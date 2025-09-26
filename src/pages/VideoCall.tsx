import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Calendar as CalendarIcon, Clock, User, Phone, PhoneOff } from "lucide-react";

const mockVideoAppointments = [
  {
    id: "VC001",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2024-01-20",
    time: "10:00 AM",
    duration: "30 mins",
    status: "Scheduled",
    meetingLink: "https://meet.nexora.com/vc001"
  },
  {
    id: "VC002",
    doctorName: "Dr. Michael Chen",
    specialty: "General Medicine",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: "20 mins",
    status: "Completed",
    meetingLink: "https://meet.nexora.com/vc002"
  }
];

const availableDoctors = [
  { id: "d1", name: "Dr. Sarah Johnson", specialty: "Cardiology", available: true },
  { id: "d2", name: "Dr. Michael Chen", specialty: "General Medicine", available: true },
  { id: "d3", name: "Dr. Emily Davis", specialty: "Pediatrics", available: false },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

export default function VideoCall() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [inCall, setInCall] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "default";
      case "Completed": return "secondary";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };

  const handleJoinCall = (meetingLink: string) => {
    setInCall(true);
    // Simulate video call interface
    setTimeout(() => {
      setInCall(false);
    }, 10000); // Extended to 10 seconds for better demo
  };

  const handleScheduleAppointment = () => {
    if (selectedDoctor && selectedTime && selectedDate) {
      // Simulate scheduling
      alert(`Video appointment scheduled with ${availableDoctors.find(d => d.id === selectedDoctor)?.name} on ${selectedDate.toDateString()} at ${selectedTime}`);
      setSelectedDoctor("");
      setSelectedTime("");
      setSelectedDate(new Date());
    }
  };

  if (inCall) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-80 h-60 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
            <User className="h-20 w-20 text-gray-400" />
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Connected
            </div>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Dr. Johnson
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Video Consultation Active</h2>
          <p className="text-gray-300 mb-4">You are now connected with your doctor</p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20"
            >
              <Video className="h-6 w-6" />
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => setInCall(false)}
              className="rounded-full w-16 h-16"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Call will end automatically in 10 seconds for demo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Video Consultations</h1>
          <p className="text-muted-foreground">Schedule and join video appointments with doctors</p>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule New</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid gap-4">
              {mockVideoAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-medical-primary" />
                          {appointment.doctorName}
                        </CardTitle>
                        <CardDescription>{appointment.specialty}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(appointment.status) as any}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {appointment.time} ({appointment.duration})
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.status === "Scheduled" && (
                        <Button 
                          onClick={() => handleJoinCall(appointment.meetingLink)}
                          className="bg-medical-primary hover:bg-medical-primary/90"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {appointment.status === "Scheduled" && (
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Doctor</label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors.map((doctor) => (
                          <SelectItem 
                            key={doctor.id} 
                            value={doctor.id}
                            disabled={!doctor.available}
                          >
                            <div className="flex items-center gap-2">
                              <span>{doctor.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {doctor.specialty}
                              </span>
                              {!doctor.available && (
                                <Badge variant="secondary" className="text-xs">
                                  Unavailable
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full bg-medical-primary hover:bg-medical-primary/90"
                    disabled={!selectedDoctor || !selectedTime || !selectedDate}
                    onClick={handleScheduleAppointment}
                  >
                    Schedule Video Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}