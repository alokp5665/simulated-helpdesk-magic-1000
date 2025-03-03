import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BarChart, LineChart, PieChart, ResponsiveContainer, 
  Line, XAxis, Bar, Cell, Pie, Tooltip as RechartsTooltip
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { 
  ClipboardList, BarChart3, Users, Star, TrendingUp, 
  Search, Filter, Plus, Send, Bell, Calendar, ThumbsUp,
  ThumbsDown, Smile, Frown, Meh, MessageSquare, RefreshCw,
  ChevronUp, ChevronDown, CheckCircle, XCircle, AlertTriangle,
  Award, Target, PieChart as PieChartIcon, Clock
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";

// Indian Hindu Names
const FIRST_NAMES = [
  "Aarav", "Arjun", "Vivaan", "Dhruv", "Vihaan", 
  "Advik", "Aditya", "Rohan", "Vikram", "Aryan",
  "Ananya", "Diya", "Saanvi", "Anika", "Ishita", 
  "Aadhya", "Kavya", "Avni", "Nisha", "Meera"
];

const LAST_NAMES = [
  "Sharma", "Patel", "Deshpande", "Gupta", "Singh",
  "Joshi", "Malhotra", "Agarwal", "Verma", "Reddy",
  "Kapoor", "Mehta", "Iyer", "Nair", "Desai"
];

const COMMENTS = [
  "Excellent service, very satisfied with the customer support!",
  "The product quality is good but delivery was delayed.",
  "Your team was extremely professional and helpful.",
  "Response time needs significant improvement.",
  "Great value for money, will definitely recommend to others!",
  "Had a few issues initially but your team resolved them quickly.",
  "The new features are amazing and very user-friendly!",
  "Could use more personalization options in the dashboard.",
  "Very impressed with the quality of service provided.",
  "Interface is intuitive but some sections are confusing."
];

const SURVEY_TITLES = [
  "Customer Satisfaction Survey",
  "Product Feedback",
  "Support Experience",
  "Website Usability",
  "Service Quality Assessment",
  "Employee Engagement Survey",
  "Market Research Analysis",
  "User Experience Feedback"
];

interface SurveyResponse {
  id: string;
  respondent: string;
  rating: number;
  comment: string;
  timestamp: Date;
  sentiment: "positive" | "neutral" | "negative";
  resolved: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  responses: SurveyResponse[];
  responseRate: number;
  averageRating: number;
  createdAt: Date;
  completionRate: number;
  targetRate: number;
  department: string;
}

interface AgentPerformance {
  name: string;
  responseRate: number;
  averageRating: number;
  responsesCount: number;
}

// Helper function to determine sentiment based on rating
const getSentiment = (rating: number): "positive" | "neutral" | "negative" => {
  if (rating >= 4) return "positive";
  if (rating >= 3) return "neutral";
  return "negative";
};

// Helper function to generate a random Indian name
const getRandomIndianName = () => {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${
    LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  }`;
};

const responseBreakdownData = [
  { name: 'Sales', responses: 86, fill: '#3070f4' },
  { name: 'Support', responses: 114, fill: '#3070f4' },
  { name: 'Marketing', responses: 73, fill: '#3070f4' },
  { name: 'Development', responses: 91, fill: '#3070f4' },
  { name: 'HR', responses: 57, fill: '#3070f4' }
];

const SurveysPage = () => {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responseRates, setResponseRates] = useState<{ timestamp: number; rate: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [feedbackTrend, setFeedbackTrend] = useState<{ month: string; positive: number; neutral: number; negative: number }[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [latestNotification, setLatestNotification] = useState("");
  const [targetResponseRate, setTargetResponseRate] = useState(80);
  const [responseFilter, setResponseFilter] = useState("all");

  // Generate initial surveys
  useEffect(() => {
    setIsLoading(true);
    
    const generateResponse = (): SurveyResponse => {
      const rating = Math.floor(Math.random() * 5) + 1;
      return {
        id: Date.now().toString() + Math.random().toString(),
        respondent: getRandomIndianName(),
        rating: rating,
        comment: COMMENTS[Math.floor(Math.random() * COMMENTS.length)],
        timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000), // Random time in the last 48 hours
        sentiment: getSentiment(rating),
        resolved: Math.random() > 0.7 // 30% chance of being resolved
      };
    };

    const departments = ["Sales", "Support", "Marketing", "Development", "HR"];

    const generateSurvey = (): Survey => {
      const responses = Array(Math.floor(Math.random() * 20) + 5)
        .fill(null)
        .map(generateResponse);

      return {
        id: Date.now().toString() + Math.random().toString(),
        title: SURVEY_TITLES[Math.floor(Math.random() * SURVEY_TITLES.length)],
        description: "Help us improve our service by providing your valuable feedback.",
        responses,
        responseRate: 60 + Math.random() * 30,
        averageRating: responses.reduce((acc, r) => acc + r.rating, 0) / responses.length,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in the last month
        completionRate: 50 + Math.random() * 40,
        targetRate: 75 + Math.random() * 15,
        department: departments[Math.floor(Math.random() * departments.length)]
      };
    };

    const initialSurveys = Array(5).fill(null).map(generateSurvey);
    setSurveys(initialSurveys);

    // Generate initial response rates
    const initialRates = Array(10).fill(0).map((_, i) => ({
      timestamp: Date.now() - (9 - i) * 3000,
      rate: 75 + Math.random() * 15
    }));
    setResponseRates(initialRates);

    // Generate agent performance data
    const generateAgentPerformance = (): AgentPerformance[] => {
      return Array(8).fill(null).map(() => ({
        name: getRandomIndianName(),
        responseRate: 60 + Math.random() * 35,
        averageRating: 3 + Math.random() * 2,
        responsesCount: Math.floor(Math.random() * 50) + 10
      }));
    };
    setAgentPerformance(generateAgentPerformance());

    // Generate feedback trends
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const trends = months.map(month => ({
      month,
      positive: 20 + Math.random() * 30,
      neutral: 10 + Math.random() * 20,
      negative: 5 + Math.random() * 15
    }));
    setFeedbackTrend(trends);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Update response rates
  useEffect(() => {
    const interval = setInterval(() => {
      const newRate = 75 + Math.random() * 15;
      setResponseRates(prevRates => [
        ...prevRates.slice(1),
        { timestamp: Date.now(), rate: newRate }
      ]);
      
      // Occasionally show rate change notification
      if (Math.random() > 0.7) {
        const message = `Response Rate ${newRate > responseRates[responseRates.length-1]?.rate ? 'increased' : 'decreased'} to ${newRate.toFixed(1)}%`;
        setLatestNotification(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [responseRates]);

  // Add new responses randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setSurveys(prev => {
          const updatedSurveys = [...prev];
          const randomSurveyIndex = Math.floor(Math.random() * updatedSurveys.length);
          const rating = Math.floor(Math.random() * 5) + 1;
          const respondent = getRandomIndianName();
          
          const newResponse = {
            id: Date.now().toString() + Math.random().toString(),
            respondent,
            rating,
            comment: COMMENTS[Math.floor(Math.random() * COMMENTS.length)],
            timestamp: new Date(),
            sentiment: getSentiment(rating),
            resolved: false
          };
          
          const updatedSurvey = {
            ...updatedSurveys[randomSurveyIndex],
            responses: [...updatedSurveys[randomSurveyIndex].responses, newResponse],
            responseRate: Math.min(100, updatedSurveys[randomSurveyIndex].responseRate + Math.random() * 5),
            averageRating: [...updatedSurveys[randomSurveyIndex].responses, newResponse].reduce((acc, r) => acc + r.rating, 0) / 
              (updatedSurveys[randomSurveyIndex].responses.length + 1)
          };
          
          updatedSurveys[randomSurveyIndex] = updatedSurvey;
          
          // Show notification for negative feedback
          if (rating <= 2) {
            const alertMessage = `Alert: Negative feedback from ${respondent}`;
            toast({
              title: "Negative Feedback Alert",
              description: alertMessage,
              variant: "destructive"
            });
          }
          
          // Show notification for new feedback
          if (Math.random() > 0.5) {
            const newFeedbackMsg = `New feedback from ${respondent}`;
            setLatestNotification(newFeedbackMsg);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
          }
          
          return updatedSurveys;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [toast]);

  // Update agent performance randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setAgentPerformance(prev => {
          const updated = [...prev];
          const randomIndex = Math.floor(Math.random() * updated.length);
          updated[randomIndex] = {
            ...updated[randomIndex],
            responseRate: Math.min(100, updated[randomIndex].responseRate + (Math.random() * 10 - 5)),
            averageRating: Math.min(5, Math.max(1, updated[randomIndex].averageRating + (Math.random() - 0.5) / 2))
          };
          return updated;
        });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Handle response to feedback
  const handleRespondToFeedback = useCallback((surveyId: string, responseId: string) => {
    setSurveys(prev => 
      prev.map(survey => {
        if (survey.id === surveyId) {
          return {
            ...survey,
            responses: survey.responses.map(response => {
              if (response.id === responseId) {
                return {
                  ...response,
                  resolved: true
                };
              }
              return response;
            })
          };
        }
        return survey;
      })
    );
    
    toast({
      title: "Response Sent",
      description: "Your response has been sent to the customer.",
    });
  }, [toast]);

  // Filter surveys based on search term
  const filteredSurveys = surveys.filter(survey => 
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter responses based on sentiment
  const getFilteredResponses = useCallback(() => {
    let allResponses = surveys.flatMap(survey => 
      survey.responses.map(response => ({...response, surveyId: survey.id, surveyTitle: survey.title}))
    );
    
    // Sort by timestamp (newest first)
    allResponses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply filter
    if (responseFilter !== "all") {
      allResponses = allResponses.filter(response => response.sentiment === responseFilter);
    }
    
    return allResponses.slice(0, 12);
  }, [surveys, responseFilter]);

  // Get sentiment class for color coding
  const getSentimentClass = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get sentiment icon
  const getSentimentIcon = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
      case 'neutral': return <Meh className="h-4 w-4 text-yellow-500" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  // Handle creating a new survey
  const handleCreateSurvey = () => {
    toast({
      title: "New Survey Created",
      description: "Your new survey has been created and is ready to be sent."
    });
  };
  
  // Handle downloading report
  const handleDownloadReport = () => {
    toast({
      title: "Report Download Successful",
      description: "Your report has been downloaded successfully."
    });
  };

  // Calculate overall statistics
  const totalResponses = surveys.reduce((total, survey) => total + survey.responses.length, 0);
  const averageSatisfaction = surveys.reduce((total, survey) => total + survey.averageRating, 0) / surveys.length;
  const positiveFeedbackPercentage = surveys.reduce((total, survey) => {
    const positiveCount = survey.responses.filter(r => r.sentiment === 'positive').length;
    return total + (positiveCount / survey.responses.length) * 100;
  }, 0) / surveys.length;

  // Data for sentiment distribution pie chart
  const sentimentData = [
    { name: 'Positive', value: Math.round(positiveFeedbackPercentage), fill: '#22c55e' },
    { name: 'Neutral', value: Math.round((100 - positiveFeedbackPercentage) * 0.6), fill: '#eab308' },
    { name: 'Negative', value: Math.round((100 - positiveFeedbackPercentage) * 0.4), fill: '#ef4444' }
  ];
  
  

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      {/* Main content */}
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1600px] mx-auto">
          {/* Top notification */}
          {showNotification && (
            <div className="fixed top-20 right-6 z-50 animate-fade-in">
              <div className="bg-primary text-white p-3 rounded-lg shadow-lg flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>{latestNotification}</span>
              </div>
            </div>
          )}
          
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Survey Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Analyze survey responses and feedback from customers.
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search surveys..."
                  className="pl-9 w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateSurvey} className="flex items-center gap-2 transition-all hover:scale-105">
                <Plus className="h-4 w-4" />
                <span>New Survey</span>
              </Button>
            </div>
          </div>
          
          {/* Stats cards row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <AnalyticsCard
              title="Total Responses"
              value={totalResponses}
              icon={<Users className="h-5 w-5 text-primary" />}
              description={`+${Math.floor(Math.random() * 20 + 5)} in the last 24 hours`}
              className="hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300"
            />
            <AnalyticsCard
              title="Average Rating"
              value={averageSatisfaction.toFixed(1)}
              icon={<Star className="h-5 w-5 text-yellow-500" />}
              description={`${(averageSatisfaction / 5 * 100).toFixed(1)}% satisfaction rate`}
              className="hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300"
            />
            <AnalyticsCard
              title="Completion Rate"
              value={`${Math.round(surveys.reduce((acc, s) => acc + s.completionRate, 0) / surveys.length)}%`}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              description="Based on all active surveys"
              className="hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300"
            />
            <AnalyticsCard
              title="Response Time"
              value="4.2 hrs"
              icon={<Clock className="h-5 w-5 text-blue-500" />}
              description="Average time to first response"
              className="hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300"
            />
          </div>
          
          {/* Bento grid layout for main content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Response Rate Chart */}
            <Card className="col-span-12 lg:col-span-8 glass-card hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Real-time Response Rate</span>
                </CardTitle>
                <Badge variant="secondary" className="animate-pulse flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Live Updates
                </Badge>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading response data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={responseRates}>
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">Response Rate</p>
                                  <p className="text-lg font-bold text-primary">
                                    {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#A855F7' }}
                          className="animate-draw"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-medium">Target Response Rate:</span>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={targetResponseRate}
                        onChange={(e) => setTargetResponseRate(Number(e.target.value))}
                        className="w-20 h-8 text-center"
                        min={1}
                        max={100}
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">Current vs. Target:</span>
                    <div className="flex items-center">
                      {responseRates.length > 0 && (
                        <Badge 
                          className={responseRates[responseRates.length - 1].rate >= targetResponseRate 
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"}
                        >
                          {responseRates[responseRates.length - 1].rate.toFixed(1)}% / {targetResponseRate}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card className="col-span-12 lg:col-span-4 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  <span>Sentiment Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          className="transition-all duration-300"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80" />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value) => [`${value}%`, 'Percentage']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Positive</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Neutral</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">Negative</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Trends */}
            <Card className="col-span-12 md:col-span-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Feedback Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[250px] flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={feedbackTrend}>
                        <XAxis dataKey="month" />
                        <RechartsTooltip 
                          formatter={(value, name) => {
                            return [`${value}%`, typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name];
                          }}
                        />
                        <Bar dataKey="positive" name="Positive" fill="#22c55e" />
                        <Bar dataKey="neutral" name="Neutral" fill="#eab308" />
                        <Bar dataKey="negative" name="Negative" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  <p className="font-medium">Monthly Trend Analysis:</p>
                  <p>Positive feedback increased by 10% this month</p>
                </div>
              </CardContent>
            </Card>

            {/* Response Breakdown */}
            <Card className="col-span-12 md:col-span-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Response Breakdown by Department</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[250px] flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={responseBreakdownData} layout="vertical">
                        <XAxis type="number" />
                        <RechartsTooltip 
                          formatter={(value) => [`${value} responses`, 'Total']}
                        />
                        <Bar dataKey="responses">
                          {responseBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>Filter by department:</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-7 px-2">Sales</Button>
                    <Button variant="outline" size="sm" className="h-7 px-2">Support</Button>
                    <Button variant="outline" size="sm" className="h-7 px-2">All</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Performance */}
            <Card className="col-span-12 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Agent Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-60 space-y-3">
                    {Array(5).fill(null).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Agent</TableHead>
                          <TableHead>Response Rate</TableHead>
                          <TableHead>Average Rating</TableHead>
                          <TableHead className="text-right">Responses</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agentPerformance
                          .sort((a, b) => b.responseRate - a.responseRate)
                          .slice(0, 5)
                          .map((agent, index) => (
                            <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/20">
                                      {agent.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
