
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { 
  Search, ArrowRight, Sparkles, 
  CheckCircle2, AlertCircle, BarChart3, 
  Users, Zap, Shield, Award, ArrowUpRight,
  RefreshCcw, Clock, BookOpen, ChevronRight, 
  PanelRight, Star, Mail, MessageSquare,
  Calendar, GanttChart, ClipboardCheck, Timer,
  Milestone, GitPullRequestDraft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

// Knowledge tips for the "Did you know?" feature
const knowledgeTips = [
  "You can create automation workflows to trigger actions when project milestones are reached.",
  "Keyboard shortcuts can significantly speed up your project management. Press 'K' to view all available shortcuts.",
  "You can link related tasks together to track dependencies and ensure proper sequencing of work.",
  "Setting up templates for common project types can save your team hours of setup time each week.",
  "The 'Snooze' feature lets you temporarily hide tasks until they need attention again.",
  "PrimeCare Project Management can automatically suggest resource allocation based on team workload.",
  "You can schedule reports to be automatically emailed to stakeholders on a regular basis.",
  "Internal notes allow team members to collaborate on tasks without the client seeing these comments.",
  "Tags can be used to categorize projects and create powerful reports on specific types of work.",
  "The collision detection feature alerts team members when multiple people are working on the same task.",
  "Use SLA policies to ensure your team meets project delivery commitments to clients.",
  "The 'Client Satisfaction Score' feature automatically surveys clients after project completion.",
  "You can create custom project fields to collect specific information needed for your workflow process.",
  "Time tracking features allow you to measure how much time is spent on different types of project tasks.",
  "The knowledge base analytics show which guides are most viewed, helping you improve your team resources.",
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
                    Welcome to PrimeCare
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
                      <span>Track projects and tasks across all departments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                      <span>Automate routine workflows with intelligent triggers</span>
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
                        <GanttChart className="h-8 w-8 text-primary mx-auto mb-2" />
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
                    <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="mt-4">Task Management</CardTitle>
                  <CardDescription>
                    Create, assign, and track tasks across your entire organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage tasks with customizable workflows, priorities, and dependencies to keep projects moving forward.
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
                  <CardTitle className="mt-4">Workflow Automation</CardTitle>
                  <CardDescription>
                    Create intelligent workflows to handle routine tasks automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Build custom rules to route, prioritize, and assign tasks based on your business processes.
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
                  <CardTitle className="mt-4">Project Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive reporting to track performance and identify trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gain actionable insights into team performance, project health, and resource allocation.
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
                    <GanttChart className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="mt-4">Gantt Charts</CardTitle>
                  <CardDescription>
                    Visualize project timelines with interactive Gantt charts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Plan and manage project schedules with powerful visualization tools that make timelines clear.
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
                    Tools to help your project team work together efficiently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Collaborate on tasks with comments, @mentions, file sharing, and real-time updates.
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
                    <Timer className="h-5 w-5 text-pink-600" />
                  </div>
                  <CardTitle className="mt-4">Time Tracking</CardTitle>
                  <CardDescription>
                    Monitor time spent on tasks and projects for accurate billing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track hours, set estimates, and measure actual time spent for better resource planning.
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
                <h2 className="text-2xl font-bold mb-8 text-center">Trusted by Project Teams Worldwide</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                    <p className="text-sm text-muted-foreground">Companies</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">25M+</div>
                    <p className="text-sm text-muted-foreground">Projects Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">98%</div>
                    <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">30%</div>
                    <p className="text-sm text-muted-foreground">Productivity Increase</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Solutions Tabs */}
          <div className="mb-12 fade-in">
            <h2 className="text-2xl font-bold mb-6">Solutions For Every Team</h2>
            <Tabs defaultValue="product" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="product">Product Teams</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="engineering">Engineering</TabsTrigger>
                <TabsTrigger value="client">Client Services</TabsTrigger>
              </TabsList>
              
              <TabsContent value="product" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">Product Management Solutions</h3>
                        <p className="text-muted-foreground mb-4">
                          Plan your product roadmap, track feature development, and ensure timely delivery with our comprehensive project tools.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Product roadmap planning</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Feature prioritization boards</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Sprint planning tools</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>User feedback integration</span>
                          </li>
                        </ul>
                        <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                      </div>
                    </CardContent>
                    <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                      <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                        <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                          <GitPullRequestDraft className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Product-Led Growth</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "PrimeCare transformed our product development process, reducing our time-to-market by 40% and improving our feature adoption rates by 28%."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Sarah Johnson, CPO at Vertex Corp</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="marketing" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">Marketing Campaign Management</h3>
                        <p className="text-muted-foreground mb-4">
                          Plan, execute, and measure marketing campaigns across all channels with integrated project tracking.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Campaign planning tools</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Content calendar integrations</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Asset management workflows</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Marketing analytics dashboards</span>
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
                        <h4 className="text-lg font-bold mb-2">Marketing Excellence</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "Our marketing team now launches campaigns 35% faster, and our project tracking is completely streamlined thanks to PrimeCare's solutions."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Michael Chen, CMO at Synapse Systems</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="engineering" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">Engineering Project Management</h3>
                        <p className="text-muted-foreground mb-4">
                          Plan development cycles, track bugs, and manage technical debt with specialized engineering tools.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Sprint management tools</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>GitHub & GitLab integration</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>CI/CD pipeline visibility</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Technical documentation hub</span>
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
                        <h4 className="text-lg font-bold mb-2">Engineering Transformation</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "Our engineering team saved over 15 hours per sprint by automating routine processes with PrimeCare. Deployment frequency increased by 45%."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Elena Rodriguez, CTO at Quantum Innovations</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="client" className="animate-in fade-in">
                <Card>
                  <div className="grid md:grid-cols-2 gap-6">
                    <CardContent className="p-6">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">Client Services Solutions</h3>
                        <p className="text-muted-foreground mb-4">
                          Manage client projects, track deliverables, and ensure client satisfaction with specialized tools.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Client portal access</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>SOW and deliverable tracking</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Automated client reporting</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                            <span>Time and budget monitoring</span>
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
                        <h4 className="text-lg font-bold mb-2">Client Project Excellence</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          "PrimeCare's client services solution improved our on-time delivery rate by 35% and increased our client satisfaction scores by nearly 28%."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <p className="text-xs mt-2 font-medium">Robert Patel, VP Client Services at Nimbus Solutions</p>
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
                    <h2 className="text-3xl font-bold mb-4">Ready to transform your project management?</h2>
                    <p className="text-muted-foreground mb-6">
                      Join thousands of companies that are delivering exceptional results with PrimeCare Project Management.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="gap-2" onClick={goToContact}>
                        Start Now <ArrowRight className="h-4 w-4" />
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
