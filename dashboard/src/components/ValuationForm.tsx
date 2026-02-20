"use client";

import { useState } from "react";
import { PropertyTur, EstimateRequest } from "@/types/api";
import { Calculator, Building, Map, Briefcase, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ValuationFormProps {
  onEstimate: (tur: PropertyTur, data: EstimateRequest) => void;
  loading: boolean;
}

export default function ValuationForm({ onEstimate, loading }: ValuationFormProps) {
  const { t } = useLanguage();
  const [tur, setTur] = useState<PropertyTur>("konut");
  const [formData, setFormData] = useState<Partial<EstimateRequest>>({
    aylik_artis: 0.03, // Default %3
    il: "Ordu", 
    ilce: "Ünye",
    mahalle: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;

    if (type === "number") {
      val = value === "" ? undefined : parseFloat(value);
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEstimate(tur, formData as EstimateRequest);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary dark:text-green-400" />
        {t.valuation.engineTitle}
      </h2>

      {/* Property Type Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl mb-6">
        {(["konut", "arsa", "ticari"] as PropertyTur[]).map((type) => (
          <button
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

      {/* Listing Type Toggle */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl mb-6">
        <button
            onClick={() => setFormData(p => ({ ...p, listing_type: "satilik" }))}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${(formData.listing_type || "satilik") === "satilik" 
                ? "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
            `}
        >
            {t.valuation.sale}
        </button>
        <button
            onClick={() => setFormData(p => ({ ...p, listing_type: "kiralik" }))}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${formData.listing_type === "kiralik" 
                ? "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
            `}
        >
            {t.valuation.rent}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Lokasyon */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase">{t.valuation.location}</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="il"
              placeholder={t.valuation.province}
              value={formData.il || ""}
              onChange={handleChange}
              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 transition-colors text-slate-800 dark:text-white placeholder:text-slate-400"
              required
            />
            <input
              name="ilce"
              placeholder={t.valuation.district}
              value={formData.ilce || ""}
              onChange={handleChange}
              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 transition-colors text-slate-800 dark:text-white placeholder:text-slate-400"
              required
            />
          </div>
          <input
            name="mahalle"
            placeholder={t.valuation.neighborhood}
            value={formData.mahalle || ""}
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 transition-colors text-slate-800 dark:text-white placeholder:text-slate-400"
            required
          />
        </div>

        {/* Özellikler */}
        <div className="space-y-3 mt-2">
          <p className="text-xs font-bold text-slate-400 uppercase">{t.valuation.physicalAttributes}</p>
          
          <div className="grid grid-cols-2 gap-3">
            {tur !== "arsa" ? (
              <input
                type="number"
                name="brut_m2"
                placeholder={t.valuation.grossM2}
                value={formData.brut_m2 ?? ""}
                onChange={handleChange}
                className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                required
              />
            ) : (
              <input
                type="number"
                name="arsa_m2"
                placeholder={t.valuation.landM2}
                value={formData.arsa_m2 ?? ""}
                onChange={handleChange}
                className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                required
              />
            )}
            
            {tur !== "arsa" && (
              <input
                type="number"
                name="net_m2"
                placeholder={t.valuation.netM2}
                value={formData.net_m2 ?? ""}
                onChange={handleChange}
                className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-800 dark:text-white placeholder:text-slate-400"
              />
            )}
          </div>

          {tur === "arsa" && (
             <div className="grid grid-cols-2 gap-3">
               <input
                 type="number"
                 step="0.01"
                 name="kaks"
                 placeholder={t.valuation.kaks}
                 value={formData.kaks ?? ""}
                 onChange={handleChange}
                 className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-800 dark:text-white placeholder:text-slate-400"
               />
               <select
                  name="imar"
                  value={formData.imar || ""}
                  onChange={handleChange}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-600 dark:text-slate-300"
               >
                 <option value="">{t.valuation.zoningStatus}</option>
                 <option value="Konut">Konut</option>
                 <option value="Ticari">Ticari</option>
                 <option value="Sanayi">Sanayi</option>
                 <option value="Arsa">Arsa</option>
               </select>
             </div>
          )}

          {tur !== "arsa" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="bina_yasi"
                  placeholder={t.valuation.buildingAge}
                  value={formData.bina_yasi ?? ""}
                  onChange={handleChange}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                />
                 <select
                    name="oda_sayisi"
                    value={formData.oda_sayisi || ""}
                    onChange={handleChange}
                    className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-600 dark:text-slate-300"
                 >
                   <option value="">{t.valuation.roomCount}</option>
                   <option value="1+0">1+0</option>
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

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="bulundugu_kat"
                  placeholder={t.valuation.floor}
                  value={formData.bulundugu_kat ?? ""}
                  onChange={handleChange}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                />
                <input
                  type="number"
                  name="bina_kat_sayisi"
                  placeholder={t.valuation.totalFloors}
                  value={formData.bina_kat_sayisi ?? ""}
                  onChange={handleChange}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </>
          )}
          
          {tur !== "arsa" && (
            <>
             <select
                name="isitma"
                value={formData.isitma || ""}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:focus:border-green-500 text-slate-600 dark:text-slate-300 mb-3"
             >
               <option value="">{t.valuation.heatingType}</option>
               <option value="Kombi">Kombi</option>
               <option value="Merkezi">Merkezi</option>
               <option value="Soba">Soba</option>
               <option value="Yerden Isıtma">Yerden Isıtma</option>
             </select>

             <div className="grid grid-cols-2 gap-2 mb-2">
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.asansor === 1 ? 'bg-primary/10 border-primary text-primary dark:bg-green-900/20 dark:border-green-500 dark:text-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <input type="checkbox" checked={formData.asansor === 1} onChange={e => setFormData(p => ({...p, asansor: e.target.checked ? 1 : 0}))} className="hidden" />
                    <span className="text-xs font-bold">{t.valuation.elevator}</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.otopark === 1 ? 'bg-primary/10 border-primary text-primary dark:bg-green-900/20 dark:border-green-500 dark:text-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <input type="checkbox" checked={formData.otopark === 1} onChange={e => setFormData(p => ({...p, otopark: e.target.checked ? 1 : 0}))} className="hidden" />
                    <span className="text-xs font-bold">{t.valuation.parking}</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.esyali === 1 ? 'bg-primary/10 border-primary text-primary dark:bg-green-900/20 dark:border-green-500 dark:text-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <input type="checkbox" checked={formData.esyali === 1} onChange={e => setFormData(p => ({...p, esyali: e.target.checked ? 1 : 0}))} className="hidden" />
                    <span className="text-xs font-bold">{t.valuation.furnished}</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.site_icerisinde === 1 ? 'bg-primary/10 border-primary text-primary dark:bg-green-900/20 dark:border-green-500 dark:text-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <input type="checkbox" checked={formData.site_icerisinde === 1} onChange={e => setFormData(p => ({...p, site_icerisinde: e.target.checked ? 1 : 0}))} className="hidden" />
                    <span className="text-xs font-bold">{t.valuation.inComplex}</span>
                </label>
             </div>
            </>
          )}
        </div>

        {/* Gelişmiş Piyasa Ayarları */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
           <details className="group">
              <summary className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors list-none">
                 <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-open:bg-primary dark:group-open:bg-green-500" />
                 {t.valuation.advancedSettings}
              </summary>
              
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                       <label className="text-slate-600 dark:text-slate-300 font-medium">{t.valuation.monthlyIncrease}</label>
                       <span className="font-bold text-primary dark:text-green-400">%{((formData.aylik_artis || 0) * 100).toFixed(1)}</span>
                    </div>
                    <input 
                      type="range"
                      name="aylik_artis"
                      min="0"
                      max="0.10"
                      step="0.005"
                      value={formData.aylik_artis || 0}
                      onChange={handleChange}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-green-500"
                    />
                    <p className="text-[10px] text-slate-400 leading-tight">
                       {t.valuation.increaseDesc}
                    </p>
                 </div>
              </div>
           </details>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-primary dark:bg-green-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            t.valuation.calculating
          ) : (
            <>
              {t.valuation.startValuation}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
        
        <p className="text-[10px] text-center text-slate-400 mt-2">
          {t.valuation.disclaimer}
        </p>
      </form>
    </div>
  );
}
