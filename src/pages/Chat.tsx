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

  // ---- Smart reply: intent classification + memory so it never just repeats ----
  const lastReplyRef = useRef<string>("");
  const lastIntentRef = useRef<string>("");

  type Intent = { key: string; keywords: string[]; reply: (t: string, ctx: { last: string; staff: string; role: string }) => string };
  const intents: Intent[] = [
    { key: "greet", keywords: ["hi", "hello", "hey", "namaste", "good morning", "good evening", "good afternoon"], reply: (_t, c) => `Hi there! 👋 I'm ${c.staff} from NeXora ${c.role}. I can help with appointments, beds, prescriptions, lab results, billing, video calls or emergencies — what's on your mind?` },
    { key: "thanks", keywords: ["thank", "thanks", "ty", "🙏", "appreciate"], reply: () => "You're most welcome! 😊 Anything else I can do for you today?" },
    { key: "bye", keywords: ["bye", "goodbye", "see you", "later"], reply: () => "Take care! Reach me here anytime. Stay healthy 💚" },
    { key: "book_appt", keywords: ["book", "appointment", "schedule", "slot", "consult"], reply: () => "Sure — which speciality? Cardiology, General Medicine, Pediatrics, Orthopedics, Dermatology or Neurology? Next free slot today: Dr. Sarah Wilson (Cardiology) at 4:30 PM." },
    { key: "cancel_appt", keywords: ["cancel appointment", "cancel my", "cancel booking", "cancel the"], reply: () => "I can cancel that. Share the doctor name or date, or open the Appointments page → red Cancel button. The slot frees up instantly." },
    { key: "reschedule_appt", keywords: ["reschedule", "postpone", "change appointment", "change time", "change date"], reply: () => "Tell me the new preferred date and time, or use OP Rescheduling. I'll confirm in under a minute." },
    { key: "beds", keywords: ["bed", "admission", "admit", "ward", "icu", "room", "vacancy"], reply: () => "Live availability → General: 23 · ICU: 15 · Special Care: 9 · Maternity: 11 · Pediatric: 6. Want me to reserve one? Share patient name + admission time." },
    { key: "prescription", keywords: ["prescription", "rx", "medicine", "medication", "tablet", "refill", "pharmacy"], reply: () => "Active Rx: Lisinopril 10 mg (1×/day), Metformin 500 mg (2×/day). I can raise a refill — should I send it to HealthCare Pharmacy for 2-hour delivery?" },
    { key: "lab", keywords: ["lab", "test", "blood", "report", "result", "x-ray", "scan", "mri", "ct", "ultrasound", "ecg"], reply: () => "Recent reports → CBC (Normal), Lipid Profile (LDL 132 borderline), HbA1c 6.4%. Download from Lab Tests page. Want to book a new test?" },
    { key: "billing", keywords: ["bill", "payment", "invoice", "insurance", "claim", "cost", "price", "charges", "refund"], reply: () => "Last invoice #INV-2421 = ₹3,450 — fully paid. Insurance reimbursement ₹2,800 processed 12-Jun. Need a GST receipt or itemised break-up?" },
    { key: "emergency", keywords: ["emergency", "ambulance", "urgent", "108", "chest pain", "stroke", "fainting", "bleeding heavily", "unconscious"], reply: () => "🚨 If life-threatening: open Emergency → REQUEST EMERGENCY HELP. Ambulance dispatch + first-aid audio starts instantly. Want me to start it now?" },
    { key: "doctors", keywords: ["doctor", "physician", "specialist", "cardiologist", "dermatologist", "pediatrician", "gynecologist", "neurologist"], reply: () => "On duty now: Dr. Sarah Wilson (Cardiology ⭐4.9), Dr. Michael Chen (Neurology ⭐4.8), Dr. Emily Davis (Dermatology ⭐4.7), Dr. Teja (On-call). Reply with a name to connect." },
    { key: "video", keywords: ["video call", "video", "online consult", "telemedicine", "online appointment"], reply: () => "Tap the 📹 icon above to start a WhatsApp video consult with our on-call doctor (₹399). Or schedule one from the Video Call page." },
    { key: "profile", keywords: ["profile", "my details", "address", "update info", "personal info", "blood group", "allergy"], reply: () => "Open Profile to update blood group, allergies and emergency contacts. Keeping it current speeds up care during emergencies." },
    { key: "feedback", keywords: ["feedback", "complaint", "complain", "suggestion", "review", "rating"], reply: () => "Please share it on the Feedback page — serious complaints reach the Quality team within 4 hours." },
    { key: "directions", keywords: ["distance", "direction", "how far", "where", "location", "reach", "map", "parking"], reply: () => "NeXora General Hospital — MG Road, Bangalore. Open Distance Tracker for live ETA. Free patient parking at Gate 2." },
    { key: "hours", keywords: ["hour", "timing", "open", "closed", "schedule today", "available", "shift"], reply: () => "OPD: Mon–Sat 8 AM–8 PM, Sun 9 AM–1 PM. Emergency & Pharmacy: 24×7. Lab collection: 7 AM–9 PM." },
    { key: "covid", keywords: ["covid", "corona", "vaccine", "vaccination", "booster"], reply: () => "Covid booster shots available walk-in 9 AM–5 PM, ₹250. Bring Aadhaar + Cowin OTP." },
    { key: "diet", keywords: ["diet", "food", "nutrition", "what to eat"], reply: () => "Our dietitian Ms. Kavya offers free 15-min consults on Tue/Thu 11 AM. Want me to book one?" },
    { key: "discharge", keywords: ["discharge", "going home", "leaving hospital"], reply: () => "Discharge summary is prepared 2 hours after the doctor signs off. You'll get it on WhatsApp + Profile → Documents." },
    { key: "yes", keywords: ["^yes$", "^yeah$", "^sure$", "^ok$", "^okay$", "please do", "go ahead"], reply: (_t, c) => {
      // Use last intent to give a contextual confirmation
      const map: Record<string, string> = {
        book_appt: "Great — booking Dr. Sarah Wilson at 4:30 PM today. Confirmation will pop into your bell 🔔 within 1 minute.",
        prescription: "Refill request raised with HealthCare Pharmacy — expect delivery in 2–3 hours.",
        lab: "I've added a CBC + Lipid Profile to your cart. Pay & schedule from the Lab Tests page.",
        emergency: "Opening the Emergency page now. Stay calm — help is on the way.",
        video: "Starting WhatsApp video consult with Dr. Teja (on-call) now.",
      };
      return map[c.last] || "Got it. Please share one more detail (date, doctor name or symptoms) so I can move forward.";
    } },
    { key: "no", keywords: ["^no$", "^nope$", "not now", "later"], reply: () => "No problem — I'm here whenever you need anything. 💚" },
  ];

  const match = (text: string): Intent | null => {
    const t = text.toLowerCase().trim();
    for (const intent of intents) {
      for (const kw of intent.keywords) {
        const re = kw.startsWith("^") ? new RegExp(kw) : null;
        if (re ? re.test(t) : t.includes(kw)) return intent;
      }
    }
    return null;
  };

  const smartReply = (text: string, role: string): string => {
    const intent = match(text);
    const ctx = { last: lastIntentRef.current, staff: selectedStaff.name, role };
    let reply: string;
    if (intent) {
      reply = intent.reply(text, ctx);
      lastIntentRef.current = intent.key;
    } else {
      // Contextual fallback — asks a clarifying question that varies based on last topic, never repeats.
      const followUps: Record<string, string> = {
        book_appt: "Could you share the speciality you need, or a preferred date?",
        beds: "Should I look at General, ICU, or Maternity beds for you?",
        lab: "Which test are you asking about — CBC, lipid, X-ray, MRI, or something else?",
        prescription: "Which medicine — Lisinopril, Metformin, or a new one?",
        emergency: "Is this happening RIGHT NOW? If yes I'll start the ambulance dispatch immediately.",
      };
      const ctxQ = followUps[lastIntentRef.current];
      reply = ctxQ
        ? `Just to make sure I help correctly — ${ctxQ}`
        : `I'm not 100% sure I got that. Could you rephrase, or pick a topic: appointments · beds · prescriptions · lab results · billing · video call · emergency?`;
    }
    // Hard guarantee: never send the exact same reply twice in a row
    if (reply === lastReplyRef.current) {
      reply = `Just to add — ${reply}`;
    }
    lastReplyRef.current = reply;
    return reply;
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
