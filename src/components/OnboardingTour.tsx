import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

const STEPS = [
  { title: "Welcome to NeXora 👋", body: "Quick 30-second tour so you get the most out of every feature." },
  { title: "Persistent navigation", body: "Use the top bar to jump between Beds, Appointments, Emergency, Video Calls, Lab Tests and more." },
  { title: "Notification bell 🔔", body: "Appointment reminders, lab results and bed updates show up here in real time." },
  { title: "Emergency in one tap", body: "Tap Emergency, choose the type, and we'll play multilingual first-aid audio while dispatching help." },
  { title: "Nearby hospitals", body: "Your dashboard lists hospitals sorted by your live location with one-tap Call & Directions." },
  { title: "Complete your profile", body: "Add blood group, allergies and emergency contact so doctors can help you faster. Enjoy NeXora! 💚" },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("nexora_tour_done")) setOpen(true);
  }, []);

  if (!open) return null;
  const finish = () => { localStorage.setItem("nexora_tour_done", "1"); setOpen(false); };
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 border relative animate-in slide-in-from-bottom-4">
        <button onClick={finish} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        <div className="text-xs text-primary font-medium mb-2">Step {step + 1} of {STEPS.length}</div>
        <h3 className="text-lg font-bold mb-2">{s.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{s.body}</p>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={finish}>Skip tour</Button>
          <Button size="sm" onClick={() => (last ? finish() : setStep(step + 1))}>
            {last ? "Got it" : <>Next <ArrowRight className="h-3 w-3 ml-1" /></>}
          </Button>
        </div>
        <div className="flex gap-1.5 justify-center mt-4">
          {STEPS.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />)}
        </div>
      </div>
    </div>
  );
}