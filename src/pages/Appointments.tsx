import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Calendar as CalendarIcon, Clock, Stethoscope, Plus, CircleCheck as CheckCircle, Circle as XCircle, RotateCcw, Eye } from "lucide-react";

// Dummy data
const upcomingAppointments = [
  { id: 1, doctor: "Dr. Sarah Wilson", specialty: "Cardiology", date: "2024-01-20", time: "10:30 AM", type: "Follow-up", status: "confirmed" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Orthopedics", date: "2024-01-22", time: "2:15 PM", type: "Consultation", status: "confirmed" },
  { id: 3, doctor: "Dr. Emily Davis", specialty: "Dermatology", date: "2024-01-25", time: "11:00 AM", type: "Check-up", status: "pending" }
];

const pastAppointments = [
  { id: 4, doctor: "Dr. James Thompson", specialty: "General Medicine", date: "2024-01-15", time: "9:00 AM", type: "Consultation", status: "completed" },
  { id: 5, doctor: "Dr. Sarah Wilson", specialty: "Cardiology", date: "2024-01-10", time: "10:30 AM", type: "Initial Visit", status: "completed" }
];

const specialties = ["Cardiology","Orthopedics","Dermatology","General Medicine","Pediatrics","Gynecology","Neurology","Ophthalmology"];
const timeSlots = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM"];

// Utility functions
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

// Reschedule Dialog
function RescheduleDialog({ appointmentId, onSubmit }: { appointmentId: number, onSubmit: (newDate: Date, newTime: string, reason: string) => void }) {
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (newDate && newTime) {
      onSubmit(newDate, newTime, reason);
      setNewDate(undefined);
      setNewTime("");
      setReason("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-1" />Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select new date and time for your appointment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>New Date</Label>
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          <div>
            <Label>New Time</Label>
            <Select value={newTime} onValueChange={setNewTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reason (Optional)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rescheduling"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">Submit Reschedule Request</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Appointment Card
function AppointmentCard({ appointment, isUpcoming = false, onReschedule, onCancel, onViewReport }: { appointment: typeof upcomingAppointments[0], isUpcoming?: boolean, onReschedule?: (id:number) => void, onCancel?: (id:number) => void, onViewReport?: (id:number) => void }) {
  const StatusIcon = getStatusIcon(appointment.status);
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{appointment.doctor}</h3>
            <p className="text-sm text-muted-foreground">{appointment.specialty} • {appointment.type}</p>
            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1"><CalendarIcon className="h-4 w-4" /><span>{appointment.date}</span></div>
              <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{appointment.time}</span></div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusColor(appointment.status)}><StatusIcon className="h-3 w-3 mr-1" />{appointment.status}</Badge>
          {isUpcoming && (
            <div className="flex space-x-2">
              <RescheduleDialog appointmentId={appointment.id} onSubmit={(date,time,reason)=>{alert(`Reschedule submitted for ${appointment.id} to ${date.toLocaleDateString()} at ${time}`)}} />
              <Button variant="destructive" size="sm" onClick={()=>alert(`Cancelled ${appointment.id}`)}>Cancel</Button>
            </div>
          )}
          {!isUpcoming && (
            <Button variant="outline" size="sm" onClick={()=>alert(`Viewing report for ${appointment.id}`)}>
              <Eye className="h-4 w-4 mr-1" />View Report
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Component
export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Appointments</h1>
          <p className="text-muted-foreground">Manage your appointments and book new consultations</p>
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
                <CardTitle className="flex items-center space-x-2"><CalendarIcon className="h-5 w-5 text-primary" /><span>Upcoming Appointments</span></CardTitle>
                <CardDescription>Your scheduled appointments with doctors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} isUpcoming />)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Past Appointments */}
          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Clock className="h-5 w-5 text-primary" /><span>Past Appointments</span></CardTitle>
                <CardDescription>Your appointment history and medical records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Book New Appointment */}
          <TabsContent value="book" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2"><Plus className="h-5 w-5 text-primary" /><span>Book New Appointment</span></CardTitle>
                  <CardDescription>Schedule a consultation with our specialists</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Select Specialty</Label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose medical specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Select Time Slot</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="default" 
                    className="w-full"
                    disabled={!selectedDate || !selectedSpecialty || !selectedTime}
                    onClick={()=>alert(`Appointment booked on ${selectedDate?.toLocaleDateString()} at ${selectedTime} for ${selectedSpecialty}`)}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>Choose your preferred appointment date</CardDescription>
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
  )
}
