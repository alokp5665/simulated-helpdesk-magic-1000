
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { 
  Search, ArrowRight, Sparkles, Bot, X, Maximize2, 
  Minimize2, MessageSquare, AlertCircle, CheckCircle2,
  BarChart3, Users, Zap, Shield, Award, ArrowUpRight,
  RefreshCcw, Clock, BookOpen, Send, ChevronRight, PanelRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// Mock chatbot responses data
const chatbotResponses = [
  {
    query: "How do I create a new ticket?",
    response: "To create a new ticket, navigate to the Tickets section and click on the 'New Ticket' button in the top right corner. Fill in the required fields in the form that appears, and click 'Submit'. You can also create tickets via email by sending a message to your designated support email address."
  },
  {
    query: "What is SLA management?",
    response: "SLA (Service Level Agreement) management in PrimeCare Helpdesk allows you to define and track response and resolution times for different types of tickets. You can set up different SLA policies based on ticket priority, category, or customer type. The system will automatically track adherence to these SLAs and alert agents when tickets are approaching or have breached their SLA targets."
  },
  {
    query: "How do I reset my password?",
    response: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password. If you're already logged in and want to change your password, go to your user profile settings and select the 'Change Password' option."
  },
  {
    query: "How can I set up automation rules?",
    response: "To set up automation rules, go to Settings > Automation. Click 'Add Rule' and define the conditions and actions for your rule. Conditions determine when the rule will be triggered (e.g., when a ticket is created or updated), and actions define what happens when those conditions are met (e.g., assign the ticket to a specific agent or team, change the status, or send a notification)."
  },
  {
    query: "Can I customize the ticket fields?",
    response: "Yes, you can customize ticket fields in PrimeCare Helpdesk. Go to Settings > Ticket Fields to add, edit, or remove fields. You can create various field types including text, dropdown, checkbox, date, and more. You can also make fields required or optional, and control their visibility to agents and customers."
  },
  {
    query: "How do I export reports?",
    response: "To export reports, navigate to the Reports section and generate the report you need. Once the report is displayed, look for the 'Export' button, usually located in the top right corner of the report view. You can export reports in various formats including CSV, Excel, PDF, and more depending on your subscription plan."
  },
  {
    query: "What integrations are available?",
    response: "PrimeCare Helpdesk offers numerous integrations with popular business tools. These include CRM systems like Salesforce and HubSpot, communication tools like Slack and Microsoft Teams, email providers like Gmail and Outlook, calendar apps, project management tools like Jira and Asana, and more. You can find the full list in Settings > Integrations."
  },
  {
    query: "How do I add a new agent to the system?",
    response: "To add a new agent, go to Settings > Agents > Add New Agent. Fill in their details including name, email, and role. The system will send an invitation email with instructions to set up their account. You can also assign them to specific teams, define their permissions, and set up their availability for ticket assignments."
  },
  {
    query: "How can I merge duplicate tickets?",
    response: "To merge duplicate tickets, select the tickets you want to merge from the ticket list by checking their checkboxes. Then click on the 'More Actions' or 'Actions' dropdown and select 'Merge Tickets'. Choose which ticket should be the primary one, and all conversations and attachments from the other tickets will be moved to this primary ticket."
  },
  {
    query: "How do I set up canned responses?",
    response: "To set up canned responses (also called saved replies), go to Settings > Saved Replies. Click 'Add New Reply', give it a name, and enter the response text. You can include placeholders for dynamic content such as customer name or ticket ID. Once created, agents can use these replies while responding to tickets, saving time on repetitive responses."
  },
  {
    query: "What are tags used for?",
    response: "Tags in PrimeCare Helpdesk help categorize and organize tickets for better management and reporting. You can add tags to tickets based on their nature, the type of issue, or any other classification that makes sense for your workflow. Tags can be used for filtering tickets, creating automation rules, and generating reports on specific types of issues."
  },
  {
    query: "How do I configure email notifications?",
    response: "To configure email notifications, go to Settings > Notifications. Here you can define which events trigger notifications (e.g., new ticket created, ticket assigned, comment added) and who receives these notifications. You can customize the email templates used for these notifications by going to Settings > Email Templates."
  },
  {
    query: "Can I set up a knowledge base?",
    response: "Yes, PrimeCare Helpdesk includes a comprehensive knowledge base feature. To set it up, go to the Knowledge Base section and click 'Settings'. Here you can configure categories, visibility settings, and access permissions. To add articles, click 'Add Article', create your content using the rich text editor, assign categories, and publish when ready."
  },
  {
    query: "How does the ticket routing work?",
    response: "Ticket routing in PrimeCare Helpdesk can be automatic or manual. For automatic routing, you can set up rules based on various criteria like ticket category, priority, or keywords in the subject/description. These rules can assign tickets to specific agents or teams based on expertise or availability. For manual routing, team leads or admins can assign tickets to appropriate agents through the ticket management interface."
  },
  {
    query: "What reporting capabilities are available?",
    response: "PrimeCare Helpdesk offers extensive reporting capabilities including predefined reports and custom report builders. You can generate reports on ticket volume, response times, resolution times, SLA compliance, agent performance, customer satisfaction, and more. Reports can be scheduled to run automatically and be sent to specified email addresses. Advanced analytics dashboards are available on higher-tier plans."
  },
  {
    query: "How do I set up teams?",
    response: "To set up teams, go to Settings > Teams > Add New Team. Give the team a name and description, then add members by selecting from your agent list. You can designate team leaders who will have additional permissions for tickets assigned to the team. Teams can be used in routing rules, SLA policies, and for organizing your support structure into specialized groups."
  },
  {
    query: "What are macros and how do I use them?",
    response: "Macros in PrimeCare Helpdesk are predefined sets of actions that can be applied to a ticket with a single click. To create a macro, go to Settings > Macros > Add New Macro. Define a sequence of actions like changing status, assigning to a team, adding tags, or sending a response. Macros help streamline repetitive workflows and ensure consistent ticket handling procedures."
  },
  {
    query: "How do I customize the customer portal?",
    response: "To customize the customer portal, go to Settings > Customer Portal. Here you can adjust the branding (logo, colors, fonts), configure which fields are visible to customers when they submit tickets, set up welcome messages, and control features like knowledge base access. You can also create custom fields specifically for the customer portal interface."
  },
  {
    query: "Can I implement ticket approval workflows?",
    response: "Yes, you can implement ticket approval workflows in PrimeCare Helpdesk using the Approvals feature. Go to Settings > Approvals to set up approval rules. You can define which types of tickets require approval, who the approvers are, and what happens after approval or rejection. This is particularly useful for change requests, purchase requests, or other tickets that require management sign-off."
  },
  {
    query: "How do I track time spent on tickets?",
    response: "PrimeCare Helpdesk includes time tracking functionality for tickets. Agents can log time manually by clicking the 'Add Time Log' button on a ticket and entering the duration and a description. The system can also track time automatically when agents are actively working on a ticket. Time logs can be used for billing, productivity analysis, and resource allocation planning."
  },
  {
    query: "How secure is my data in PrimeCare Helpdesk?",
    response: "PrimeCare Helpdesk implements industry-standard security measures to protect your data. These include data encryption in transit and at rest, regular security audits, role-based access controls, two-factor authentication, IP restrictions, and single sign-on options. We're compliant with major regulations including GDPR, HIPAA, and SOC 2. Detailed security information is available in our security whitepaper."
  },
  {
    query: "Can I customize the ticket status workflow?",
    response: "Yes, you can customize the ticket status workflow in Settings > Ticket Statuses. Here you can create new status options beyond the default ones (Open, Pending, Resolved, Closed), define their properties, and establish the allowed transitions between statuses. This allows you to create a workflow that matches your specific support processes."
  },
  {
    query: "How do I set up SLA policies?",
    response: "To set up SLA policies, go to Settings > SLA Policies > Add New Policy. Define the conditions when this policy applies (e.g., ticket priority, category, customer type) and set the target response and resolution times. You can also configure escalation rules that trigger when SLA targets are approaching or have been breached, such as notifications to managers or automatic priority increases."
  },
  {
    query: "How do I implement a satisfaction survey?",
    response: "To implement a customer satisfaction survey, go to Settings > Satisfaction Survey. Enable the survey feature and customize the questions, rating scale, and when surveys are sent (typically after a ticket is resolved). You can choose between different survey types including simple rating questions, Net Promoter Score (NPS), or custom question sets. Survey results are available in the reporting section."
  },
  {
    query: "How do I handle multiple brands or products?",
    response: "PrimeCare Helpdesk supports multi-brand helpdesk management. Go to Settings > Brands to set up different brands or products. For each brand, you can configure unique email addresses, customer portals, knowledge bases, and email templates with appropriate branding. This allows you to provide tailored support experiences for different products or divisions within your organization."
  },
  {
    query: "What mobile options are available?",
    response: "PrimeCare Helpdesk offers mobile apps for iOS and Android, allowing agents to manage tickets on the go. The mobile apps include features like ticket creation and updates, internal notes, file attachments, and notifications. Additionally, both the agent interface and customer portal are responsive and can be accessed via mobile web browsers if preferred."
  },
  {
    query: "How do I customize my dashboard?",
    response: "To customize your dashboard, click the 'Customize' button in the top right corner of your dashboard. You can add, remove, and rearrange widgets by dragging and dropping. Available widgets include recent tickets, ticket statistics, SLA compliance metrics, knowledge base usage, and agent performance. Individual agents can personalize their own dashboards to focus on metrics relevant to their role."
  },
  {
    query: "How do I set up email piping?",
    response: "To set up email piping, go to Settings > Channels > Email. Add your support email address and configure the mail server settings (or use our built-in email service). Once configured, any emails sent to this address will automatically be converted into tickets in your helpdesk. You can set up multiple email addresses for different departments or brands, with separate automation rules for each."
  },
  {
    query: "What languages does PrimeCare Helpdesk support?",
    response: "PrimeCare Helpdesk supports multiple languages for both the agent interface and customer portal. Available languages include English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Japanese, Chinese, and more. Agents can work in their preferred language, and the customer portal can automatically detect and display in the customer's language based on their browser settings."
  },
  {
    query: "How do I import existing tickets from another system?",
    response: "To import existing tickets from another system, go to Settings > Import/Export > Import Tickets. The system supports importing from CSV files and direct migration from several popular helpdesk platforms. You'll need to map the fields from your source system to PrimeCare Helpdesk fields. For complex migrations, our professional services team can provide assistance to ensure a smooth transition."
  },
];

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

// Helper type for chat messages
type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

const HomePage = () => {
  const { toast } = useToast();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  const [currentTip, setCurrentTip] = useState(knowledgeTips[0]);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "👋 Hi there! I'm your PrimeCare assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Change the tip every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = knowledgeTips[Math.floor(Math.random() * knowledgeTips.length)];
      setCurrentTip(randomTip);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Find a response or use a default one
    setTimeout(() => {
      setIsTyping(false);
      
      // Try to find a matching response
      const matchedResponse = chatbotResponses.find(
        (item) => item.query.toLowerCase().includes(inputMessage.toLowerCase()) || 
                  inputMessage.toLowerCase().includes(item.query.toLowerCase())
      );
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: matchedResponse 
          ? matchedResponse.response 
          : "I don't have specific information about that yet. Please try asking about creating tickets, SLA management, password resets, or other helpdesk features. Alternatively, you can contact our support team for more assistance.",
        timestamp: new Date(),
      };
      
      setChatMessages((prev) => [...prev, botMessage]);
    }, 1500 + Math.random() * 1000);
  };

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
                  <h1 className="text-4xl font-bold mb-4 text-foreground">
                    <span className="relative">
                      PrimeCare Helpdesk
                      <div className="absolute -top-4 -right-4">
                        <div className="text-xs font-normal bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Enterprise Edition
                        </div>
                      </div>
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    The complete customer support solution for growing teams
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
                    <Button size="lg" className="gap-2">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2">
                      Watch Demo <Sparkles className="h-4 w-4" />
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
                  <Button variant="ghost" className="w-full justify-between">
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
                  <Button variant="ghost" className="w-full justify-between">
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
                  <Button variant="ghost" className="w-full justify-between">
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
                  <Button variant="ghost" className="w-full justify-between">
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
                  <Button variant="ghost" className="w-full justify-between">
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
                  <Button variant="ghost" className="w-full justify-between">
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
                        <Button className="mt-6 w-fit">Learn More</Button>
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
                        <Button className="mt-6 w-fit">Learn More</Button>
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
                        <Button className="mt-6 w-fit">Learn More</Button>
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
                        <Button className="mt-6 w-fit">Learn More</Button>
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
                      <Button size="lg" className="gap-2">
                        Start Free Trial <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2">
                        Schedule Demo <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      No credit card required. Free 14-day trial with full access to all features.
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      {/* AI Chatbot */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isChatbotMinimized ? "w-auto" : isChatbotOpen ? "w-80 sm:w-96" : "w-auto"
      )}>
        {!isChatbotOpen ? (
          <Button 
            onClick={() => {
              setIsChatbotOpen(true);
              setIsChatbotMinimized(false);
              toast({
                title: "AI Assistant Activated",
                description: "Ask any question about PrimeCare Helpdesk.",
              });
            }} 
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all"
          >
            <Bot className="h-6 w-6" />
          </Button>
        ) : (
          <Card className={cn(
            "shadow-lg transition-all duration-300 border-primary/20",
            isChatbotMinimized ? "h-14" : "h-[450px]"
          )}>
            {/* Chatbot Header */}
            <div className="flex items-center justify-between p-3 border-b bg-primary/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">PrimeCare Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {isChatbotMinimized ? (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7" 
                    onClick={() => setIsChatbotMinimized(false)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7" 
                    onClick={() => setIsChatbotMinimized(true)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7" 
                  onClick={() => {
                    setIsChatbotOpen(false);
                    setIsChatbotMinimized(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {!isChatbotMinimized && (
              <>
                {/* Did You Know Section */}
                <div className="p-3 bg-primary/5 border-b">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-medium">Did you know?</p>
                      <p className="text-xs text-muted-foreground">{currentTip}</p>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 p-3 overflow-y-auto h-[310px]">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={cn(
                          "flex",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div 
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground rounded-tr-none" 
                              : "bg-muted rounded-tl-none"
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg rounded-tl-none p-3">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce delay-75"></div>
                            <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce delay-150"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Chat Input */}
                <div className="p-3 border-t">
                  <div className="flex items-center gap-2">
                    <Textarea 
                      placeholder="Ask me anything about PrimeCare..." 
                      className="min-h-9 resize-none"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      size="icon" 
                      className="h-9 w-9 rounded-full flex-shrink-0"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePage;
