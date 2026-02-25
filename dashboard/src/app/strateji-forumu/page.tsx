"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Users, Eye, HelpCircle, AlertTriangle, TrendingUp, Lightbulb, Search, BookOpen, Globe, Newspaper } from "lucide-react";

interface ForumPost {
  id: number;
  kategori: string;
  soru_baslik: string;
  cevap_icerik: string;
  okunma_sayisi: number;
  created_at: string;
}

interface NewsItem {
  baslik: string;
  ozet: string;
  link: string;
  kategori: string;
}

export default function StrategyForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const categories = ["Tümü", "İtiraz Karşılama", "Hukuki", "Pazarlama Stratejisi", "Müzakere"];

  const fetchData = async () => {
    try {
      setLoadingPosts(true);
      const res = await fetch("http://localhost:5555/api/forum", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchNews = async () => {
    try {
      setLoadingNews(true);
      const res = await fetch("http://localhost:5555/api/forum/news", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNews();
  }, []);

  const handleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    
    // Okunma sayısını artır
    try {
      await fetch(`http://localhost:5555/api/forum/${id}/read`, { method: "POST" });
      setPosts(posts.map(p => p.id === id ? { ...p, okunma_sayisi: p.okunma_sayisi + 1 } : p));
    } catch (e) {}
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("itiraz")) return <HelpCircle className="w-4 h-4 text-orange-500" />;
    if (cat.includes("hukuk")) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (cat.includes("pazar")) return <TrendingUp className="w-4 h-4 text-blue-500" />;
    return <Lightbulb className="w-4 h-4 text-emerald-500" />;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.soru_baslik.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.cevap_icerik.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || post.kategori.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
          <BookOpen className="w-96 h-96" />
        </div>

        <div className="relative z-10 w-full md:w-3/4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Globe className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
              Bilgi, Veri ve Ekosistem Merkezi
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Sektörel haberleri canlı takip edin, ofisinizin standart senaryolarını tek tıklamayla bulun. İnternet dünyasıyla şirketinizin hafızası tek ekranda.
          </p>
        </div>
      </div>


      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Market Memory (Scenarios) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Piyasa Hafızası (Senaryolar & Çözümler)
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Senaryo veya çözüm ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all shadow-sm"
              />
            </div>
            <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat 
                      ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {loadingPosts ? (
              <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 mb-4 text-slate-300 dark:text-slate-600">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">Kayıt Bulunamadı</h3>
                <p className="text-slate-500 dark:text-slate-400">Aradığınız kritere uygun senaryo yok.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <div 
                      className="w-full text-left p-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 group"
                      onClick={() => handleExpand(post.id)}
                    >
                      <div className="flex items-center gap-3 shrink-0 md:w-48">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          {getCategoryIcon(post.kategori)}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {post.kategori}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-base font-semibold leading-snug transition-colors ${expandedId === post.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
                          {post.soru_baslik}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-slate-400 dark:text-slate-500 text-sm font-medium">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
                          <Eye className="w-4 h-4" /> {post.okunma_sayisi}
                        </span>
                      </div>
                    </div>
                    {expandedId === post.id && (
                      <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2">
                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 relative">
                           <div className="absolute left-0 top-6 bottom-6 w-1 bg-emerald-500 rounded-r-full"></div>
                          <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-3 text-xs tracking-widest uppercase">
                            <MessageSquare className="w-4 h-4 text-emerald-500" /> Profesyonel Çözüm
                          </h4>
                          <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-[15px]">
                            {post.cevap_icerik}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Live Internet News Feed */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-500" />
            Canlı Pazar Trendleri
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {loadingNews ? (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 space-y-4">
                 <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                 <p className="text-sm">İnternet taranıyor...</p>
               </div>
            ) : news.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 text-center">
                 <Globe className="w-12 h-12 opacity-20 mb-4" />
                 <p>Şu an güncel haber bulunamadı.</p>
               </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[800px] custom-scrollbar">
                {news.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-150 transition-transform"></div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-snug mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {item.baslik}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.ozet}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center">
               <span className="text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 Emlakjet Haber / Veri Akışı Aktif
               </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
