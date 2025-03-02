
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Users,
  User,
  Ticket,
  MessageSquare,
  ChevronRight,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ChartBar,
  BarChart,
  BarChart3,
  UserCheck,
  Calendar,
  Search,
  Plus,
  Activity as ActivityIcon,
  Send
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Types
interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy" | "away";
  role: string;
  performance: number;
  ticketsResolved: number;
  responseTime: number;
  customers: number;
  lastActive?: Date;
}

interface Ticket {
  id: string;
  title: string;
  customer: string;
  status: "open" | "in_progress" | "pending" | "resolved";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  created: Date;
}

interface Activity {
  id: string;
  agent: string;
  action: string;
  timestamp: Date;
  ticketId?: string;
}

interface Reminder {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  ticketId?: string;
}

// Helper constants
const FIRST_NAMES = [
  "Arjun", "Aditya", "Rahul", "Vikram", "Raj", "Amit", "Sanjay", "Vivek", "Suresh", "Mahesh", 
  "Neha", "Priya", "Meera", "Anjali", "Divya", "Pooja", "Isha", "Ananya", "Kavita", "Deepa"
];

const LAST_NAMES = [
  "Sharma", "Patel", "Singh", "Gupta", "Verma", "Joshi", "Agarwal", "Mehta", "Desai", "Iyer", 
  "Reddy", "Malhotra", "Kapoor", "Nair", "Pillai", "Saxena", "Trivedi", "Choudhury", "Bhat", "Rao"
];

const CUSTOMER_NAMES = ["Tata Consultancy", "Reliance Industries", "Infosys Technologies", "Bharti Airtel", "Mahindra Group", "Wipro Limited", "HCL Technologies", "Tech Mahindra", "Aditya Birla Group", "Larsen & Toubro", "Godrej Industries", "Bajaj Auto", "Adani Enterprises", "TVS Motors", "Sun Pharma"];

const TICKET_SUBJECTS = [
  "Account login issues",
  "Payment processing failed",
  "Unable to reset password",
  "Feature request: dark mode",
  "Data sync not working",
  "Mobile app crashing",
  "Subscription renewal problem",
  "Missing order details",
  "Billing discrepancy",
  "Service downtime report"
];

const AGENT_ACTIONS = [
  "resolved a ticket",
  "was assigned a new ticket",
  "replied to a customer",
  "escalated an issue",
  "created a knowledge article",
  "closed a case",
  "transferred a ticket",
  "added a note",
  "scheduled a follow-up",
  "updated ticket status"
];

const REMINDER_SUBJECTS = [
  "Follow up with customer",
  "Team meeting",
  "Review pending tickets",
  "Submit daily report",
  "Training session",
  "Update knowledge base",
  "Client call",
  "Performance review",
  "Quality assessment",
  "Update ticket status"
];

const CHAT_MESSAGES = [
  {
    ticketId: "T-1234",
    title: "Payment processing failed for premium customer",
    messages: [
      { 
        sender: "Vikram Sharma", 
        content: "Hey team, I'm looking at ticket T-1234 about a payment processing failure. The customer is pretty upset. @Anjali Desai can you take a look at the payment logs?" 
      },
      { 
        sender: "Anjali Desai", 
        content: "I'll check the logs right away. From what I can see initially, it looks like their card was declined by the payment gateway. @Rahul Verma, have you seen this error code before?" 
      },
      { 
        sender: "Rahul Verma", 
        content: "Yes, that error usually means the card issuer blocked the transaction. I suggest we: 1) Verify customer details, 2) Ask them to contact their bank, 3) Offer alternative payment methods." 
      },
      { 
        sender: "Vikram Sharma", 
        content: "Great suggestions, Rahul. I'll contact the customer with these options. Anjali, can you prepare a detailed report of the transaction attempts for reference?" 
      },
      { 
        sender: "Anjali Desai", 
        content: "Already on it. I'll have the report ready in 15 minutes and share it with you both." 
      }
    ]
  },
  {
    ticketId: "T-2345",
    title: "Data sync not working after recent update",
    messages: [
      { 
        sender: "Rahul Verma", 
        content: "Has anyone looked at ticket T-2345 about data sync issues? We've received multiple reports since the latest update." 
      },
      { 
        sender: "Anjali Desai", 
        content: "I'm checking it now. Looks like there might be an issue with the new API endpoints. @Vikram Sharma, didn't you work on the sync mechanism recently?" 
      },
      { 
        sender: "Vikram Sharma", 
        content: "Yes, I did. Let me review the logs. There might be a compatibility issue with older client versions. I'll push a hotfix to address this within the next hour." 
      },
      { 
        sender: "Rahul Verma", 
        content: "Should we notify all affected customers about the expected fix?" 
      },
      { 
        sender: "Vikram Sharma", 
        content: "Good idea. I'll draft a notification once I've confirmed the exact issue. Anjali, could you identify all impacted accounts so we can target the communication?" 
      },
      { 
        sender: "Anjali Desai", 
        content: "Will do. I'll prepare a list of affected accounts categorized by priority level." 
      }
    ]
  },
  {
    ticketId: "T-3456",
    title: "Feature request implementation timeline",
    messages: [
      { 
        sender: "Anjali Desai", 
        content: "We have a priority feature request from Enterprise customer Tata Consultancy. They're asking about dark mode implementation timeline. Thoughts on when we can deliver this?" 
      },
      { 
        sender: "Vikram Sharma", 
        content: "I've reviewed the request. It's on our roadmap for next quarter, but given their status, we might want to expedite. @Rahul Verma, how busy is the front-end team right now?" 
      },
      { 
        sender: "Rahul Verma", 
        content: "We're focused on the accessibility improvements this sprint, but I could allocate resources for this starting next week. It should take about 2-3 weeks to implement properly." 
      },
      { 
        sender: "Anjali Desai", 
        content: "That's great news! I'll let them know we can start work on it next week with an expected delivery in 3 weeks. Would be nice to under-promise and over-deliver." 
      },
      { 
        sender: "Vikram Sharma", 
        content: "Agreed. Rahul, can you prepare a brief implementation plan that I can share with the account manager? Just the high-level milestones and testing approach." 
      },
      { 
        sender: "Rahul Verma", 
        content: "Sure thing. I'll have that ready by tomorrow morning. I'll also include some mockups so they can see what we're planning." 
      }
    ]
  }
];

// Define form schemas
const AddReminderSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  dueDate: z.date(),
  priority: z.enum(["low", "medium", "high"]),
});

// Helper functions
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateRandomAgent = (): Agent => {
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const roles = ["Support Agent", "Customer Success", "Technical Support", "Billing Specialist", "Product Support"];
  
  return {
    id: `agent-${Math.random().toString(36).substring(2, 10)}`,
    name,
    avatar: `/placeholder.svg`,
    status: randomElement(["online", "offline", "busy", "away"]),
    role: randomElement(roles),
    performance: randomInt(60, 98),
    ticketsResolved: randomInt(20, 150),
    responseTime: randomInt(5, 60),
    customers: randomInt(10, 50),
    lastActive: randomDate(new Date(Date.now() - 86400000 * 3), new Date()) // Last 3 days
  };
};

const generateRandomTicket = (): Ticket => {
  return {
    id: `T-${randomInt(1000, 9999)}`,
    title: randomElement(TICKET_SUBJECTS),
    customer: randomElement(CUSTOMER_NAMES),
    status: randomElement(["open", "in_progress", "pending", "resolved"]),
    priority: randomElement(["low", "medium", "high"]),
    created: randomDate(new Date(Date.now() - 86400000 * 14), new Date()) // Last 14 days
  };
};

const generateRandomActivity = (agents: Agent[]): Activity => {
  const agent = randomElement(agents);
  return {
    id: `activity-${Math.random().toString(36).substring(2, 10)}`,
    agent: agent.name,
    action: randomElement(AGENT_ACTIONS),
    timestamp: randomDate(new Date(Date.now() - 86400000 * 2), new Date()), // Last 2 days
    ticketId: `T-${randomInt(1000, 9999)}`
  };
};

const generateRandomReminder = (): Reminder => {
  return {
    id: `reminder-${Math.random().toString(36).substring(2, 10)}`,
    title: randomElement(REMINDER_SUBJECTS),
    dueDate: randomDate(new Date(), new Date(Date.now() + 86400000 * 7)), // Next 7 days
    priority: randomElement(["low", "medium", "high"]),
    completed: Math.random() > 0.7 // 30% chance of being completed
  };
};

// Main component
const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [ticketStats, setTicketStats] = useState({
    open: randomInt(10, 30),
    inProgress: randomInt(15, 40),
    pending: randomInt(5, 20),
    resolved: randomInt(50, 150)
  });
  const [performanceTab, setPerformanceTab] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [selectedChat, setSelectedChat] = useState<string>("T-1234");
  const [searchTerm, setSearchTerm] = useState("");
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Initialize forms
  const reminderForm = useForm<z.infer<typeof AddReminderSchema>>({
    resolver: zodResolver(AddReminderSchema),
    defaultValues: {
      title: "",
      dueDate: new Date(),
      priority: "medium",
    },
  });

  // Add reminder handler
  const onAddReminder = (values: z.infer<typeof AddReminderSchema>) => {
    const newReminder: Reminder = {
      id: `reminder-${Math.random().toString(36).substring(2, 10)}`,
      title: values.title,
      dueDate: values.dueDate,
      priority: values.priority,
      completed: false,
    };
    
    setReminders(prev => [newReminder, ...prev]);
    setIsReminderDialogOpen(false);
    reminderForm.reset();
    toast("New reminder added successfully");
  };

  // Send message handler
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const selectedChatData = CHAT_MESSAGES.find(c => c.ticketId === selectedChat);
    if (!selectedChatData) return;
    
    // Add new message to the chat
    const updatedMessages = [...selectedChatData.messages, {
      sender: "Vikram Sharma", // Using a fixed sender for the current user
      content: newMessage,
      timestamp: new Date(),
    }];
    
    // Update the chat messages
    const updatedChatMessages = CHAT_MESSAGES.map(chat => 
      chat.ticketId === selectedChat 
        ? { ...chat, messages: updatedMessages } 
        : chat
    );
    
    // Update state
    setNewMessage("");
    
    // Show success message
    toast("Message sent successfully");
  };

  // Handle reminder completion toggle
  const toggleReminderCompletion = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed } 
          : reminder
      )
    );
  };

  // Initialize with random data
  useEffect(() => {
    // Generate initial agents
    const initialAgents = Array(15).fill(null).map(generateRandomAgent);
    setAgents(initialAgents);
    
    // Generate initial tickets
    const initialTickets = Array(20).fill(null).map(generateRandomTicket);
    setTickets(initialTickets);
    
    // Generate initial activities
    const initialActivities = Array(10).fill(null).map(() => generateRandomActivity(initialAgents));
    setActivities(initialActivities);
    
    // Generate initial reminders
    const initialReminders = Array(8).fill(null).map(generateRandomReminder);
    setReminders(initialReminders);
    
    // Set up periodic updates for dynamic content
    const ticketStatsInterval = setInterval(() => {
      setTicketStats({
        open: randomInt(10, 30),
        inProgress: randomInt(15, 40),
        pending: randomInt(5, 20),
        resolved: randomInt(50, 150)
      });
    }, 10000); // Update every 10 seconds
    
    const newActivityInterval = setInterval(() => {
      const newActivity = generateRandomActivity(agents);
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }, 15000); // New activity every 15 seconds
    
    const newTicketInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance of new ticket
        const newTicket = generateRandomTicket();
        setTickets(prev => [newTicket, ...prev.slice(0, 19)]); // Keep only 20 most recent
      }
    }, 30000); // Check for new ticket every 30 seconds
    
    return () => {
      clearInterval(ticketStatsInterval);
      clearInterval(newActivityInterval);
      clearInterval(newTicketInterval);
    };
  }, []);

  // Filter agents based on search term
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1600px] mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-foreground/90">Agent Management</h1>
          <p className="text-muted-foreground mb-8">View and manage your customer support team performance</p>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Ticket Stats - Top Row */}
            <div className="col-span-12 lg:col-span-3">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="h-full"
              >
                <Card className="bg-white/60 border-purple-100/40 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">Open Tickets</CardTitle>
                      <Ticket className="h-4 w-4 text-orange-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{ticketStats.open}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {randomInt(-10, 20)}% from last week
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="col-span-12 lg:col-span-3">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <Card className="bg-white/60 border-blue-100/40 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">In Progress</CardTitle>
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500">{ticketStats.inProgress}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {randomInt(-5, 15)}% from last week
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="col-span-12 lg:col-span-3">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="h-full"
              >
                <Card className="bg-white/60 border-amber-100/40 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">Pending</CardTitle>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-500">{ticketStats.pending}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {randomInt(-20, 5)}% from last week
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="col-span-12 lg:col-span-3">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="h-full"
              >
                <Card className="bg-white/60 border-green-100/40 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">Resolved</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">{ticketStats.resolved}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {randomInt(5, 25)}% from last week
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Top Performers - Second Row */}
            <div className="col-span-12 lg:col-span-8">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/60 border-purple-100/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-primary" />
                        <span>Top Performers</span>
                      </CardTitle>
                      <Tabs value={performanceTab} onValueChange={(v) => setPerformanceTab(v as any)}>
                        <TabsList className="bg-muted/50">
                          <TabsTrigger value="weekly">Weekly</TabsTrigger>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                          <TabsTrigger value="yearly">Yearly</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {performanceTab === "weekly" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {agents.slice(0, 3).map((agent, index) => (
                          <Card key={agent.id} className="border bg-card/50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={agent.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-lg">
                                      {agent.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 border">
                                    <Badge className="h-5 w-5 p-1 flex items-center justify-center rounded-full font-bold">
                                      {index + 1}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium">{agent.name}</h3>
                                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">
                                      {randomInt(90, 99)}% satisfaction
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Tickets Resolved</span>
                                  <span className="font-medium">{randomInt(20, 50)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Avg. Response Time</span>
                                  <span className="font-medium">{randomInt(3, 15)} min</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {performanceTab === "monthly" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {agents.slice(3, 6).map((agent, index) => (
                          <Card key={agent.id} className="border bg-card/50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={agent.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-lg">
                                      {agent.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 border">
                                    <Badge className="h-5 w-5 p-1 flex items-center justify-center rounded-full font-bold">
                                      {index + 1}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium">{agent.name}</h3>
                                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">
                                      {randomInt(90, 99)}% satisfaction
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Tickets Resolved</span>
                                  <span className="font-medium">{randomInt(80, 150)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Avg. Response Time</span>
                                  <span className="font-medium">{randomInt(4, 10)} min</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {performanceTab === "yearly" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {agents.slice(6, 9).map((agent, index) => (
                          <Card key={agent.id} className="border bg-card/50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={agent.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-lg">
                                      {agent.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 border">
                                    <Badge className="h-5 w-5 p-1 flex items-center justify-center rounded-full font-bold">
                                      {index + 1}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium">{agent.name}</h3>
                                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">
                                      {randomInt(92, 99)}% satisfaction
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Tickets Resolved</span>
                                  <span className="font-medium">{randomInt(500, 1200)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Avg. Response Time</span>
                                  <span className="font-medium">{randomInt(4, 8)} min</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Active Agents - Right Side */}
            <div className="col-span-12 lg:col-span-4">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/60 border-purple-100/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Active Agents</span>
                      </CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {agents.filter(a => a.status === "online").length} Online
                      </Badge>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search agents..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[320px] pr-4">
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                      >
                        {filteredAgents.map((agent) => (
                          <motion.div 
                            key={agent.id}
                            variants={itemVariants}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={agent.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                  {agent.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                                agent.status === "online" ? "bg-green-500" :
                                agent.status === "busy" ? "bg-red-500" :
                                agent.status === "away" ? "bg-amber-500" :
                                "bg-gray-400"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{agent.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{agent.role}</p>
                            </div>
                            <div className="text-xs text-right">
                              <p>{agent.ticketsResolved} tickets</p>
                              <p className="text-muted-foreground mt-1">
                                {agent.lastActive?.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Agent Leaderboard */}
            <div className="col-span-12 lg:col-span-4">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/60 border-purple-100/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>Agent Leaderboard</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {agents.slice(0, 5).map((agent, index) => (
                        <div key={agent.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 text-sm font-medium text-muted-foreground">
                                {index + 1}
                              </div>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                  {agent.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium">{agent.name}</div>
                            </div>
                            <div className="text-sm font-medium">{agent.performance}%</div>
                          </div>
                          <Progress value={agent.performance} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Active Tickets */}
            <div className="col-span-12 lg:col-span-4">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-white/60 border-purple-100/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" />
                      <span>Active Tickets</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px] pr-4">
                      <div className="space-y-4">
                        {tickets.filter(t => t.status !== "resolved").slice(0, 6).map(ticket => (
                          <div key={ticket.id} className="p-3 border rounded-md bg-card/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{ticket.title}</div>
                              <Badge className={`
                                ${
                                  ticket.priority === "high" ? "bg-red-100 text-red-800 border-red-200" :
                                  ticket.priority === "medium" ? "bg-amber-100 text-amber-800 border-amber-200" :
                                  "bg-green-100 text-green-800 border-green-200"
                                }
                              `}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{ticket.customer}</span>
                              <span className="text-xs text-muted-foreground">
                                {ticket.created.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <Badge variant="outline" className={`
                                ${
                                  ticket.status === "open" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                  ticket.status === "in_progress" ? "bg-purple-50 text-purple-700 border-purple-200" :
                                  "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              `}>
                                {ticket.status.replace("_", " ")}
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                View <ChevronRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Activity Feed */}
            <div className="col-span-12 lg:col-span-4">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-white/60 border-purple-100/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ActivityIcon className="h-5 w-5 text-primary" />
                      <span>Activity Feed</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px] pr-4">
                      <ol className="relative border-l border-muted space-y-4 ml-3">
                        {activities.map(activity => (
                          <li key={activity.id} className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3 ring-4 ring-white">
                              <User className="w-3 h-3 text-primary" />
                            </span>
                            <div className="p-3 bg-card/50 border rounded-md">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{activity.agent}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {activity.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm">
                                {activity.action}
                                {activity.ticketId && (
                                  <span className="ml-1 text-primary font-medium">
                                    {activity.ticketId}
                                  </span>
                                )}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Team Communication */}
            <div className="col-span-12 lg:col-span-8">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 }}
              >
                <Card className="bg-white/60 border-purple-100/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span>Team Communication</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[400px] border rounded-md overflow-hidden">
                      {/* Chat sidebar */}
                      <div className="w-64 border-r bg-muted/30">
                        <div className="p-3 border-b">
                          <h3 className="font-medium">Active Tickets</h3>
                        </div>
                        <ScrollArea className="h-[350px]">
                          {CHAT_MESSAGES.map(chat => (
                            <div 
                              key={chat.ticketId}
                              className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                                selectedChat === chat.ticketId ? "bg-muted/80" : ""
                              }`}
                              onClick={() => setSelectedChat(chat.ticketId)}
                            >
                              <div className="font-medium text-sm">{chat.ticketId}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {chat.title}
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-xs">
                                <div className="flex -space-x-2">
                                  {chat.messages.slice(0, 2).map((msg, idx) => (
                                    <Avatar key={idx} className="h-5 w-5 border border-background">
                                      <AvatarFallback className="text-[8px]">
                                        {msg.sender.split(" ").map(n => n[0]).join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                <span className="text-muted-foreground">
                                  {chat.messages.length} messages
                                </span>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                      
                      {/* Chat messages */}
                      <div className="flex-1 flex flex-col">
                        <div className="p-3 border-b flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">
                              {CHAT_MESSAGES.find(c => c.ticketId === selectedChat)?.ticketId}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {CHAT_MESSAGES.find(c => c.ticketId === selectedChat)?.title}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost">
                            View Ticket
                          </Button>
                        </div>
                        
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-4">
                            {CHAT_MESSAGES.find(c => c.ticketId === selectedChat)?.messages.map((message, idx) => (
                              <div key={idx} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                    {message.sender.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{message.sender}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date().toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1">{message.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <div className="p-3 border-t">
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Type your message..." 
                              className="flex-1" 
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button onClick={handleSendMessage}>
                              <Send className="h-4 w-4 mr-2" /> Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Reminders */}
            <div className="col-span-12 lg:col-span-4">
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.1 }}
              >
                <Card className="bg-white/60 border-purple-100/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <span>Reminders</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {reminders.map(reminder => (
                          <motion.div 
                            key={reminder.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 border rounded-md ${
                              reminder.completed ? "bg-muted/30" : "bg-card/50"
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="mr-2 pt-0.5">
                                <Checkbox 
                                  checked={reminder.completed}
                                  onCheckedChange={() => toggleReminderCompletion(reminder.id)}
                                  className={`${
                                    reminder.priority === "high" ? "text-red-600 data-[state=checked]:bg-red-600" : 
                                    reminder.priority === "medium" ? "text-amber-600 data-[state=checked]:bg-amber-600" : 
                                    "text-green-600 data-[state=checked]:bg-green-600"
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className={`text-sm font-medium ${
                                  reminder.completed ? "line-through text-muted-foreground" : ""
                                }`}>
                                  {reminder.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className={`
                                    ${
                                      reminder.priority === "high" ? "bg-red-50 text-red-700 border-red-200" :
                                      reminder.priority === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                      "bg-green-50 text-green-700 border-green-200"
                                    }
                                  `}>
                                    {reminder.priority}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {reminder.dueDate.toLocaleDateString()} 
                                    {" • "}
                                    {reminder.dueDate.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" /> Add Reminder
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Reminder</DialogTitle>
                          <DialogDescription>
                            Create a new reminder for tasks and follow-ups
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...reminderForm}>
                          <form onSubmit={reminderForm.handleSubmit(onAddReminder)} className="space-y-4">
                            <FormField
                              control={reminderForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Reminder title" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={reminderForm.control}
                              name="dueDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Due Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="datetime-local" 
                                      {...field} 
                                      value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                                      onChange={(e) => {
                                        field.onChange(new Date(e.target.value));
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={reminderForm.control}
                              name="priority"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Priority</FormLabel>
                                  <FormControl>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button type="submit">Add Reminder</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentsPage;
