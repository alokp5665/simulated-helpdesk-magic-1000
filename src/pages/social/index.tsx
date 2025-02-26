
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, MessageSquare, Heart, Share2, ThumbsUp, Star } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

interface SocialPost {
  id: string;
  platform: "twitter" | "facebook" | "instagram";
  content: string;
  author: string;
  likes: number;
  shares: number;
  timestamp: Date;
  responses?: { author: string; content: string; timestamp: Date }[];
}

interface Survey {
  id: string;
  question: string;
  responses: number;
  satisfaction: number;
  timestamp: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SocialPage = () => {
  const [waveData1, setWaveData1] = useState(Array(10).fill(0).map(() => ({ value: Math.random() * 100 })));
  const [waveData2, setWaveData2] = useState(Array(10).fill(0).map(() => ({ value: Math.random() * 100 })));
  const [pieData1, setPieData1] = useState([
    { name: 'Positive', value: 60 },
    { name: 'Neutral', value: 25 },
    { name: 'Negative', value: 15 }
  ]);
  const [pieData2, setPieData2] = useState([
    { name: 'Facebook', value: 40 },
    { name: 'Twitter', value: 30 },
    { name: 'Instagram', value: 30 }
  ]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  // Update wave graphs
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveData1(prev => [...prev.slice(1), { value: Math.random() * 100 }]);
      setWaveData2(prev => [...prev.slice(1), { value: Math.random() * 100 }]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update pie charts
  useEffect(() => {
    const interval = setInterval(() => {
      setPieData1([
        { name: 'Positive', value: 40 + Math.random() * 30 },
        { name: 'Neutral', value: 15 + Math.random() * 20 },
        { name: 'Negative', value: 5 + Math.random() * 20 }
      ]);
      setPieData2([
        { name: 'Facebook', value: 30 + Math.random() * 20 },
        { name: 'Twitter', value: 20 + Math.random() * 20 },
        { name: 'Instagram', value: 20 + Math.random() * 20 }
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Simulate social media posts
  useEffect(() => {
    const generatePost = (): SocialPost => {
      const platforms = ["twitter", "facebook", "instagram"] as const;
      const contents = [
        "Loving the new features! 🚀",
        "Great customer service experience",
        "Quick response time, very helpful",
        "Having some issues with the app",
        "Can someone help me with setup?"
      ];
      const names = ["Alex Smith", "Maria Garcia", "James Lee", "Sarah Johnson"];

      return {
        id: Date.now().toString(),
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        content: contents[Math.floor(Math.random() * contents.length)],
        author: names[Math.floor(Math.random() * names.length)],
        likes: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        timestamp: new Date(),
        responses: Math.random() > 0.5 ? [{
          author: "Support Team",
          content: "Thank you for your feedback! We're here to help.",
          timestamp: new Date()
        }] : undefined
      };
    };

    const interval = setInterval(() => {
      setPosts(prev => [generatePost(), ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate surveys
  useEffect(() => {
    const generateSurvey = (): Survey => {
      const questions = [
        "How satisfied are you with our service?",
        "Would you recommend us to others?",
        "Rate your recent support experience",
        "How likely are you to use our service again?"
      ];

      return {
        id: Date.now().toString(),
        question: questions[Math.floor(Math.random() * questions.length)],
        responses: Math.floor(Math.random() * 100) + 50,
        satisfaction: Math.floor(Math.random() * 5) + 1,
        timestamp: new Date()
      };
    };

    const interval = setInterval(() => {
      setSurveys(prev => [generateSurvey(), ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Wave Analytics 1 */}
            <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Engagement Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={waveData1}>
                    <defs>
                      <linearGradient id="colorWave1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0EA5E9"
                      fillOpacity={1}
                      fill="url(#colorWave1)"
                      className="ocean-wave"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Wave Analytics 2 */}
            <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Interaction Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={waveData2}>
                    <defs>
                      <linearGradient id="colorWave2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#colorWave2)"
                      className="ocean-wave"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart 1 */}
            <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>Sentiment Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData1}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      className="animate-spin-slow"
                    >
                      {pieData1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart 2 */}
            <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>Platform Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData2}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      className="animate-spin-slow"
                    >
                      {pieData2.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Social Feed */}
            <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Social Feed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{post.author}</p>
                            <p className="text-sm text-muted-foreground">
                              via {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                            </p>
                          </div>
                        </div>
                        <p className="mb-3">{post.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-4 w-4" />
                            <span>{post.shares}</span>
                          </div>
                        </div>
                        {post.responses && (
                          <div className="mt-3 pl-4 border-l-2">
                            {post.responses.map((response, idx) => (
                              <div key={idx} className="mt-2">
                                <p className="text-sm font-medium">{response.author}</p>
                                <p className="text-sm">{response.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Surveys and Feedback */}
            <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Customer Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {surveys.map(survey => (
                      <div key={survey.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                        <h3 className="font-medium mb-2">{survey.question}</h3>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4 text-primary" />
                            <span className="text-sm">{survey.responses} responses</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${idx < survey.satisfaction ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created {survey.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocialPage;
