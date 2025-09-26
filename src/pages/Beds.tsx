import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Bed, Users, Heart, Stethoscope, RefreshCw, Clock, CreditCard } from "lucide-react";

const bedTypes = [
  {
    type: "General Ward",
    total: 150,
    available: 23,
    price: "₹2,500/day",
    icon: Bed,
    description: "Standard medical care with essential monitoring"
  },
  {
    type: "ICU",
    total: 50,
    available: 15,
    price: "₹8,500/day",
    icon: Heart,
    description: "Intensive care with 24/7 monitoring"
  },
  {
    type: "Special Care",
    total: 30,
    available: 9,
    price: "₹5,500/day",
    icon: Stethoscope,
    description: "Specialized treatment units"
  },
  {
    type: "Emergency",
    total: 20,
    available: 18,
    price: "₹3,500/day",
    icon: Users,
    description: "Emergency care and stabilization"
  }
];

export default function Beds() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBedType, setSelectedBedType] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    patientName: "",
    patientAge: "",
    contactNumber: "",
    emergencyContact: "",
    medicalCondition: "",
    preferredDoctor: "",
    insuranceNumber: "",
    admissionType: "planned"
  });

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "success";
    if (percentage > 20) return "secondary";
    return "destructive";
  };

  const handleBookBed = (bedType: any) => setSelectedBedType(bedType);

  const handleBookingSubmit = () => {
    if (selectedBedType && bookingData.patientName && bookingData.contactNumber) {
      alert(`Bed booking request submitted for ${selectedBedType.type}. You will receive confirmation within 15 minutes.`);
      setSelectedBedType(null);
      setBookingData({
        patientName: "",
        patientAge: "",
        contactNumber: "",
        emergencyContact: "",
        medicalCondition: "",
        preferredDoctor: "",
        insuranceNumber: "",
        admissionType: "planned"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Bed Availability</h1>
              <p className="text-muted-foreground">Real-time bed availability across all departments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</p>
              </div>
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Bed Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bedTypes.map((bed, idx) => {
              const Icon = bed.icon;
              const availabilityPercentage = (bed.available / bed.total) * 100;

              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{bed.type}</CardTitle>
                          <CardDescription>{bed.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={getAvailabilityColor(bed.available, bed.total)}>
                        {bed.available} Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Occupancy</span>
                        <span>{bed.total - bed.available} / {bed.total} beds</span>
                      </div>
                      <Progress value={100 - availabilityPercentage} className="h-2" />
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold text-primary">{bed.price}</div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={bed.available > 0 ? "default" : "secondary"}
                              disabled={bed.available === 0}
                              className="flex items-center space-x-2"
                              onClick={() => handleBookBed(bed)}
                            >
                              <Bed className="h-4 w-4" />
                              <span>{bed.available > 0 ? 'Book Bed' : 'Waitlist'}</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Book {selectedBedType?.type}</DialogTitle>
                              <DialogDescription>Please provide patient details for bed booking</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="patientName">Patient Name *</Label>
                                  <Input
                                    id="patientName"
                                    value={bookingData.patientName}
                                    onChange={(e) => setBookingData(prev => ({ ...prev, patientName: e.target.value }))}
                                    placeholder="Full name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="patientAge">Age</Label>
                                  <Input
                                    id="patientAge"
                                    value={bookingData.patientAge}
                                    onChange={(e) => setBookingData(prev => ({ ...prev, patientAge: e.target.value }))}
                                    placeholder="Age"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="contactNumber">Contact Number *</Label>
                                <Input
                                  id="contactNumber"
                                  value={bookingData.contactNumber}
                                  onChange={(e) => setBookingData(prev => ({ ...prev, contactNumber: e.target.value }))}
                                  placeholder="+91 XXXXX XXXXX"
                                />
                              </div>
                              <div>
                                <Label htmlFor="medicalCondition">Medical Condition</Label>
                                <Textarea
                                  id="medicalCondition"
                                  value={bookingData.medicalCondition}
                                  onChange={(e) => setBookingData(prev => ({ ...prev, medicalCondition: e.target.value }))}
                                  placeholder="Brief description of condition"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label htmlFor="admissionType">Admission Type</Label>
                                <Select value={bookingData.admissionType} onValueChange={(value) => setBookingData(prev => ({ ...prev, admissionType: value }))}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="planned">Planned Admission</SelectItem>
                                    <SelectItem value="emergency">Emergency Admission</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={handleBookingSubmit} className="flex-1 flex items-center justify-center space-x-2">
                                <CreditCard className="h-4 w-4" />
                                <span>Book Bed</span>
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Booking Info */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Booking Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">How to Book:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Click "Book Bed" for immediate reservation</li>
                    <li>• Provide patient details and medical requirements</li>
                    <li>• Confirm booking with advance payment</li>
                    <li>• Receive booking confirmation and bed number</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Important Notes:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Bed availability updates every 30 seconds</li>
                    <li>• Emergency cases get priority allocation</li>
                    <li>• Advance booking available up to 7 days</li>
                    <li>• Cancellation allowed up to 2 hours before</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
