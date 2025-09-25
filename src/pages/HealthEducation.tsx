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
    content: "Heart disease remains one of the leading causes of death globally. However, many heart conditions can be prevented through simple lifestyle modifications..."
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
    content: "Mental health is just as important as physical health, yet it often receives less attention. This article explores common mental health conditions..."
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
    content: "Living with diabetes requires consistent daily management. This guide provides practical strategies for monitoring blood sugar..."
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
  }
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
  }
];

export default function HealthEducation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<typeof healthArticles[0] | null>(null);

  const categories = ["all", "Cardiology", "Mental Health", "Endocrinology", "Fitness", "Nutrition"];

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