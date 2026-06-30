import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function fmt(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function LiveClock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur text-xs font-mono shadow-sm border ${className}`}>
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span>{fmt(now)}</span>
    </div>
  );
}