export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone: string;
  speciality: string;
  city: string;
  emergency24x7: boolean;
}

// Curated sample list across India for demo. Replace with real API later.
export const HOSPITALS: Hospital[] = [
  { id: "h1", name: "NeXora General Hospital", lat: 12.9716, lng: 77.5946, phone: "+918012345678", speciality: "Multi-speciality", city: "Bangalore", emergency24x7: true },
  { id: "h2", name: "Apollo Hospitals", lat: 13.0067, lng: 77.5510, phone: "+918044442100", speciality: "Multi-speciality", city: "Bangalore", emergency24x7: true },
  { id: "h3", name: "Manipal Hospital", lat: 12.9606, lng: 77.6498, phone: "+918025023333", speciality: "Multi-speciality", city: "Bangalore", emergency24x7: true },
  { id: "h4", name: "Fortis Hospital", lat: 12.8929, lng: 77.5973, phone: "+918066214444", speciality: "Cardiac & Trauma", city: "Bangalore", emergency24x7: true },
  { id: "h5", name: "Narayana Health City", lat: 12.8079, lng: 77.6772, phone: "+918071222222", speciality: "Cardiac & Oncology", city: "Bangalore", emergency24x7: true },
  { id: "h6", name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, phone: "+911126588500", speciality: "Multi-speciality", city: "Delhi", emergency24x7: true },
  { id: "h7", name: "Tata Memorial Hospital", lat: 19.0044, lng: 72.8434, phone: "+912224177000", speciality: "Oncology", city: "Mumbai", emergency24x7: true },
  { id: "h8", name: "Apollo Hospitals Chennai", lat: 13.0651, lng: 80.2549, phone: "+914428290200", speciality: "Multi-speciality", city: "Chennai", emergency24x7: true },
  { id: "h9", name: "KIMS Hospital", lat: 17.4376, lng: 78.4482, phone: "+914044885000", speciality: "Multi-speciality", city: "Hyderabad", emergency24x7: true },
  { id: "h10", name: "Yashoda Hospitals", lat: 17.4123, lng: 78.4801, phone: "+914045674567", speciality: "Multi-speciality", city: "Hyderabad", emergency24x7: true },
];

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}