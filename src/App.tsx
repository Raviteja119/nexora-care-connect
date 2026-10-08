import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { FloatingSosDock } from "./components/FloatingSosDock";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import Emergency from "./pages/Emergency";
import Track from "./pages/Track";
import Profile from "./pages/Profile";
import Reschedule from "./pages/Reschedule";
import Prescriptions from "./pages/Prescriptions";
import VideoCall from "./pages/VideoCall";
import LabTests from "./pages/LabTests";
import Chat from "./pages/Chat";
import HealthEducation from "./pages/HealthEducation";
import Feedback from "./pages/Feedback";
import HospitalManagement from "./pages/HospitalManagement";
import TollFreeService from "./pages/TollFreeService";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/AuthGuard";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/beds" element={<AuthGuard><Beds /></AuthGuard>} />
          <Route path="/appointments" element={<AuthGuard><Appointments /></AuthGuard>} />
          <Route path="/doctors" element={<AuthGuard><Doctors /></AuthGuard>} />
          <Route path="/emergency" element={<AuthGuard><Emergency /></AuthGuard>} />
          <Route path="/track" element={<AuthGuard><Track /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/reschedule" element={<AuthGuard><Reschedule /></AuthGuard>} />
          <Route path="/prescriptions" element={<AuthGuard><Prescriptions /></AuthGuard>} />
          <Route path="/video-call" element={<AuthGuard><VideoCall /></AuthGuard>} />
          <Route path="/lab-tests" element={<AuthGuard><LabTests /></AuthGuard>} />
          <Route path="/chat" element={<AuthGuard><Chat /></AuthGuard>} />
          <Route path="/health-education" element={<AuthGuard><HealthEducation /></AuthGuard>} />
          <Route path="/feedback" element={<AuthGuard><Feedback /></AuthGuard>} />
          <Route path="/hospital-management" element={<AuthGuard><HospitalManagement /></AuthGuard>} />
          <Route path="/toll-free" element={<AuthGuard><TollFreeService /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          <FloatingSosDock />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
