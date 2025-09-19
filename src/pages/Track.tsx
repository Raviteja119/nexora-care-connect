import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Car,
  RefreshCw,
  Phone,
  Route
} from "lucide-react";

interface LocationData {
  distance: string;
  duration: string;
  ambulanceETA: string;
  ambulanceStatus: "dispatched" | "en-route" | "arrived" | "not-requested";
}

export default function Track() {
  const [locationData, setLocationData] = useState<LocationData>({
    distance: "2.3 km",
    duration: "8 minutes",
    ambulanceETA: "12 minutes",
    ambulanceStatus: "not-requested"
  });
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshLocation = () => {
    setIsTracking(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsTracking(false);
    }, 2000);
  };

  const requestAmbulance = () => {
    setLocationData(prev => ({
      ...prev,
      ambulanceStatus: "dispatched",
      ambulanceETA: "15 minutes"
    }));
  };

  useEffect(() => {
    if (locationData.ambulanceStatus === "dispatched") {
      const timer = setTimeout(() => {
        setLocationData(prev => ({
          ...prev,
          ambulanceStatus: "en-route",
          ambulanceETA: "8 minutes"
        }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [locationData.ambulanceStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dispatched": return "secondary";
      case "en-route": return "default";
      case "arrived": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Distance Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your distance to the hospital and ambulance services
          </p>
        </div>

        {/* Location Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Your Location to Hospital</span>
                </CardTitle>
                <CardDescription>
                  Real-time distance and travel information
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={refreshLocation}
                disabled={isTracking}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isTracking ? 'animate-spin' : ''}`} />
                <span>Update Location</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {locationData.distance}
                </div>
                <p className="text-sm text-muted-foreground">Distance to Hospital</p>
              </div>
              
              <div className="text-center">
                <div className="bg-accent/10 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {locationData.duration}
                </div>
                <p className="text-sm text-muted-foreground">Estimated Travel Time</p>
              </div>
              
              <div className="text-center">
                <div className="bg-destructive/10 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Car className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {locationData.ambulanceETA}
                </div>
                <p className="text-sm text-muted-foreground">Ambulance ETA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ambulance Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-primary" />
              <span>Ambulance Service</span>
            </CardTitle>
            <CardDescription>
              Request and track ambulance services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-muted p-3 rounded-full">
                    <Car className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ambulance Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {locationData.ambulanceStatus === "not-requested" && "No active ambulance request"}
                      {locationData.ambulanceStatus === "dispatched" && "Ambulance has been dispatched"}
                      {locationData.ambulanceStatus === "en-route" && "Ambulance is on the way"}
                      {locationData.ambulanceStatus === "arrived" && "Ambulance has arrived"}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusColor(locationData.ambulanceStatus)}>
                  {locationData.ambulanceStatus.replace("-", " ").toUpperCase()}
                </Badge>
              </div>

              {locationData.ambulanceStatus !== "not-requested" && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>ETA: {locationData.ambulanceETA}</span>
                  </div>
                  <Progress 
                    value={locationData.ambulanceStatus === "dispatched" ? 25 : 
                           locationData.ambulanceStatus === "en-route" ? 75 : 100} 
                    className="h-2"
                  />
                </div>
              )}

              <div className="flex space-x-4">
                {locationData.ambulanceStatus === "not-requested" ? (
                  <Button
                    variant="emergency"
                    onClick={requestAmbulance}
                    className="flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Request Ambulance</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Contact Ambulance</span>
                  </Button>
                )}
                <Button variant="outline">
                  <Route className="h-4 w-4 mr-2" />
                  View Route
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-primary" />
              <span>Live Map</span>
            </CardTitle>
            <CardDescription>
              Interactive map showing your location and route to hospital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Interactive Map
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Live GPS tracking showing your current location, the hospital, and the optimal route. 
                  Ambulance location is updated in real-time when requested.
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-destructive/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Emergency Hotline</h3>
                  <p className="text-sm text-muted-foreground">Direct line to emergency services</p>
                </div>
                <Button variant="emergency">Call 108</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Share Location</h3>
                  <p className="text-sm text-muted-foreground">Send location to emergency contact</p>
                </div>
                <Button variant="outline">Share</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}