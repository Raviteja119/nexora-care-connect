import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, Clock, User, Search, Heart, Brain, Activity } from "lucide-react";

const healthArticles = [
  {
    id: "art1",
    title: "Understanding Heart Health: Prevention Tips",
    category: "Cardiology",
    author: "Dr. Sarah Johnson",
    readTime: "5 min read",
    date: "2024-01-15",
    image: "/api/placeholder/300/200",
    excerpt: "Learn essential tips for maintaining a healthy heart and preventing cardiovascular diseases through lifestyle changes and regular checkups.",
    content: "Heart disease remains one of the leading causes of death globally. However, many heart conditions can be prevented through simple lifestyle modifications: a Mediterranean-style diet rich in fruits, vegetables, whole grains and healthy fats; at least 150 minutes of moderate aerobic activity per week; not smoking; managing stress through meditation or breathing exercises; keeping blood pressure under 120/80 and cholesterol within healthy ranges. Schedule a lipid profile and ECG every 12 months after age 35."
  },
  {
    id: "art2",
    title: "Mental Health Awareness: Breaking the Stigma",
    category: "Mental Health",
    author: "Dr. Michael Chen",
    readTime: "7 min read",
    date: "2024-01-12",
    image: "/api/placeholder/300/200",
    excerpt: "Understanding mental health conditions and how to seek help without stigma. A comprehensive guide to mental wellness.",
    content: "Mental health is just as important as physical health. Common conditions include anxiety, depression, PTSD and bipolar disorder. Warning signs: persistent sadness >2 weeks, withdrawal from activities, sleep changes, appetite changes, thoughts of self-harm. Treatments work: therapy (CBT, DBT), medications, lifestyle change, and peer support. If you or someone you know is in crisis, call iCall: 9152987821 (India) or Vandrevala Foundation: 1860-2662-345."
  },
  {
    id: "art3",
    title: "Diabetes Management: Daily Care Tips",
    category: "Endocrinology",
    author: "Dr. Emily Davis",
    readTime: "6 min read",
    date: "2024-01-10",
    image: "/api/placeholder/300/200",
    excerpt: "Practical tips for managing diabetes through diet, exercise, and medication adherence.",
    content: "Living with diabetes requires consistent daily management. Check blood sugar as prescribed, take medications on time, eat balanced meals at regular intervals, walk 30 minutes daily, monitor feet for cuts, and have an HbA1c test every 3 months. Keep glucose tablets nearby for hypoglycemia."
  },
  {
    id: "art4",
    title: "Monsoon Season: Preventing Dengue, Malaria and Typhoid",
    category: "General Medicine",
    author: "Dr. Rajesh Kumar",
    readTime: "4 min read",
    date: "2024-06-05",
    image: "/api/placeholder/300/200",
    excerpt: "Stay safe this monsoon — eliminate stagnant water, drink boiled water, and recognize early symptoms of vector-borne diseases.",
    content: "Empty water containers weekly, use mosquito repellents and nets, eat freshly cooked food, drink only boiled or filtered water, and avoid roadside cut fruits. Seek medical care for high fever, body aches, rash or persistent vomiting."
  },
  {
    id: "art5",
    title: "Childhood Vaccination Schedule (0–5 years)",
    category: "Pediatrics",
    author: "Dr. Priya Sharma",
    readTime: "6 min read",
    date: "2024-04-22",
    image: "/api/placeholder/300/200",
    excerpt: "A complete guide to the Indian National Immunisation Schedule for infants and toddlers.",
    content: "At birth: BCG, OPV-0, Hep-B. 6/10/14 weeks: DPT, OPV, Hep-B, Hib, Rotavirus, PCV. 9 months: Measles-Rubella, Vitamin A. 16–24 months: DPT booster, OPV booster, MR-2. Keep your child's immunisation card updated."
  },
  {
    id: "art6",
    title: "Healthy Eating on a Budget",
    category: "Nutrition",
    author: "Chef Maria Rodriguez",
    readTime: "5 min read",
    date: "2024-03-18",
    image: "/api/placeholder/300/200",
    excerpt: "Affordable swaps and meal-prep ideas for nutritious eating without overspending.",
    content: "Buy seasonal vegetables, choose dals and millets over packaged proteins, batch-cook on weekends, freeze leftovers, and avoid sugary drinks. A balanced plate: 1/2 vegetables, 1/4 whole grain, 1/4 protein."
  },
  {
    id: "art7",
    title: "Pregnancy Care: Trimester-by-Trimester Guide",
    category: "Gynecology",
    author: "Dr. Neha Reddy",
    readTime: "8 min read",
    date: "2024-05-10",
    image: "/api/placeholder/300/200",
    excerpt: "What to expect, eat, and avoid during each stage of pregnancy.",
    content: "1st trimester: folic acid, avoid alcohol/smoking, first ultrasound at 8–12 weeks. 2nd trimester: anomaly scan at 18–22 weeks, iron and calcium supplements. 3rd trimester: birth plan, kick-count monitoring, weekly checkups after 36 weeks."
  },
  {
    id: "art8",
    title: "Recognising a Stroke: Use the FAST Rule",
    category: "Neurology",
    author: "Dr. Ravi Iyer",
    readTime: "3 min read",
    date: "2024-02-14",
    image: "/api/placeholder/300/200",
    excerpt: "FAST = Face drooping, Arm weakness, Speech difficulty, Time to call emergency.",
    content: "Every minute counts in a stroke. If you see Face drooping, Arm weakness, or Speech slurring, note the Time and call emergency immediately. Clot-busting drugs work best within 4.5 hours of onset."
  },
  {
    id: "art9",
    title: "Improving Sleep Hygiene for Better Health",
    category: "Mental Health",
    author: "Dr. James Park",
    readTime: "4 min read",
    date: "2024-01-30",
    image: "/api/placeholder/300/200",
    excerpt: "Simple evening habits to fall asleep faster and wake refreshed.",
    content: "Keep a consistent sleep schedule, limit screens 1 hour before bed, avoid caffeine after 2 PM, keep the bedroom cool and dark, and try 4-7-8 breathing if your mind races."
  },
  {
    id: "art10",
    title: "Home First-Aid Kit Essentials",
    category: "General Medicine",
    author: "Dr. Teja",
    readTime: "4 min read",
    date: "2024-06-01",
    image: "/api/placeholder/300/200",
    excerpt: "Build a complete home first-aid kit for common injuries and emergencies.",
    content: "Must-haves: antiseptic liquid, gauze, bandages of various sizes, sterile cotton, adhesive tape, scissors, thermometer, BP monitor, ORS sachets, paracetamol, antihistamine, oral rehydration salts, and a torch. Check expiry dates every 6 months."
  }
];

const healthVideos = [
  {
    id: "vid1",
    title: "10-Minute Morning Exercise Routine",
    category: "Fitness",
    duration: "10:23",
    instructor: "Lisa Wilson, PT",
    views: "12.5K",
    thumbnail: "/api/placeholder/300/200",
    description: "Start your day with this energizing 10-minute workout routine designed for all fitness levels."
  },
  {
    id: "vid2",
    title: "Breathing Techniques for Stress Relief",
    category: "Mental Health",
    duration: "8:15",
    instructor: "Dr. James Park",
    views: "8.2K",
    thumbnail: "/api/placeholder/300/200",
    description: "Learn effective breathing techniques to manage stress and anxiety in your daily life."
  },
  {
    id: "vid3",
    title: "Healthy Meal Prep for Busy Professionals",
    category: "Nutrition",
    duration: "15:30",
    instructor: "Chef Maria Rodriguez",
    views: "25.1K",
    thumbnail: "/api/placeholder/300/200",
    description: "Time-saving meal prep strategies for maintaining a healthy diet with a busy schedule."
  },
  { id: "vid4", title: "CPR Basics — Hands-Only Technique", category: "First Aid", duration: "6:48", instructor: "Dr. Teja", views: "47.2K", thumbnail: "/api/placeholder/300/200", description: "Learn the rhythm and depth of chest compressions to save a life." },
  { id: "vid5", title: "Yoga for Lower Back Pain", category: "Fitness", duration: "20:15", instructor: "Asha Iyer, RYT", views: "33.8K", thumbnail: "/api/placeholder/300/200", description: "Gentle yoga poses to relieve chronic lower back pain." },
  { id: "vid6", title: "Diabetic-Friendly Indian Recipes", category: "Nutrition", duration: "12:05", instructor: "Chef Maria Rodriguez", views: "18.9K", thumbnail: "/api/placeholder/300/200", description: "Tasty diabetic-friendly Indian meals under 400 calories." },
  { id: "vid7", title: "Postpartum Recovery Exercises", category: "Gynecology", duration: "14:30", instructor: "Dr. Neha Reddy", views: "9.6K", thumbnail: "/api/placeholder/300/200", description: "Safe exercises for new mothers in the first 6 weeks." },
  { id: "vid8", title: "Mindfulness for Anxiety Relief", category: "Mental Health", duration: "10:00", instructor: "Dr. James Park", views: "27.3K", thumbnail: "/api/placeholder/300/200", description: "A 10-minute guided mindfulness practice for anxiety." }
];

const healthTips = [
  {
    id: "tip1",
    title: "Stay Hydrated",
    icon: Activity,
    tip: "Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.",
    category: "General Health"
  },
  {
    id: "tip2",
    title: "Regular Exercise",
    icon: Heart,
    tip: "Aim for at least 30 minutes of moderate exercise 5 days a week to improve cardiovascular health.",
    category: "Fitness"
  },
  {
    id: "tip3",
    title: "Adequate Sleep",
    icon: Brain,
    tip: "Get 7-9 hours of quality sleep each night to support mental health and immune function.",
    category: "Sleep Health"
  },
  { id: "tip4", title: "Wash Hands Often", icon: Activity, tip: "Wash hands with soap for at least 20 seconds before meals and after returning home.", category: "Hygiene" },
  { id: "tip5", title: "Limit Salt & Sugar", icon: Heart, tip: "Keep added salt under 5g/day and added sugar under 25g/day to protect your heart and kidneys.", category: "Nutrition" },
  { id: "tip6", title: "Annual Health Check", icon: Activity, tip: "Schedule a full body check-up once a year — early detection saves lives.", category: "Preventive Care" },
  { id: "tip7", title: "Sun Safety", icon: Activity, tip: "Use SPF 30+ sunscreen and avoid direct sun between 11 AM and 4 PM.", category: "Skin Care" },
  { id: "tip8", title: "Mind Your Posture", icon: Brain, tip: "Take a 2-minute stretch break every hour if you work at a desk.", category: "Ergonomics" }
];

export default function HealthEducation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<typeof healthArticles[0] | null>(null);

  const categories = ["all", "Cardiology", "Mental Health", "Endocrinology", "Fitness", "Nutrition", "General Medicine", "Pediatrics", "Gynecology", "Neurology", "First Aid"];

  const filteredArticles = healthArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedArticle(null)}
            className="mb-6"
          >
            ← Back to Articles
          </Button>
          
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">
                {selectedArticle.category}
              </Badge>
              <CardTitle className="text-3xl">{selectedArticle.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-base">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedArticle.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedArticle.readTime}
                </span>
                <span>{selectedArticle.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  {selectedArticle.excerpt}
                </p>
                <div className="text-foreground">
                  {selectedArticle.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Health Education</h1>
          <p className="text-muted-foreground">Learn about health topics from our medical experts</p>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles, videos, and tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="tips">Health Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {article.category}
                    </Badge>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthVideos.map((video) => (
                <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-400" />
                      </div>
                      <Badge variant="secondary" className="absolute bottom-2 right-2">
                        {video.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-2">
                      {video.category}
                    </Badge>
                    <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                    <CardDescription className="mb-3">
                      {video.description}
                    </CardDescription>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                      <span>{video.instructor}</span>
                      <span>{video.views} views</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthTips.map((tip) => (
                <Card key={tip.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-medical-primary/10 rounded-lg">
                        <tip.icon className="h-6 w-6 text-medical-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {tip.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}