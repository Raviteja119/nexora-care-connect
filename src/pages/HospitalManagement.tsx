import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Hospital, Plus, CreditCard as Edit, Trash2, MapPin, Phone, Users, Building, Search, Save } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  emergencyNumber: string;
  departments: string[];
  services: string[];
  doctors: Doctor[];
  totalBeds: number;
  availableBeds: number;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  availability: "available" | "busy" | "off-duty";
}

const mockHospitals: Hospital[] = [
  {
    id: "h1",
    name: "NeXora General Hospital",
    address: "123 Medical Center Drive, Bangalore, Karnataka 560001",
    contactNumber: "+91-80-2345-6789",
    emergencyNumber: "+91-80-2345-6700",
    departments: ["Emergency", "Cardiology", "Orthopedics", "Pediatrics", "General Medicine"],
    services: ["24/7 Emergency", "ICU", "Surgery", "Diagnostics", "Pharmacy"],
    doctors: [
      { id: "d1", name: "Dr. Sarah Johnson", specialty: "Cardiology", experience: "15 years", availability: "available" },
      { id: "d2", name: "Dr. Michael Chen", specialty: "Orthopedics", experience: "12 years", availability: "busy" }
    ],
    totalBeds: 250,
    availableBeds: 65
  },
  {
    id: "h2",
    name: "City Medical Center",
    address: "456 Healthcare Avenue, Mumbai, Maharashtra 400001",
    contactNumber: "+91-22-3456-7890",
    emergencyNumber: "+91-22-3456-7800",
    departments: ["Emergency", "Neurology", "Oncology", "Dermatology"],
    services: ["Emergency Care", "Cancer Treatment", "Neurosurgery", "Radiology"],
    doctors: [
      { id: "d3", name: "Dr. Priya Sharma", specialty: "Neurology", experience: "18 years", availability: "available" }
    ],
    totalBeds: 180,
    availableBeds: 42
  }
];

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Partial<Hospital>>({});

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.departments.some(dept => dept.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddHospital = () => {
    setEditingHospital({
      name: "",
      address: "",
      contactNumber: "",
      emergencyNumber: "",
      departments: [],
      services: [],
      doctors: [],
      totalBeds: 0,
      availableBeds: 0
    });
    setIsEditing(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setIsEditing(true);
  };

  const handleSaveHospital = () => {
    if (editingHospital.name && editingHospital.address) {
      if (editingHospital.id) {
        // Update existing hospital
        setHospitals(prev => prev.map(h => h.id === editingHospital.id ? editingHospital as Hospital : h));
      } else {
        // Add new hospital
        const newHospital = {
          ...editingHospital,
          id: `h${Date.now()}`,
        } as Hospital;
        setHospitals(prev => [...prev, newHospital]);
      }
      setIsEditing(false);
      setEditingHospital({});
    }
  };

  const handleDeleteHospital = (hospitalId: string) => {
    if (confirm("Are you sure you want to delete this hospital?")) {
      setHospitals(prev => prev.filter(h => h.id !== hospitalId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Hospital Management
            </h1>
            <p className="text-muted-foreground">
              Manage hospital information, departments, and services
            </p>
          </div>
          <Button onClick={handleAddHospital} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Hospital</span>
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Hospital Directory</TabsTrigger>
            <TabsTrigger value="search">Search & Filter</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Hospital className="h-5 w-5 text-primary" />
                          <span>{hospital.name}</span>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{hospital.address}</span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleEditHospital(hospital)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteHospital(hospital.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Contact</p>
                        <p className="font-medium">{hospital.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Emergency</p>
                        <p className="font-medium text-destructive">{hospital.emergencyNumber}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Departments</p>
                      <div className="flex flex-wrap gap-1">
                        {hospital.departments.slice(0, 3).map((dept) => (
                          <Badge key={dept} variant="outline" className="text-xs">
                            {dept}
                          </Badge>
                        ))}
                        {hospital.departments.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{hospital.departments.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Beds</p>
                        <p className="font-medium">{hospital.totalBeds}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available</p>
                        <p className="font-medium text-success">{hospital.availableBeds}</p>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedHospital(hospital)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Hospitals</CardTitle>
                <CardDescription>
                  Find hospitals by name, location, or department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search hospitals, departments, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-4">
                  {filteredHospitals.map((hospital) => (
                    <div key={hospital.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{hospital.name}</h3>
                        <Badge variant="outline">
                          {hospital.availableBeds} beds available
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{hospital.address}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{hospital.contactNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{hospital.doctors.length} doctors</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Hospital Details Dialog */}
        {selectedHospital && (
          <Dialog open={!!selectedHospital} onOpenChange={() => setSelectedHospital(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedHospital.name}</DialogTitle>
                <DialogDescription>Complete hospital information</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p>{selectedHospital.address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p>{selectedHospital.contactNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Emergency</p>
                      <p className="text-destructive">{selectedHospital.emergencyNumber}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Departments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.departments.map((dept) => (
                      <Badge key={dept} variant="outline">{dept}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.services.map((service) => (
                      <Badge key={service} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Available Doctors</h4>
                  <div className="space-y-2">
                    {selectedHospital.doctors.map((doctor) => (
                      <div key={doctor.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialty} • {doctor.experience}</p>
                        </div>
                        <Badge variant={doctor.availability === "available" ? "default" : "secondary"}>
                          {doctor.availability}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Add/Edit Hospital Dialog */}
        {isEditing && (
          <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingHospital.id ? "Edit Hospital" : "Add New Hospital"}
                </DialogTitle>
                <DialogDescription>
                  Enter hospital information and details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Hospital Name *</Label>
                    <Input
                      id="name"
                      value={editingHospital.name || ""}
                      onChange={(e) => setEditingHospital(prev => ({...prev, name: e.target.value}))}
                      placeholder="Hospital name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalBeds">Total Beds</Label>
                    <Input
                      id="totalBeds"
                      type="number"
                      value={editingHospital.totalBeds || ""}
                      onChange={(e) => setEditingHospital(prev => ({...prev, totalBeds: parseInt(e.target.value) || 0}))}
                      placeholder="Total beds"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={editingHospital.address || ""}
                    onChange={(e) => setEditingHospital(prev => ({...prev, address: e.target.value}))}
                    placeholder="Complete hospital address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      value={editingHospital.contactNumber || ""}
                      onChange={(e) => setEditingHospital(prev => ({...prev, contactNumber: e.target.value}))}
                      placeholder="+91-XX-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency">Emergency Number *</Label>
                    <Input
                      id="emergency"
                      value={editingHospital.emergencyNumber || ""}
                      onChange={(e) => setEditingHospital(prev => ({...prev, emergencyNumber: e.target.value}))}
                      placeholder="+91-XX-XXXX-XXXX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="departments">Departments (comma-separated)</Label>
                  <Input
                    id="departments"
                    value={editingHospital.departments?.join(", ") || ""}
                    onChange={(e) => setEditingHospital(prev => ({
                      ...prev, 
                      departments: e.target.value.split(",").map(d => d.trim()).filter(d => d)
                    }))}
                    placeholder="Emergency, Cardiology, Orthopedics"
                  />
                </div>

                <div>
                  <Label htmlFor="services">Services (comma-separated)</Label>
                  <Input
                    id="services"
                    value={editingHospital.services?.join(", ") || ""}
                    onChange={(e) => setEditingHospital(prev => ({
                      ...prev, 
                      services: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                    }))}
                    placeholder="24/7 Emergency, ICU, Surgery"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveHospital} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Hospital
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}