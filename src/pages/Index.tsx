import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Stethoscope className="h-16 w-16 text-primary" />
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary">NeXora</h1>
              <p className="text-lg text-muted-foreground">Hospital Services</p>
            </div>
          </div>

          <Card className="shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl font-bold mb-4">
                Your Health, Our Priority
              </CardTitle>
              <CardDescription className="text-xl">
                Advanced hospital services designed to maximize your survival chances and provide comprehensive healthcare solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-muted-foreground">Emergency Services</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">&lt;5min</div>
                  <p className="text-muted-foreground">Average Response Time</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <p className="text-muted-foreground">Specialist Doctors</p>
                </div>
              </div>

              <div className="space-y-4">
                <Link to="/login">
                  <Button variant="medical" size="lg" className="w-full text-lg h-14">
                    Access Hospital Services
                  </Button>
                </Link>
                <Link to="/emergency">
                  <Button variant="emergency" size="lg" className="w-full text-lg h-14">
                    Emergency Access
                  </Button>
                </Link>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Comprehensive Healthcare Services
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>• Bed Booking</div>
                  <div>• Doctor Appointments</div>
                  <div>• Emergency Response</div>
                  <div>• Distance Tracking</div>
                  <div>• Medical Records</div>
                  <div>• OP Rescheduling</div>
                  <div>• Real-time Updates</div>
                  <div>• 24/7 Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
