"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Building2, ExternalLink, Star, StarOff, Clock, TrendingUp, ShieldAlert } from "lucide-react";

export default function FsboAgentPage() {
  const [il, setIl] = useState("Ordu");
  const [ilce, setIlce] = useState("Ünye");
  const [tur, setTur] = useState("konut");
  
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [savedLeads, setSavedLeads] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Sayfa yüklendiğinde kayıtlı leadleri getir
  useEffect(() => {
    fetchSavedLeads();
  }, []);

  const fetchSavedLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      if(!token) return;
      const res = await fetch("http://localhost:5555/api/fsbo/leads", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        const data = await res.json();
        setSavedLeads(data);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    setLeads([]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5555/api/fsbo/search", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ il, ilce, tur })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Arama sırasında bir hata oluştu.");
      
      setLeads(data.leads || []);
      // Refresh saved leads to show newly saved ones in the right column
      fetchSavedLeads();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const togglePortfolio = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5555/api/fsbo/${id}/portfolio`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        fetchSavedLeads(); // refresh the list
      }
    } catch(e) {
      console.error(e);
    }
  };

  const renderLeadCard = (lead: any, isSavedItem: boolean = false) => {
    const isFSBO = lead.fsbo_skoru > 0;
    const isPortfolio = lead.portfoy_adayi === 1;

    return (
      <div key={lead.id || lead.url} className={`p-4 rounded-xl border transition-all ${isPortfolio ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"} hover:shadow-md`}>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFSBO ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                {lead.platform}
              </span>
              {isFSBO && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> SAHİBİNDEN
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2" title={lead.baslik}>
              {lead.baslik}
            </h3>
          </div>
          <a href={lead.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors flex-shrink-0">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          {lead.ozet}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/50">
          <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
            {lead.tahmini_fiyat ? `${lead.tahmini_fiyat.toLocaleString("tr-TR")} ₺` : "Fiyat Belirsiz"}
          </div>
          
          {isSavedItem && lead.id && (
            <button 
              onClick={() => togglePortfolio(lead.id)}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isPortfolio 
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {isPortfolio ? <><Star className="w-4 h-4 fill-amber-500 stroke-amber-500" /> Aday</> : <><StarOff className="w-4 h-4" /> Aday Yap</>}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Search className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-300">
              FSBO Emlak Avcısı
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            İnternetteki ilanları yapay zeka ile tarayın, aracısız (sahibinden) satılan mülkleri bulun ve portföyünüze katın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Search Form & Current Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">İl</label>
                <input 
                  type="text" 
                  value={il}
                  onChange={(e) => setIl(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">İlçe / Bölge</label>
                <input 
                  type="text" 
                  value={ilce}
                  onChange={(e) => setIlce(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emlak Tipi</label>
                <select 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  value={tur}
                  onChange={(e) => setTur(e.target.value)}
                >
                  <option value="konut">Konut</option>
                  <option value="ticari">Ticari / İşyeri</option>
                  <option value="arsa">Arsa / Tarla</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSearching ? <Search className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5" />}
                {isSearching ? "Aranıyor..." : "Hemen Tara"}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {isSearching && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Yapay Zeka Satıcı İlanlarını Analiz Ediyor...</p>
            </div>
          )}

          {!isSearching && leads.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                Canlı Arama Sonuçları ({leads.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map(lead => renderLeadCard(lead, false))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Gece Taraması & Kayıtlı Leadler */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 dark:text-white">
              <Clock className="w-5 h-5 text-indigo-500" />
              Sizin İçin Bulunanlar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Gece otomatik taramalar (02:00) ve önceki aramalarınızdan sisteme kaydedilen potansiyel fırsatlar.
            </p>

            <div className="space-y-4 overflow-y-auto pr-2 max-h-[600px] custom-scrollbar">
              {savedLeads.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <TrendingUp className="w-12 h-12 opacity-20 mx-auto mb-3" />
                  <p>Henüz kayıtlı bir fırsat yok.</p>
                </div>
              ) : (
                savedLeads.map(lead => renderLeadCard(lead, true))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
