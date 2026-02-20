const API_BASE = "";
let lastEstimateResult = null;

// State
let propertyType = 'konut';

// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.view-section');
const forms = {
    add: document.getElementById('form-add'),
    estimate: document.getElementById('form-estimate')
};
const lists = {
    emsal: document.getElementById('emsal-list')
};

// Property Type Change (Global or per form if needed)
function handleTypeChange(formId, triggerOnly = false) {
    const form = document.getElementById(formId);
    if (!form) return;
    const sel = form.querySelector('select[name="tur"]');
    if (!sel) return;

    const update = () => {
        const val = sel.value; // konut, arsa, ticari
        // console.log(`[${formId}] Type changed to: ${val}`);

        // Tüm type- sınıflı elemanları gizle
        form.querySelectorAll('.type-konut, .type-arsa, .type-ticari').forEach(el => {
            el.style.display = 'none';
        });
        
        // Seçili tipe uygun olanları göster
        form.querySelectorAll(`.type-${val}`).forEach(el => {
            el.style.display = 'flex'; 
        });
        
        // Global state update (optional)
        if (formId === 'form-add' || formId === 'form-estimate') {
            propertyType = val; 
        }
    };

    if (!triggerOnly) {
        sel.addEventListener('change', update);
    }
    
    // Anlık güncelleme
    update();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadEmsals();
    setupForms();
});

function setupTabs() {
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Reload data if needed
            if (targetId === 'list-view') {
                loadEmsals();
            }
        });
    });
}

function setupForms() {
    handleTypeChange('form-add');
    handleTypeChange('form-estimate');
    handleTypeChange('form-edit');

    // Add Emsal
    document.getElementById('save-emsal-btn').addEventListener('click', async () => {
        const data = getFormData('form-add');
        if (!validate(data)) return;
        
        try {
            const res = await fetch(`${API_BASE}/emsal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (res.ok) {
                alert('Emsal kaydedildi!');
                document.getElementById('form-add').reset();
            } else {
                alert('Hata: ' + (result.detail || 'Bilinmeyen hata'));
            }
        } catch (e) {
            console.error(e);
            alert('Bağlantı hatası');
        }
    });

    // Estimate
    document.getElementById('estimate-btn').addEventListener('click', async () => {
        const data = getFormData('form-estimate');
        // Type is required for URL
        const tur = data.tur; 
        
        try {
            const res = await fetch(`${API_BASE}/estimate/${tur}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (res.ok) {
                renderEstimateResult(result);
            } else {
                alert('Hata: ' + (result.detail || 'Hesaplama hatası'));
            }
        } catch (e) {
            console.error(e);
            alert('Bağlantı hatası');
        }
    });
}

function getFormData(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select');
    const data = {};
    
    inputs.forEach(input => {
        if (input.name) {
            let val = input.value;
            
            // Empty string -> null (except required fields, handled by validation)
            if (val === "") {
                val = null;
            } else {
                // Type conversion
                if (input.type === 'number' || input.name === 'otopark' || input.name === 'bina_yasi' || input.name === 'net_m2' || input.name === 'bina_kat_sayisi' || input.name === 'bulundugu_kat') {
                    val = parseFloat(val);
                }
            }
            
            if (val !== null) {
                data[input.name] = val;
            }
        }
    });

    // Ensure 'tur' is set if missing (default to global propertyType)
    if (!data.tur) {
        data.tur = propertyType;
    }

    return data;
}

function validate(data) {
    if (!data.fiyat) {
        alert("Fiyat zorunludur!");
        return false;
    }
    return true;
}

// Bump version logic handled in HTML
// Global Data
window.emsalData = [];

async function loadEmsals() {
    console.log("Loading Emsals...");
    try {
        const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : '';

        const tur = getVal('filter-tur');
        const il = getVal('filter-il');
        const ilce = getVal('filter-ilce');
        const mahalle = getVal('filter-mahalle');

        let url = `${API_BASE}/emsal?limit=50`;
        if (tur) url += `&tur=${tur}`;
        if (il) url += `&il=${il}`;
        if (ilce) url += `&ilce=${ilce}`;
        if (mahalle) url += `&mahalle=${mahalle}`;
        
        console.log("Fetching URL:", url);

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Data received:", data);
        
        window.emsalData = data; // Store for edit
        renderTable(data);
    } catch (e) {
        console.error("Load Error:", e);
        alert('Veri yüklenirken hata oluştu: ' + e.message);
    }
}

function renderTable(data) {
    const tbody = document.querySelector('#emsal-table tbody');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1rem; color:#888;">Kayıt bulunamadı.</td></tr>';
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td><span class="badge type-${item.tur}">${item.tur}</span></td>
            <td>${item.il || '-'} / ${item.ilce || '-'}</td>
            <td>${item.mahalle || '-'}</td>
            <td>
                <div style="font-weight:600">${item.brut_m2 || item.arsa_m2 || '-'} m²</div>
                ${item.net_m2 ? `<small style="color:var(--text-muted)">Net: ${item.net_m2} m²</small>` : ''}
            </td>
            <td>${item.bina_yasi ?? '-'}</td>
            <td>
                <div>${item.kat || '-'}</div>
                ${item.bulundugu_kat !== null && item.bulundugu_kat !== undefined ? `<small style="color:var(--text-muted)">Kat: ${item.bulundugu_kat}</small>` : ''}
            </td>
            <td>${item.isitma || '-'} / ${item.cephe || '-'}</td>
            <td style="font-weight:700; color:var(--primary)">${formatCurrency(item.fiyat)}</td>
            <td>
                <div style="display:flex; gap:5px">
                    <button class="btn-sm" style="background:var(--primary)" onclick="openEditModal(${item.id})">Düzenle</button>
                    <button class="btn-sm btn-danger" onclick="deleteEmsal(${item.id})">Sil</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Edit Logic
window.openEditModal = (id) => {
    // Loose equality (==) in case id comes as string/int mismatch
    const item = window.emsalData.find(e => e.id == id);
    if (!item) {
        console.error("Edit: Item not found for id", id);
        return;
    }

    const form = document.getElementById('form-edit');
    // Basic fields
    form.querySelector('[name="id"]').value = item.id;
    form.querySelector('[name="tur"]').value = item.tur;
    form.querySelector('[name="il"]').value = item.il || "";
    form.querySelector('[name="ilce"]').value = item.ilce || "";
    form.querySelector('[name="mahalle"]').value = item.mahalle || "";
    form.querySelector('[name="fiyat"]').value = item.fiyat;
    form.querySelector('[name="bina_yasi"]').value = item.bina_yasi !== null ? item.bina_yasi : "";
    
    // M2 fields
    form.querySelector('[name="brut_m2"]').value = item.brut_m2 !== null ? item.brut_m2 : "";
    form.querySelector('[name="net_m2"]').value = item.net_m2 !== null ? item.net_m2 : "";
    form.querySelector('[name="arsa_m2"]').value = item.arsa_m2 !== null ? item.arsa_m2 : "";
    form.querySelector('[name="kaks"]').value = item.kaks !== null ? item.kaks : "";

    // Features
    const setSelect = (name, val) => {
        const sel = form.querySelector(`[name="${name}"]`);
        if(sel) sel.value = val || "";
    };
    setSelect('kat', item.kat);
    setSelect('cephe', item.cephe);
    setSelect('tapu', item.tapu);
    setSelect('isitma', item.isitma);
    setSelect('otopark', item.otopark);

    // Numeric & Text Fields
    const setVal = (name, val) => {
        const input = form.querySelector(`[name="${name}"]`);
        if(input) input.value = val !== null && val !== undefined ? val : "";
    };

    setVal('bulundugu_kat', item.bulundugu_kat);
    setVal('bina_kat_sayisi', item.bina_kat_sayisi);
    setVal('bina_yasi', item.bina_yasi);
    setVal('imar', item.imar);
    setVal('kira', item.kira);
    setVal('lat', item.lat);
    setVal('lng', item.lng);
    setVal('kaynak', item.kaynak);

    // Filter fields based on type (Trigger only, listener already set)
    handleTypeChange('form-edit', true);

    document.getElementById('edit-modal').style.display = 'block';
};

window.closeEditModal = () => {
    document.getElementById('edit-modal').style.display = 'none';
};

window.saveEdit = async () => {
    const data = getFormData('form-edit');
    if (!data.fiyat) { alert('Fiyat zorunlu'); return; }
    
    const id = data.id;
    // Remove id from body if needed, but schema allows extras usually. 
    // Cleaning data types
    
    try {
        const res = await fetch(`${API_BASE}/emsal/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            alert('Güncellendi!');
            closeEditModal();
            loadEmsals();
        } else {
            const err = await res.json();
            alert('Hata: ' + (err.detail || 'Güncelleme hatası'));
        }
    } catch (e) {
        alert('Bağlantı hatası');
    }
};

window.deleteEmsal = async (id) => {
    if(!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    
    try {
        await fetch(`${API_BASE}/emsal/${id}`, { method: 'DELETE' });
        loadEmsals();
    } catch (e) {
        alert('Silme sırasında hata oluştu');
    }
};

window.uploadExcel = async (input) => {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    // Reset input
    input.value = '';

    try {
        const res = await fetch(`${API_BASE}/import/emsal`, {
            method: 'POST',
            body: formData
        });
        
        const result = await res.json();
        
        if (res.ok) {
            let msg = `İşlem Tamam!\n\nToplam: ${result.total_rows}\nBaşarılı: ${result.success}`;
            if (result.errors.length > 0) {
                msg += `\nHatalı: ${result.errors.length}\n\nİlk Hatalar:\n` + result.errors.slice(0, 3).join("\n");
            }
            alert(msg);
            loadEmsals();
        } else {
            alert('Yükleme hatası: ' + (result.detail || 'Bilinmeyen hata'));
        }
    } catch (e) {
        console.error(e);
        alert('Bağlantı hatası');
    }
};

window.downloadExcel = () => {
    try {
        const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : '';

        const tur = getVal('filter-tur');
        const il = getVal('filter-il');
        const ilce = getVal('filter-ilce');
        const mahalle = getVal('filter-mahalle');

        let url = `${API_BASE}/export/emsal?t=${Date.now()}`;
        if (tur) url += `&tur=${tur}`;
        if (il) url += `&il=${il}`;
        if (ilce) url += `&ilce=${ilce}`;
        if (mahalle) url += `&mahalle=${mahalle}`;
        
        console.log("Downloading Excel from:", url);
        window.location.href = url;
    } catch (e) {
        console.error("Download Error:", e);
        alert("Excel indirme başlatılamadı: " + e.message);
    }
};

function renderEstimateResult(res) {
    const box = document.getElementById('estimate-result');
    box.style.display = 'block';
    const fmt = formatCurrency;
    
    lastEstimateResult = res;

    box.innerHTML = `
        <div class="result-header">Tahmin Sonucu (${res.confidence}/100 Güven)</div>
        
        <!-- AI & PDF Actions (MOVED TO TOP) -->
        <div id="report-actions" style="margin-bottom: 1.5rem; display: flex; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.1);">
            <button class="btn" onclick="getAIAnalysis('customer')" id="ai-btn-customer" style="background: var(--primary); font-size: 0.85rem; padding: 0.6rem 1rem;">
                ✨ Müşteri Özeti (AI)
            </button>
            <button class="btn" onclick="getAIAnalysis('investor')" id="ai-btn-investor" style="background: #0ea5e9; font-size: 0.85rem; padding: 0.6rem 1rem;">
                📈 Yatırımcı Analizi (AI)
            </button>
            <button class="btn" onclick="downloadPDF()" id="pdf-btn" style="background: #334155; font-size: 0.85rem; padding: 0.6rem 1rem;">
                📄 PDF Raporu Al
            </button>
        </div>

        <div class="result-grid">
            <div class="result-item">
                <small>Tahmini Satış</small>
                <strong>${fmt(res.tahmini_satis)}</strong>
            </div>
            <div class="result-item">
                <small>Aralık (Min)</small>
                <strong>${fmt(res.satis_aralik.alt)}</strong>
            </div>
            <div class="result-item">
                <small>Aralık (Max)</small>
                <strong>${fmt(res.satis_aralik.ust)}</strong>
            </div>
            <div class="result-item">
                <small>Emsal Sayısı</small>
                <strong>${res.kullanilan_emsal}</strong>
            </div>
        </div>
        <p style="margin-top:1rem; color:var(--text-main); font-weight:500;">${res.aciklama}</p>

        <!-- AI Content Area -->
        <div id="ai-report-area" style="display: none; margin-top: 1.5rem; padding: 1.5rem; background: #fff; border-radius: 8px; border-left: 4px solid var(--primary); font-size: 0.95rem; line-height: 1.7; color: #334155; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h4 style="margin-bottom: 1rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
                <span id="ai-report-title-icon">🤖</span>
                <span id="ai-report-title">Yapay Zekâ Analizi</span>
            </h4>
            <div id="ai-report-text" style="white-space: pre-wrap;"></div>
        </div>

        <div class="danisman-section">
            <div class="danisman-title">
                <span>🤖</span> DANIŞMAN ZEKÂSI (Teknik Veri)
            </div>
            
            <div class="danisman-grid">
                <div class="danisman-card">
                    <h4><span>🔍</span> Neden bu fiyat?</h4>
                    <ul class="danisman-list">
                        ${res.danisman_zekasi.neden_fiyat.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="danisman-card">
                    <h4><span>⚖️</span> Risk Analizi</h4>
                    <div style="margin-bottom:0.8rem">
                        <span class="risk-badge risk-${res.danisman_zekasi.risk_durumu === 'Güvenli' ? 'safe' : res.danisman_zekasi.risk_durumu === 'Riskli' ? 'high' : 'medium'}">
                            ${res.danisman_zekasi.risk_durumu}
                        </span>
                    </div>
                    <p style="font-size:0.85rem; color:var(--text-muted)">${res.danisman_zekasi.risk_nedeni}</p>
                </div>

                <div class="danisman-card" style="grid-column: 1 / -1">
                    <h4><span>📌</span> En Etkili Emsal Kayıtları (ID)</h4>
                    <div class="emsal-tags">
                        ${res.danisman_zekasi.etkili_emsaller.map(id => `<span class="emsal-tag">#${id}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function getAIAnalysis(type) {
    if (!lastEstimateResult) return;
    
    const area = document.getElementById('ai-report-area');
    const text = document.getElementById('ai-report-text');
    const title = document.getElementById('ai-report-title');
    const btn = document.getElementById(`ai-btn-${type}`);
    
    area.style.display = 'block';
    text.innerHTML = '✨ Yapay zeka analiz ediyor, lütfen bekleyin...';
    title.innerText = type === 'customer' ? 'Müşteri Özet Raporu' : 'Detaylı Yatırımcı Analizi';
    
    try {
        const response = await fetch(`${API_BASE}/ai-report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                analysis_data: lastEstimateResult,
                report_type: type
            })
        });
        
        const data = await response.json();
        text.innerText = data.report_text;
        
        // Scroll to AI area
        area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
        console.error(e);
        text.innerText = '⚠️ AI Raporu alınırken bir hata oluştu. Lütfen API anahtarını kontrol edin.';
    }
}

async function downloadPDF() {
    if (!lastEstimateResult) return;
    
    const btn = document.getElementById('pdf-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⌛ Hazırlanıyor...';
    btn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/export-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lastEstimateResult)
        });
        
        if (!response.ok) throw new Error('PDF üretilemedi');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `degerleme_raporu_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (e) {
        console.error(e);
        alert('PDF indirilirken bir hata oluştu.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function formatCurrency(val) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
}
