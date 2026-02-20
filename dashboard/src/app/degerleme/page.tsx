"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ValuationForm from "@/components/ValuationForm";
import ValuationResult from "@/components/ValuationResult";
import { EstimateRequest, EstimateResponse, PropertyTur } from "@/types/api";

export default function ValuationPage() {
  const router = useRouter();
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = async (tur: PropertyTur, data: EstimateRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }

      const res = await fetch(`http://localhost:5555/estimate/${tur}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch (parseError) {
        // JSON değil, muhtemelen HTML hata sayfası döndü
        throw new Error(`Sunucu Hatası (${res.status}): Beklenmedik yanıt formatı.`);
      }

      if (res.status === 404) {
         setResult(null);
         setError("NO_DATA"); 
         return;
      }

      if (res.status === 401) {
         router.push("/login");
         return;
      }

      if (!res.ok) {
        throw new Error(responseData.detail || "Değerleme sırasında bir hata oluştu.");
      }

      setResult(responseData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* Left Column: Form (Sticky) */}
      <div className="lg:col-span-4">
        <div className="sticky top-8">
           <div className="mb-6">
             <h1 className="text-2xl font-bold text-slate-900">Akıllı Değerleme</h1>
             <p className="text-slate-500 text-sm">Mülk detaylarını gir, yapay zeka senin için hesaplasın.</p>
           </div>
           
           <ValuationForm onEstimate={handleEstimate} loading={loading} />
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-8">
       {error === "NO_DATA" ? (
           <div className="mb-6 p-8 bg-amber-50 border border-amber-100 rounded-3xl text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">🧐</span>
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">Yeterli Veri Bulunamadı</h3>
              <p className="text-amber-700/80 mb-6 max-w-md mx-auto text-sm">
                 Aradığınız kriterlere uygun emsal kaydı veritabanında henüz yok.
                 Doğru bir değerleme için önce bu bölgeye ait birkaç örnek veri girmelisiniz.
              </p>
              <a href="/emsal" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
                 Emsal Verisi Ekle
              </a>
           </div>
         ) : error && (
           <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl animate-pulse">
             ⚠️ {error}
           </div>
         )}

         {loading && (
           <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p>Piyasa verileri analiz ediliyor...</p>
           </div>
         )}

         {!loading && !result && !error && (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                 <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-2">Henüz Değerleme Yapılmadı</h3>
              <p className="max-w-md">Sol taraftaki formu doldurarak bölgenizdeki emsal verilerine dayalı akıllı fiyat tahmini alabilirsiniz.</p>
           </div>
         )}

         {result && (
           <ValuationResult data={result} />
         )}
      </div>
    </div>
  );
}
