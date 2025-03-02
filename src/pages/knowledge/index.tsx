import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { 
  Book, Search, Clock, TrendingUp, BookOpen, FilePlus, 
  FileText, HelpCircle, GraduationCap, MessageSquare, 
  Star, ChevronRight, Bookmark, CheckCircle2, Mail
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

// Mock data for knowledge base
const articles = [
  { 
    id: 1, 
    title: "Getting Started with PrimeCare Helpdesk", 
    category: "Getting Started", 
    views: 4821, 
    date: "2023-12-05",
    icon: <BookOpen className="w-4 h-4" />,
    excerpt: "Learn the basics of setting up and navigating PrimeCare Helpdesk software."
  },
  { 
    id: 2, 
    title: "Setting Up Automated Workflows", 
    category: "Automation", 
    views: 3752, 
    date: "2023-12-12",
    icon: <CheckCircle2 className="w-4 h-4" />,
    excerpt: "Create powerful automated workflows to streamline your support processes."
  },
  { 
    id: 3, 
    title: "Advanced Ticket Routing Configurations", 
    category: "Configuration", 
    views: 2985, 
    date: "2023-12-18",
    icon: <FileText className="w-4 h-4" />,
    excerpt: "Learn how to set up complex routing rules for tickets based on multiple conditions."
  },
  { 
    id: 4, 
    title: "Creating Custom Dashboard Widgets", 
    category: "Customization", 
    views: 2541, 
    date: "2023-12-25",
    icon: <FileText className="w-4 h-4" />,
    excerpt: "Design and implement your own dashboard widgets to track specific metrics."
  },
  { 
    id: 5, 
    title: "Integrating with Third-Party Services", 
    category: "Integration", 
    views: 2103, 
    date: "2024-01-03",
    icon: <FileText className="w-4 h-4" />,
    excerpt: "Connect PrimeCare with your favorite tools and services for enhanced functionality."
  },
  { 
    id: 6, 
    title: "Advanced Reporting Techniques", 
    category: "Reporting", 
    views: 1987, 
    date: "2024-01-10",
    icon: <FileText className="w-4 h-4" />,
    excerpt: "Master the art of creating comprehensive, insightful reports to track performance."
  },
  { 
    id: 7, 
    title: "User Management Best Practices", 
    category: "Administration", 
    views: 1854, 
    date: "2024-01-17",
    icon: <FileText className="w-4 h-4" />,
    excerpt: "Learn efficient ways to manage users, roles, and permissions in your helpdesk."
  },
  { 
    id: 8, 
    title: "Knowledge Base Article Creation Guide", 
    category: "Knowledge Base", 
    views: 1689, 
    date: "2024-01-24",
    icon: <FileText className="w-4 h-4" />,
    excerpt: "Guidelines for creating effective, searchable knowledge base articles for your team."
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to complete the process."
  },
  {
    question: "Can I customize the ticket fields?",
    answer: "Yes, you can customize ticket fields by navigating to Settings > Ticket Fields. Here, you can add, remove, or modify fields according to your needs."
  },
  {
    question: "How do I set up email notifications?",
    answer: "To set up email notifications, go to Settings > Notifications. You can configure which events trigger notifications and customize the email templates."
  },
  {
    question: "What are the system requirements?",
    answer: "PrimeCare Helpdesk requires a modern web browser (Chrome, Firefox, Safari, Edge), and an internet connection. No additional software installation is needed."
  },
  {
    question: "How can I merge duplicate tickets?",
    answer: "To merge tickets, select the tickets you want to merge from the ticket list, then click the 'Merge' button in the action bar. Choose which ticket to keep as the primary."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes, PrimeCare Helpdesk offers mobile apps for both iOS and Android platforms. You can download them from the respective app stores."
  }
];

const tutorials = [
  {
    id: 1,
    title: "Creating Your First Ticket",
    duration: "5 min",
    level: "Beginner",
    icon: <GraduationCap className="w-4 h-4" />
  },
  {
    id: 2,
    title: "Setting Up Automation Rules",
    duration: "10 min",
    level: "Intermediate",
    icon: <GraduationCap className="w-4 h-4" />
  },
  {
    id: 3,
    title: "Advanced Reporting",
    duration: "15 min",
    level: "Advanced",
    icon: <GraduationCap className="w-4 h-4" />
  },
  {
    id: 4,
    title: "Integrating with Slack",
    duration: "8 min",
    level: "Intermediate",
    icon: <GraduationCap className="w-4 h-4" />
  }
];

const KnowledgeBasePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredArticles, setFeaturedArticles] = useState<typeof articles>([]);
  const [recentArticles, setRecentArticles] = useState<typeof articles>([]);
  
  useEffect(() => {
    // Simulate fetching featured and recent articles
    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    setFeaturedArticles(shuffled.slice(0, 4));
    
    const sorted = [...articles].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setRecentArticles(sorted.slice(0, 4));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Book className="mr-2 h-6 w-6 text-primary" />
              Knowledge Base & Help Center
            </h1>
            <p className="text-muted-foreground">
              Find answers, tutorials, and guides to help you get the most out of PrimeCare Helpdesk
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-8 fade-in glass-card p-6 hover-scale">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">How can we help you today?</h2>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search the knowledge base..." 
                    className="pl-10 bg-white/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="default">Search</Button>
              </div>
            </div>
          </div>
          
          {/* Main Content with Tabs */}
          <Tabs defaultValue="articles" className="fade-in">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="faqs" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Tutorials
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Training
              </TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Featured Articles Section */}
              <div className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                        Most Viewed Articles
                      </CardTitle>
                      <CardDescription>Popular resources to help you get started</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center text-primary">
                      View all <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {featuredArticles.map((article) => (
                        <HoverCard key={article.id}>
                          <HoverCardTrigger asChild>
                            <div className="p-4 rounded-lg border border-border/40 bg-white/70 backdrop-blur-sm hover:bg-primary/5 transition-all cursor-pointer group">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    {article.icon}
                                  </div>
                                  <div>
                                    <h3 className="font-medium group-hover:text-primary transition-colors">
                                      {article.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {article.category} • {article.views.toLocaleString()} views
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Bookmark className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">{article.title}</h4>
                              <p className="text-sm">{article.excerpt}</p>
                              <div className="flex items-center justify-between pt-2">
                                <p className="text-xs text-muted-foreground">Published: {new Date(article.date).toLocaleDateString()}</p>
                                <Button variant="link" size="sm" className="h-auto p-0">
                                  Read article
                                </Button>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recently Added Section */}
              <div>
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
                      Recently Added
                    </CardTitle>
                    <CardDescription>Latest resources and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentArticles.slice(0, 4).map((article) => (
                        <div 
                          key={article.id}
                          className="group flex items-start gap-3 p-3 rounded-md hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <FilePlus className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Added {new Date(article.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View all recent articles</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            
            {/* Tab Content */}
            <TabsContent value="articles" className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-primary/10 text-primary">
                            {article.icon}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{article.category}</span>
                        </div>
                        <span className="text-xs flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-3 w-3" /> {article.views.toLocaleString()}
                        </span>
                      </div>
                      <CardTitle className="text-base mt-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Read more <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="faqs" className="animate-in fade-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Find quick answers to common questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <details key={index} className="group rounded-lg border border-border/50 bg-background">
                        <summary className="flex cursor-pointer items-center justify-between p-4 text-base font-medium">
                          {faq.question}
                          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                        </summary>
                        <div className="border-t border-border/30 px-4 py-3 text-sm text-muted-foreground">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tutorials" className="animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="glass-card hover-scale">
                    <CardHeader className="pb-0">
                      <div className="w-full aspect-video bg-primary/10 rounded-md flex items-center justify-center mb-4">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-primary/90 text-white hover:bg-primary hover:scale-110 transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 ml-0.5"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                        </Button>
                      </div>
                      <CardTitle className="text-base">{tutorial.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {tutorial.duration}
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          tutorial.level === "Beginner" && "bg-green-100 text-green-700",
                          tutorial.level === "Intermediate" && "bg-blue-100 text-blue-700",
                          tutorial.level === "Advanced" && "bg-purple-100 text-purple-700"
                        )}>
                          {tutorial.level}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Start Tutorial</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="training" className="animate-in fade-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Training Resources</CardTitle>
                  <CardDescription>Comprehensive learning resources to master PrimeCare Helpdesk</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="p-2 w-fit rounded-full bg-blue-100">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg mt-2">Beginner Course</CardTitle>
                        <CardDescription>Basics of PrimeCare Helpdesk</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Introduction to the Interface
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Creating & Managing Tickets
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Basic Reporting
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Start Learning</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="p-2 w-fit rounded-full bg-amber-100">
                          <BookOpen className="h-5 w-5 text-amber-600" />
                        </div>
                        <CardTitle className="text-lg mt-2">Intermediate Course</CardTitle>
                        <CardDescription>Advanced features and customization</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Automation Rules & Workflows
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            SLA Management
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Custom Fields & Forms
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Start Learning</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="p-2 w-fit rounded-full bg-purple-100">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg mt-2">Expert Course</CardTitle>
                        <CardDescription>System administration & optimization</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            API Integration
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Advanced Automation
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            System Optimization
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Start Learning</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Help Contact Section */}
          <div className="mt-8 mb-10 fade-in">
            <Card className="bg-primary/5 border-none overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Need Additional Help?</h3>
                  <p className="text-muted-foreground mb-6">
                    Our support team is ready to assist you with any questions or issues you may have.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Live Chat Support</h4>
                        <p className="text-sm text-muted-foreground">Available 24/7</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-sm text-muted-foreground">support@educare.com</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/contact">
                    <Button className="mt-6">Contact Support</Button>
                  </Link>
                </CardContent>
                <div className="hidden md:block relative">
                  <div className="absolute inset-0 bg-primary/20 z-0"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Star className="h-16 w-16 mx-auto mb-4 text-white/70" />
                      <h3 className="text-2xl font-bold mb-2">Premium Support</h3>
                      <p className="max-w-xs mx-auto">
                        Get priority support with our premium support package
                      </p>
                      <Button variant="outline" className="mt-4 bg-white/20 text-white border-white/40 hover:bg-white/30">
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBasePage;
