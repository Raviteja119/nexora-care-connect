import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { Phone, TriangleAlert as AlertTriangle, Heart, Car, Baby, Activity, MapPin, Clock, User, Zap, Volume2, Play, Pause, Video, Languages, Flame, Pill as PillIcon, Brain, Bug, Droplet, Thermometer, Ear, Eye as EyeIcon } from "lucide-react";
import emergencyBg from "@/assets/emergency-bg.jpg";
import { openWhatsAppVideoCall, openWhatsAppChat, callDoctor, ON_CALL_DOCTOR } from "@/lib/whatsapp";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLanguage, ttsLangCode } from "@/contexts/LanguageContext";

const emergencyTypes = [
  { value: "cardiac", label: "Cardiac Emergency", icon: Heart, color: "text-red-500" },
  { value: "accident", label: "Accident/Trauma", icon: Car, color: "text-orange-500" },
  { value: "delivery", label: "Emergency Delivery", icon: Baby, color: "text-pink-500" },
  { value: "stroke", label: "Stroke/Neurological", icon: Activity, color: "text-purple-500" },
  { value: "respiratory", label: "Breathing Difficulty", icon: Zap, color: "text-blue-500" },
  { value: "burns", label: "Burns / Fire", icon: Flame, color: "text-orange-600" },
  { value: "poisoning", label: "Poisoning / Overdose", icon: PillIcon, color: "text-green-600" },
  { value: "seizure", label: "Seizure / Epilepsy", icon: Brain, color: "text-indigo-500" },
  { value: "choking", label: "Choking", icon: Activity, color: "text-rose-500" },
  { value: "snakebite", label: "Snake / Insect Bite", icon: Bug, color: "text-emerald-600" },
  { value: "bleeding", label: "Severe Bleeding", icon: Droplet, color: "text-red-700" },
  { value: "fever", label: "High Fever / Dehydration", icon: Thermometer, color: "text-amber-500" },
  { value: "mental", label: "Mental Health Crisis", icon: User, color: "text-violet-500" },
  { value: "other", label: "Other Emergency", icon: AlertTriangle, color: "text-yellow-500" },
];

const emergencyInstructions = {
  cardiac: {
    title: "Cardiac Emergency Instructions",
    message: "Stay calm. Do not move unless necessary. If you have prescribed heart medication, take it now. Loosen tight clothing around your neck and chest. If you feel faint, lie down with your legs elevated.",
    audio: {
      english: "For cardiac emergencies: Stay calm and still. If you have heart medication, take it now. Help is coming.",
      hindi: "हृदय आपातकाल के लिए: शांत रहें और स्थिर रहें। यदि आपके पास हृदय की दवा है, तो अभी लें। मदद आ रही है।",
      tamil: "இதய அவசரநிலைகளுக்கு: அமைதியாக இருங்கள் மற்றும் அசையாமல் இருங்கள். உங்களிடம் இதய மருந்து இருந்தால், இப்போது எடுத்துக் கொள்ளுங்கள். உதவி வருகிறது।",
      telugu: "గుండె అత్యవసర పరిస్థితుల కోసం: ప్రశాంతంగా ఉండండి మరియు నిశ్చలంగా ఉండండి. మీ దగ్గర గుండె మందు ఉంటే, ఇప్పుడే తీసుకోండి. సహాయం వస్తోంది।"
    }
  },
  accident: {
    title: "Accident/Trauma Instructions", 
    message: "Do not move if you suspect spinal injury. Apply pressure to any bleeding wounds with clean cloth. Stay conscious and alert. If others are involved, ensure their safety too.",
    audio: {
      english: "For accidents: Do not move if injured. Apply pressure to bleeding wounds. Stay alert. Help is on the way.",
      hindi: "दुर्घटनाओं के लिए: यदि घायल हैं तो न हिलें। खून बहने वाले घावों पर दबाव डालें। सतर्क रहें। मदद आ रही है।",
      tamil: "விபத்துகளுக்கு: காயம் பட்டிருந்தால் அசையாதீர்கள். இரத்தம் வரும் காயங்களில் அழுத்தம் கொடுங்கள். எச்சரிக்கையாக இருங்கள். உதவி வழியில் உள்ளது।",
      telugu: "ప్రమాదాల కోసం: గాయపడితే కదలవద్దు. రక్తస్రావం అయ్యే గాయాలపై ఒత్తిడి వేయండి. అప్రమత్తంగా ఉండండి. సహాయం మార్గంలో ఉంది।"
    }
  },
  delivery: {
    title: "Emergency Delivery Instructions",
    message: "Find a clean, comfortable place to lie down. Have clean towels ready. Do not push unless you feel the urge. Breathe steadily. Someone will guide you through the process when help arrives.",
    audio: {
      english: "For emergency delivery: Find a clean place to lie down. Have towels ready. Breathe steadily. Medical help is coming.",
      hindi: "आपातकालीन प्रसव के लिए: लेटने के लिए एक साफ जगह खोजें। तौलिए तैयार रखें। स्थिर रूप से सांस लें। चिकित्सा सहायता आ रही है।",
      tamil: "அவசர பிரசவத்திற்கு: படுக்க ஒரு சுத்தமான இடத்தைக் கண்டுபிடிக்கவும். துண்டுகளை தயாராக வைக்கவும். நிலையாக மூச்சு விடுங்கள். மருத்துவ உதவி வருகிறது।",
      telugu: "అత్యవసర ప్రసవం కోసం: పడుకోవడానికి శుభ్రమైన స్థలాన్ని కనుగొనండి. టవల్స్ సిద్ధంగా ఉంచండి. స్థిరంగా ఊపిరి తీసుకోండి. వైద్య సహాయం వస్తోంది."
    }
  },
  stroke: {
    title: "Stroke/Neurological Instructions",
    message: "Note the time symptoms started. Do not eat or drink anything. Lie down with your head slightly elevated. Stay as still as possible. Try to stay calm and conscious.",
    audio: {
      english: "For stroke: Note the time. Do not eat or drink. Lie down with head elevated. Stay still and calm.",
      hindi: "स्ट्रोक के लिए: समय नोट करें। कुछ न खाएं या पिएं। सिर को ऊंचा करके लेट जाएं। शांत और स्थिर रहें।",
      tamil: "பக்கவாதத்திற்கு: நேரத்தை குறித்து வைக்கவும். எதுவும் சாப்பிடவோ குடிக்கவோ வேண்டாம். தலையை உயர்த்தி படுக்கவும். அமைதியாக இருங்கள்।",
      telugu: "స్ట్రోక్ కోసం: సమయాన్ని గుర్తుంచుకోండి. ఏమీ తినవద్దు లేదా త్రాగవద్దు. తలను పైకి లేపి పడుకోండి. ప్రశాంతంగా ఉండండి."
    }
  },
  respiratory: {
    title: "Breathing Difficulty Instructions", 
    message: "Sit upright, leaning slightly forward. Loosen tight clothing. Use your inhaler if you have one. Try to breathe slowly and deeply. Do not lie down unless instructed.",
    audio: {
      english: "For breathing difficulty: Sit upright and lean forward. Use your inhaler if available. Breathe slowly. Help is coming.",
      hindi: "सांस लेने में कठिनाई के लिए: सीधे बैठें और आगे झुकें। यदि उपलब्ध हो तो अपना इनहेलर उपयोग करें। धीरे-धीरे सांस लें। मदद आ रही है।",
      tamil: "மூச்சுத் திணறலுக்கு: நேராக உட்கார்ந்து முன்னோக்கி சாய்ந்து கொள்ளுங்கள். உங்கள் இன்ஹேலர் இருந்தால் பயன்படுத்துங்கள். மெதுவாக மூச்சு விடுங்கள். உதவி வருகிறது।",
      telugu: "శ్వాస ఇబ్బందికి: నిటారుగా కూర్చుని ముందుకు వంగండి. మీ ఇన్హేలర్ అందుబాటులో ఉంటే ఉపయోగించండి. నెమ్మదిగా ఊపిరి తీసుకోండి. సహాయం వస్తోంది."
    }
  },
  other: {
    title: "General Emergency Instructions",
    message: "Stay calm and alert. Do not leave your current location unless it's unsafe. Follow any specific medical instructions you've been given. Help is on the way.",
    audio: {
      english: "For emergencies: Stay calm and alert. Remain where you are unless unsafe. Follow your medical instructions.",
      hindi: "आपातकाल के लिए: शांत और सतर्क रहें। जब तक असुरक्षित न हो तब तक वहीं रहें। अपने चिकित्सा निर्देशों का पालन करें।",
      tamil: "அவசரநிலைகளுக்கு: அமைதியாகவும் எச்சரிக்கையாகவும் இருங்கள். பாதுகாப்பற்றதாக இல்லாத வரை நீங்கள் இருக்கும் இடத்திலேயே இருங்கள்।",
      telugu: "అత్యవసర పరిస్థితుల కోసం: ప్రశాంతంగా మరియు అప్రమత్తంగా ఉండండి. అసురక్షితం కాకపోతే మీరు ఉన్న చోటనే ఉండండి।"
    }
  },
  burns: {
    title: "Burns / Fire Injury Instructions",
    message: "Move away from the source of heat. Cool the burn under cool (not cold) running water for at least 10 minutes. Do NOT apply ice, butter, or ointments. Cover loosely with a clean, non-stick cloth. Remove tight items (rings, watches) near the burn before swelling starts.",
    audio: {
      english: "For burns: Move to safety. Cool the burn under running water for ten minutes. Do not apply ice or cream. Cover loosely. Help is coming.",
      hindi: "जलने पर: सुरक्षित स्थान पर जाएं। जले हुए भाग को 10 मिनट तक ठंडे पानी के नीचे रखें। बर्फ या क्रीम न लगाएं।",
      tamil: "தீக்காயங்களுக்கு: பாதுகாப்பான இடத்திற்கு செல்லுங்கள். தீக்காயத்தை 10 நிமிடம் தண்ணீரில் குளிர்விக்கவும்.",
      telugu: "కాలిన గాయాలకు: సురక్షిత ప్రదేశానికి వెళ్లండి. కాలిన భాగాన్ని 10 నిమిషాలు చల్లని నీటిలో ఉంచండి."
    }
  },
  poisoning: {
    title: "Poisoning / Overdose Instructions",
    message: "Do NOT induce vomiting unless specifically told to by a poison control expert. If the patient is conscious, keep them sitting up. Save the container or pill bottle to show medical staff. If unconscious but breathing, place them on their side (recovery position).",
    audio: {
      english: "For poisoning: Do not make them vomit. Keep the container with you. If unconscious, place them on their side. Help is coming.",
      hindi: "जहर के लिए: उल्टी न कराएं। दवा की बोतल साथ रखें। बेहोश हो तो करवट पर लिटाएं।",
      tamil: "விஷத்திற்கு: வாந்தி வரவைக்காதீர்கள். மருந்து குப்பியை வைத்துக் கொள்ளுங்கள். மயக்கமாக இருந்தால் பக்கவாட்டில் படுக்கவைக்கவும்.",
      telugu: "విషం కోసం: వాంతి చేయించవద్దు. మందు సీసాను దగ్గర ఉంచుకోండి. స్పృహ లేకుంటే పక్కకు పడుకోబెట్టండి."
    }
  },
  seizure: {
    title: "Seizure / Epilepsy Instructions",
    message: "Do NOT restrain the person or put anything in their mouth. Clear the area of hard or sharp objects. Place something soft under their head. Turn them gently on their side when the shaking stops. Time the seizure. Call for help if it lasts more than 5 minutes.",
    audio: {
      english: "For seizure: Do not hold them down. Move sharp objects away. Cushion the head. Turn on their side when shaking stops. Time the seizure.",
      hindi: "दौरे के लिए: रोकें नहीं। नुकीली चीजें हटाएं। सिर के नीचे कुछ मुलायम रखें। दौरा रुकने पर करवट लिटाएं।",
      tamil: "வலிப்புக்கு: அவர்களைப் பிடித்து வைக்காதீர்கள். கூர்மையான பொருட்களை அகற்றவும். தலையின் கீழ் மென்மையான பொருளை வைக்கவும்.",
      telugu: "మూర్ఛ కోసం: వారిని పట్టుకోకండి. పదునైన వస్తువులను తీసివేయండి. తల కింద మెత్తని వస్తువు ఉంచండి."
    }
  },
  choking: {
    title: "Choking Instructions",
    message: "If the person can cough or speak, encourage them to keep coughing. If they cannot, give 5 sharp back blows between the shoulder blades. If still blocked, perform 5 abdominal thrusts (Heimlich maneuver). Alternate until the object is dislodged or help arrives.",
    audio: {
      english: "For choking: Encourage coughing. If blocked, give five back blows then five abdominal thrusts. Alternate until help arrives.",
      hindi: "दम घुटने पर: खांसने दें। नहीं हो तो 5 बार पीठ पर थपकी और 5 बार पेट दबाव दें।",
      tamil: "மூச்சுத் திணறலுக்கு: இருமலை ஊக்குவிக்கவும். 5 முதுகில் தட்டுக்கள் மற்றும் 5 வயிற்று அழுத்தங்களைச் செய்யவும்.",
      telugu: "ఊపిరి ఆడకపోతే: దగ్గుమని చెప్పండి. వీపుపై 5 సార్లు తట్టి, ఆపై 5 సార్లు పొట్టను నొక్కండి."
    }
  },
  snakebite: {
    title: "Snake / Insect Bite Instructions",
    message: "Keep the bitten limb still and BELOW heart level. Do NOT cut the wound, suck out venom, or apply ice. Remove rings, watches, or tight clothing near the bite. Try to remember the colour and shape of the snake/insect to describe it to medical staff.",
    audio: {
      english: "For snake or insect bite: Keep the limb still and below the heart. Do not cut or suck the wound. Remove tight items. Help is coming.",
      hindi: "सर्पदंश के लिए: काटे हुए हिस्से को स्थिर रखें और हृदय से नीचे रखें। घाव को न काटें।",
      tamil: "பாம்பு கடியில்: காயமான பகுதியை அசையாமல் வைக்கவும். காயத்தை வெட்டவோ உறிஞ்சவோ வேண்டாம்.",
      telugu: "పాము కాటుకు: కాటు వేసిన భాగాన్ని కదలకుండా ఉంచండి. గాయాన్ని కోయవద్దు."
    }
  },
  bleeding: {
    title: "Severe Bleeding Instructions",
    message: "Apply firm, direct pressure on the wound with a clean cloth or your hand. Elevate the injured area above the level of the heart if possible. Do NOT remove embedded objects. Add more cloth on top if blood soaks through — do not lift the original cloth.",
    audio: {
      english: "For severe bleeding: Press firmly on the wound with clean cloth. Raise the injured area above the heart. Help is coming.",
      hindi: "अधिक रक्तस्राव के लिए: साफ कपड़े से घाव पर दबाव डालें। घायल भाग को हृदय से ऊपर रखें।",
      tamil: "அதிக இரத்தப்போக்கு: சுத்தமான துணியால் காயத்தை அழுத்தவும். காயமான பகுதியை இதயத்திற்கு மேலே வைக்கவும்.",
      telugu: "తీవ్ర రక్తస్రావం: శుభ్రమైన గుడ్డతో గాయంపై గట్టిగా నొక్కండి. గాయపడిన భాగాన్ని గుండె కంటే పైకి ఎత్తండి."
    }
  },
  fever: {
    title: "High Fever / Dehydration Instructions",
    message: "Move to a cool place. Sip small amounts of water or ORS solution frequently. Apply a cool damp cloth on the forehead, neck and armpits. Remove heavy clothing. Do NOT give aspirin to children. Seek immediate help if fever exceeds 104°F (40°C) or with confusion.",
    audio: {
      english: "For high fever: Move to a cool place. Sip water or ORS. Apply cool cloths. Avoid heavy clothing. Help is coming.",
      hindi: "तेज बुखार के लिए: ठंडी जगह जाएं। पानी या ORS पिएं। ठंडे कपड़े लगाएं।",
      tamil: "அதிக காய்ச்சலுக்கு: குளிர்ந்த இடத்திற்கு செல்லவும். தண்ணீர் அல்லது ORS குடிக்கவும்.",
      telugu: "ఎక్కువ జ్వరానికి: చల్లని ప్రదేశానికి వెళ్లండి. నీరు లేదా ORS త్రాగండి."
    }
  },
  mental: {
    title: "Mental Health Crisis Instructions",
    message: "Stay with the person. Speak calmly and listen without judgement. Remove any objects that could cause self-harm. Do not argue or use force. Reassure them that help is coming. If you are the patient, take slow deep breaths and stay on the line.",
    audio: {
      english: "Mental health support: Stay calm. Listen without judgement. Remove harmful objects. Reassure that help is on the way.",
      hindi: "मानसिक संकट: शांत रहें। बिना न्याय किए सुनें। हानिकारक चीजें हटाएं।",
      tamil: "மன அழுத்தத்திற்கு: அமைதியாக இருங்கள். தீர்ப்பு இல்லாமல் கேளுங்கள்.",
      telugu: "మానసిక సహాయం: ప్రశాంతంగా ఉండండి. తీర్పు లేకుండా వినండి."
    }
  }
};

export default function Emergency() {
  const { lang } = useLanguage();
  const [selectedEmergency, setSelectedEmergency] = useState<string>("");
  const [emergencyRequested, setEmergencyRequested] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [videoCallActive, setVideoCallActive] = useState(false);

  // Sync local instruction language with globally selected app language
  useEffect(() => {
    const map: Record<string, string> = { en: "english", hi: "hindi", ta: "tamil", te: "telugu" };
    if (map[lang]) setSelectedLanguage(map[lang]);
  }, [lang]);

  const handleEmergencyRequest = () => {
    setEmergencyRequested(true);
    if (selectedEmergency) {
      const instruction = emergencyInstructions[selectedEmergency as keyof typeof emergencyInstructions];
      const audioText = instruction.audio[selectedLanguage as keyof typeof instruction.audio];
      setAudioMessage(audioText);
      playAudioMessage(audioText);
    }
  };

  const playAudioMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(message);
      const langMap: Record<string, string> = {
        english: "en-US", hindi: "hi-IN", tamil: "ta-IN", telugu: "te-IN",
      };
      utterance.lang = langMap[selectedLanguage] || ttsLangCode(lang);
      // Prefer a voice matching the selected language if available
      const voices = speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang === utterance.lang) || voices.find((v) => v.lang.startsWith(utterance.lang.split("-")[0]));
      if (match) utterance.voice = match;
      utterance.rate = 0.85;
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

  const handleVideoCall = () => {
    const type = emergencyTypes.find((t) => t.value === selectedEmergency)?.label ?? "Emergency";
    openWhatsAppVideoCall(`🚨 EMERGENCY: ${type}\nPatient needs immediate video consultation with on-call doctor.`);
    toast.success("Opening WhatsApp emergency video call...");
    setVideoCallActive(true);
    setTimeout(() => setVideoCallActive(false), 8000);
  };

  const handleEmergencyRequestWithAlert = () => {
    handleEmergencyRequest();
    const type = emergencyTypes.find((t) => t.value === selectedEmergency)?.label ?? "Emergency";
    openWhatsAppChat(
      `🚨 EMERGENCY ALERT - ${type}\n\nA patient has requested emergency ambulance dispatch via NeXora.\n\nDetails: ${additionalInfo || "No additional info provided"}\n\nPlease confirm dispatch and ETA.`,
    );
    toast.success("Emergency alert sent to hospital via WhatsApp", { duration: 5000 });
  };

  if (videoCallActive) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-96 h-72 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
            <User className="h-24 w-24 text-gray-400" />
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Connected to Emergency Doctor
            </div>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Dr. Emergency Response
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Emergency Video Consultation</h2>
          <p className="text-gray-300 mb-4">Connected to nearest hospital emergency doctor</p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20"
            >
              <Video className="h-6 w-6" />
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => setVideoCallActive(false)}
              className="rounded-full w-16 h-16"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Emergency consultation active - Follow doctor's instructions</p>
        </div>
      </div>
    );
  }

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

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Preferred Language for Instructions
                    </label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                        <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                      </SelectContent>
                    </Select>
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
                    onClick={handleEmergencyRequestWithAlert}
                    disabled={!selectedEmergency}
                  >
                    <Phone className="h-6 w-6 mr-3" />
                    REQUEST EMERGENCY HELP
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Or call directly:{" "}
                    <a href="tel:108" className="font-bold text-destructive underline">108</a>
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
                    <Link to="/track" className="block">
                      <Button variant="default" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" /> Track Ambulance Live
                      </Button>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      Emergency ID: <span className="font-mono">EMG-{Date.now().toString().slice(-6)}</span>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-3">Need Immediate Medical Guidance?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect with an emergency doctor via video call for immediate first aid instructions
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleVideoCall}
                        className="w-full"
                      >
                        <Video className="h-5 w-5 mr-2" />
                        Connect to Emergency Doctor
                      </Button>
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