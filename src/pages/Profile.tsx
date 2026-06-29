import { useState, useRef, useEffect } from "react";
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
  AlertCircle,
  Upload,
  Download,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { downloadTextFile, readFileAsDataURL } from "@/lib/fileUtils";
import { getCurrentUser } from "@/lib/auth";

// Profile starts empty for newly registered users — they are prompted to fill it in.
const emergencyContacts: { name: string; relation: string; phone: string }[] = [];
const medicalHistory: { condition: string; diagnosed: string; status: string }[] = [];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ name: string; url: string; size: number }[]>([]);
  const avatarRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    currentMedications: ""
  });
  const [profileComplete, setProfileComplete] = useState(true);

  // Load registered user details on mount; restore any saved profile.
  useEffect(() => {
    const u = getCurrentUser();
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem("nexora_profile") || "null"); } catch { return null; }
    })();
    if (saved) {
      setProfileData(saved);
    } else if (u) {
      const [first, ...rest] = (u.name || "").split(" ");
      setProfileData((p) => ({
        ...p,
        firstName: first || "",
        lastName: rest.join(" "),
        email: u.email || "",
        phone: u.phone || "",
      }));
    }
    // Show profile-completion prompt if essential fields missing
    const required = ["firstName", "phone", "address", "dateOfBirth", "bloodType"];
    const data = saved || (u ? { firstName: (u.name || "").split(" ")[0], phone: u.phone, address: "", dateOfBirth: "", bloodType: "" } : {});
    const missing = required.some((k) => !data || !(data as any)[k]);
    setProfileComplete(!missing);
    if (missing) {
      setIsEditing(true);
      setTimeout(() => toast.info("Please complete your profile details to unlock personalised features.", { duration: 6000 }), 600);
    }
  }, []);

  const handleSave = () => {
    const required: (keyof typeof profileData)[] = ["firstName", "phone", "address", "dateOfBirth", "bloodType"];
    const missing = required.filter((k) => !profileData[k]?.toString().trim());
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }
    localStorage.setItem("nexora_profile", JSON.stringify(profileData));
    setProfileComplete(true);
    setIsEditing(false);
    toast.success("Profile saved successfully");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await readFileAsDataURL(f);
    setAvatar(data);
    toast.success("Profile photo updated");
    e.target.value = "";
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setDocuments((prev) => [...prev, { name: f.name, url, size: f.size }]);
    toast.success(`Uploaded ${f.name}`);
    e.target.value = "";
  };

  const downloadProfile = () => {
    const text = `NeXora Patient Profile\n========================\nName: ${profileData.firstName} ${profileData.lastName}\nEmail: ${profileData.email}\nPhone: ${profileData.phone}\nAddress: ${profileData.address}\nDOB: ${profileData.dateOfBirth}\nBlood Type: ${profileData.bloodType}\nAllergies: ${profileData.allergies}\nMedications: ${profileData.currentMedications}\n`;
    downloadTextFile("nexora-profile.txt", text);
    toast.success("Profile downloaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-primary" />}
              </div>
              <input ref={avatarRef} type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
              <button
                onClick={() => avatarRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 hover:opacity-90"
                title="Change photo"
              >
                <Upload className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Profile & Medical Information</h1>
              <p className="text-muted-foreground">Keep your information up to date for better healthcare service</p>
            </div>
          </div>
          <div className="flex gap-2">
          <Button variant="outline" onClick={downloadProfile}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button
            variant={isEditing ? "success" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="flex items-center space-x-2"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
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

          {/* Documents */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>My Documents</span>
                </CardTitle>
                <CardDescription>Upload and download your medical records, reports and ID documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={docRef} type="file" hidden onChange={handleDocUpload} />
                <Button variant="outline" onClick={() => docRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Upload Document
                </Button>
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((d, i) => (
                      <div key={i} className="flex items-center justify-between border rounded p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{(d.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={d.url} download={d.name}>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDocuments((prev) => prev.filter((_, idx) => idx !== i));
                              toast.success("Document removed");
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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