"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Filter } from "lucide-react";
import MapFilterPanel from "@/components/MapFilterPanel";
import { PropertyTur } from "@/types/api";

// Dynamic Map Import
const Map = dynamic(() => import("@/components/Map").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500 font-semibold animate-pulse">Harita Yükleniyor...</p>
    </div>
  ),
});

export default function MapAnalysisPage() {
  const router = useRouter();
  const [emsals, setEmsals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State
  const [filters, setFilters] = useState<{ type: PropertyTur | "tumu", listingType?: "satilik" | "kiralik" }>({ type: "tumu" });
  const [bounds, setBounds] = useState<any>(null); // Leaflet Bounds

  // Initial Fetch
  useEffect(() => {
    async function fetchData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) { router.push("/login"); return; }
            
            const res = await fetch(`http://localhost:5555/emsal?limit=1000&ts=${new Date().getTime()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (res.status === 401) { router.push("/login"); return; }
            const data = await res.json();
            if (Array.isArray(data)) {
                // Ensure numbers
                const parsed = data.map(d => ({
                    ...d,
                    fiyat: Number(d.fiyat),
                    brut_m2: Number(d.brut_m2),
                    arsa_m2: Number(d.arsa_m2),
                    lat: Number(d.lat),
                    lng: Number(d.lng)
                }));
                setEmsals(parsed);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  // 1. Filter by Properties (Type, Price, etc.)
  const filteredEmsals = useMemo(() => {
     return emsals.filter(e => {
        if (filters.type !== "tumu" && e.tur !== filters.type) return false;
        
        // Listing Type Filter
        // If filter is set (satilik/kiralik), match it.
        // If data is missing listing_type, assume 'satilik' for backward compatibility or strict check?
        // Let's assume 'satilik' default if missing in DB for now, or just check matches
        if (filters.listingType) {
            const itemType = e.listing_type || "satilik"; // Default to satilik if null
            if (itemType !== filters.listingType) return false;
        }

        return true;
     });
  }, [emsals, filters]);

  // 2. Filter by Bounds (for Stats)
  const visibleStats = useMemo(() => {
     if (!bounds) return { count: 0, avgPrice: 0, avgM2: 0 };

     // Leaflet bounds object can be tricky in state, let's extract values if possible
     // or check if it has methods.
     let south: number | undefined, west: number | undefined, north: number | undefined, east: number | undefined;
     try {
         if (bounds.getSouthWest) {
             south = bounds.getSouthWest().lat;
             west = bounds.getSouthWest().lng;
             north = bounds.getNorthEast().lat;
             east = bounds.getNorthEast().lng;
         } else if (bounds._southWest) { // Internal fallback
             south = bounds._southWest.lat;
             west = bounds._southWest.lng;
             north = bounds._northEast.lat;
             east = bounds._northEast.lng;
         }
     } catch(e) {
         console.error("Bounds error", e);
         return { count: 0, avgPrice: 0, avgM2: 0 };
     }

     if (south === undefined) return { count: 0, avgPrice: 0, avgM2: 0 };

     let count = 0;
     let totalPrice = 0;
     let totalM2Price = 0;
     let m2Count = 0;

     filteredEmsals.forEach(e => {
        if (e.lat && e.lng) {
            // Manual Check
            // Ensure bounds are defined
            if (south !== undefined && north !== undefined && west !== undefined && east !== undefined) {
                const inLat = e.lat >= south && e.lat <= north;
                const inLng = e.lng >= west && e.lng <= east;

                if (inLat && inLng) {
                    count++;
                    totalPrice += e.fiyat || 0;
                    
                    // Calculate M2 Price (Try brut_m2, then arsa_m2)
                    const m2 = e.brut_m2 || e.arsa_m2;
                    if (m2 && m2 > 0) {
                        totalM2Price += (e.fiyat / m2);
                        m2Count++;
                    }
                }
            }
        }
     });

     return {
        count,
        avgPrice: count > 0 ? totalPrice / count : 0,
        avgM2: m2Count > 0 ? totalM2Price / m2Count : 0
     };

  }, [filteredEmsals, bounds]);

  return (
    <div className="h-screen w-full relative">
        {/* Helper/Filter Panel */}
        <MapFilterPanel 
            stats={visibleStats}
            onFilterChange={(f) => setFilters(f)}
        />

        {/* Full Screen Map */}
        <div className="absolute inset-0 z-0">
            {/* Pass only filtered pins to map, so user sees what they filtered */}
            <Map 
                emsals={filteredEmsals} 
                onBoundsChange={setBounds}
            />
        </div>
        
        {/* Loading Overlay */}
        {loading && (
            <div className="absolute inset-0 z-[500] bg-white/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                  <div className="text-slate-800 dark:text-white font-bold">Veriler Yükleniyor...</div>
            </div>
        )}
    </div>
  );
}
