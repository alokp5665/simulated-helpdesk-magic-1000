
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart, ResponsiveContainer, Line, XAxis, Bar, Cell } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ClipboardList, BarChart3, Users, Star, TrendingUp } from "lucide-react";

interface SurveyResponse {
  id: string;
  respondent: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  responses: SurveyResponse[];
  responseRate: number;
  averageRating: number;
  createdAt: Date;
}

const FIRST_NAMES = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"];
const COMMENTS = [
  "Great service, very satisfied!",
  "Could be better, but overall good",
  "Excellent support team",
  "Response time needs improvement",
  "Very professional service",
  "Highly recommended"
];

const SURVEY_TITLES = [
  "Customer Satisfaction Survey",
  "Product Feedback",
  "Support Experience",
  "Website Usability",
  "Service Quality Assessment"
];

const SurveysPage = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responseRates, setResponseRates] = useState<{ timestamp: number; rate: number }[]>(
    Array(10).fill(0).map((_, i) => ({
      timestamp: Date.now() - (9 - i) * 3000,
      rate: 75 + Math.random() * 15
    }))
  );

  // Generate initial surveys
  useEffect(() => {
    const generateResponse = (): SurveyResponse => ({
      id: Date.now().toString(),
      respondent: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${
        LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
      }`,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: COMMENTS[Math.floor(Math.random() * COMMENTS.length)],
      timestamp: new Date()
    });

    const generateSurvey = (): Survey => {
      const responses = Array(Math.floor(Math.random() * 20) + 5)
        .fill(null)
        .map(generateResponse);

      return {
        id: Date.now().toString(),
        title: SURVEY_TITLES[Math.floor(Math.random() * SURVEY_TITLES.length)],
        description: "Help us improve our service by providing your feedback.",
        responses,
        responseRate: 60 + Math.random() * 30,
        averageRating: responses.reduce((acc, r) => acc + r.rating, 0) / responses.length,
        createdAt: new Date()
      };
    };

    setSurveys(Array(5).fill(null).map(generateSurvey));
  }, []);

  // Update response rates
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseRates(prev => [
        ...prev.slice(1),
        { timestamp: Date.now(), rate: 75 + Math.random() * 15 }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add new responses randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setSurveys(prev => prev.map(survey => {
        if (Math.random() > 0.7) {
          const newResponse = {
            id: Date.now().toString(),
            respondent: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${
              LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
            }`,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: COMMENTS[Math.floor(Math.random() * COMMENTS.length)],
            timestamp: new Date()
          };
          
          return {
            ...survey,
            responses: [...survey.responses, newResponse],
            responseRate: Math.min(100, survey.responseRate + Math.random() * 5),
            averageRating: [...survey.responses, newResponse].reduce((acc, r) => acc + r.rating, 0) / 
              (survey.responses.length + 1)
          };
        }
        return survey;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Response Rate Chart */}
            <Card className="col-span-12 lg:col-span-8 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Real-time Response Rate</span>
                  </div>
                  <Badge variant="secondary" className="animate-pulse">
                    Live Updates
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseRates}>
                      <XAxis dataKey="timestamp" />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={false}
                        className="animate-draw"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Survey Stats */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Survey Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {surveys.map(survey => (
                    <div key={survey.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{survey.title}</h3>
                        <Badge variant="outline">
                          {survey.responses.length} Responses
                        </Badge>
                      </div>
                      <Progress value={survey.responseRate} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Response Rate: {survey.responseRate.toFixed(1)}%</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{survey.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Latest Responses */}
            <Card className="col-span-12 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <span>Latest Responses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {surveys.flatMap(survey => 
                      survey.responses.slice(-3).map(response => (
                        <div
                          key={response.id}
                          className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>
                                {response.respondent.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{response.respondent}</p>
                              <p className="text-sm text-muted-foreground">
                                {response.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{survey.title}</p>
                            <p className="text-sm">{response.comment}</p>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < response.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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

export default SurveysPage;
