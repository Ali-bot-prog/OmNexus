"use client";

import { useState, useEffect } from "react";
import { X, Save, Building, Map, Briefcase } from "lucide-react";
import { PropertyTur } from "@/types/api";
import { useLanguage } from "@/context/LanguageContext";

interface EmsalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // If editing, pass the item. If creating, null.
  editingItem: any | null;
  // For pre-filling (e.g. from AI Parser)
  initialData?: any | null;
}

export default function EmsalModal({ isOpen, onClose, onSuccess, editingItem, initialData }: EmsalModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [tur, setTur] = useState<PropertyTur>("konut");
  
  // Form State
  const [formData, setFormData] = useState<any>({});

  // Reset or Fill form on open
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({ ...editingItem });
        setTur(editingItem.tur || "konut");
      } else if (initialData) {
        setFormData({ ...initialData });
        setTur(initialData.tur || "konut");
      } else {
        setFormData({
            il: "Ordu",
            ilce: "Ünye",
            mahalle: "",
            tur: "konut", // default
            durum: "aktif"
        });
        setTur("konut");
      }
    }
  }, [isOpen, editingItem, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;

    if (type === "number") {
      val = value === "" ? undefined : parseFloat(value);
    }

    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload
    // Ensure all numeric fields are numbers or null
    const payload = { ...formData, tur };

    try {
      const url = editingItem ? `http://localhost:5555/emsal/${editingItem.id}` : "http://localhost:5555/emsal";
      const method = editingItem ? "PUT" : "POST";

      const token = localStorage.getItem("token");
      if (!token) {
        alert(t.common.checkingAuth); // Using existing auth check message or add a specific one
        window.location.href = "/login";
        return;
      }

      const res = await fetch(url, {
        method,
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || t.emsal.saveError);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white">
             {editingItem ? `#${editingItem.id} ${t.emsal.editRecord}` : t.emsal.addNewRecord}
           </h2>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
             <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
           <form id="emsal-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Listing Type Toggle (Satılık / Kiralık) */}
              <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl mb-2">
                 <button
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, listing_type: "satilik" }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
                      ${(formData.listing_type || "satilik") === "satilik" 
                        ? "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-sm" 
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}
                    `}
                 >
                    {t.valuation.sale}
                 </button>
                 <button
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, listing_type: "kiralik" }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
                      ${(formData.listing_type || "satilik") === "kiralik" 
                        ? "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm" 
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}
                    `}
                 >
                    {t.valuation.rent}
                 </button>
              </div>

              {/* Status Selector (New) */}
              <div className="space-y-1 mb-2">
                 <p className="text-xs font-bold text-slate-400 uppercase">{t.emsal.listingStatus}</p>
                 <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
                    {["aktif", "satildi", "kiralandi", "pasif"].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setFormData((prev: any) => ({ ...prev, durum: s }))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize
                          ${(formData.durum || "aktif") === s 
                             ? (s === 'aktif' ? 'bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-sm' 
                                : s === 'satildi' ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm'
                                : s === 'kiralandi' ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm') 
                             : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}
                        `}
                      >
                        {s === 'satildi' ? t.emsal.sold : s === 'kiralandi' ? t.emsal.rented : s === 'aktif' ? t.emsal.active : t.emsal.passive}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Type Select (Only if creating new, usually type shouldn't change on edit easily but we allow it) */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                {(["konut", "arsa", "ticari"] as PropertyTur[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setTur(type)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 capitalize
                      ${tur === type 
                        ? "bg-white dark:bg-slate-800 text-primary dark:text-green-400 shadow-sm" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
                    `}
                  >
                    {type === "konut" && <Building className="w-4 h-4" />}
                    {type === "arsa" && <Map className="w-4 h-4" />}
                    {type === "ticari" && <Briefcase className="w-4 h-4" />}
                    {type === "konut" ? t.valuation.residential : type === "arsa" ? t.valuation.land : t.valuation.commercial}
                  </button>
                ))}
              </div>

              {/* Location */}
              <div className="space-y-3">
                 <p className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-1">{t.valuation.location}</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.province}</label>
                       <input name="il" value={formData.il || ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" required />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.district}</label>
                       <input name="ilce" value={formData.ilce || ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" required />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.neighborhood}</label>
                    <input name="mahalle" value={formData.mahalle || ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.emsal.latitude}</label>
                       <input type="number" step="any" name="lat" value={formData.lat ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.emsal.longitude}</label>
                       <input type="number" step="any" name="lng" value={formData.lng ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" />
                    </div>
                 </div>
              </div>

              {/* Main Info */}
              <div className="space-y-3">
                 <p className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-1">{t.emsal.basicInfo}</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-primary dark:text-green-400">{t.emsal.price}</label>
                       <input type="number" name="fiyat" value={formData.fiyat ?? ""} onChange={handleChange} className="w-full p-3 bg-white dark:bg-slate-900 border-2 border-primary/20 dark:border-green-500/20 focus:border-primary dark:focus:border-green-500 rounded-xl text-sm font-bold text-slate-900 dark:text-white" required />
                    </div>
                    {tur !== "arsa" ? (
                      <div className="space-y-1">
                         <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.grossM2}</label>
                         <input type="number" name="brut_m2" value={formData.brut_m2 ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" required />
                      </div>
                    ) : (
                      <div className="space-y-1">
                         <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.landM2}</label>
                         <input type="number" name="arsa_m2" value={formData.arsa_m2 ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" required />
                      </div>
                    )}
                 </div>
                 
                  {tur !== "arsa" && (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.netM2}</label>
                           <input type="number" name="net_m2" value={formData.net_m2 ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.roomCount}</label>
                           <select name="oda_sayisi" value={formData.oda_sayisi || ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white">
                             <option value="">{t.emsal.select}</option>
                             <option value="1+0">1+0 ({t.emsal.studio})</option>
                             <option value="1+1">1+1</option>
                             <option value="2+0">2+0</option>
                             <option value="2+1">2+1</option>
                             <option value="3+1">3+1</option>
                             <option value="3+2">3+2</option>
                             <option value="4+1">4+1</option>
                             <option value="4+2">4+2</option>
                             <option value="5+1">5+1</option>
                           </select>
                        </div>
                     </div>
                  )}

                  {tur !== "arsa" && (
                    <div className="grid grid-cols-3 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.buildingAge}</label>
                          <input type="number" name="bina_yasi" value={formData.bina_yasi ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.floor}</label>
                          <input type="number" name="bulundugu_kat" value={formData.bulundugu_kat ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.totalFloors}</label>
                          <input type="number" name="bina_kat_sayisi" value={formData.bina_kat_sayisi ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" />
                       </div>
                    </div>
                  )}

                 {tur === "arsa" && (
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.kaks}</label>
                          <input type="number" step="0.01" name="kaks" value={formData.kaks ?? ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.valuation.zoningStatus}</label>
                          <select name="imar" value={formData.imar || ""} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white">
                             <option value="">{t.emsal.select}</option>
                             <option value="Konut">Konut</option>
                             <option value="Ticari">Ticari</option>
                             <option value="Sanayi">Sanayi</option>
                             <option value="Arsa">Arsa</option>
                             <option value="Tarla">Tarla</option>
                             <option value="Bağ/Bahçe">Bağ/Bahçe</option>
                          </select>
                       </div>
                    </div>
                 )}
              </div>
              
              {/* Extra Details */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-3">
                 <p className="text-xs font-bold text-slate-400 uppercase">{t.emsal.extraFeatures}</p>
                 
                 {tur === "konut" && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {/* Asansör Toggle */}
                        <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.asansor === 1 ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}>
                           <input 
                              type="checkbox" 
                              checked={formData.asansor === 1} 
                              onChange={(e) => setFormData((p:any) => ({ ...p, asansor: e.target.checked ? 1 : 0 }))}
                              className="w-4 h-4 rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                           />
                           <span className="text-sm font-medium">{t.valuation.elevator}</span>
                        </label>

                        {/* Otopark Toggle */}
                        <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.otopark === 1 ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}>
                           <input 
                              type="checkbox" 
                              checked={formData.otopark === 1} 
                              onChange={(e) => setFormData((p:any) => ({ ...p, otopark: e.target.checked ? 1 : 0 }))}
                              className="w-4 h-4 rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                           />
                           <span className="text-sm font-medium">{t.valuation.parking}</span>
                        </label>

                        {/* Eşyalı Toggle */}
                        <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.esyali === 1 ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}>
                           <input 
                              type="checkbox" 
                              checked={formData.esyali === 1} 
                              onChange={(e) => setFormData((p:any) => ({ ...p, esyali: e.target.checked ? 1 : 0 }))}
                              className="w-4 h-4 rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                           />
                           <span className="text-sm font-medium">{t.valuation.furnished}</span>
                        </label>

                        {/* Site İçerisinde Toggle */}
                        <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.site_icerisinde === 1 ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}>
                           <input 
                              type="checkbox" 
                              checked={formData.site_icerisinde === 1} 
                              onChange={(e) => setFormData((p:any) => ({ ...p, site_icerisinde: e.target.checked ? 1 : 0 }))}
                              className="w-4 h-4 rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                           />
                           <span className="text-sm font-medium whitespace-nowrap">{t.valuation.inComplex}</span>
                        </label>
                     </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                    <input name="cephe" placeholder={t.emsal.facade} value={formData.cephe || ""} onChange={handleChange} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                    <input name="isitma" placeholder={t.emsal.heating} value={formData.isitma || ""} onChange={handleChange} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                    <input name="kaynak" placeholder={t.emsal.source} value={formData.kaynak || ""} onChange={handleChange} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                    <input name="tapu" placeholder={t.emsal.deedStatus} value={formData.tapu || ""} onChange={handleChange} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                 </div>
              </div>

           </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50">
           <button type="button" onClick={onClose} className="px-6 py-3 font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
             {t.emsal.cancel}
           </button>
           <button 
             form="emsal-form"
             type="submit" 
             disabled={loading}
             className="px-8 py-3 bg-primary dark:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-primary/30 dark:shadow-green-900/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
           >
             {loading ? t.emsal.saving : (
               <>
                 <Save className="w-4 h-4" />
                 {t.emsal.save}
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
