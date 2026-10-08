import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ambulance, Hospital, Phone, Siren, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

const HIDDEN = ["/", "/login", "/emergency"];

export function FloatingSosDock() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  if (HIDDEN.includes(pathname) || !getCurrentUser()) return null;

  const actions = [
    { to: "/emergency", label: "Emergency Help", icon: Siren },
    { to: "/track", label: "Request Ambulance", icon: Ambulance },
    { to: "/beds", label: "Nearest ER Beds", icon: Hospital },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.div
              key={a.to}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05 } }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
            >
              <Link
                to={a.to}
                onClick={() => setOpen(false)}
                className="glass flex items-center gap-3 rounded-full pl-4 pr-5 py-3 shadow-lg lift text-sm font-semibold text-foreground"
              >
                <a.icon className="h-5 w-5 text-destructive" /> {a.label}
              </Link>
            </motion.div>
          ))}
        {open && (
          <motion.a
            href="tel:108"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
            exit={{ opacity: 0 }}
            className="glass flex items-center gap-3 rounded-full pl-4 pr-5 py-3 shadow-lg lift text-sm font-semibold text-foreground"
          >
            <Phone className="h-5 w-5 text-destructive" /> Call 108
          </motion.a>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="SOS quick actions"
        className="relative h-16 w-16 rounded-full bg-gradient-emergency text-destructive-foreground shadow-emergency flex items-center justify-center font-display font-bold transition-transform hover:scale-105 active:scale-95"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-destructive animate-pulse-ring" />}
        <span className="relative">{open ? <X className="h-6 w-6" /> : "SOS"}</span>
      </button>
    </div>
  );
}
