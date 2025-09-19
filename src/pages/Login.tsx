import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"email" | "mobile">("email");

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Stethoscope className="h-10 w-10 text-primary" />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">NeXora</h1>
            <p className="text-sm text-muted-foreground">Hospital Services</p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Access your hospital services account
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-11"
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
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="h-11"
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
                    />
                    <Button variant="outline" className="h-11 px-3">
                      Send OTP
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 mt-6">
              <Link to="/dashboard">
                <Button variant="medical" className="w-full h-11 text-lg font-medium">
                  <Lock className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>

              <div className="text-center">
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    New to NeXora?
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-11">
                Create New Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}