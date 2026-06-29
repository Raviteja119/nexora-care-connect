import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, Video, Paperclip, MoreVertical, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { openWhatsAppVideoCall } from "@/lib/whatsapp";

interface Message {
  id: string;
  sender: "user" | "staff";
  content: string;
  timestamp: string;
  staffName?: string;
  staffRole?: string;
  attachment?: { name: string; url: string };
}

const mockMessages: Message[] = [
  { id: "1", sender: "staff", content: "Hello! I'm Sarah from NeXora Care. How can I assist you today?", timestamp: "10:30 AM", staffName: "Sarah Johnson", staffRole: "Patient Coordinator" },
  { id: "2", sender: "user", content: "Hi, I need to check my appointment status for tomorrow.", timestamp: "10:32 AM" },
  { id: "3", sender: "staff", content: "Your appointment with Dr. Michael Chen is confirmed for tomorrow at 2:00 PM.", timestamp: "10:33 AM", staffName: "Sarah Johnson", staffRole: "Patient Coordinator" }
];

const staffMembers = [
  { id: "s1", name: "Sarah Johnson", role: "Patient Coordinator", status: "online" },
  { id: "s2", name: "Mike Wilson", role: "Billing Support", status: "online" },
  { id: "s3", name: "Lisa Chen", role: "Technical Support", status: "away" },
  { id: "s4", name: "Dr. Robert Kim", role: "Emergency Coordinator", status: "busy" }
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(staffMembers[0]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const smartReply = (text: string, role: string): string => {
    const t = text.toLowerCase().trim();
    const has = (...words: string[]) => words.some((w) => t.includes(w));

    // Greetings
    if (has("hi", "hello", "hey", "namaste", "good morning", "good evening")) {
      return `Hi there! 👋 I'm ${selectedStaff.name} from NeXora ${role}. How can I help you today? You can ask me about appointments, beds, doctors, lab tests, prescriptions, billing or emergencies.`;
    }
    // Appointments
    if (has("appointment", "book", "schedule", "consult", "slot")) {
      if (has("cancel")) return "I can cancel that for you. Could you share the appointment date or doctor name? You can also cancel directly from the Appointments page.";
      if (has("reschedule", "change", "postpone")) return "Sure — head to OP Rescheduling from the menu, or tell me the new preferred date and time and I'll move it for you.";
      return "I can book an appointment for you. Which speciality do you need — Cardiology, General Medicine, Pediatrics, Orthopedics, Dermatology or Neurology? Your next available slot with Dr. Sarah Wilson (Cardiology) is today 4:30 PM.";
    }
    // Beds
    if (has("bed", "admission", "admit", "ward", "icu", "room")) {
      return "Live bed availability right now → General: 23, ICU: 15, Special Care: 9, Maternity: 11, Pediatric: 6. Would you like me to reserve one? Please share patient name and approximate admission time.";
    }
    // Prescriptions
    if (has("prescription", "medicine", "medication", "refill", "tablet", "pharmacy")) {
      return "Your active prescriptions are: 1) Lisinopril 10 mg — once daily, 2) Metformin 500 mg — twice daily. I've raised a refill request with HealthCare Pharmacy (delivery in 2–3 hours). Need anything else?";
    }
    // Lab tests
    if (has("lab", "test", "blood", "report", "result", "x-ray", "scan", "mri", "ct")) {
      return "Your last 3 lab results are ready: CBC (Normal), Lipid Profile (Borderline LDL 132 mg/dL), HbA1c (6.4%). View or download from the Lab Tests page. Would you like to book a new test?";
    }
    // Billing
    if (has("bill", "payment", "invoice", "insurance", "claim", "cost", "price", "charges")) {
      return "Your last invoice #INV-2421 of ₹3,450 is FULLY PAID. Insurance reimbursement of ₹2,800 was processed on 12-Jun. Need a GST receipt or detailed break-up?";
    }
    // Emergency
    if (has("emergency", "ambulance", "urgent", "108", "accident", "chest pain", "stroke", "fainting")) {
      return "🚨 If this is life-threatening, please tap REQUEST EMERGENCY HELP on the Emergency page now — an ambulance will be dispatched and recorded first-aid instructions will play. I'm staying on this chat. Type DOCTOR to start an immediate video consultation.";
    }
    // Doctors
    if (has("doctor", "physician", "specialist", "cardiologist", "dermatologist", "pediatrician")) {
      return "Available doctors right now: Dr. Sarah Wilson (Cardiology, ⭐4.9), Dr. Michael Chen (Neurology, ⭐4.8), Dr. Emily Davis (Dermatology, ⭐4.7). Reply with a name to book a slot or video call.";
    }
    // Video call
    if (has("video", "call", "consultation", "online")) {
      return "I can connect you to a doctor over WhatsApp video. Tap 'Video Call' at the top of this chat or visit the Video Call page. Standard consultation fee is ₹399.";
    }
    // Profile
    if (has("profile", "details", "address", "update", "personal")) {
      return "You can update your personal details, allergies, blood group and emergency contacts from the Profile page. Keeping it current helps us serve you faster in emergencies.";
    }
    // Feedback / complaint
    if (has("feedback", "complaint", "complain", "suggestion", "review")) {
      return "We'd love your feedback! Please visit the Feedback page and rate your last visit. Serious complaints are escalated to the Quality team within 4 hours.";
    }
    // Distance / directions
    if (has("distance", "direction", "how far", "address", "location", "reach", "map")) {
      return "NeXora General Hospital is at MG Road, Bangalore. Use the Distance Tracker page for live distance, ETA and route map. Free patient parking is available at Gate 2.";
    }
    // Hours
    if (has("hour", "timing", "open", "close", "available")) {
      return "OPD: Mon–Sat 8 AM – 8 PM, Sun 9 AM – 1 PM. Emergency & Pharmacy: 24×7. Lab collection: 7 AM – 9 PM daily.";
    }
    // Thanks
    if (has("thank", "thanks", "ty", "🙏")) {
      return "You're most welcome! 😊 Wishing you good health. Is there anything else I can help with?";
    }
    // Yes / No
    if (t === "yes" || t === "yeah" || t === "sure" || t === "ok") {
      return "Great! Please share a bit more detail so I can help you faster — e.g., patient name, preferred date/time, or symptoms.";
    }
    if (t === "no" || t === "nope") {
      return "No problem. I'm here whenever you need anything else. Stay healthy! 💚";
    }
    // Fallback
    return `I understand you're asking about "${text.slice(0, 60)}". Could you tell me a bit more? I can help with appointments, bed availability, prescriptions, lab tests, billing, doctor video calls, or emergencies — just type a keyword like "book doctor" or "lab report".`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = { id: Date.now().toString(), sender: "user", content: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const userText = newMessage;
    setMessages(prev => [...prev, msg]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate staff reply
    setTimeout(() => {
      const staffMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "staff",
        content: smartReply(userText, selectedStaff.role),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        staffName: selectedStaff.name,
        staffRole: selectedStaff.role
      };
      setMessages(prev => [...prev, staffMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const msg: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: `📎 Sent file: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: { name: file.name, url },
    };
    setMessages((prev) => [...prev, msg]);
    toast.success(`File "${file.name}" attached`);
    e.target.value = "";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Chat Support</h1>
        <p className="text-muted-foreground mb-6">Get instant help from our hospital staff</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Staff List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" />Staff Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {staffMembers.map(staff => (
                <div key={staff.id} onClick={() => setSelectedStaff(staff)} className={`p-3 rounded-lg cursor-pointer transition-all ${selectedStaff.id === staff.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">{staff.name.split(' ').map(n=>n[0]).join('')}</div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(staff.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{staff.name}</p>
                      <p className={`text-xs truncate ${selectedStaff.id === staff.id ? 'text-white/80' : 'text-muted-foreground'}`}>{staff.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-semibold">{selectedStaff.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedStaff.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedStaff.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStaff.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open("tel:+919491966048", "_self")}><Phone className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => openWhatsAppVideoCall(`Patient requesting video call with ${selectedStaff.name} (${selectedStaff.role})`)}><Video className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Options: Mute • Block • Export chat")}><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.sender === 'staff' && <div className="text-xs text-muted-foreground mb-1">{msg.staffName} • {msg.staffRole}</div>}
                    <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{msg.content}</p>
                      {msg.attachment && (
                        <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" download={msg.attachment.name} className="text-xs underline block mt-1">
                          Download {msg.attachment.name}
                        </a>
                      )}
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted px-3 py-2 rounded-lg text-sm text-muted-foreground">
                    {selectedStaff.name} is typing<span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <input ref={fileRef} type="file" hidden onChange={handleAttach} />
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Paperclip className="h-4 w-4" /></Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e)=>setNewMessage(e.target.value)}
                  onKeyPress={(e)=>e.key==='Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
