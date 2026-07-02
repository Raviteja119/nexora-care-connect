import { Link, useLocation } from "react-router-dom";
import {
  Chrome as Home,
  Bed,
  UserCheck,
  Phone,
  MapPin,
  User,
  LogOut,
  Pill,
  Video,
  TestTube,
  MessageCircle,
  BookOpen,
  Star,
  PhoneCall,
  Stethoscope,
  Menu as MenuIcon,
  LayoutDashboard,
  Building2
} from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationBell } from "./NotificationBell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { logout, getCurrentUser, UserRole } from "@/lib/auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";

// path, icon, translation key, and roles allowed to see it.
type NavItem = { key: string; path: string; icon: any; roles: UserRole[] };
const ALL_ITEMS: NavItem[] = [
  { key: "nav.home", path: "/dashboard", icon: LayoutDashboard, roles: ["patient", "staff", "admin"] },
  { key: "nav.beds", path: "/beds", icon: Bed, roles: ["patient", "admin"] },
  { key: "nav.appointments", path: "/appointments", icon: UserCheck, roles: ["patient", "staff"] },
  { key: "nav.doctors", path: "/doctors", icon: Stethoscope, roles: ["patient", "admin"] },
  { key: "nav.emergency", path: "/emergency", icon: Phone, roles: ["patient", "staff", "admin"] },
  { key: "nav.tollFree", path: "/toll-free", icon: PhoneCall, roles: ["patient"] },
  { key: "nav.track", path: "/track", icon: MapPin, roles: ["patient", "staff", "admin"] },
  { key: "nav.prescriptions", path: "/prescriptions", icon: Pill, roles: ["patient", "staff"] },
  { key: "nav.videoCall", path: "/video-call", icon: Video, roles: ["patient", "staff"] },
  { key: "nav.labTests", path: "/lab-tests", icon: TestTube, roles: ["patient", "staff"] },
  { key: "nav.chat", path: "/chat", icon: MessageCircle, roles: ["patient", "staff", "admin"] },
  { key: "nav.education", path: "/health-education", icon: BookOpen, roles: ["patient"] },
  { key: "nav.feedback", path: "/feedback", icon: Star, roles: ["patient", "admin"] },
  { key: "nav.hospitalMgmt", path: "/hospital-management", icon: Building2, roles: ["staff", "admin"] },
];

// Quick-access paths always shown in the top bar (still filtered by role).
const QUICK_ACCESS = ["/dashboard", "/emergency", "/track", "/chat"];

export function Navbar() {
  const location = useLocation();
  const { t } = useLanguage();
  const user = getCurrentUser();
  const role: UserRole = user?.role ?? "patient";
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const items = ALL_ITEMS.filter((i) => i.roles.includes(role)).map((n) => ({ ...n, name: t(n.key) }));
  const quickItems = items.filter((i) => QUICK_ACCESS.includes(i.path));

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Top Row */}
        <div className="flex justify-between items-center h-16 gap-2">

          {/* Left: Menu drawer + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2" aria-label={t("nav.menu")}>
                  <MenuIcon className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1 text-sm">{t("nav.menu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <Logo size={36} />
                    <span className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
                      {role}
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SheetClose asChild key={item.path}>
                        <Link to={item.path}>
                          <Button
                            variant={isActive(item.path) ? "default" : "ghost"}
                            className="w-full justify-start mb-1 h-10"
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            <span className="text-sm">{item.name}</span>
                          </Button>
                        </Link>
                      </SheetClose>
                    );
                  })}
                  <SheetClose asChild>
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start mb-1 h-10">
                        <User className="h-4 w-4 mr-3" />
                        <span className="text-sm">{t("nav.profile")}</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/dashboard" className="shrink-0 min-w-0">
              <Logo size={44} />
            </Link>
          </div>

          {/* Center: quick-access items */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center min-w-0">
            {quickItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-1.5 px-3 h-9",
                      isActive(item.path) && "shadow-md",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Profile + Logout + Language */}
          <div className="flex items-center gap-1 shrink-0">
            <NotificationBell />
            <LanguageSelector />
            <Link to="/profile">
              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1 px-2 h-8"
              >
                <User className="h-4 w-4" />
                <span className="hidden xl:inline text-xs">{t("nav.profile")}</span>
              </Button>
            </Link>
            <Link to="/login" onClick={() => { logout(); toast.success("Logged out successfully"); }}>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden xl:inline ml-1 text-xs">{t("nav.logout")}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile: quick-access row */}
        <div className="md:hidden pb-2 flex flex-wrap gap-1 justify-center">
          {quickItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-1 text-xs h-8"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
