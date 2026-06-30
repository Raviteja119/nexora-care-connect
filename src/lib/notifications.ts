// Lightweight in-memory + localStorage notification bus for the bell.
export interface NexoraNotification {
  id: string;
  type: "appointment" | "lab" | "bed" | "emergency" | "info";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

const KEY = "nexora_notifications";
type Listener = (n: NexoraNotification[]) => void;
const listeners = new Set<Listener>();

function read(): NexoraNotification[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(list: NexoraNotification[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((l) => l(list));
}

export function getNotifications(): NexoraNotification[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}
export function pushNotification(n: Omit<NexoraNotification, "id" | "read" | "createdAt">) {
  const list = read();
  list.unshift({ ...n, id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, read: false, createdAt: Date.now() });
  write(list.slice(0, 50));
}
export function markAllRead() { write(read().map((n) => ({ ...n, read: true }))); }
export function markRead(id: string) { write(read().map((n) => (n.id === id ? { ...n, read: true } : n))); }
export function clearAll() { write([]); }
export function subscribe(fn: Listener) {
  listeners.add(fn);
  fn(getNotifications());
  return () => listeners.delete(fn);
}

// Seed once for demo so the bell is never empty on first login
if (typeof window !== "undefined" && !localStorage.getItem(KEY + "_seeded")) {
  localStorage.setItem(KEY + "_seeded", "1");
  const now = Date.now();
  write([
    { id: "seed1", type: "appointment", title: "Appointment reminder", message: "Dr. Sarah Wilson tomorrow at 10:30 AM (Cardiology).", link: "/appointments", read: false, createdAt: now - 60_000 },
    { id: "seed2", type: "lab", title: "Lab results ready", message: "Your CBC + Lipid Profile results are available.", link: "/lab-tests", read: false, createdAt: now - 5 * 60_000 },
    { id: "seed3", type: "bed", title: "Bed status update", message: "ICU bed availability changed: 15 beds free.", link: "/beds", read: true, createdAt: now - 2 * 3600_000 },
  ]);
}