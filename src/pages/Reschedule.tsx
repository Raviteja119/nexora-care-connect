import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send
} from "lucide-react";

const existingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    currentDate: "2024-01-20",
    currentTime: "10:30 AM",
    type: "Follow-up",
    status: "scheduled",
    canReschedule: true
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Orthopedics",
    currentDate: "2024-01-22",
    currentTime: "2:15 PM",
    type: "Consultation",
    status: "scheduled",
    canReschedule: true
  },
  {
    id: 3,
    doctor: "Dr. Emily Davis",
    specialty: "Dermatology",
    currentDate: "2024-01-25",
    currentTime: "11:00 AM",
    type: "Check-up",
    status: "pending_approval",
    canReschedule: false
  }
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM"
];

export default function Reschedule() {
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [rescheduleRequests, setRescheduleRequests] = useState<any[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "success";
      case "pending_approval": return "secondary";
      case "approved": return "success";
      case "rejected": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled": return CheckCircle;
      case "pending_approval": return Clock;
      case "approved": return CheckCircle;
      case "rejected": return XCircle;
      default: return AlertCircle;
    }
  };

  const handleRescheduleRequest = () => {
    if (selectedAppointment && selectedDate && selectedTime) {
      const appointment = existingAppointments.find(apt => apt.id === selectedAppointment);
      if (appointment) {
        const newRequest = {
          id: Date.now(),
          appointmentId: selectedAppointment,
          doctor: appointment.doctor,
          specialty: appointment.specialty,
          originalDate: appointment.currentDate,
          originalTime: appointment.currentTime,
          newDate: selectedDate.toISOString().split('T')[0],
          newTime: selectedTime,
          reason: reason,
          status: "pending_approval",
          requestedAt: new Date().toISOString()
        };
        
        setRescheduleRequests(prev => [...prev, newRequest]);
        setSelectedAppointment(null);
        setSelectedDate(undefined);
        setSelectedTime("");
        setReason("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            OP Rescheduling
          </h1>
          <p className="text-muted-foreground">
            Reschedule your outpatient appointments with hospital approval
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Existing Appointments */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <span>Current Appointments</span>
                </CardTitle>
                <CardDescription>
                  Select an appointment to reschedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingAppointments.map((appointment) => {
                    const StatusIcon = getStatusIcon(appointment.status);
                    const isSelected = selectedAppointment === appointment.id;
                    
                    return (
                      <div
                        key={appointment.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/30'
                        } ${!appointment.canReschedule ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={() => appointment.canReschedule && setSelectedAppointment(appointment.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Stethoscope className="h-4 w-4 text-primary" />
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
                                  <CalendarIcon className="h-3 w-3" />
                                  <span>{appointment.currentDate}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{appointment.currentTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant={getStatusColor(appointment.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {appointment.status.replace('_', ' ')}
                            </Badge>
                            {!appointment.canReschedule && (
                              <span className="text-xs text-muted-foreground">Cannot reschedule</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reschedule Requests */}
            {rescheduleRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    <span>Reschedule Requests</span>
                  </CardTitle>
                  <CardDescription>
                    Your submitted reschedule requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rescheduleRequests.map((request) => {
                      const StatusIcon = getStatusIcon(request.status);
                      return (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">
                              {request.doctor}
                            </h3>
                            <Badge variant={getStatusColor(request.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {request.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>From: {request.originalDate} at {request.originalTime}</p>
                            <p>To: {request.newDate} at {request.newTime}</p>
                            {request.reason && <p>Reason: {request.reason}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reschedule Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span>Reschedule Request</span>
                </CardTitle>
                <CardDescription>
                  Select new date and time for your appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedAppointment ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Select an Appointment
                    </h3>
                    <p className="text-muted-foreground">
                      Choose an appointment from the list to reschedule
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">
                        Select New Date
                      </Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="time" className="text-sm font-medium text-foreground mb-2 block">
                        Select New Time
                      </Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose available time slot" />
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

                    <div>
                      <Label htmlFor="reason" className="text-sm font-medium text-foreground mb-2 block">
                        Reason for Rescheduling (Optional)
                      </Label>
                      <Textarea
                        id="reason"
                        placeholder="Please provide a reason for rescheduling..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button
                      variant="medical"
                      className="w-full"
                      onClick={handleRescheduleRequest}
                      disabled={!selectedDate || !selectedTime}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Reschedule Request
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span>Rescheduling Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Reschedule requests must be submitted at least 24 hours before the appointment</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Hospital staff will review and approve/reject your request within 2 hours</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>You will receive SMS and email notifications about the status</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Emergency appointments cannot be rescheduled online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
