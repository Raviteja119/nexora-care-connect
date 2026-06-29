import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState<string | null>(null);
  const [name, setName] = useState("");

  const pwChecks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One number", ok: /[0-9]/.test(password) },
    { label: "One special character", ok: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const handleSubmit = () => {
    if (loginType === "mobile") {
      if (!/^\+?\d{10,13}$/.test(mobile.replace(/\s/g, ""))) {
        toast.error("Enter a valid mobile number");
        return;
      }
      if (!otp || otp !== otpSent) {
        toast.error("Invalid OTP. Use the OTP shown after 'Send OTP'.");
        return;
      }
      loginByMobile(mobile);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 600);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    const pwErr = validatePassword(password);
    if (pwErr) {
      toast.error(pwErr);
      return;
    }
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
    if (!/^\+?\d{10,13}$/.test(mobile.replace(/\s/g, ""))) {
      toast.error("Enter a valid mobile number");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpSent(code);
    toast.success(`Demo OTP sent: ${code}`, { duration: 8000 });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/85 to-emerald-500/20 backdrop-blur-sm" />
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-6"
        >
          <Logo size={56} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ perspective: 1200 }}
        >
        <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, rotateY: mode === "signup" ? 90 : -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: mode === "signup" ? -90 : 90 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
        <Card className="shadow-2xl border-primary/20 backdrop-blur-md bg-card/95">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              {mode === "signin" ? (
                <><Heart className="h-5 w-5 text-primary" /> Welcome Back</>
              ) : (
                <><Sparkles className="h-5 w-5 text-emerald-500" /> Join NeXora</>
              )}
            </CardTitle>
            <CardDescription>
              {mode === "signin" ? "Access your hospital services account" : "Sign up to access NeXora services"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "email" | "mobile")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Mobile</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="h-11" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {(mode === "signup" || password.length > 0) && (
                    <div className="text-xs space-y-1 mt-2 p-2 rounded bg-muted/50">
                      {pwChecks.map((c) => (
                        <div key={c.label} className={`flex items-center gap-1 ${c.ok ? "text-success" : "text-muted-foreground"}`}>
                          {c.ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Re-enter password" className="h-11" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mobile" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="h-11"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      className="h-11"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button variant="outline" className="h-11 px-3" onClick={sendOtp} type="button">
                      Send OTP
                    </Button>
                  </div>
                  {otpSent && <p className="text-xs text-muted-foreground">Demo OTP: <span className="font-mono font-bold">{otpSent}</span></p>}
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 mt-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="medical" className="w-full h-11 text-lg font-medium" onClick={handleSubmit}>
                  <Lock className="h-5 w-5 mr-2" />
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </motion.div>

              <div className="text-center">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => toast.info("Demo: Password reset link would be emailed.")}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {mode === "signin" ? "New to NeXora?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-11 group" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
                <span className="transition-transform group-hover:translate-x-1">
                  {mode === "signin" ? "Create New Account →" : "← Sign in instead"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
        </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Your data is encrypted and never shared.
        </motion.div>
      </div>
    </div>
  );
}