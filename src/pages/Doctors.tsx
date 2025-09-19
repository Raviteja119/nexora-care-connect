import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { 
  User, 
  Search, 
  Clock, 
  Star, 
  Calendar,
  CheckCircle,
  XCircle,
  Coffee
} from "lucide-react";
import { Link } from "react-router-dom";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    experience: "15 years",
    rating: 4.9,
    status: "Available",
    nextSlot: "10:30 AM",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Orthopedics",
    experience: "12 years",
    rating: 4.8,
    status: "Busy",
    nextSlot: "2:30 PM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    specialty: "Dermatology",
    experience: "10 years",
    rating: 4.7,
    status: "Available",
    nextSlot: "11:00 AM",
    image: "https://images.unsplash.com/photo-1594824506145-29f7c2939d76?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    specialty: "General Medicine",
    experience: "18 years",
    rating: 4.9,
    status: "Available",
    nextSlot: "9:00 AM",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Dr. Lisa Rodriguez",
    specialty: "Pediatrics",
    experience: "14 years",
    rating: 4.8,
    status: "On Leave",
    nextSlot: "Tomorrow",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Neurology",
    experience: "20 years",
    rating: 4.9,
    status: "Busy",
    nextSlot: "4:00 PM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
  }
];

const specialties = ["All", "Cardiology", "Orthopedics", "Dermatology", "General Medicine", "Pediatrics", "Neurology"];

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "success";
      case "Busy": return "secondary";
      case "On Leave": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available": return CheckCircle;
      case "Busy": return Clock;
      case "On Leave": return XCircle;
      default: return Clock;
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Doctor Availability
          </h1>
          <p className="text-muted-foreground">
            Find and book appointments with our specialist doctors
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by specialty" />
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
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-success">4</div>
              <p className="text-sm text-muted-foreground">Available Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-secondary">2</div>
              <p className="text-sm text-muted-foreground">Currently Busy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">6</div>
              <p className="text-sm text-muted-foreground">Total Doctors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-accent">4.8</div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const StatusIcon = getStatusIcon(doctor.status);
            return (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {doctor.specialty}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getStatusColor(doctor.status)} className="text-xs">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {doctor.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="font-medium">{doctor.experience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{doctor.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Available:</span>
                      <span className="font-medium">{doctor.nextSlot}</span>
                    </div>
                    <div className="pt-4 space-y-2">
                      <Link to="/appointments">
                        <Button 
                          variant={doctor.status === "Available" ? "default" : "secondary"}
                          className="w-full"
                          disabled={doctor.status === "On Leave"}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {doctor.status === "Available" ? "Book Appointment" : 
                           doctor.status === "On Leave" ? "Not Available" : "Join Waitlist"}
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredDoctors.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No doctors found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or specialty filter
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}