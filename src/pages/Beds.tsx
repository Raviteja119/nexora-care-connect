import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { Bed, Users, Heart, Stethoscope, RefreshCw, Clock } from "lucide-react";

const bedTypes = [
  {
    type: "General Ward",
    total: 150,
    available: 23,
    price: "₹2,500/day",
    icon: Bed,
    color: "success",
    description: "Standard medical care with essential monitoring"
  },
  {
    type: "ICU",
    total: 50,
    available: 15,
    price: "₹8,500/day",
    icon: Heart,
    color: "destructive",
    description: "Intensive care with 24/7 monitoring"
  },
  {
    type: "Special Care",
    total: 30,
    available: 9,
    price: "₹5,500/day",
    icon: Stethoscope,
    color: "primary",
    description: "Specialized treatment units"
  },
  {
    type: "Emergency",
    total: 20,
    available: 18,
    price: "₹3,500/day",
    icon: Users,
    color: "secondary",
    description: "Emergency care and stabilization"
  }
];

export default function Beds() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "success";
    if (percentage > 20) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bed Availability
            </h1>
            <p className="text-muted-foreground">
              Real-time bed availability across all departments
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="text-sm font-medium">
                {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-success">65</div>
                <p className="text-sm text-muted-foreground">Total Available</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">250</div>
                <p className="text-sm text-muted-foreground">Total Beds</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">185</div>
                <p className="text-sm text-muted-foreground">Occupied</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">26%</div>
                <p className="text-sm text-muted-foreground">Availability</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bed Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {bedTypes.map((bed, index) => {
            const Icon = bed.icon;
            const availabilityPercentage = (bed.available / bed.total) * 100;
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{bed.type}</CardTitle>
                        <CardDescription>{bed.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getAvailabilityColor(bed.available, bed.total)}>
                      {bed.available} Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Occupancy</span>
                      <span>{bed.total - bed.available} / {bed.total} beds</span>
                    </div>
                    <Progress 
                      value={100 - availabilityPercentage} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-primary">
                        {bed.price}
                      </div>
                      <Button 
                        variant={bed.available > 0 ? "default" : "secondary"}
                        disabled={bed.available === 0}
                        className="flex items-center space-x-2"
                      >
                        <Bed className="h-4 w-4" />
                        <span>{bed.available > 0 ? 'Book Bed' : 'Waitlist'}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Booking Information */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Booking Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">How to Book:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Click "Book Bed" for immediate reservation</li>
                  <li>• Provide patient details and medical requirements</li>
                  <li>• Confirm booking with advance payment</li>
                  <li>• Receive booking confirmation and bed number</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Important Notes:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Bed availability updates every 30 seconds</li>
                  <li>• Emergency cases get priority allocation</li>
                  <li>• Advance booking available up to 7 days</li>
                  <li>• Cancellation allowed up to 2 hours before</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}