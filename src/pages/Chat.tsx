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

  const smartReply = (text: string, role: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("appointment")) return "Your appointment with Dr. Michael Chen is confirmed for tomorrow at 2:00 PM. Do you need directions or a reminder?";
    if (lower.includes("bill") || lower.includes("payment") || lower.includes("insurance")) return "I can help with billing. Your last invoice #INV-2421 was ₹3,450 — fully paid. Need a receipt?";
    if (lower.includes("bed") || lower.includes("admission")) return "We have 23 General, 15 ICU and 9 Special Care beds available right now. Would you like me to reserve one?";
    if (lower.includes("prescription") || lower.includes("medicine") || lower.includes("refill")) return "Sure — I see your active Rx for Lisinopril 10mg. I've raised a refill request with HealthCare Pharmacy.";
    if (lower.includes("emergency") || lower.includes("ambulance")) return "Please head to the Emergency page and tap REQUEST EMERGENCY HELP. Staying on this chat for support.";
    if (lower.includes("doctor")) return "Dr. Sarah Wilson (Cardiology) is Available now. Want me to book a slot or start a video call?";
    if (lower.includes("thank")) return "You're welcome! Anything else I can help you with today? 😊";
    return `Thanks for the details. I've noted this and our ${role} team will follow up shortly. Anything else?`;
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
