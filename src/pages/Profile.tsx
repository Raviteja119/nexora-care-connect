import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Calendar,
  Clock,
  Save,
  Edit,
  AlertCircle
} from "lucide-react";

const emergencyContacts = [
  { name: "John Smith", relation: "Spouse", phone: "+1 (555) 0123" },
  { name: "Sarah Johnson", relation: "Daughter", phone: "+1 (555) 0456" },
  { name: "Dr. Wilson", relation: "Primary Doctor", phone: "+1 (555) 0789" }
];

const medicalHistory = [
  { condition: "Hypertension", diagnosed: "2020", status: "Ongoing" },
  { condition: "Diabetes Type 2", diagnosed: "2019", status: "Controlled" },
  { condition: "Heart Surgery", diagnosed: "2021", status: "Recovered" }
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    dateOfBirth: "1985-05-15",
    bloodType: "O+",
    allergies: "Penicillin, Shellfish",
    currentMedications: "Metformin 500mg twice daily, Lisinopril 10mg once daily"
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would sync with the backend
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Profile & Medical Information
            </h1>
            <p className="text-muted-foreground">
              Keep your information up to date for better healthcare service
            </p>
          </div>
          <Button
            variant={isEditing ? "success" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="flex items-center space-x-2"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </Button>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Your basic information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={profileData.bloodType}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bloodType: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical History */}
          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Medical History</span>
                </CardTitle>
                <CardDescription>
                  Your medical conditions and treatment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {medicalHistory.map((condition, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{condition.condition}</h3>
                          <p className="text-sm text-muted-foreground">
                            Diagnosed: {condition.diagnosed}
                          </p>
                        </div>
                        <Badge variant={condition.status === "Ongoing" ? "secondary" : "success"}>
                          {condition.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Input
                      id="allergies"
                      value={profileData.allergies}
                      onChange={(e) => setProfileData(prev => ({ ...prev, allergies: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="List any known allergies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={profileData.currentMedications}
                      onChange={(e) => setProfileData(prev => ({ ...prev, currentMedications: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="List current medications and dosages"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts */}
          <TabsContent value="emergency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Emergency Contacts</span>
                </CardTitle>
                <CardDescription>
                  People to contact in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground">{contact.relation}</p>
                            <p className="text-sm text-foreground mt-1">{contact.phone}</p>
                          </div>
                        </div>
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" className="w-full mt-4">
                    Add New Contact
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  How you'd like to receive updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground">Appointment Reminders</h3>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground">Emergency Alerts</h3>
                      <p className="text-sm text-muted-foreground">Receive emergency notifications</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground">Health Tips</h3>
                      <p className="text-sm text-muted-foreground">Weekly health and wellness tips</p>
                    </div>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sync Information */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Auto-Sync Enabled</h3>
                <p className="text-sm text-muted-foreground">
                  Your profile is automatically synchronized with the hospital database for seamless care.
                </p>
              </div>
              <Badge variant="success">
                <Calendar className="h-3 w-3 mr-1" />
                Last synced: Just now
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}