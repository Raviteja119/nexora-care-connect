import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  Plus,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    date: "2024-01-20",
    time: "10:30 AM",
    type: "Follow-up",
    status: "confirmed"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Orthopedics",
    date: "2024-01-22",
    time: "2:15 PM",
    type: "Consultation",
    status: "confirmed"
  },
  {
    id: 3,
    doctor: "Dr. Emily Davis",
    specialty: "Dermatology",
    date: "2024-01-25",
    time: "11:00 AM",
    type: "Check-up",
    status: "pending"
  }
];

const pastAppointments = [
  {
    id: 4,
    doctor: "Dr. James Thompson",
    specialty: "General Medicine",
    date: "2024-01-15",
    time: "9:00 AM",
    type: "Consultation",
    status: "completed"
  },
  {
    id: 5,
    doctor: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    date: "2024-01-10",
    time: "10:30 AM",
    type: "Initial Visit",
    status: "completed"
  }
];

const specialties = [
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
  "Pediatrics",
  "Gynecology",
  "Neurology",
  "Ophthalmology"
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM"
];

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending": return "secondary";
      case "completed": return "default";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return CheckCircle;
      case "pending": return Clock;
      case "completed": return CheckCircle;
      case "cancelled": return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Doctor Appointments
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments and book new consultations
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
            <TabsTrigger value="book">Book New</TabsTrigger>
          </TabsList>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
                <CardDescription>
                  Your scheduled appointments with doctors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => {
                    const StatusIcon = getStatusIcon(appointment.status);
                    return (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Stethoscope className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {appointment.doctor}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.specialty} • {appointment.type}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={getStatusColor(appointment.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {appointment.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Reschedule
                              </Button>
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Past Appointments */}
          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Past Appointments</span>
                </CardTitle>
                <CardDescription>
                  Your appointment history and medical records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => {
                    const StatusIcon = getStatusIcon(appointment.status);
                    return (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-muted p-3 rounded-full">
                              <Stethoscope className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {appointment.doctor}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.specialty} • {appointment.type}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={getStatusColor(appointment.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {appointment.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Book New Appointment */}
          <TabsContent value="book" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-primary" />
                    <span>Book New Appointment</span>
                  </CardTitle>
                  <CardDescription>
                    Schedule a consultation with our specialists
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Select Specialty
                    </label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose medical specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Select Time Slot
                    </label>
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
                    variant="medical" 
                    className="w-full"
                    disabled={!selectedDate || !selectedSpecialty || !selectedTime}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>
                    Choose your preferred appointment date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}