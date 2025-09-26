import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/track" element={<Track />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reschedule" element={<Reschedule />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/video-call" element={<VideoCall />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/health-education" element={<HealthEducation />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/hospital-management" element={<HospitalManagement />} />
          <Route path="/toll-free" element={<TollFreeService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
