"use client";

import { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";

interface TextParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export default function TextParserModal({ isOpen, onClose, onSuccess }: TextParserModalProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5555/tools/parse-text", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
         const d = await res.json();
         throw new Error(d.detail || "Analiz başarısız.");
      }

      const data = await res.json();
      onSuccess(data); // Pass data back to parent
      setText(""); // Clear
      onClose(); // Close modal

    } catch (e: any) {
        console.error(e);
        setError(e.message || "Hata oluştu.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
         <div className="p-4 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">Yapay Zeka ile Veri Çıkar</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
            </button>
         </div>
         
         <div className="p-6 flex flex-col gap-4">
            <p className="text-sm text-slate-600">
                İlan metnini (Facebook, Sahibinden, WhatsApp vb.) aşağıya yapıştırın. Yapay zeka sizin için formu doldursun.
            </p>
            
            <textarea 
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
                placeholder="Örnek: Sahibinden 3+1 daire, Ünye Gölevi mahallesi, 3.500.000 TL, 130m2..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}
         </div>

         <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg font-medium text-sm">
                İptal
            </button>
            <button 
                onClick={handleParse}
                disabled={loading || !text.trim()}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Analiz Ediliyor..." : (
                    <>
                        Verileri Çıkar
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
         </div>
      </div>
    </div>
  );
}
