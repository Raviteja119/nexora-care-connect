import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons (Vite breaks the bundled asset URLs)
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetina = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadow = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl: iconRetina, shadowUrl: shadow });

const ambulanceIcon = L.divIcon({
  className: "",
  html: `<div style="background:#dc2626;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 0 0 4px rgba(220,38,38,0.35);animation:pulse 1.5s infinite;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 6h12v9h2l3-4v-3h-1l-2-2h-2V4H3v2zm2 0h10v6H5V6zm12 4l1.5 2H17v-2zm-9 7a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const hospitalIcon = L.divIcon({
  className: "",
  html: `<div style="background:#10b981;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M19 8h-2V3H7v5H5c-1.1 0-2 .9-2 2v11h18V10c0-1.1-.9-2-2-2zm-8 11H5v-2h6v2zm0-4H5v-2h6v2zm0-4H5V9h6v2zm2-3h2v2h2v-2h2v-2h-2V6h-2v2h-2v2zM19 19h-6v-2h6v2zm0-4h-6v-2h6v2z"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface Props {
  hospital: { lat: number; lng: number; name: string };
  user: { lat: number; lng: number } | null;
  ambulanceActive: boolean;
  progress: number; // 0..100
}

export function AmbulanceMap({ hospital, user, ambulanceActive, progress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{ hosp?: L.Marker; user?: L.Marker; amb?: L.Marker; route?: L.Polyline }>({});

  const ambPos = useMemo<[number, number] | null>(() => {
    if (!user || !ambulanceActive) return null;
    const t = Math.min(1, Math.max(0, progress / 100));
    return [
      hospital.lat + (user.lat - hospital.lat) * t,
      hospital.lng + (user.lng - hospital.lng) * t,
    ];
  }, [hospital, user, ambulanceActive, progress]);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView(
      user ? [user.lat, user.lng] : [hospital.lat, hospital.lng],
      13,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    layersRef.current.hosp = L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon })
      .bindPopup(hospital.name)
      .addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync user + route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (user) {
      if (!layersRef.current.user) {
        layersRef.current.user = L.marker([user.lat, user.lng]).bindPopup("Your location").addTo(map);
      } else {
        layersRef.current.user.setLatLng([user.lat, user.lng]);
      }
      const routeCoords: [number, number][] = [[hospital.lat, hospital.lng], [user.lat, user.lng]];
      if (!layersRef.current.route) {
        layersRef.current.route = L.polyline(routeCoords, {
          color: "#dc2626", weight: 4, dashArray: "8 8", opacity: 0.8,
        }).addTo(map);
      } else {
        layersRef.current.route.setLatLngs(routeCoords);
      }
      map.fitBounds(routeCoords as L.LatLngBoundsExpression, { padding: [40, 40] });
    }
  }, [user, hospital]);

  // Sync ambulance marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (ambPos) {
      if (!layersRef.current.amb) {
        layersRef.current.amb = L.marker(ambPos, { icon: ambulanceIcon })
          .bindPopup(`Ambulance en route — ${Math.round(progress)}%`)
          .addTo(map);
      } else {
        layersRef.current.amb.setLatLng(ambPos);
        layersRef.current.amb.setPopupContent(`Ambulance en route — ${Math.round(progress)}%`);
      }
    } else if (layersRef.current.amb) {
      map.removeLayer(layersRef.current.amb);
      layersRef.current.amb = undefined;
    }
  }, [ambPos, progress]);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: 300, borderRadius: "0.5rem" }} />;
}