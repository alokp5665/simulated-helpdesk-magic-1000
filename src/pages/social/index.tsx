import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, PieChart, MessageSquare, Heart, Share2, ThumbsUp, Star, Filter, Bell, Calendar, Check, AlertTriangle, TrendingUp, Activity, BarChart, User, RefreshCw } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line } from "recharts";

interface SocialPost {
  id: string;
  platform: "twitter" | "facebook" | "instagram";
  content: string;
  author: string;
  likes: number;
  shares: number;
  timestamp: Date;
  sentiment: "positive" | "neutral" | "negative";
  responses?: { author: string; content: string; timestamp: Date }[];
}

interface Survey {
  id: string;
  question: string;
  responses: number;
  satisfaction: number;
  timestamp: Date;
}

interface Campaign {
  id: string;
  name: string;
  platform: "twitter" | "facebook" | "instagram" | "all";
  reach: number;
  engagement: number;
  startDate: Date;
  endDate: Date;
}

interface EngagementGoal {
  platform: "twitter" | "facebook" | "instagram" | "all";
  target: number;
  current: number;
}

const indianNames = [
  "Aarav Sharma", "Aditi Patel", "Arjun Mehta", "Ananya Singh", "Aryan Gupta",
  "Diya Verma", "Ishaan Malhotra", "Kavya Agarwal", "Neha Kapoor", "Rahul Joshi",
  "Riya Gupta", "Rohan Singhania", "Sanya Reddy", "Vihaan Choudhury", "Zara Iyer",
  "Vikram Desai", "Tanvi Nair", "Kabir Bose", "Meera Rao", "Dev Kulkarni",
  "Aisha Puri", "Arnav Khanna", "Prisha Bajaj", "Reyansh Bansal", "Sonia Mittal"
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const SENTIMENT_COLORS = {
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#ef4444'
};

const SocialPage = () => {
  const { toast } = useToast();
  const [waveData1, setWaveData1] = useState(Array(10).fill(null).map(() => ({ value: Math.random() * 100 })));
  const [waveData2, setWaveData2] = useState(Array(10).fill(null).map(() => ({ value: Math.random() * 100 })));
  const [interactionRates, setInteractionRates] = useState(Array(7).fill(null).map((_, i) => ({ 
    day: i, 
    rate: 40 + Math.random() * 40
  })));
  const [pieData1, setPieData1] = useState([
    { name: 'Positive', value: 60 },
    { name: 'Neutral', value: 25 },
    { name: 'Negative', value: 15 }
  ]);
  const [pieData2, setPieData2] = useState([
    { name: 'Twitter', value: 40 },
    { name: 'Facebook', value: 30 },
    { name: 'Instagram', value: 30 }
  ]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [goals, setGoals] = useState<EngagementGoal[]>([
    { platform: "all", target: 80, current: 73 },
    { platform: "twitter", target: 75, current: 68 },
    { platform: "facebook", target: 70, current: 72 },
    { platform: "instagram", target: 85, current: 79 }
  ]);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledMessage, setScheduledMessage] = useState("");
  const [scheduledPlatform, setScheduledPlatform] = useState("twitter");
  const [scheduledDate, setScheduledDate] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const displayNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveData1(prevData => [...prevData.slice(1), { value: Math.random() * 100 }]);
      setWaveData2(prevData => [...prevData.slice(1), { value: Math.random() * 100 }]);
      
      setInteractionRates(prevRates => {
        const newRates = [...prevRates];
        const lastValue = newRates[newRates.length - 1].rate;
        const change = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5);
        const newValue = Math.max(40, Math.min(90, lastValue + change));
        
        if (Math.abs(lastValue - newValue) > 3) {
          const direction = newValue > lastValue ? "increased" : "decreased";
          displayNotification(`Interaction Rate ${direction} to ${newValue.toFixed(1)}%`);
        }
        
        newRates.shift();
        newRates.push({ day: newRates[newRates.length - 1].day + 1, rate: newValue });
        return newRates;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPieData1(prevData => {
        const newData = [
          { name: 'Positive', value: 40 + Math.random() * 30 },
          { name: 'Neutral', value: 15 + Math.random() * 20 },
          { name: 'Negative', value: 5 + Math.random() * 20 }
        ];
        
        const newPositive = newData[0].value;
        const prevPositive = prevData[0].value;
        
        if (Math.abs(newPositive - prevPositive) > 5) {
          const direction = newPositive > prevPositive ? "increased" : "decreased";
          displayNotification(`Positive sentiment ${direction} to ${newPositive.toFixed(1)}%`);
        }
        
        return newData;
      });
      
      setPieData2(prevData => {
        const newData = [
          { name: 'Twitter', value: 30 + Math.random() * 20 },
          { name: 'Facebook', value: 20 + Math.random() * 20 },
          { name: 'Instagram', value: 20 + Math.random() * 20 }
        ];
        return newData;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const generatePost = (): SocialPost => {
      const platforms = ["twitter", "facebook", "instagram"] as const;
      const contents = [
        "Love the new EduCare features! 🚀",
        "Great customer service experience with the support team",
        "Quick response time, very helpful in resolving my issue",
        "Having some issues with login on the mobile app",
        "Can someone help me with course enrollment?",
        "Really enjoying the new dashboard layout!",
        "The study materials are excellent, thank you!",
        "Having trouble accessing my assignments",
        "The webinar yesterday was so informative",
        "When will exam results be published?"
      ];
      const randomNameIndex = Math.floor(Math.random() * indianNames.length);
      const randomContentIndex = Math.floor(Math.random() * contents.length);
      const randomPlatformIndex = Math.floor(Math.random() * platforms.length);
      
      let sentiment: "positive" | "neutral" | "negative";
      if (randomContentIndex <= 2 || randomContentIndex === 5 || randomContentIndex === 6 || randomContentIndex === 8) {
        sentiment = "positive";
      } else if (randomContentIndex === 3 || randomContentIndex === 4 || randomContentIndex === 7 || randomContentIndex === 9) {
        sentiment = "neutral";
      } else {
        sentiment = "negative";
      }

      return {
        id: Date.now().toString(),
        platform: platforms[randomPlatformIndex],
        content: contents[randomContentIndex],
        author: indianNames[randomNameIndex],
        likes: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        timestamp: new Date(),
        sentiment,
        responses: Math.random() > 0.5 ? [{
          author: "Support Team",
          content: "Thank you for your feedback! We're here to help.",
          timestamp: new Date()
        }] : undefined
      };
    };

    const interval = setInterval(() => {
      const newPost = generatePost();
      setPosts(prevPosts => [newPost, ...prevPosts.slice(0, 19)]);
      
      if (newPost.sentiment === "negative") {
        displayNotification(`Alert: Negative feedback from ${newPost.author}`);
      } else if (Math.random() > 0.7) {
        displayNotification(`New ${newPost.platform} post from ${newPost.author}`);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const generateCampaign = (): Campaign => {
      const platforms = ["twitter", "facebook", "instagram", "all"] as const;
      const campaignNames = [
        "Summer Enrollment Drive",
        "New Course Launch",
        "Student Success Stories",
        "Faculty Spotlight",
        "Campus Life",
        "Alumni Connect",
        "EduCare Mobile App",
        "Career Services"
      ];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 15);
      
      return {
        id: Date.now().toString(),
        name: campaignNames[Math.floor(Math.random() * campaignNames.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        reach: Math.floor(Math.random() * 10000) + 5000,
        engagement: Math.floor(Math.random() * 30) + 10,
        startDate,
        endDate
      };
    };

    setCampaigns([
      generateCampaign(),
      generateCampaign(),
      generateCampaign(),
      generateCampaign()
    ]);

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * campaigns.length);
      setCampaigns(prevCampaigns => {
        const updated = [...prevCampaigns];
        if (updated[randomIndex]) {
          updated[randomIndex] = {
            ...updated[randomIndex],
            reach: updated[randomIndex].reach + Math.floor(Math.random() * 500),
            engagement: Math.min(100, updated[randomIndex].engagement + Math.floor(Math.random() * 3))
          };
          
          displayNotification(`Campaign Update: ${updated[randomIndex].name} reached ${updated[randomIndex].reach.toLocaleString()} people`);
        }
        return updated;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGoals(prevGoals => {
        const updated = [...prevGoals];
        const randomIndex = Math.floor(Math.random() * updated.length);
        const change = (Math.random() > 0.6 ? 1 : -1) * (Math.random() * 3);
        updated[randomIndex] = {
          ...updated[randomIndex],
          current: Math.max(40, Math.min(95, updated[randomIndex].current + change))
        };
        
        if (Math.abs(change) > 1.5) {
          const platform = updated[randomIndex].platform === "all" 
            ? "Overall" 
            : updated[randomIndex].platform.charAt(0).toUpperCase() + updated[randomIndex].platform.slice(1);
          const direction = change > 0 ? "increased" : "decreased";
          displayNotification(`${platform} engagement ${direction} to ${updated[randomIndex].current.toFixed(1)}%`);
        }
        
        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSchedulePost = () => {
    if (scheduledMessage && scheduledPlatform && scheduledDate) {
      toast({
        title: "Post Scheduled",
        description: `Your post will be published on ${scheduledPlatform} on ${scheduledDate}`,
      });
      setShowScheduler(false);
      setScheduledMessage("");
      setScheduledDate("");
    }
  };

  const filteredPosts = posts.filter(post => {
    if (platformFilter !== "all" && post.platform !== platformFilter) return false;
    if (sentimentFilter !== "all" && post.sentiment !== sentimentFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Social Media Analytics
            </h1>
            <p className="text-muted-foreground mt-2">Real-time insights and engagement metrics</p>
          </div>

          {showNotification && (
            <div className="fixed top-20 right-6 z-50 notification-animate">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>{notificationMessage}</span>
              </div>
            </div>
          )}

          <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="feed" className="text-sm">Social Feed</TabsTrigger>
              <TabsTrigger value="campaigns" className="text-sm">Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-12 gap-6 bentoGrid">
                <Card className="col-span-12 md:col-span-8 glass-card hover-scale">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>Engagement Trends</span>
                    </CardTitle>
                    <CardDescription>
                      Daily interaction rates across all platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={interactionRates}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Interaction Rate']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white' 
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#8884d8" 
                          strokeWidth={3} 
                          dot={{ fill: '#8884d8', r: 6 }}
                          activeDot={{ r: 8, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-4 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Engagement Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {goals.map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="capitalize">
                              {goal.platform === "all" ? "Overall" : goal.platform}
                            </span>
                            <span className={`font-mono ${goal.current >= goal.target ? 'text-green-500' : 'text-amber-500'}`}>
                              {goal.current.toFixed(1)}% / {goal.target}%
                            </span>
                          </div>
                          <Progress 
                            value={(goal.current / goal.target) * 100} 
                            className={`h-2 ${goal.current >= goal.target ? 'bg-secondary' : 'bg-secondary/50'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <PieChart className="h-5 w-5 text-white" />
                      <span>Sentiment Analysis</span>
                    </CardTitle>
                    <CardDescription className="text-white">
                      Distribution of feedback sentiment across platforms
                    </CardDescription>
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
                          className="animate-pulse-slow"
                        >
                          {pieData1.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? SENTIMENT_COLORS.positive : index === 1 ? SENTIMENT_COLORS.neutral : SENTIMENT_COLORS.negative} 
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white' 
                          }}
                          labelStyle={{
                            color: 'white'
                          }}
                          itemStyle={{
                            color: 'white'
                          }}
                        />
                        <Legend formatter={(value) => <span style={{ color: 'white' }}>{value}</span>} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <BarChart className="h-5 w-5 text-white" />
                      <span>Platform Distribution</span>
                    </CardTitle>
                    <CardDescription className="text-white">
                      Engagement breakdown by social media platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={pieData2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" tick={{ fill: 'white' }} />
                        <YAxis tick={{ fill: 'white' }} />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Engagement']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white' 
                          }}
                          labelStyle={{
                            color: 'white'
                          }}
                          itemStyle={{
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="value">
                          {pieData2.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </ReBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="feed" className="space-y-6">
              <div className="grid grid-cols-12 gap-6 bentoGrid">
                <Card className="col-span-12 glass-card">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex gap-2">
                        <Select 
                          value={platformFilter} 
                          onValueChange={setPlatformFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={sentimentFilter} 
                          onValueChange={setSentimentFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sentiment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sentiments</SelectItem>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="negative">Negative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Button onClick={() => setShowScheduler(true)} className="premium-button">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Post
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-8 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span>Social Feed</span>
                    </CardTitle>
                    <CardDescription>
                      Recent posts and interactions across platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {filteredPosts.map(post => (
                          <div key={post.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors response-card">
                            <div className="flex items-center space-x-3 mb-3">
                              <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author.replace(" ", "+")}`} />
                                <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{post.author}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-muted-foreground">
                                    via {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                                  </p>
                                  <Badge variant={
                                    post.sentiment === "positive" ? "success" : 
                                    post.sentiment === "neutral" ? "warning" : "destructive"
                                  }>
                                    {post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="ml-auto text-xs text-muted-foreground">
                                {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                              <div className="ml-auto">
                                <Button variant="ghost" size="sm">Reply</Button>
                                <Button variant="ghost" size="sm">Mark Resolved</Button>
                              </div>
                            </div>
                            {post.responses && (
                              <div className="mt-3 pl-4 border-l-2 border-primary/30">
                                {post.responses.map((response, idx) => (
                                  <div key={idx} className="mt-2">
                                    <div className="flex items-center">
                                      <Avatar className="h-6 w-6 mr-2">
                                        <AvatarFallback className="text-xs">{response.author[0]}</AvatarFallback>
                                      </Avatar>
                                      <p className="text-sm font-medium">{response.author}</p>
                                    </div>
                                    <p className="text-sm ml-8">{response.content}</p>
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

                <div className="col-span-12 md:col-span-4 space-y-6">
                  <Card className="glass-card hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <span>Quick Stats</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                          <div className="flex items-center">
                            <div className="mr-3 p-2 bg-blue-500/10 rounded-full">
                              <MessageSquare className="h-5 w-5 text-blue-500" />
                            </div>
                            <span>Total Posts</span>
                          </div>
                          <span className="font-mono font-bold">{posts.length}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                          <div className="flex items-center">
                            <div className="mr-3 p-2 bg-green-500/10 rounded-full">
                              <ThumbsUp className="h-5 w-5 text-green-500" />
                            </div>
                            <span>Positive</span>
                          </div>
                          <span className="font-mono font-bold">
                            {posts.filter(p => p.sentiment === "positive").length}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                          <div className="flex items-center">
                            <div className="mr-3 p-2 bg-red-500/10 rounded-full">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <span>Negative</span>
                          </div>
                          <span className="font-mono font-bold">
                            {posts.filter(p => p.sentiment === "negative").length}
                          </span>
                        </div>
                        
                        <Button className="w-full" variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh Stats
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>Response Templates</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          "Thank you for your feedback! We're glad you had a positive experience.",
                          "We appreciate your feedback and will work on improving this aspect.",
                          "We're sorry you had this experience. Our team will contact you shortly.",
                          "Thanks for bringing this to our attention. We'll look into it right away."
                        ].map((template, i) => (
                          <div key={i} className="p-3 rounded-lg bg-background/50 cursor-pointer hover:bg-background transition-colors">
                            <p className="text-sm">{template}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <div className="grid grid-cols-12 gap-6 bentoGrid">
                <Card className="col-span-12 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>Campaign Performance</span>
                    </CardTitle>
                    <CardDescription>
                      Active social media campaigns and their metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {campaigns.map(campaign => (
                        <div 
                          key={campaign.id} 
                          className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors response-card"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium text-lg">{campaign.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">{campaign.platform}</p>
                            </div>
                            <Badge variant={campaign.engagement > 20 ? "success" : "default"}>
                              {campaign.engagement}% Engagement
                            </Badge>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Reach</span>
                              <span className="font-mono">{campaign.reach.toLocaleString()}</span>
                            </div>
                            <Progress 
                              value={(campaign.reach / 15000) * 100} 
                              className="h-2"
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Started: {campaign.startDate.toLocaleDateString()}</span>
                            <span>Ends: {campaign.endDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {showScheduler && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Schedule Social Media Post</CardTitle>
                  <CardDescription>
                    Create and schedule your post across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea 
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={scheduledMessage}
                        onChange={(e) => setScheduledMessage(e.target.value)}
                        placeholder="Type your message here..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform</label>
                      <Select 
                        value={scheduledPlatform} 
                        onValueChange={setScheduledPlatform}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="all">All Platforms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Schedule Date</label>
                      <Input 
                        type="datetime-local" 
                        value={scheduledDate} 
                        onChange={(e) => setScheduledDate(e.target.value)} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setShowScheduler(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSchedulePost}>
                    Schedule Post
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SocialPage;
