import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Navigation, Loader2 } from "lucide-react";
import { HOSPITALS, Hospital, haversineKm } from "@/lib/hospitals";

export function NearbyHospitals() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setErr("Geolocation not supported"); setLoading(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => { setPos({ lat: p.coords.latitude, lng: p.coords.longitude }); setLoading(false); },
      () => { setErr("Location permission denied — showing all hospitals"); setLoading(false); },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  // Only show hospitals within ~50 km of the patient. Distant hospitals are
  // useless in emergency situations. Falls back to nearest 5 if none in range.
  const RADIUS_KM = 50;
  const list: (Hospital & { km?: number })[] = pos
    ? (() => {
        const withDist = HOSPITALS
          .map((h) => ({ ...h, km: haversineKm(pos, h) }))
          .sort((a, b) => a.km - b.km);
        const near = withDist.filter((h) => h.km <= RADIUS_KM);
        return near.length > 0 ? near : withDist.slice(0, 5);
      })()
    : HOSPITALS.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Hospitals Near You</CardTitle>
        <CardDescription>
          {loading ? "Detecting your location..." : err ? err : "Sorted by distance from your current location"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {list.map((h) => (
              <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{h.name}</span>
                    {h.emergency24x7 && <Badge variant="destructive" className="text-[10px]">24×7 ER</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{h.speciality} · {h.city}{h.km !== undefined ? ` · ${h.km.toFixed(1)} km away` : ""}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(`tel:${h.phone}`, "_self")}>
                    <Phone className="h-3.5 w-3.5 mr-1" /> Call
                  </Button>
                  <Button size="sm" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`, "_blank", "noopener")}>
                    <Navigation className="h-3.5 w-3.5 mr-1" /> Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}