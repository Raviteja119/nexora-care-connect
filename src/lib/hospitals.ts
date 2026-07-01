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
  // Guntur (AP)
  { id: "g1", name: "Guntur Government General Hospital", lat: 16.3067, lng: 80.4365, phone: "+918632234200", speciality: "Multi-speciality", city: "Guntur", emergency24x7: true },
  { id: "g2", name: "NRI General Hospital", lat: 16.4419, lng: 80.6221, phone: "+918645244555", speciality: "Multi-speciality", city: "Guntur", emergency24x7: true },
  { id: "g3", name: "Manipal Hospitals Vijayawada", lat: 16.5062, lng: 80.6480, phone: "+918666666555", speciality: "Multi-speciality", city: "Vijayawada", emergency24x7: true },
  { id: "g4", name: "Katuri Medical College & Hospital", lat: 16.3410, lng: 80.5320, phone: "+918632350005", speciality: "Multi-speciality", city: "Guntur", emergency24x7: true },
  { id: "g5", name: "Ramesh Hospitals", lat: 16.5040, lng: 80.6480, phone: "+918666666333", speciality: "Cardiac & Neuro", city: "Vijayawada", emergency24x7: true },
  { id: "g6", name: "Lalitha Super Specialities Hospital", lat: 16.3103, lng: 80.4344, phone: "+918632220100", speciality: "Multi-speciality", city: "Guntur", emergency24x7: true },
  { id: "g7", name: "Amaravati Institute of Medical Sciences", lat: 16.3200, lng: 80.4400, phone: "+918632200200", speciality: "Multi-speciality", city: "Guntur", emergency24x7: true },
];

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}