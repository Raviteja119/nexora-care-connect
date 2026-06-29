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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

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
    <nav className="bg-card border-b border-border shadow-sm overflow-x-auto whitespace-nowrap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/dashboard"><Logo size={36} /></Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2 transition-all duration-200",
                      isActive(item.path) && "shadow-md"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Profile + Logout + Language */}
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <Link to="/profile">
              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.profile")}</span>
              </Button>
            </Link>
            <Link to="/login" onClick={() => toast.success("Logged out successfully")}>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">{t("nav.logout")}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-2 flex flex-wrap gap-1 justify-center">
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
