"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download, Upload, Search, Trash2, Edit, FileSpreadsheet, Sparkles } from "lucide-react";
import { EstimateRequest } from "@/types/api"; 
import EmsalModal from "@/components/EmsalModal";
import TextParserModal from "@/components/TextParserModal";

// Type definition matching backend Emsal model
interface EmsalItem {
  id: number;
  tur: string;
  listing_type?: string;
  durum?: string; // [NEW]
  il: string;
  ilce: string;
  mahalle: string;
  fiyat: number;
  brut_m2: number;
  arsa_m2?: number;
  net_m2?: number;
  bina_yasi?: number;
  kat?: string;
  created_at: string;
  lat?: number;
  lng?: number;
}

export default function EmsalPage() {
  const router = useRouter();
  const [emsals, setEmsals] = useState<EmsalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const LIMIT = 50;
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmsalItem | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  const [filters, setFilters] = useState<{ tur: string; durum: string; listingType: string; }>({
    tur: "",
    durum: "",
    listingType: ""
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
       router.push("/login");
       return {};
    }
    return { "Authorization": `Bearer ${token}` };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const offset = page * LIMIT;
      // Build query string
      const params = new URLSearchParams({
         limit: LIMIT.toString(),
         offset: offset.toString(),
         sort: "asc"
      });
      if (searchTerm) {
        params.append("q", searchTerm);
      }
      if (filters.tur) {
        params.append("tur", filters.tur);
      }
      if (filters.durum) {
        params.append("durum", filters.durum);
      }
      if (filters.listingType) {
        params.append("listing_type", filters.listingType);
      }

      const res = await fetch(`http://localhost:5555/emsal?${params.toString()}`, {
         headers: getAuthHeaders() as any
      });
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmsals(data);
      } else {
        setEmsals([]);
      }
    } catch (err) {
      console.error(err);
      setEmsals([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page changes or filters change
  useEffect(() => {
    fetchData();
  }, [page, filters]);

  // Handle Search (reset page to 0)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`http://localhost:5555/emsal/${id}`, { 
          method: "DELETE",
          headers: getAuthHeaders() as any,
      });
      if (res.ok) {
        setEmsals(prev => prev.filter(e => e.id !== id));
      } else {
        alert("Silme başarısız oldu.");
      }
    } catch (e) {
      console.error(e);
      alert("Hata oluştu.");
    }
  };

  const handleExportExcel = async () => {
     try {
       const res = await fetch("http://localhost:5555/export/emsal", {
           headers: getAuthHeaders() as any
       });
       if (res.status === 401) { router.push("/login"); return; }
       if (!res.ok) throw new Error("Export failed");
       
       const blob = await res.blob();
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `emsal_listesi_${new Date().toISOString().slice(0,10)}.xlsx`;
       document.body.appendChild(a);
       a.click();
       a.remove();
     } catch (e) {
        alert("Export hatası: " + e);
     }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5555/import/emsal", {
        method: "POST",
        body: fd,
        headers: getAuthHeaders() as any
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Yükleme hatası");

      alert(`Yükleme Başarılı!\nToplam: ${data.total_rows}\nBaşarılı: ${data.success}\nHatalı: ${data.errors.length}`);
      fetchData(); // Refresh grid
    } catch (err: any) {
      alert("Import Başarısız: " + err.message);
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Emsal Yönetimi</h1>
          <p className="text-slate-500 text-sm">Veritabanındaki tüm kayıtları düzenleyin.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsParserOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Metinden Doldur (AI)
          </button>

          <button 
            onClick={() => document.getElementById('import-excel-input')?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Excel Yükle
          </button>

          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel İndir
          </button>
          
          <button 
            onClick={() => { setEditingItem(null); setInitialData(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Emsal
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/50">
          {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="İlçe veya mahalle ara... (Enter)" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
               />
            </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.tur}
              onChange={(e) => { setFilters({ ...filters, tur: e.target.value }); setPage(0); }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[120px]"
            >
              <option value="">Tüm Türler</option>
              <option value="konut">Konut</option>
              <option value="ticari">Ticari</option>
              <option value="arsa">Arsa</option>
            </select>

            <select
              value={filters.listingType}
              onChange={(e) => { setFilters({ ...filters, listingType: e.target.value }); setPage(0); }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[120px]"
            >
              <option value="">Tüm İlan Tipleri</option>
              <option value="satilik">Satılık</option>
              <option value="kiralik">Kiralık</option>
            </select>

            <select
              value={filters.durum}
              onChange={(e) => { setFilters({ ...filters, durum: e.target.value }); setPage(0); }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[120px]"
            >
              <option value="">Tüm Durumlar</option>
              <option value="aktif">Aktif</option>
              <option value="satildi">Satıldı</option>
              <option value="kiralandi">Kiralandı</option>
              <option value="pasif">Pasif</option>
            </select>

            {/* Clear Filters Button (Shows only if a filter is active) */}
            {(filters.tur || filters.durum || filters.listingType || searchTerm) && (
              <button
                onClick={() => {
                  setFilters({ tur: "", durum: "", listingType: "" });
                  setSearchTerm("");
                  setPage(0);
                }}
                className="px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
              >
                Temizle
              </button>
            )}
          </div>
         </div>

         {/* Grid */}
         <div className="overflow-x-auto min-h-[400px]">
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
               <tr>
                 <th className="p-4">Sıra</th>
                 <th className="p-4">Tür</th>
                 <th className="p-4">Konum</th>
                 <th className="p-4">Fiyat</th>
                 <th className="p-4">Büyüklük</th>
                 <th className="p-4">Bina Yaşı</th>
                 <th className="p-4">Tarih</th>
                 <th className="p-4 text-right">İşlemler</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {loading ? (
                 <tr><td colSpan={8} className="p-8 text-center text-slate-400">Yükleniyor...</td></tr>
               ) : emsals.length === 0 ? (
                 <tr><td colSpan={8} className="p-8 text-center text-slate-400">Kayıt bulunamadı.</td></tr>
               ) : (
                  emsals.map((e, index) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 font-mono text-slate-400">#{index + 1 + (page * LIMIT)}</td>
                  <td className="p-4">
                        <div className="flex flex-col gap-1">
                           <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded uppercase border border-slate-200 w-fit">
                             {e.tur}
                           </span>
                           {/* Status Badge */}
                           {e.durum && e.durum !== 'aktif' && (
                             <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border w-fit
                               ${e.durum === 'satildi' ? 'bg-red-50 text-red-600 border-red-100' : 
                                 e.durum === 'kiralandi' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                 'bg-gray-50 text-gray-500 border-gray-200'}
                             `}>
                               {e.durum === 'satildi' ? 'SATILDI' : e.durum === 'kiralandi' ? 'KİRALANDI' : e.durum}
                             </span>
                           )}
                        </div>
                  </td>
                     <td className="p-4">
                       <div className="font-medium text-slate-800">{e.ilce}</div>
                       <div className="text-xs text-slate-500">{e.mahalle}</div>
                     </td>
                     <td className="p-4 font-bold text-slate-900">{e.fiyat.toLocaleString()} TL</td>
                     <td className="p-4">
                        {e.tur === "arsa" ? (
                           <div>{e.arsa_m2} m² (Arsa)</div>
                        ) : (
                           <>
                             <div>{e.brut_m2} m² (Brüt)</div>
                             {e.net_m2 && <div className="text-xs text-slate-400">{e.net_m2} m² (Net)</div>}
                           </>
                        )}
                     </td>
                     <td className="p-4 text-slate-600">{e.bina_yasi !== undefined ? `${e.bina_yasi} Yaş` : "-"}</td>
                     <td className="p-4 text-slate-500 text-xs">{new Date(e.created_at).toLocaleDateString("tr-TR")}</td>
                     <td className="p-4">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => { setEditingItem(e); setInitialData(null); setIsModalOpen(true); }}
                           className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                         >
                           <Edit className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDelete(e.id)}
                           className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
         
         {/* Pagination Controls */}
         <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="text-sm text-slate-500">
               Sayfa {page + 1}
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => setPage(p => Math.max(0, p - 1))}
                 disabled={page === 0 || loading}
                 className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
               >
                 Önceki
               </button>
               <button 
                 onClick={() => setPage(p => p + 1)}
                 disabled={emsals.length < LIMIT || loading}
                 className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
               >
                 Sonraki
               </button>
            </div>
         </div>
      </div>
      
       {/* Modal - Emsal Edit/Create */}
       <EmsalModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSuccess={() => { 
           setIsModalOpen(false); 
           setSearchTerm("");
           setPage(0);
           fetchData(); 
         }}
         editingItem={editingItem}
         initialData={initialData}
       />

        {/* Modal - AI Parser */}
        <TextParserModal
           isOpen={isParserOpen}
           onClose={() => setIsParserOpen(false)}
           onSuccess={(data) => {
               setInitialData(data);
               setEditingItem(null);
               setIsParserOpen(false); // Close parser
               setTimeout(() => setIsModalOpen(true), 200); // Open form filled
           }}
        />
      
      {/* Hidden File Input for Import */}
      <input 
         type="file"
         id="import-excel-input"
         accept=".xlsx"
         className="hidden"
         onChange={handleImportExcel}
      />
    </main>
  );
}
