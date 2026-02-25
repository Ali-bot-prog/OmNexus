"""
OmNexus FSBO Lead Finder
========================
FSBO (For Sale By Owner / Sahibinden Satış) ilanlarını internette bulur.
Doğrudan mülk sahibinin sattığı ilanları tespit ederek portföy adayı olarak sunar.
"""
from __future__ import annotations
import re
import os
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from google import genai
from duckduckgo_search import DDGS

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBoHtAsMYcRSJqEugGCmoL4mmX1t77_Fp0")
_ai_client = None
if GEMINI_API_KEY:
    _ai_client = genai.Client(api_key=GEMINI_API_KEY)

# FSBO lead için kabul edilen kaynaklar
FSBO_SOURCES = [
    "sahibinden.com",
    "hepsiemlak.com",
    "emlakjet.com",
    "zingat.com",
    "hurriyet-emlak.com",
    "milliyet.com.tr",
]

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _detect_platform(url: str) -> str:
    url_lower = url.lower()
    if "sahibinden" in url_lower: return "Sahibinden"
    if "hepsiemlak" in url_lower: return "HepsiEmlak"
    if "emlakjet" in url_lower: return "EmlakJet"
    if "zingat" in url_lower: return "Zingat"
    if "hurriyet" in url_lower: return "Hürriyet Emlak"
    if "milliyet" in url_lower: return "Milliyet Emlak"
    return "İnternet"


def _is_fsbo(title: str, body: str) -> bool:
    """
    FSBO (sahibinden satış) sinyali tespit et.
    Araya girmeden direkt satıcının sattığı ilanları bul.
    """
    text = (title + " " + body).lower()
    
    # Güçlü FSBO sinyalleri
    fsbo_signals = [
        "sahibinden", "mülk sahibi", "ev sahibinden",
        "direkt satış", "aracısız", "komisyonsuz",
        "sahibi satıyor", "elden satılık", "sahibinden kiralık"
    ]
    
    # Acente sinyalleri (bunları çıkar)
    agency_signals = [
        "emlak ofisi", "remax", "century 21", "coldwell",
        "era emlak", "gayrimenkul danışmanı", "portföy"
    ]
    
    has_fsbo = any(s in text for s in fsbo_signals)
    has_agency = any(s in text for s in agency_signals)
    
    # Sahibinden.com'dan gelen ilanlar çoğunlukla FSBO
    return has_fsbo and not has_agency


def _extract_price(text: str) -> Optional[float]:
    """Metinden fiyat çıkarmaya çalışır."""
    # "2.500.000 TL", "2500000", "2,5 milyon" gibi formatlar
    patterns = [
        r'(\d[\d.,]+)\s*tl',
        r'(\d[\d.,]+)\s*₺',
        r'(\d+)\s*milyon',
    ]
    text_lower = text.lower()
    for pat in patterns:
        m = re.search(pat, text_lower)
        if m:
            raw = m.group(1).replace(".", "").replace(",", ".")
            try:
                val = float(raw)
                if "milyon" in pat:
                    val *= 1_000_000
                if 10_000 < val < 1_000_000_000:  # Mantıklı aralık
                    return val
            except:
                pass
    return None


def find_fsbo_leads(
    il: str,
    ilce: str,
    tur: str = "konut",  # konut / arsa / ticari
    listing_type: str = "satilik",  # satilik / kiralik
    max_results: int = 15,
    tenant_id: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """
    Belirtilen bölge ve tipte FSBO ilanları arar.
    Gemini'yi arama sorgusu üretmek için, DuckDuckGo'yu gerçek tarama için kullanır.
    """
    if not _ai_client:
        raise ValueError("Gemini API key ayarlanmamış.")

    tur_tr = {"konut": "daire/konut", "arsa": "arsa/tarla", "ticari": "işyeri/ticari"}.get(tur, tur)
    listing_tr = "satılık" if listing_type == "satilik" else "kiralık"

    # Gemini ile optimal FSBO arama sorgusu üret
    sys_prompt = f"""Sen bir emlak ajan asistanısın. FSBO (sahibinden satış) ilanı bulmak için Google/DuckDuckGo arama sorgusu üreteceksin.

Arama kriterleri:
- Konum: {il} / {ilce}
- Tip: {tur_tr}
- İşlem: {listing_tr}
- AMAÇ: Mülk sahibinin direkt sattığı / aracısız ilanlar (FSBO)

Kurallar:
1. Mutlaka "sahibinden" kelimesini veya "aracısız" veya "komisyonsuz" ekle
2. Site filtresi: site:sahibinden.com OR site:hepsiemlak.com/sahibinden OR site:emlakjet.com
3. Konum terimlerini ekle: {ilce} {il}
4. Başka hiçbir açıklama yazma, SADECE arama sorgusunu dön.

Örnek çıktı: site:sahibinden.com Ünye Ordu satılık daire sahibinden
"""
    
    response = _ai_client.models.generate_content(
        model='gemini-2.0-flash',
        contents=sys_prompt,
    )
    query = response.text.strip().replace('"', '')
    print(f"[FSBO] Arama sorgusu: {query}")

    # DuckDuckGo ile internette tara
    ddgs = DDGS()
    raw_results = list(ddgs.text(query, max_results=max_results * 2))

    leads = []
    for item in raw_results:
        title = item.get("title", "")
        body = item.get("body", "")
        url = item.get("href", "")

        if not url or not title:
            continue

        platform = _detect_platform(url)
        price = _extract_price(title + " " + body)

        lead = {
            "baslik": title,
            "ozet": body,
            "url": url,
            "platform": platform,
            "tahmini_fiyat": price,
            "il": il,
            "ilce": ilce,
            "tur": tur,
            "listing_type": listing_type,
            "fsbo_skoru": 1 if _is_fsbo(title, body) else 0,
            "durum": "yeni",
            "tenant_id": tenant_id,
            "created_at": _now_iso(),
        }
        leads.append(lead)

        if len(leads) >= max_results:
            break

    # FSBO skoru yüksek olanları öne çıkar
    leads.sort(key=lambda x: x["fsbo_skoru"], reverse=True)
    return leads


def nightly_scan(tenant_list: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Tüm aktif tenant'lar için gece tarama yapar.
    tenant_list: [{"tenant_id": 1, "il": "Ordu", "ilce": "Ünye"}, ...]
    Sonuçları döner: {"tenant_id": bulunan_lead_sayisi}
    """
    results = {}
    for tenant in tenant_list:
        tenant_id = tenant.get("tenant_id")
        il = tenant.get("il", "Ordu")
        ilce = tenant.get("ilce", "Ünye")
        
        try:
            for tur in ["konut", "arsa", "ticari"]:
                leads = find_fsbo_leads(
                    il=il, ilce=ilce, tur=tur,
                    listing_type="satilik",
                    max_results=10,
                    tenant_id=tenant_id,
                )
                results[tenant_id] = results.get(tenant_id, 0) + len(leads)
                print(f"[FSBO] Gece: tenant={tenant_id} {il}/{ilce} {tur} → {len(leads)} ilan")
        except Exception as e:
            print(f"[FSBO] Gece Tarama Hatası tenant={tenant_id}: {e}")

    return results
