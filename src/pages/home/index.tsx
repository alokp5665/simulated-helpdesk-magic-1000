import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { 
  Search, ArrowRight, Sparkles, 
  CheckCircle2, AlertCircle, BarChart3, 
  Users, Zap, Shield, Award, ArrowUpRight,
  RefreshCcw, Clock, BookOpen, ChevronRight, 
  PanelRight, Star, Mail, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

// Knowledge tips for the "Did you know?" feature
const knowledgeTips = [
  "You can create automation rules to automatically assign tickets based on keywords in the subject line.",
  "Keyboard shortcuts can significantly speed up your ticket processing. Press 'K' to view all available shortcuts.",
  "You can merge duplicate tickets to keep your helpdesk organized and provide a unified response to customers.",
  "Setting up canned responses for common questions can save your agents hours of repetitive typing each week.",
  "The 'Snooze' feature lets you temporarily hide tickets until they need attention again.",
  "PrimeCare Helpdesk can automatically suggest relevant knowledge base articles when agents are responding to tickets.",
  "You can schedule reports to be automatically emailed to stakeholders on a regular basis.",
  "Internal notes allow agents to collaborate on tickets without the customer seeing these comments.",
  "Tags can be used to categorize tickets and create powerful reports on specific types of issues.",
  "The collision detection feature alerts agents when multiple people are viewing or replying to the same ticket.",
  "Use SLA policies to ensure your team meets response time commitments to customers.",
  "The 'Customer Satisfaction Score' feature automatically surveys customers after their tickets are resolved.",
  "You can create custom ticket fields to collect specific information needed for your support process.",
  "Time tracking features allow you to measure how much time is spent on different types of support issues.",
  "The knowledge base analytics show which articles are most viewed, helping you improve your self-service content.",
];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentTip, setCurrentTip] = useState(knowledgeTips[0]);

  const goToContact = () => {
    navigate("/contact");
  };

  // Change the tip every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = knowledgeTips[Math.floor(Math.random() * knowledgeTips.length)];
      setCurrentTip(randomTip);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12 fade-in">
            <div className="rounded-xl overflow-hidden glass-card p-8 hover-scale">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-4 text-foreground flex items-center">
                    Welcome to EduCare Hub
                    <span className="ml-3 text-xs font-normal bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Enterprise Edition
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    The complete project management solution for growing teams
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                      <span>Streamline customer conversations across all channels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                      <span>Automate routine tasks with intelligent workflows</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                      <span>Gain insights with advanced reporting and analytics</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <Button 
                      size="lg" 
                      className="gap-2"
                      onClick={goToContact}
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="aspect-video bg-primary/10 rounded-xl overflow-hidden relative">
                    {/* Placeholder for hero image or animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg text-center">
                        <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-medium">Interactive Dashboard Demo</p>
                        <Button variant="link" size="sm" className="mt-1">
                          Play Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Cards Section */}
          <div className="mb-12 fade-in">
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-card hover-scale">
                <CardHeader>
                  <div className="p-2 w-fit rounded-full bg-blue-100">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="mt-4">Omnichannel Support</CardTitle>
                  <CardDescription>
                    Manage customer conversations across email, chat, phone, and social media
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Provide seamless support across all communication channels from a single unified inbox.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" onClick={goToContact}>
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="glass-card hover-scale">
                <CardHeader>
                  <div className="p-2 w-fit rounded-full bg-amber-100">
                    <Zap className="h-5 w-5 text-amber-600" />
                  </div>
                  <CardTitle className="mt-4">Smart Automation</CardTitle>
                  <CardDescription>
                    Create intelligent workflows to handle routine tasks automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Build custom rules to route, prioritize, and assign tickets based on your business logic.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" onClick={goToContact}>
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="glass-card hover-scale">
                <CardHeader>
                  <div className="p-2 w-fit rounded-full bg-green-100">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="mt-4">Advanced Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive reporting to track performance and identify trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gain actionable insights into team performance, customer satisfaction, and support trends.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" onClick={goToContact}>
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="glass-card hover-scale">
                <CardHeader>
                  <div className="p-2 w-fit rounded-full bg-purple-100">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="mt-4">Knowledge Base</CardTitle>
                  <CardDescription>
                    Create a self-service support center with searchable articles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Empower customers to find answers on their own and reduce repetitive support queries.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" onClick={goToContact}>
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="glass-card hover-scale">
                <CardHeader>
                  <div className="p-2 w-fit rounded-full bg-red-100">
                    <Users className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle className="mt-4">Team Collaboration</CardTitle>
                  <CardDescription>
                    Tools to help your support team work together efficiently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Collaborate on tickets with internal notes, @mentions, and shared ticket views.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" onClick={goToContact}>
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="glass-card hover-scale">
                <CardHeader>
                  <div className="p-2 w-fit rounded-full bg-pink-100">
                    <Shield className="h-5 w-5 text-pink-600" />
                  </div>
                  <CardTitle className="mt-4">SLA Management</CardTitle>
                  <CardDescription>
                    Define and track service level agreements for customer support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Set response and resolution time targets with automatic escalations and tracking.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" onClick={goToContact}>
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mb-12 fade-in">
            <Card className="glass-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-8 text-center">Trusted by Support Teams Worldwide</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                    <p className="text-sm text-muted-foreground">Companies</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">25M+</div>
                    <p className="text-sm text-muted-foreground">Tickets Resolved</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">98%</div>
                    <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">30min</div>
                    <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Solutions Tabs */}
          <div className="mb-12 fade-in">
            <h2 className="text-2xl font-bold mb-6">Solutions For Every Team</h2>
            <Tabs defaultValue="support" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="support">Customer Support</TabsTrigger>
                <TabsTrigger value="it">IT Help Desk</TabsTrigger>
                <TabsTrigger value="hr">HR Services</TabsTrigger>
                <TabsTrigger value="field">Field Service</TabsTrigger>
              </TabsList>
              
              <TabsContent value="support" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">Customer Support Solutions</h3>
                        <p className="text-muted-foreground mb-4">
                          Deliver exceptional customer support across all channels, reduce response times, and increase satisfaction scores.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Unified customer communication hub</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Automated ticket routing and prioritization</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Customer satisfaction tracking</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Self-service knowledge base</span>
                          </li>
                        </ul>
                        <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                      </div>
                    </CardContent>
                    <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                      <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                        <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Customer-Centric Support</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "PrimeCare transformed our support operations, reducing our average response time by 65% and increasing CSAT scores by 28%."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Sarah Johnson, CX Director at TechGlobal</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="it" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">IT Help Desk Solutions</h3>
                        <p className="text-muted-foreground mb-4">
                          Streamline internal IT support, resolve issues faster, and maintain detailed asset management.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Incident and problem management</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>IT asset tracking and management</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Change request workflows</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Service catalog for common requests</span>
                          </li>
                        </ul>
                        <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                      </div>
                    </CardContent>
                    <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                      <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                        <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                          <PanelRight className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">IT Support Excellence</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "Our IT team now resolves tickets 40% faster, and our asset management is completely streamlined thanks to PrimeCare's IT solutions."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Michael Chen, IT Director at Finova</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="hr" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">HR Service Desk Solutions</h3>
                        <p className="text-muted-foreground mb-4">
                          Simplify employee requests, automate onboarding and offboarding, and maintain detailed HR documentation.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Employee self-service portal</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Onboarding & offboarding workflows</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Benefits and policy management</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Secure document handling</span>
                          </li>
                        </ul>
                        <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                      </div>
                    </CardContent>
                    <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                      <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                        <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">HR Process Transformation</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "Our HR team saved over 20 hours per week by automating routine processes with PrimeCare. Employee satisfaction with HR services increased by a remarkable 42%."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Elena Rodriguez, HR Manager at NexGen</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="field" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">Field Service Solutions</h3>
                        <p className="text-muted-foreground mb-4">
                          Optimize field service operations, dispatch technicians efficiently, and track service performance.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Technician scheduling and dispatch</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Mobile service management</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Parts inventory tracking</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Service history and reporting</span>
                          </li>
                        </ul>
                        <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                      </div>
                    </CardContent>
                    <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                      <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                        <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                          <RefreshCcw className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Field Operations Optimization</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "PrimeCare's field service solution improved our first-time fix rate by 35% and reduced travel time between service calls by nearly 28%."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Robert Patel, Operations Manager at ServicePro</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* CTA Section */}
          <div className="mb-10 fade-in">
            <Card className="glass-card overflow-hidden">
              <div className="relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mt-20 -mr-20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -mb-16 -ml-16 blur-xl"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="max-w-xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Ready to transform your support operations?</h2>
                    <p className="text-muted-foreground mb-6">
                      Join thousands of companies that are delivering exceptional support experiences with PrimeCare Helpdesk.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="gap-2" onClick={goToContact}>
                        Buy Now <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2" onClick={goToContact}>
                        Upgrade <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      You're Using Unlimited Free Trial
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
