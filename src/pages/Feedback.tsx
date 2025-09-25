import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare, ThumbsUp, Send, TrendingUp } from "lucide-react";

const feedbackHistory = [
  {
    id: "fb1",
    type: "Service Rating",
    service: "Emergency Care",
    rating: 5,
    comment: "Excellent response time and professional care. The staff was very helpful during my emergency visit.",
    date: "2024-01-15",
    status: "Reviewed"
  },
  {
    id: "fb2",
    type: "Doctor Rating",
    service: "Dr. Sarah Johnson - Cardiology",
    rating: 4,
    comment: "Very knowledgeable doctor. Explained my condition clearly and provided good treatment options.",
    date: "2024-01-10",
    status: "Reviewed"
  },
  {
    id: "fb3",
    type: "General Feedback",
    service: "Hospital Facilities",
    rating: 3,
    comment: "The facilities are good but could use some updates. Waiting times were longer than expected.",
    date: "2024-01-08",
    status: "In Review"
  }
];

const serviceCategories = [
  "Emergency Care",
  "Doctor Consultation",
  "Nursing Care", 
  "Hospital Facilities",
  "Food Services",
  "Billing Services",
  "Pharmacy",
  "Laboratory Services",
  "Radiology",
  "General Experience"
];

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("");
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = () => {
    // Simulate feedback submission
    console.log({
      rating,
      feedbackType,
      service,
      comment,
      email,
      name
    });
    
    // Reset form
    setRating(0);
    setFeedbackType("");
    setService("");
    setComment("");
    setEmail("");
    setName("");
    
    alert("Thank you for your feedback! We appreciate your input and will review it shortly.");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reviewed": return "default";
      case "In Review": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Feedback & Reviews</h1>
          <p className="text-muted-foreground">Help us improve our services with your valuable feedback</p>
        </div>

        <Tabs defaultValue="new-feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new-feedback">Submit Feedback</TabsTrigger>
            <TabsTrigger value="history">My Feedback</TabsTrigger>
            <TabsTrigger value="insights">Service Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="new-feedback" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-medical-primary" />
                    Share Your Experience
                  </CardTitle>
                  <CardDescription>
                    Your feedback helps us provide better healthcare services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name</label>
                      <Input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email (Optional)</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Feedback Type</label>
                    <Select value={feedbackType} onValueChange={setFeedbackType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service Rating</SelectItem>
                        <SelectItem value="doctor">Doctor Rating</SelectItem>
                        <SelectItem value="facility">Facility Feedback</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="compliment">Compliment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Service/Department</label>
                    <Select value={service} onValueChange={setService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Overall Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleStarClick(star)}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rating > 0 && `You rated: ${rating} star${rating > 1 ? 's' : ''}`}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Comments</label>
                    <Textarea
                      placeholder="Please share your detailed feedback..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button 
                    className="w-full bg-medical-primary hover:bg-medical-primary/90"
                    onClick={handleSubmit}
                    disabled={!rating || !feedbackType || !service || !comment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Your Feedback Matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ThumbsUp className="h-5 w-5 text-medical-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Improve Patient Care</h3>
                      <p className="text-sm text-muted-foreground">
                        Your feedback helps us identify areas for improvement in patient care and services.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-medical-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Enhance Quality</h3>
                      <p className="text-sm text-muted-foreground">
                        We use your insights to enhance the quality of our healthcare services and facilities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-medical-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Better Communication</h3>
                      <p className="text-sm text-muted-foreground">
                        Your feedback helps us improve communication between patients and healthcare providers.
                      </p>
                    </div>
                  </div>

                  <div className="bg-medical-light/20 p-4 rounded-lg mt-6">
                    <h3 className="font-semibold text-medical-primary mb-2">Quick Survey</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      How likely are you to recommend NeXora Care to others?
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <Button
                          key={num}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 text-xs"
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Not likely</span>
                      <span>Very likely</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-4">
              {feedbackHistory.map((feedback) => (
                <Card key={feedback.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-medical-primary" />
                          {feedback.service}
                        </CardTitle>
                        <CardDescription>{feedback.type}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant={getStatusColor(feedback.status) as any}>
                          {feedback.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{feedback.comment}</p>
                    <p className="text-sm text-muted-foreground">Submitted on {feedback.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">4.7</h3>
                      <p className="text-sm text-muted-foreground">Overall Rating</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div>
                    <h3 className="text-2xl font-bold">1,247</h3>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div>
                    <h3 className="text-2xl font-bold">94%</h3>
                    <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div>
                    <h3 className="text-2xl font-bold">2.1 hrs</h3>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-medical-primary pl-4">
                    <p className="text-muted-foreground mb-2">
                      "The emergency care team was exceptional. They responded quickly and provided excellent treatment during a critical situation."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">- Anonymous Patient</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-medical-primary pl-4">
                    <p className="text-muted-foreground mb-2">
                      "Dr. Johnson was very thorough and explained everything clearly. The staff was professional and caring."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">- John D.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}