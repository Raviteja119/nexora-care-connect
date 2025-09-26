import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/Navbar";
import { 
  Phone, 
  AlertTriangle, 
  Heart, 
  Car, 
  Baby, 
  Activity,
  MapPin,
  Clock,
  User,
  Zap,
  Volume2,
  Play,
  Pause
} from "lucide-react";
import emergencyBg from "@/assets/emergency-bg.jpg";

const emergencyTypes = [
  { value: "cardiac", label: "Cardiac Emergency", icon: Heart, color: "text-red-500" },
  { value: "accident", label: "Accident/Trauma", icon: Car, color: "text-orange-500" },
  { value: "delivery", label: "Emergency Delivery", icon: Baby, color: "text-pink-500" },
  { value: "stroke", label: "Stroke/Neurological", icon: Activity, color: "text-purple-500" },
  { value: "respiratory", label: "Breathing Difficulty", icon: Zap, color: "text-blue-500" },
  { value: "other", label: "Other Emergency", icon: AlertTriangle, color: "text-yellow-500" },
];

const emergencyInstructions = {
  cardiac: {
    title: "Cardiac Emergency Instructions",
    message: "Stay calm. Do not move unless necessary. If you have prescribed heart medication, take it now. Loosen tight clothing around your neck and chest. If you feel faint, lie down with your legs elevated.",
    audio: "For cardiac emergencies: Stay calm and still. If you have heart medication, take it now. Help is coming."
  },
  accident: {
    title: "Accident/Trauma Instructions", 
    message: "Do not move if you suspect spinal injury. Apply pressure to any bleeding wounds with clean cloth. Stay conscious and alert. If others are involved, ensure their safety too.",
    audio: "For accidents: Do not move if injured. Apply pressure to bleeding wounds. Stay alert. Help is on the way."
  },
  delivery: {
    title: "Emergency Delivery Instructions",
    message: "Find a clean, comfortable place to lie down. Have clean towels ready. Do not push unless you feel the urge. Breathe steadily. Someone will guide you through the process when help arrives.",
    audio: "For emergency delivery: Find a clean place to lie down. Have towels ready. Breathe steadily. Medical help is coming."
  },
  stroke: {
    title: "Stroke/Neurological Instructions",
    message: "Note the time symptoms started. Do not eat or drink anything. Lie down with your head slightly elevated. Stay as still as possible. Try to stay calm and conscious.",
    audio: "For stroke: Note the time. Do not eat or drink. Lie down with head elevated. Stay still and calm."
  },
  respiratory: {
    title: "Breathing Difficulty Instructions", 
    message: "Sit upright, leaning slightly forward. Loosen tight clothing. Use your inhaler if you have one. Try to breathe slowly and deeply. Do not lie down unless instructed.",
    audio: "For breathing difficulty: Sit upright and lean forward. Use your inhaler if available. Breathe slowly. Help is coming."
  },
  other: {
    title: "General Emergency Instructions",
    message: "Stay calm and alert. Do not leave your current location unless it's unsafe. Follow any specific medical instructions you've been given. Help is on the way.",
    audio: "For emergencies: Stay calm and alert. Remain where you are unless unsafe. Follow your medical instructions."
  }
};

export default function Emergency() {
  const [selectedEmergency, setSelectedEmergency] = useState<string>("");
  const [emergencyRequested, setEmergencyRequested] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");

  const handleEmergencyRequest = () => {
    setEmergencyRequested(true);
    if (selectedEmergency) {
      const instruction = emergencyInstructions[selectedEmergency as keyof typeof emergencyInstructions];
      setAudioMessage(instruction.audio);
      playAudioMessage(instruction.audio);
    }
  };

  const playAudioMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.volume = 1;
      utterance.onend = () => setIsPlayingAudio(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudioMessage = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const replayInstructions = () => {
    if (audioMessage) {
      playAudioMessage(audioMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Emergency Header */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${emergencyBg})` }}
      >
        <div className="absolute inset-0 bg-destructive/20 backdrop-blur-sm" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-destructive p-3 rounded-full animate-pulse">
                <Phone className="h-8 w-8 text-destructive-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Emergency Services
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              24/7 Emergency Medical Response - We're here when you need us most
            </p>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Response Time: &lt; 5 Minutes
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!emergencyRequested ? (
          <div className="space-y-8">
            {/* Emergency Type Selection */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                  <span>Select Emergency Type</span>
                </CardTitle>
                <CardDescription>
                  Choose the type of emergency to help us respond appropriately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {emergencyTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={selectedEmergency === type.value ? "destructive" : "outline"}
                        className="h-20 flex-col space-y-2 p-4 hover:border-destructive/50"
                        onClick={() => setSelectedEmergency(type.value)}
                      >
                        <Icon className={`h-6 w-6 ${selectedEmergency === type.value ? 'text-destructive-foreground' : type.color}`} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </Button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Additional Information (Optional)
                    </label>
                    <Textarea
                      placeholder="Describe the emergency situation, symptoms, or any relevant details..."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Action */}
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Ready to Request Emergency Help?
                    </h3>
                    <p className="text-muted-foreground">
                      Our emergency team will be immediately notified and an ambulance will be dispatched to your location.
                    </p>
                  </div>

                  <Button
                    variant="emergency"
                    size="lg"
                    className="text-xl px-12 py-6 h-auto shadow-lg hover:shadow-xl animate-pulse"
                    onClick={handleEmergencyRequest}
                    disabled={!selectedEmergency}
                  >
                    <Phone className="h-6 w-6 mr-3" />
                    REQUEST EMERGENCY HELP
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Or call directly: <span className="font-bold text-destructive">108</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Location Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    We automatically detect your location for fastest response
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Average response time under 5 minutes citywide
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <User className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Expert Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Trained paramedics and emergency medical technicians
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Emergency Requested State */
          <div className="space-y-6">
            <Card className="border-success bg-success/5">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-6">
                  <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="h-10 w-10 text-success animate-pulse" />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-success mb-2">
                      Emergency Request Sent!
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4">
                      Help is on the way. Stay calm and follow these instructions.
                    </p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold text-foreground mb-4">What happens next:</h3>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Emergency team has been notified</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Ambulance dispatched to your location</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-muted rounded-full"></div>
                        <span className="text-sm">Medical team will contact you shortly</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full" onClick={() => setEmergencyRequested(false)}>
                      Send Another Emergency Request
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Emergency ID: <span className="font-mono">EMG-{Date.now().toString().slice(-6)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Instructions */}
            {selectedEmergency && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5 text-primary" />
                      <span>{emergencyInstructions[selectedEmergency as keyof typeof emergencyInstructions].title}</span>
                    </span>
                    <div className="space-x-2">
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={replayInstructions}
                        disabled={isPlayingAudio}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Replay
                      </Button>
                      {isPlayingAudio && (
                        <Button variant="outline" size="sm" onClick={stopAudioMessage}>
                          <Pause className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-base font-medium">
                      {emergencyInstructions[selectedEmergency as keyof typeof emergencyInstructions].message}
                    </AlertDescription>
                  </Alert>
                  
                  {isPlayingAudio && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center space-x-2 text-primary">
                        <Volume2 className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">Playing audio instructions...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}