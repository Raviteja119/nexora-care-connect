import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MY_TOKEN = 24;

export function QueueTracker() {
  const [serving, setServing] = useState(19);
  useEffect(() => {
    if (serving >= MY_TOKEN) return;
    const id = setTimeout(() => {
      const next = serving + 1;
      setServing(next);
      if (next === MY_TOKEN - 1) toast.info("You're next! Please proceed to OPD Room 3.");
      if (next === MY_TOKEN) toast.success("It's your turn — Token A-24, Room 3.");
    }, 9000);
    return () => clearTimeout(id);
  }, [serving]);

  const ahead = Math.max(0, MY_TOKEN - serving);
  const progress = Math.min(100, ((serving - 15) / (MY_TOKEN - 15)) * 100);

  return (
    <Card className="glass lift">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base"><Ticket className="h-5 w-5 text-primary" /> OPD Queue · Cardiology</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-medical p-4 text-primary-foreground">
            <div className="text-xs opacity-90">Your Token</div>
            <div className="text-3xl font-display font-bold">A-{MY_TOKEN}</div>
          </div>
          <div className="rounded-xl bg-muted/60 p-4">
            <div className="text-xs text-muted-foreground">Now Serving</div>
            <motion.div key={serving} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-display font-bold text-foreground">
              A-{serving}
            </motion.div>
          </div>
        </div>
        <Progress value={progress} />
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4" /> {ahead} ahead of you</span>
          <span className="font-semibold text-foreground">{ahead === 0 ? "Your turn" : `~${ahead * 3} min wait`}</span>
        </div>
      </CardContent>
    </Card>
  );
}
