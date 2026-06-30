import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, XCircle, Sparkles, ShieldCheck, Heart } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";
import { toast } from "sonner";
import { validatePassword } from "@/lib/fileUtils";
import { registerUser, loginUser, loginByMobile } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"email" | "mobile">("email");
  const [active, setActive] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState<string | null>(null);
  const [name, setName] = useState("");

  const pwChecks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special character", ok: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const handleSubmit = (mode: "signin" | "signup") => {
    if (loginType === "mobile") {
      if (!/^\+?\d{10,13}$/.test(mobile.replace(/\s/g, ""))) return toast.error("Enter a valid mobile number");
      if (!otpSent) return toast.error("Please tap 'Send OTP' first.");
      if (!otp.trim()) return toast.error("Enter the OTP you received.");
      if (otp.trim() !== otpSent) return toast.error("OTP does not match. Please re-enter the correct OTP.");
      loginByMobile(mobile);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 600);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Enter a valid email address");
    const pwErr = validatePassword(password);
    if (pwErr) return toast.error(pwErr);
    if (mode === "signup") {
      if (!name.trim()) return toast.error("Please enter your name");
      if (password !== confirmPwd) return toast.error("Passwords do not match");
      const res = registerUser({ name, email, password });
      if (!res.ok) return toast.error(res.error || "Registration failed");
      toast.success(`Account created for ${name}! Redirecting...`);
    } else {
      const res = loginUser(email, password);
      if (!res.ok) return toast.error(res.error || "Login failed");
      toast.success("Login successful! Redirecting...");
    }
    setTimeout(() => navigate("/dashboard"), 600);
  };

  const sendOtp = () => {
    if (!/^\+?\d{10,13}$/.test(mobile.replace(/\s/g, ""))) return toast.error("Enter a valid mobile number");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpSent(code);
    toast.success(`OTP sent to ${mobile}: ${code}`, { description: "Demo: enter this exact OTP to log in.", duration: 10000 });
  };

  const EmailFields = ({ mode }: { mode: "signin" | "signup" }) => (
    <div className="space-y-3">
      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label htmlFor={`${mode}-name`} className="text-xs">Full Name</Label>
          <Input id={`${mode}-name`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-10" />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor={`${mode}-email`} className="text-xs">Email</Label>
        <Input id={`${mode}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${mode}-pw`} className="text-xs">Password</Label>
        <div className="relative">
          <Input id={`${mode}-pw`} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="h-10 pr-10" />
          <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {(mode === "signup" || password.length > 0) && (
          <div className="text-[10px] grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 p-1.5 rounded bg-muted/50">
            {pwChecks.map((c) => (
              <div key={c.label} className={`flex items-center gap-1 ${c.ok ? "text-success" : "text-muted-foreground"}`}>
                {c.ok ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}<span>{c.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-xs">Confirm Password</Label>
          <Input id="confirm" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Re-enter" className="h-10" />
        </div>
      )}
    </div>
  );

  const MobileFields = () => (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="mobile" className="text-xs">Mobile Number</Label>
        <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 XXXXXXXXXX" className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="otp" className="text-xs">OTP</Label>
        <div className="flex gap-2">
          <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter received OTP" className="h-10" />
          <Button type="button" variant="outline" onClick={sendOtp} className="h-10 shrink-0">{otpSent ? "Resend" : "Send OTP"}</Button>
        </div>
        {otpSent && <p className="text-[11px] text-muted-foreground">Demo OTP (enter exactly): <span className="font-mono font-bold">{otpSent}</span></p>}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-hidden p-4"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/85 to-emerald-500/20 backdrop-blur-sm" />
      <motion.div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-4xl">
        <div className="flex justify-center mb-4">
          <Logo size={48} />
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-card/95 backdrop-blur-md border border-primary/20 min-h-[580px]">
          {/* Sign In form (left half) */}
          <motion.div
            className="absolute top-0 left-0 h-full w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center"
            animate={{ x: active === "signup" ? "100%" : "0%", opacity: active === "signup" ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            style={{ zIndex: active === "signin" ? 5 : 1 }}
          >
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Sign In</h2>
            <p className="text-xs text-muted-foreground mb-4">Welcome back to NeXora</p>
            <Tabs value={loginType} onValueChange={(v) => setLoginType(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-3 h-9">
                <TabsTrigger value="email" className="text-xs"><Mail className="h-3.5 w-3.5 mr-1" />Email</TabsTrigger>
                <TabsTrigger value="mobile" className="text-xs"><Phone className="h-3.5 w-3.5 mr-1" />Mobile</TabsTrigger>
              </TabsList>
              <TabsContent value="email"><EmailFields mode="signin" /></TabsContent>
              <TabsContent value="mobile"><MobileFields /></TabsContent>
            </Tabs>
            <button onClick={() => toast.info("Demo: Reset link would be emailed.")} className="text-xs text-primary hover:underline self-start mt-3">Forgot password?</button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
              <Button variant="medical" className="w-full h-10 font-medium uppercase tracking-wide" onClick={() => handleSubmit("signin")}>
                <Lock className="h-4 w-4 mr-2" /> Sign In
              </Button>
            </motion.div>
          </motion.div>

          {/* Sign Up form (also left, slides in) */}
          <motion.div
            className="absolute top-0 left-0 h-full w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center"
            animate={{ x: active === "signup" ? "100%" : "0%", opacity: active === "signup" ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            style={{ zIndex: active === "signup" ? 5 : 1 }}
          >
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2"><Sparkles className="h-5 w-5 text-emerald-500" /> Create Account</h2>
            <p className="text-xs text-muted-foreground mb-4">Join NeXora hospital services</p>
            <Tabs value={loginType} onValueChange={(v) => setLoginType(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-3 h-9">
                <TabsTrigger value="email" className="text-xs"><Mail className="h-3.5 w-3.5 mr-1" />Email</TabsTrigger>
                <TabsTrigger value="mobile" className="text-xs"><Phone className="h-3.5 w-3.5 mr-1" />Mobile</TabsTrigger>
              </TabsList>
              <TabsContent value="email"><EmailFields mode="signup" /></TabsContent>
              <TabsContent value="mobile"><MobileFields /></TabsContent>
            </Tabs>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
              <Button variant="medical" className="w-full h-10 font-medium uppercase tracking-wide" onClick={() => handleSubmit("signup")}>
                <Sparkles className="h-4 w-4 mr-2" /> Sign Up
              </Button>
            </motion.div>
          </motion.div>

          {/* Sliding gradient overlay */}
          <motion.div
            className="absolute top-0 h-full w-full md:w-1/2 overflow-hidden hidden md:block"
            animate={{ left: active === "signup" ? "0%" : "50%" }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            style={{ zIndex: 10 }}
          >
            <div className="h-full w-full bg-gradient-to-br from-primary via-emerald-500 to-primary text-white relative overflow-hidden">
              <motion.div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
              <motion.div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white/10" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity }} />
              <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
                {active === "signin" ? (
                  <motion.div key="hello" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <h3 className="text-3xl font-bold mb-3">Hello, Friend!</h3>
                    <p className="text-sm mb-8 opacity-90 max-w-xs mx-auto">Register with your personal details and start your journey to better health with NeXora.</p>
                    <Button variant="outline" onClick={() => setActive("signup")} className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary uppercase tracking-wider px-8">Sign Up</Button>
                  </motion.div>
                ) : (
                  <motion.div key="welcome" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <h3 className="text-3xl font-bold mb-3">Welcome Back!</h3>
                    <p className="text-sm mb-8 opacity-90 max-w-xs mx-auto">To stay connected with us, please log in with your personal info.</p>
                    <Button variant="outline" onClick={() => setActive("signin")} className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary uppercase tracking-wider px-8">Sign In</Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Mobile toggle (no slide overlay on small screens) */}
          <div className="md:hidden absolute bottom-3 left-0 right-0 flex justify-center">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setActive(active === "signin" ? "signup" : "signin")}>
              {active === "signin" ? "New here? Create account →" : "← Back to Sign In"}
            </Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 flex items-center justify-center gap-2 text-xs text-white drop-shadow">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
          Your data is encrypted and never shared.
        </motion.div>
      </motion.div>
    </div>
  );
}