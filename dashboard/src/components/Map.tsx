"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


interface MapProps {
  emsals: any[];
  target?: { lat: number; lng: number } | null;
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
}

// Helper to capture map events
const MapEvents = ({ onBoundsChange }: { onBoundsChange?: (b: L.LatLngBounds) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      if (onBoundsChange) {
        try {
          onBoundsChange(map.getBounds());
        } catch (e) {
             console.error("Map Bounds check error", e);
        }
      }
    },
    // Trigged on load too
    load: () => {
        if (onBoundsChange) {
             try {
                 onBoundsChange(map.getBounds());
             } catch(e) {}
        }
    }
  });

  // Trigger once on mount if map is ready, without adding onBoundsChange to dependency array
  // which causes infinite loops if the parent passes an inline function.
  useEffect(() => {
     if (map && onBoundsChange) {
         try {
             onBoundsChange(map.getBounds());
         } catch(e) {}
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

const MapComponent = ({ emsals, target, onBoundsChange }: MapProps) => {
  useEffect(() => {
    // Leaflet default icon fix
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const points = (emsals || []).filter(e => e.lat && e.lng);
  
  const targetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Green Icon for Office
  const officeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });




  
  // Konut (Mavi)
  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Arsa (Kahverengi isteği -> Turuncu kullanıyoruz)
  const brownIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Ticari (Mor)
  const violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  // Office Location: Bedesten İş Merkezi No:3z, Ünye (Near Büyük Cami)
  // Approx Coords: 41.127983, 37.287189
  const OFFICE_LOC: [number, number] = [41.127983, 37.287189];

  const getIcon = (type?: string) => {
      const t = (type || "").toLowerCase().trim();
      
      // Arsa Variations
      if (t.includes("arsa") || t.includes("arazi") || t.includes("tarla")) return brownIcon; 
      
      // Ticari Variations
      if (t.includes("ticari") || t.includes("isyeri") || t.includes("işyeri") || t.includes("dukkan") || t.includes("dükkan") || t.includes("ofis") || t.includes("büro")) return violetIcon; 
      
      // Konut Variations
      if (t.includes("konut") || t.includes("daire") || t.includes("ev") || t.includes("villa") || t.includes("yali")) return blueIcon;
      
      // Default fallback (e.g. if unknown)
      return blueIcon; 
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={target ? [target.lat, target.lng] : OFFICE_LOC} 
        zoom={target ? 14 : 14} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
      >
        <MapEvents onBoundsChange={onBoundsChange} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Static Office Marker */}
        <Marker position={OFFICE_LOC} icon={officeIcon}>
             <Popup>
                <div className="font-sans text-xs text-center">
                    <p className="font-bold text-green-600 mb-1">MERKEZ OFİS</p>
                    <p>Bedesten İş Merkezi No:3z</p>
                    <p>Ünye / ORDU</p>
                </div>
            </Popup>
        </Marker>
        
        {/* Target Property Marker */}
        {target && (
            <Marker position={[target.lat, target.lng]} icon={targetIcon}>
                <Popup>
                    <div className="font-sans text-xs text-center">
                        <p className="font-bold text-red-600 mb-1">HEDEF MÜLK</p>
                        <p>Değerlenen Konum</p>
                    </div>
                </Popup>
            </Marker>
        )}

        {/* Comparable Properties */}
        {/* Comparable Properties with Jitter for Overlaps */}
        {points.map((p, i, all) => {
          // Check for overlaps with previous points (simple O(N^2) but N is small)
          const overlapCount = all.filter((other, idx) => idx < i && other.lat === p.lat && other.lng === p.lng).length;
          
          let renderLat = p.lat;
          let renderLng = p.lng;

          if (overlapCount > 0) {
              // Jitter: Shift slightly for each overlap
              // 0.0001 is roughly 10 meters
              const offset = 0.0001 * overlapCount; 
              // Shift Diagonally
              renderLat += offset;
              renderLng += offset;
          }

          const typeStr = (p.tur || "").toLowerCase().trim();
          let debugColor = "MAVI (Default)";
          if (typeStr.includes("arsa") || typeStr.includes("arazi") || typeStr.includes("tarla")) debugColor = "TURUNCU (Arsa)";
          else if (typeStr.includes("ticari") || typeStr.includes("dukkan") || typeStr.includes("dükkan") || typeStr.includes("isyeri") || typeStr.includes("ofis")) debugColor = "MOR (Ticari)";
          
          return (
            <Marker key={`${p.id}-${p.tur}-${Date.now()}`} position={[renderLat, renderLng]} icon={getIcon(p.tur)}>
                <Popup>
                <div className="font-sans text-xs">
                    <p className="font-bold border-b pb-1 mb-1">{p.tur?.toUpperCase()} - {p.mahalle || "Bölge"}</p>
                    <p className="text-blue-600 font-bold">{(p.fiyat || 0).toLocaleString()} TL</p>
                    {/* Debug Info */}
                    <p className="text-[10px] text-gray-400 mt-1">Algılanan: {debugColor}</p>
                    {overlapCount > 0 && <p className="text-[10px] text-red-400 font-bold">(Çakışma: Kaydırıldı)</p>}
                </div>
                </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
