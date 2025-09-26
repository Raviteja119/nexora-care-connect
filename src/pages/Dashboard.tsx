import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Bed, Calendar, UserCheck, Phone, Activity, Clock, MapPin, TriangleAlert as AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardBg from "@/assets/dashboard-bg.jpg";

const quickStats = [
  { title: "Available Beds", value: "47", description: "General: 23, ICU: 15, Special: 9", icon: Bed, link: "/beds" },
  { title: "Your Appointments", value: "3", description: "Next: Tomorrow 10:30 AM", icon: Calendar, link: "/appointments" },
  { title: "Doctors Available", value: "28", description: "Specialists: 12, General: 16", icon: UserCheck, link: "/doctors" },
  { title: "Emergency Status", value: "Ready", description: "Response time: < 5 min", icon: Phone, link: "/emergency" },
];

const recentActivities = [
  { title: "Appointment Confirmed", description: "Dr. Sarah Wilson - Cardiology", time: "2 hours ago", icon: Calendar },
  { title: "Lab Results Available", description: "Blood test results ready", time: "5 hours ago", icon: Activity },
  { title: "Prescription Updated", description: "New medication added", time: "1 day ago", icon: Clock },
];

export default function Dashboard() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${dashboardBg})` }}>
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to Your Health Dashboard</h1>
            <p className="text-xl text-muted-foreground mb-8">Managing your healthcare journey with ease and precision</p>
            <Link to="/emergency">
              <Button variant="destructive" size="lg" className="shadow-lg flex items-center justify-center mx-auto">
                <Phone className="h-5 w-5 mr-2" /> Emergency Access
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Link key={idx} to={stat.link}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardHeader className="flex items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Activity className="h-5 w-5 text-primary" /> <span>Quick Actions</span></CardTitle>
                <CardDescription>Access essential hospital services instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/beds"><Button variant="outline" className="w-full h-12 justify-start"><Bed className="h-4 w-4 mr-2" /> Book a Bed</Button></Link>
                  <Link to="/appointments"><Button variant="outline" className="w-full h-12 justify-start"><Calendar className="h-4 w-4 mr-2" /> New Appointment</Button></Link>
                  <Link to="/track"><Button variant="outline" className="w-full h-12 justify-start"><MapPin className="h-4 w-4 mr-2" /> Track Distance</Button></Link>
                  <Link to="/reschedule"><Button variant="outline" className="w-full h-12 justify-start"><Clock className="h-4 w-4 mr-2" /> Reschedule OP</Button></Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Clock className="h-5 w-5 text-primary" /> <span>Recent Activities</span></CardTitle>
                <CardDescription>Your latest healthcare interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => {
                    const Icon = activity.icon;
                    return (
                      <div key={idx} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Notice */}
          <Card className="mt-8 border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-destructive/10 p-3 rounded-full"><AlertTriangle className="h-6 w-6 text-destructive" /></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">Emergency Services Available 24/7</h3>
                  <p className="text-muted-foreground">
                    In case of medical emergency, use our one-click emergency access or call directly.
                  </p>
                </div>
                <Link to="/emergency"><Button variant="destructive" size="lg">Emergency Access</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
