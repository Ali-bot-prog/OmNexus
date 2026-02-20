"use client";

import { useState } from "react";
import { Building, Map as MapIcon, Briefcase } from "lucide-react";
import { PropertyTur } from "@/types/api";
import { useLanguage } from "@/context/LanguageContext";

interface FilterState {
    type: PropertyTur | "tumu";
    listingType?: "satilik" | "kiralik";
    minPrice?: number;
    maxPrice?: number;
}

interface MapFilterPanelProps {
    stats: {
        count: number;
        avgPrice: number;
        avgM2: number;
    };
    onFilterChange: (filters: FilterState) => void;
}

export default function MapFilterPanel({ stats, onFilterChange }: MapFilterPanelProps) {
    const { t } = useLanguage();
    const [filters, setFilters] = useState<FilterState>({ type: "tumu" });
    const [isOpen, setIsOpen] = useState(true);

    const handleTypeChange = (type: PropertyTur | "tumu") => {
        const newFilters = { ...filters, type };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className={`absolute top-24 left-6 z-[400] w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px]" : "max-h-14"}`}>
            
            {/* Header / Toggle */}
            <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="font-bold text-slate-800 dark:text-white">{t.common.mapAnalysis}</h2>
                <div className={`transition-transform duration-300 text-slate-500 dark:text-slate-400 ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pt-0 space-y-6">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <div className="text-[10px] uppercase font-bold text-blue-400">{t.common.avgUnitPrice}</div>
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{(stats.avgPrice / 1000).toFixed(1)}k <span className="text-xs">TL</span></div>
                        <div className="text-[10px] text-blue-500 dark:text-blue-300">Ort. m²: {Math.round(stats.avgM2).toLocaleString()} TL</div>
                    </div>
                     <div className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                        <div className="text-[10px] uppercase font-bold text-green-400">{t.common.totalEmsal}</div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-400">{stats.count}</div>
                        <div className="text-[10px] text-green-500 dark:text-green-300">{t.result.comparablesCount}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                    {/* Listing Type: Satılık / Kiralık */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">İlan Tipi</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => {
                                    const nf = { ...filters, listingType: undefined };
                                    setFilters(nf);
                                    onFilterChange(nf);
                                }}
                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all 
                                    ${!filters.listingType 
                                        ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
                                `}
                            >
                                {t.common.all}
                            </button>
                            <button
                                onClick={() => {
                                    const nf = { ...filters, listingType: "satilik" as const };
                                    setFilters(nf);
                                    onFilterChange(nf);
                                }}
                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all 
                                    ${filters.listingType === "satilik" 
                                        ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
                                `}
                            >
                                {t.valuation.sale}
                            </button>
                             <button
                                onClick={() => {
                                    const nf = { ...filters, listingType: "kiralik" as const };
                                    setFilters(nf);
                                    onFilterChange(nf);
                                }}
                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all 
                                    ${filters.listingType === "kiralik" 
                                        ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
                                `}
                            >
                                {t.valuation.rent}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Mülk Tipi</label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                             <button 
                                onClick={() => handleTypeChange("tumu")}
                                className={`p-2 rounded-md text-[10px] font-bold transition-all 
                                    ${filters.type === "tumu" 
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
                                `}
                             >
                                {t.common.all}
                             </button>
                             <button 
                                onClick={() => handleTypeChange("konut")}
                                className={`p-2 rounded-md transition-all flex items-center justify-center 
                                    ${filters.type === "konut" 
                                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}
                                `}
                             >
                                <Building className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => handleTypeChange("arsa")}
                                className={`p-2 rounded-md transition-all flex items-center justify-center 
                                    ${filters.type === "arsa" 
                                        ? "bg-white dark:bg-slate-700 text-yellow-600 dark:text-yellow-400 shadow-sm" 
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}
                                `}
                             >
                                 <MapIcon className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => handleTypeChange("ticari")}
                                className={`p-2 rounded-md transition-all flex items-center justify-center 
                                    ${filters.type === "ticari" 
                                        ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm" 
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}
                                `}
                             >
                                 <Briefcase className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                </div>

                <div className="pt-2 text-[10px] text-center text-slate-400">
                    {t.common.updateStats}
                </div>
            </div>
        </div>
    );
}
