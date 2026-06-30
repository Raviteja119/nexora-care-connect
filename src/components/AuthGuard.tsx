import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const user = getCurrentUser();
  const location = useLocation();
  useEffect(() => {
    if (!user) toast.error("Please sign in to continue");
  }, [user]);
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}