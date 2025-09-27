import { Link, useLocation } from "react-router-dom";
import { 
  Chrome as Home, 
  Bed, 
  UserCheck, 
  Phone, 
  MapPin, 
  User, 
  LogOut, 
  Stethoscope, 
  Pill, 
  Video, 
  TestTube, 
  MessageCircle, 
  BookOpen, 
  Star 
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/dashboard", icon: Home },
  { name: "Beds", path: "/beds", icon: Bed },
  { name: "Appointments", path: "/appointments", icon: UserCheck },
  { name: "Emergency", path: "/emergency", icon: Phone },
  { name: "Track", path: "/track", icon: MapPin },
  { name: "Prescriptions", path: "/prescriptions", icon: Pill },
  { name: "Video Call", path: "/video-call", icon: Video },
  { name: "Lab Tests", path: "/lab-tests", icon: TestTube },
  { name: "Chat", path: "/chat", icon: MessageCircle },
  { name: "Education", path: "/health-education", icon: BookOpen },
  { name: "Feedback", path: "/feedback", icon: Star },
];

export function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-sm overflow-x-auto whitespace-nowrap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">NeXora</h1>
              <p className="text-xs text-muted-foreground">Hospital Services</p>
            </div>
          </div>

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
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
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
