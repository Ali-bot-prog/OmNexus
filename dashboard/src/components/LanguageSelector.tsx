"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => setLanguage("tr")}
        className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
          language === "tr"
            ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
      >
        <span>🇹🇷</span> TR
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
          language === "en"
            ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
      >
        <span>🇺🇸</span> EN
      </button>
    </div>
  );
}
