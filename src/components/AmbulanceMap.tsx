import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

function FitBounds({ a, b }: { a: [number, number]; b: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([a, b], { padding: [40, 40] });
  }, [a[0], a[1], b[0], b[1]]); // eslint-disable-line
  return null;
}

export function AmbulanceMap({ hospital, user, ambulanceActive, progress }: Props) {
  const center: [number, number] = user ? [user.lat, user.lng] : [hospital.lat, hospital.lng];
  // Interpolate ambulance position along straight line from hospital → user
  const ambPos: [number, number] | null = useMemo(() => {
    if (!user || !ambulanceActive) return null;
    const t = Math.min(1, Math.max(0, progress / 100));
    return [
      hospital.lat + (user.lat - hospital.lat) * t,
      hospital.lng + (user.lng - hospital.lng) * t,
    ];
  }, [hospital, user, ambulanceActive, progress]);

  const route: [number, number][] = user ? [[hospital.lat, hospital.lng], [user.lat, user.lng]] : [];

  return (
    <div className="w-full h-full">
      <MapContainer center={center} zoom={13} style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }} scrollWheelZoom>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[hospital.lat, hospital.lng]} icon={hospitalIcon}>
          <Popup>{hospital.name}</Popup>
        </Marker>
        {user && (
          <Marker position={[user.lat, user.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {route.length === 2 && <Polyline positions={route} pathOptions={{ color: "#dc2626", weight: 4, dashArray: "8 8", opacity: 0.8 }} />}
        {ambPos && (
          <Marker position={ambPos} icon={ambulanceIcon}>
            <Popup>Ambulance en route — {Math.round(progress)}%</Popup>
          </Marker>
        )}
        {user && <FitBounds a={[hospital.lat, hospital.lng]} b={[user.lat, user.lng]} />}
      </MapContainer>
    </div>
  );
}