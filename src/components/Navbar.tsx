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
  Star
} from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationBell } from "./NotificationBell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { logout } from "@/lib/auth";

const navItemsRaw = [
  { key: "nav.home", path: "/dashboard", icon: Home },
  { key: "nav.beds", path: "/beds", icon: Bed },
  { key: "nav.appointments", path: "/appointments", icon: UserCheck },
  { key: "nav.emergency", path: "/emergency", icon: Phone },
  { key: "nav.track", path: "/track", icon: MapPin },
  { key: "nav.prescriptions", path: "/prescriptions", icon: Pill },
  { key: "nav.videoCall", path: "/video-call", icon: Video },
  { key: "nav.labTests", path: "/lab-tests", icon: TestTube },
  { key: "nav.chat", path: "/chat", icon: MessageCircle },
  { key: "nav.education", path: "/health-education", icon: BookOpen },
  { key: "nav.feedback", path: "/feedback", icon: Star },
];

export function Navbar() {
  const location = useLocation();
  const { t } = useLanguage();
  const isActive = (path: string) => location.pathname === path;
  const navItems = navItemsRaw.map((n) => ({ ...n, name: t(n.key) }));

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Top Row */}
        <div className="flex justify-between items-center h-14 gap-2">
          
          {/* Logo */}
          <Link to="/dashboard" className="shrink-0 min-w-0">
            <Logo size={30} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center min-w-0 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-1 px-2 transition-all duration-200 h-8",
                      isActive(item.path) && "shadow-md"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden xl:inline text-xs">{item.name}</span>
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

        {/* Mobile Navigation */}
        <div className="md:hidden pb-2 flex flex-wrap gap-1 justify-center overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-1 text-xs"
                >
                  <Icon className="h-3 w-3" />
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
