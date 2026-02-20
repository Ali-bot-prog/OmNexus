"use client";

import { EstimateResponse } from "@/types/api";
import { Download, CheckCircle, AlertTriangle, Info, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

// Map'i dynamic import ile alıyoruz (SSR kapatmak için)
const Map = dynamic(() => import("@/components/Map").then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />,
});

interface ValuationResultProps {
  data: EstimateResponse;
}

export default function ValuationResult({ data }: ValuationResultProps) {
  const { t } = useLanguage();
  const { tahmini_satis, satis_aralik, confidence, danisman_zekasi, emsal_ozeti } = data;

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch("/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(t.valuation.pdfError);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `degerleme_raporu_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert(t.valuation.pdfDownloadError);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* 1. Fiyat Kartı */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden ring-1 ring-slate-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        
        <div className="relative z-10">
           <div className="flex justify-between items-start mb-2">
             <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">
                 {data.meta?.listing_type === "kiralik" ? t.valuation.rentValuation : t.valuation.saleValuation}
             </p>
             <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs font-bold text-green-400">{t.valuation.confidence}: %{confidence}</span>
             </div>
           </div>
           
           <h2 className="text-5xl font-black mb-4 tracking-tight">
             {(data.meta?.listing_type === "kiralik" ? data.tahmini_kira : tahmini_satis).toLocaleString()} <span className="text-2xl text-slate-400 font-normal">TL</span>
           </h2>

           <div className="flex items-center justify-between text-sm text-slate-400 bg-white/5 p-4 rounded-xl border border-white/5">
              <span>{t.valuation.marketRange}:</span>
              <span className="text-white font-bold">
                {data.meta?.listing_type === "kiralik" 
                    ? `${data.kira_aralik.alt.toLocaleString()} TL - ${data.kira_aralik.ust.toLocaleString()} TL`
                    : `${satis_aralik.alt.toLocaleString()} TL - ${satis_aralik.ust.toLocaleString()} TL`
                }
              </span>
           </div>
        </div>
      </div>

      {/* 2. Danışman Zekası */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          {t.valuation.aiAdvisor}
        </h3>
        
        <div className="space-y-4">
           {danisman_zekasi.neden_fiyat.map((note, idx) => (
             <div key={idx} className="flex gap-3 items-start">
               <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
               <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{note}</p>
             </div>
           ))}

           <div className={`p-4 rounded-xl border flex gap-3 items-start
             ${danisman_zekasi.risk_durumu === "Güvenli" ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20" : 
               danisman_zekasi.risk_durumu === "Riskli" ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20" : "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/20"}
           `}>
             <AlertTriangle className={`w-5 h-5 shrink-0
                ${danisman_zekasi.risk_durumu === "Güvenli" ? "text-green-600 dark:text-green-400" : 
                  danisman_zekasi.risk_durumu === "Riskli" ? "text-red-500 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}
             `} />
             <div>
               <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                 {t.valuation.regionalRisk}: {danisman_zekasi.risk_durumu}
               </p>
               <p className="text-xs text-slate-600 dark:text-slate-400">
                 {danisman_zekasi.risk_nedeni}
               </p>
             </div>
           </div>
        </div>
      </div>

      {/* 3. Kullanılan Emsaller Haritası */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-72 overflow-hidden relative">
         <Map 
            emsals={emsal_ozeti.map(e => ({
                ...e,
                fiyat: e.fiyat,
                lat: e.lat || 41.0082, // Emsal özetinde lat/lng yoksa dummy
                lng: e.lng || 28.9784
            }))} 
            target={(data.target_location?.lat && data.target_location?.lng) ? data.target_location as { lat: number; lng: number } : undefined}
         />
         <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm z-[400] border border-slate-200 dark:border-slate-700">
            {t.valuation.usedComparables} {data.kullanilan_emsal} {t.valuation.comparablesCount}
         </div>
      </div>

      {/* 4. Aksiyonlar */}
      <button 
        onClick={handleDownloadPdf}
        className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        {t.valuation.downloadReport}
      </button>
    </div>
  );
}
