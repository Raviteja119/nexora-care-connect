import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function LayoutExample() {
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
    const interval = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen relative bg-background">

      {/* Fixed Navbar */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Scrollable Content */}
      <div className="fixed top-16 left-0 right-0 bottom-0 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Page Title</h1>
              <p className="text-muted-foreground">Page description goes here.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</p>
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

          {/* Example Content */}
          <Card>
            <CardHeader>
              <CardTitle>Example Card</CardTitle>
              <CardDescription>This card scrolls under the fixed navbar.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>All page content goes inside this scrollable container.</p>
              <p>You can add multiple cards, tables, forms, etc., and only the content scrolls.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>More content here. Scroll down to see that the Navbar stays fixed.</p>
            </CardContent>
          </Card>

          {/* Add your Appointments / Beds / Other components here */}
        </div>
      </div>
    </div>
  );
}
