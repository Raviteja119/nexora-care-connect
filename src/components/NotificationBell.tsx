import { useEffect, useState } from "react";
import { Bell, Calendar, TestTube, Bed as BedIcon, Phone as PhoneIcon, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { NexoraNotification, getNotifications, markAllRead, markRead, subscribe } from "@/lib/notifications";

const icon = (t: NexoraNotification["type"]) => {
  switch (t) {
    case "appointment": return Calendar;
    case "lab": return TestTube;
    case "bed": return BedIcon;
    case "emergency": return PhoneIcon;
    default: return Info;
  }
};

export function NotificationBell() {
  const [items, setItems] = useState<NexoraNotification[]>(getNotifications());
  const navigate = useNavigate();
  useEffect(() => {
    const unsub = subscribe(setItems);
    return () => { unsub(); };
  }, []);
  const unread = items.filter((i) => !i.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] leading-none rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold animate-pulse">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-semibold text-sm">Notifications</div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAllRead()}>
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">You're all caught up</div>}
          {items.map((n) => {
            const Icon = icon(n.type);
            return (
              <button
                key={n.id}
                onClick={() => { markRead(n.id); if (n.link) navigate(n.link); }}
                className={`w-full text-left flex gap-3 p-3 border-b hover:bg-muted/60 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
              >
                <div className={`p-2 rounded-full h-9 w-9 flex items-center justify-center shrink-0 ${!n.read ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{n.title}</span>
                    {!n.read && <Badge variant="default" className="text-[10px] py-0 px-1.5">new</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}