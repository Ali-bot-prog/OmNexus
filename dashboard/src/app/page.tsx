"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ShieldCheck, Home, Search, Filter } from "lucide-react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

// Dynamically import Map component (client-side only)
const Map = dynamic(() => import("@/components/Map").then((mod) => mod.default), {
  ssr: false,
  loading: () => {
    // eslint-disable-next-line
    const { t } = useLanguage();
    return (
      <div className="h-full w-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-slate-600 dark:text-slate-400 font-semibold">{t.common.loadingMap}</p>
        </div>
      </div>
    );
  },
});

interface Emsal {
  id: number;
  tur: string;
  il: string;
  ilce: string;
  mahalle: string;
  fiyat: number;
  brut_m2: number;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [emsals, setEmsals] = useState<Emsal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    avgM2: 0,
    confidence: 85
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    setIsAuthChecking(false);

    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5555/emsal?limit=100&sort=desc", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const data = await res.json();
        
        if (Array.isArray(data)) {
          setEmsals(data);
          
          const total = data.length;
          if (total > 0) {
            const avgM2 = data.reduce((acc: number, curr: Emsal) => {
               const m2 = curr.brut_m2 || 1;
               return acc + (curr.fiyat / m2);
            }, 0) / total;
            
            setStats({
              total,
              avgM2: Math.round(avgM2),
              confidence: 85
            });
          }
        }
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (isAuthChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">{t.common.checkingAuth}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.common.digitalAgent}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.common.digitalAgentDesc}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.common.searchPlaceholder} 
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
           </div>
           <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Filter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
           </button>
           <button 
             onClick={handleLogout}
             className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/10"
           >
              {t.common.logout}
           </button>
        </div>
      </header>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">{t.common.live}</span>
          </div>
          <h3 className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider">{t.common.totalEmsal}</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? "..." : stats.total.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider">{t.common.avgUnitPrice}</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? "..." : stats.avgM2.toLocaleString()} TL</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider">{t.common.marketConfidence}</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">%{stats.confidence}</p>
        </div>
      </div>

      {/* Content Tabs / Areas */}
      <div className="grid grid-cols-3 gap-8">
         {/* Map Area */}
         <div className="col-span-2 bg-white dark:bg-slate-800 p-2 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-[500px] overflow-hidden">
            <div className="relative h-full w-full">
              <Map emsals={emsals} />
            </div>
         </div>

         {/* Feed Area */}
         <div className="col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center justify-between">
              {t.common.latestEmsals}
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t.common.last24Hours}</span>
            </h2>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 dark:bg-slate-700 rounded-2xl animate-pulse" />)
              ) : (
                emsals.slice(0, 10).map((e) => (
                  <div key={e.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="px-2 py-1 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-md border border-slate-100 dark:border-slate-600 uppercase">{e.tur}</span>
                       <span className="text-[11px] text-slate-400 dark:text-slate-500">{new Date(e.created_at).toLocaleDateString("tr-TR")}</span>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1 truncate">{e.ilce} / {e.mahalle}</p>
                    <p className="text-primary dark:text-green-400 font-black text-lg">{e.fiyat.toLocaleString()} TL</p>
                  </div>
                ))
              )}
            </div>
         </div>
      </div>
    </div>
  );
}
