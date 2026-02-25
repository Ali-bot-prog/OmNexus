"use client";

import { TrendingUp, MapPin, Filter, Calculator, Database, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{ zIndex: 999999 }} className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="flex items-center justify-center h-14 w-14 bg-transparent overflow-hidden shrink-0">
          <img src="/logo.png" alt="OMNEXUS Logo" className="h-full w-full object-contain drop-shadow-md" />
        </div>
        <span className="text-2xl font-black tracking-widest text-slate-800 dark:text-white">OMNEXUS</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">{t.common.overview}</div>
        
        <Link 
          href="/" 
          className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
            isActive("/") 
              ? "bg-green-50 dark:bg-green-900/20 text-primary dark:text-green-400 shadow-sm shadow-green-100 dark:shadow-none" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          {t.common.dashboard}
        </Link>

        <Link 
          href="/degerleme" 
          className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
            isActive("/degerleme") 
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-100 dark:shadow-none" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Calculator className="w-5 h-5" />
          {t.common.smartValuation}
          <span className="ml-auto text-[10px] bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">{t.common.new}</span>
        </Link>

        <Link 
          href="/emsal" 
          className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
            isActive("/emsal") 
              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-100 dark:shadow-none" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Filter className="w-5 h-5" />
          {t.common.emsalManagement}
        </Link>
        
        <Link 
          href="/harita" 
          className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
            isActive("/harita") 
              ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm shadow-orange-100 dark:shadow-none" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <MapPin className="w-5 h-5" />
          {t.common.mapAnalysis}
        </Link>

        <Link
          href="/veri-madenciligi"
          className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${isActive("/veri-madenciligi")
            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-100 dark:shadow-none"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
        >
          <Search className="w-5 h-5" />
          {t.common.dataMining}
          <span className="ml-auto text-[10px] bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">AJAN</span>
        </Link>

        <Link
          href="/strateji-forumu"
          className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${isActive("/strateji-forumu")
            ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-100 dark:shadow-none"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
        >
          <MessageSquare className="w-5 h-5" />
          {t.common.strategyForum}
          <span className="ml-auto text-[10px] bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">AI</span>
        </Link>
      </div>

      <div className="mt-auto space-y-4">
        {/* Ayarlar Bölümü */}
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
           <ThemeToggle />
           <LanguageSelector />
        </div>

        <div className="p-4 bg-slate-900 dark:bg-black rounded-2xl text-white">
          <p className="text-xs text-slate-400 mb-1">{t.common.deviceStatus}</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t.common.aiActive}
          </div>
        </div>
      </div>
    </nav>
  );
}
