import { useEffect, useState } from "react";
import { Activity, Droplets, Heart, Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

export function VitalsMonitor() {
  const [v, setV] = useState({ bpm: 76, spo2: 98, sys: 118, dia: 78, temp: 36.7 });
  useEffect(() => {
    const id = setInterval(
      () => setV({ bpm: rand(70, 86), spo2: rand(96, 99), sys: rand(112, 124), dia: rand(74, 82), temp: +(36.5 + Math.random() * 0.4).toFixed(1) }),
      2500,
    );
    return () => clearInterval(id);
  }, []);

  const tiles = [
    { label: "SpO₂", value: `${v.spo2}%`, icon: Droplets },
    { label: "Blood Pressure", value: `${v.sys}/${v.dia}`, icon: Activity },
    { label: "Temperature", value: `${v.temp}°C`, icon: Thermometer },
  ];

  return (
    <Card className="glass lift overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2"><Heart className="h-5 w-5 text-destructive animate-pulse" /> Live Vitals</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-success animate-pulse-ring" /><span className="relative h-2 w-2 rounded-full bg-success" /></span>
            Live
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-4">
          <div>
            <div className="text-4xl font-display font-bold text-foreground tabular-nums">{v.bpm}</div>
            <div className="text-xs text-muted-foreground">BPM · Normal</div>
          </div>
          <svg viewBox="0 0 300 60" className="flex-1 h-14">
            <path
              d="M0 30 H60 L70 30 L78 10 L86 50 L94 30 H150 L160 30 L168 8 L176 52 L184 30 H240 L250 30 L258 12 L266 48 L274 30 H300"
              fill="none"
              stroke="hsl(var(--destructive))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="600"
              style={{ animation: "ecg 2.2s linear infinite" }}
            />
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl bg-muted/60 p-3">
              <t.icon className="h-4 w-4 text-primary mb-1" />
              <div className="text-sm font-bold text-foreground tabular-nums">{t.value}</div>
              <div className="text-[11px] text-muted-foreground">{t.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
