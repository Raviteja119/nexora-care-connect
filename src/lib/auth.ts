// Simple localStorage-backed user registry for demo mode.
export interface DemoUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  createdAt: string;
}

const USERS_KEY = "nexora_users";
const CURRENT_KEY = "nexora_currentUser";

function readUsers(): DemoUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function writeUsers(u: DemoUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

export function registerUser(u: Omit<DemoUser, "createdAt">): { ok: boolean; error?: string } {
  const users = readUsers();
  if (users.find((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists" };
  }
  const newUser: DemoUser = { ...u, createdAt: new Date().toISOString() };
  users.push(newUser);
  writeUsers(users);
  setCurrentUser(newUser);
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers();
  const found = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!found) return { ok: false, error: "No account found. Please register first." };
  if (found.password !== password) return { ok: false, error: "Incorrect password" };
  setCurrentUser(found);
  return { ok: true };
}

export function loginByMobile(phone: string): { ok: boolean; error?: string } {
  const users = readUsers();
  const found = users.find((x) => x.phone && x.phone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-10)));
  if (found) setCurrentUser(found);
  else {
    // create lightweight account for demo
    const u: DemoUser = { name: "Guest User", email: `${phone}@demo.nexora`, phone, password: "", createdAt: new Date().toISOString() };
    const users2 = readUsers(); users2.push(u); writeUsers(users2); setCurrentUser(u);
  }
  return { ok: true };
}

export function getCurrentUser(): DemoUser | null {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null"); } catch { return null; }
}
export function setCurrentUser(u: DemoUser | null) {
  if (u) localStorage.setItem(CURRENT_KEY, JSON.stringify(u));
  else localStorage.removeItem(CURRENT_KEY);
}
export function logout() { setCurrentUser(null); }