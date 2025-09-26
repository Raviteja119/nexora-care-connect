import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { 
  Phone, 
  Volume2, 
  Languages, 
  Heart, 
  Bed, 
  Calendar,
  MapPin,
  User,
  Clock,
  Headphones,
  PhoneCall,
  Mic,
  MicOff
} from "lucide-react";

const tollFreeNumbers = [
  { service: "Emergency Services", number: "1800-NEXORA-911", description: "24/7 Emergency medical assistance" },
  { service: "Appointment Booking", number: "1800-NEXORA-APT", description: "Book and manage appointments" },
  { service: "Bed Availability", number: "1800-NEXORA-BED", description: "Check bed availability and book" },
  { service: "General Inquiry", number: "1800-NEXORA-INFO", description: "General hospital information" },
  { service: "Prescription Help", number: "1800-NEXORA-MED", description: "Prescription and medication support" }
];

const supportedLanguages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "mr", name: "Marathi", native: "मराठी" }
];

export default function TollFreeService() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleCall = (service: string) => {
    setSelectedService(service);
    setIsCallActive(true);
    setCallDuration(0);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setSelectedService("");
    setCallDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Phone className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-xl">Connected to NeXora Care</CardTitle>
            <CardDescription>{selectedService}</CardDescription>
            <Badge variant="default" className="mx-auto">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(callDuration)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You are connected to our healthcare support team. Please describe your needs clearly.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium">Available in 8+ Indian Languages</p>
                <p className="text-xs text-muted-foreground">Say "Language" to switch languages</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full w-16 h-16"
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndCall}
                className="rounded-full w-16 h-16"
              >
                <PhoneCall className="h-6 w-6" />
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>This is a simulated call interface</p>
              <p>In production, this would connect to actual phone services</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Phone className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Toll-Free Healthcare</h1>
              <p className="text-lg text-muted-foreground">24/7 Voice Support in Multiple Languages</p>
            </div>
          </div>
          <Badge variant="default" className="text-lg px-4 py-2">
            <Headphones className="h-4 w-4 mr-2" />
            Available in 8+ Indian Languages
          </Badge>
        </div>

        <Tabs defaultValue="services" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Call Services</TabsTrigger>
            <TabsTrigger value="languages">Language Support</TabsTrigger>
            <TabsTrigger value="guide">How to Use</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tollFreeNumbers.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {service.service.includes("Emergency") && <Heart className="h-5 w-5 text-destructive" />}
                        {service.service.includes("Appointment") && <Calendar className="h-5 w-5 text-primary" />}
                        {service.service.includes("Bed") && <Bed className="h-5 w-5 text-accent" />}
                        {service.service.includes("General") && <User className="h-5 w-5 text-secondary" />}
                        {service.service.includes("Prescription") && <Phone className="h-5 w-5 text-primary" />}
                      </div>
                      <span>{service.service}</span>
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {service.number}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Toll-Free • Available 24/7
                      </p>
                    </div>
                    <Button 
                      variant={service.service.includes("Emergency") ? "emergency" : "default"}
                      className="w-full"
                      onClick={() => handleCall(service.service)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Volume2 className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">Voice-First Healthcare</h3>
                  </div>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Designed specifically for elderly and less tech-savvy users. Simply call our toll-free numbers 
                    and speak in your preferred language. Our trained operators will guide you through all hospital services.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                        <Languages className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-semibold">Multi-Language</h4>
                      <p className="text-sm text-muted-foreground">Support in 8+ Indian languages</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                        <Clock className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-semibold">24/7 Available</h4>
                      <p className="text-sm text-muted-foreground">Round-the-clock support</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-semibold">Human Operators</h4>
                      <p className="text-sm text-muted-foreground">Trained healthcare assistants</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="languages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Languages className="h-6 w-6 text-primary" />
                  <span>Supported Languages</span>
                </CardTitle>
                <CardDescription>
                  We provide healthcare support in multiple Indian languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {supportedLanguages.map((lang) => (
                    <div key={lang.code} className="border rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">{lang.native}</div>
                      <div className="font-medium">{lang.name}</div>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        <Volume2 className="h-3 w-3 mr-1" />
                        Test Voice
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>Language Selection Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">During Call</h4>
                      <p className="text-sm text-muted-foreground">
                        Say "Language" or "भाषा" to switch to your preferred language
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Operator Assistance</h4>
                      <p className="text-sm text-muted-foreground">
                        Our operators are trained in multiple languages and will assist you
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Volume2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Clear Communication</h4>
                      <p className="text-sm text-muted-foreground">
                        Speak clearly and at a normal pace for best assistance
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Use Toll-Free Services</CardTitle>
                <CardDescription>
                  Step-by-step guide for accessing healthcare services via phone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Choose Your Service</h4>
                      <p className="text-muted-foreground">
                        Select the appropriate toll-free number based on your need:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                        <li>Emergency: 1800-NEXORA-911</li>
                        <li>Appointments: 1800-NEXORA-APT</li>
                        <li>Bed Booking: 1800-NEXORA-BED</li>
                        <li>General Info: 1800-NEXORA-INFO</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Make the Call</h4>
                      <p className="text-muted-foreground">
                        Dial the number from any phone. The call is completely free from any network in India.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Select Language</h4>
                      <p className="text-muted-foreground">
                        When connected, say "Language" or "भाषा" to choose your preferred language from 8+ options.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Describe Your Need</h4>
                      <p className="text-muted-foreground">
                        Clearly explain what you need. Our trained operators will guide you through the process.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Get Assistance</h4>
                      <p className="text-muted-foreground">
                        The operator will help you book appointments, check bed availability, get directions, or handle emergencies.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Emergency Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    <strong>For life-threatening emergencies:</strong> Call 1800-NEXORA-911 immediately
                  </p>
                  <p className="text-sm">
                    <strong>Stay calm:</strong> Speak clearly and provide your location first
                  </p>
                  <p className="text-sm">
                    <strong>Follow instructions:</strong> Our emergency operators are trained to guide you
                  </p>
                  <p className="text-sm">
                    <strong>Keep the line open:</strong> Don't hang up until instructed
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}