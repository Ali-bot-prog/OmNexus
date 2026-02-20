export type PropertyTur = "konut" | "arsa" | "ticari";
export type ListingType = "satilik" | "kiralik";

export interface EstimateRequest {
  il?: string;
  ilce?: string;
  mahalle?: string;
  lat?: number;
  lng?: number;
  
  brut_m2?: number;
  net_m2?: number;
  arsa_m2?: number;
  kaks?: number;
  
  bina_yasi?: number;
  bina_kat_sayisi?: number;
  bulundugu_kat?: number;
  
  kat?: string;
  cephe?: string;
  isitma?: string;
  otopark?: number;
  tapu?: string;
  imar?: string;
  
  listing_type?: ListingType;
  oda_sayisi?: string;
  
  // [NEW] Detailed Features
  asansor?: number;
  esyali?: number;
  site_icerisinde?: number;

  aylik_artis: number;
}

export interface EmsalSummary {
  id: number;
  il?: string;
  ilce?: string;
  mahalle?: string;
  created_at?: string;
  w: number;
  fiyat: number;
  brut_m2?: number;
  net_m2?: number;
  bina_yasi?: number;
  alan_eff: number;
  fiyat_m2_eff: number;
  lat?: number; // Harita için ekledik (Backend dönüyorsa)
  lng?: number; // Harita için ekledik
}

export interface DanismanZekasi {
  neden_fiyat: string[];
  etkili_emsaller: number[];
  risk_durumu: string;
  risk_nedeni: string;
}

export interface EstimateResponse {
  tur: PropertyTur;
  girdi_alan_eff: number;
  tahmini_satis: number;
  satis_aralik: {
    alt: number;
    ust: number;
  };
  tahmini_kira: number;
  kira_aralik: {
    alt: number;
    ust: number;
  };
  confidence: number;
  aciklama: string;
  kullanilan_emsal: number;
  emsal_ozeti: EmsalSummary[];
  danisman_zekasi: DanismanZekasi;
  target_location?: { lat: number; lng: number } | null;
  meta: any;
}
