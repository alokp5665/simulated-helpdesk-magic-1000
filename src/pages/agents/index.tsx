import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"; // Import the Input component
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  TicketCheck, 
  Users2, 
  ClipboardCheck, 
  Clock, 
  Trophy, 
  Award, 
  Bell, 
  Calendar,
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  BarChart3, 
  Star, 
  Clock8, 
  Zap, 
  Heart, 
  CircleDot, 
  CalendarClock,
  NotebookText,
  BadgeCheck,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Gift,
  Activity
} from "lucide-react";
import "../styles/social.css";

// Types
interface Agent {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  department: string;
  expertise: string;
  lastActive?: Date;
  ticketsResolved: number;
  averageResponseTime: string;
  customerSatisfaction: number;
  availability: {
    start: string;
    end: string;
    status: "Available" | "Busy" | "On Break";
  };
  achievements: string[];
  points: number;
}

interface Ticket {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  assignedTo?: Agent;
  assignedBy: string;
  createdAt: Date;
  description: string;
  customerName: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface Activity {
  id: string;
  agentId: string;
  type: "resolved" | "responded" | "assigned" | "logged" | "achievement";
  description: string;
  timestamp: Date;
  ticketId?: string;
}

interface Reminder {
  id: string;
  agentId: string;
  message: string;
  dueDate: Date;
  isCompleted: boolean;
}

// Indian Hindu Names
const AGENTS: Agent[] = [
  { 
    id: "1", 
    name: "Aarav Sharma", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Support", 
    expertise: "Technical",
    ticketsResolved: 24,
    averageResponseTime: "4.2 min",
    customerSatisfaction: 4.8,
    availability: { start: "9:00 AM", end: "5:00 PM", status: "Available" },
    achievements: ["FastestResponder", "CustomerHero"],
    points: 1250
  },
  { 
    id: "2", 
    name: "Priya Patel", 
    avatar: "/placeholder.svg", 
    isOnline: false, 
    department: "Technical", 
    expertise: "Backend",
    ticketsResolved: 18,
    averageResponseTime: "5.8 min",
    customerSatisfaction: 4.6,
    availability: { start: "8:00 AM", end: "4:00 PM", status: "On Break" },
    achievements: ["ProblemSolver", "TeamPlayer"],
    points: 980
  },
  { 
    id: "3", 
    name: "Vivek Malhotra", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Sales", 
    expertise: "Enterprise",
    ticketsResolved: 29,
    averageResponseTime: "3.9 min",
    customerSatisfaction: 4.9,
    availability: { start: "10:00 AM", end: "6:00 PM", status: "Available" },
    achievements: ["TopPerformer", "SalesGuru"],
    points: 1480
  },
  { 
    id: "4", 
    name: "Anika Reddy", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Support", 
    expertise: "Mobile",
    ticketsResolved: 21,
    averageResponseTime: "4.5 min",
    customerSatisfaction: 4.7,
    availability: { start: "9:00 AM", end: "5:00 PM", status: "Busy" },
    achievements: ["QuickResolver", "MobileExpert"],
    points: 1120
  },
  { 
    id: "5", 
    name: "Arjun Kapoor", 
    avatar: "/placeholder.svg", 
    isOnline: false, 
    department: "Technical", 
    expertise: "Frontend",
    ticketsResolved: 16,
    averageResponseTime: "6.2 min",
    customerSatisfaction: 4.5,
    availability: { start: "8:30 AM", end: "4:30 PM", status: "On Break" },
    achievements: ["UISpecialist", "CodeMaster"],
    points: 870
  },
  { 
    id: "6", 
    name: "Ishaan Joshi", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Support", 
    expertise: "Database",
    ticketsResolved: 22,
    averageResponseTime: "4.8 min",
    customerSatisfaction: 4.6,
    availability: { start: "9:30 AM", end: "5:30 PM", status: "Available" },
    achievements: ["DataWizard", "KnowledgeBase"],
    points: 1050
  },
  { 
    id: "7", 
    name: "Ananya Desai", 
    avatar: "/placeholder.svg", 
    isOnline: false, 
    department: "Sales", 
    expertise: "SMB",
    ticketsResolved: 15,
    averageResponseTime: "5.5 min",
    customerSatisfaction: 4.4,
    availability: { start: "10:00 AM", end: "6:00 PM", status: "Busy" },
    achievements: ["ClientWhisperer", "SalesStar"],
    points: 920
  },
  { 
    id: "8", 
    name: "Rohan Mehta", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Technical", 
    expertise: "Security",
    ticketsResolved: 19,
    averageResponseTime: "5.1 min",
    customerSatisfaction: 4.7,
    availability: { start: "8:00 AM", end: "4:00 PM", status: "Available" },
    achievements: ["SecurityGuru", "FirewallMaster"],
    points: 1180
  }
];

const SAMPLE_TICKETS = [
  "Mobile app sync issue",
  "Dashboard loading slow",
  "Payment gateway error",
  "API integration failure",
  "User authentication bug",
  "Database connection error",
  "Push notification issue",
  "Search functionality broken",
  "Email verification not working",
  "Password reset failed",
  "Account deactivation problem",
  "Failed transaction recovery",
  "Data migration error",
  "Server timeout issue",
  "UI rendering problem",
  "Cart checkout failure"
];

const TICKET_DESCRIPTIONS = [
  "Customer is unable to access their account after the recent update.",
  "The payment transaction is being declined despite valid card information.",
  "Mobile app crashes when trying to view order history.",
  "User reports that email notifications are not being received.",
  "Products are not appearing in search results despite being in stock.",
  "Customer unable to complete checkout process, gets stuck at payment page.",
  "Dashboard statistics not updating in real-time as expected.",
  "Integration with third-party service is failing intermittently.",
  "Customer data is not syncing across multiple devices.",
  "Export functionality creating corrupted files.",
  "Premium features not activating after subscription payment.",
  "User unable to upload profile picture, gets error message."
];

const CUSTOMER_NAMES = [
  "Rahul Singh", "Anjali Desai", "Karan Malhotra", "Divya Gupta", "Vikram Joshi",
  "Meera Sharma", "Prakash Kumar", "Neha Pandit", "Ajay Chatterjee", "Pooja Patel",
  "Deepak Sinha", "Kavita Rao", "Aditya Trivedi", "Ritu Bajaj", "Sunil Mehra",
  "Sneha Verma", "Nikhil Saxena", "Shikha Gupta", "Mohit Khanna", "Riya Chakraborty"
];

const TEAM_CHAT_MESSAGES = [
  "Can someone take Ticket #4532?",
  "I'm on it! Will update in 10 minutes.",
  "Customer needs urgent assistance with payment issue.",
  "Just resolved the API integration problem. Documentation updated.",
  "Team sync at 4 PM IST today.",
  "Need help with a complex database issue.",
  "Taking a quick break, back in 15.",
  "Can someone review my solution for Ticket #6754?",
  "Great work on that fix, Aarav!",
  "Anyone know how to reproduce the mobile sync bug?",
  "I'll be handling all security-related tickets today.",
  "Server maintenance scheduled for tonight 10 PM IST.",
  "Who's the point person for the new dashboard feature?",
  "Customer feedback for my tickets has been very positive today!",
  "Reminder: Update your knowledge base articles by Friday.",
  "The new troubleshooting guide is now available.",
  "I've created a template for handling payment issues.",
  "Can someone assist with an escalated enterprise client?",
  "Mobile team: Please check your pending code reviews.",
  "Just hit my monthly resolution target! 🎉",
  "Reminder: Customer satisfaction survey going out tomorrow.",
  "Who has experience with the new authentication system?",
  "I've documented the solution for the recurring checkout bug.",
  "Heads up - seeing several login issues after the update.",
  "Need a second pair of eyes on this complex case.",
  "What's the SLA for premium customer tickets?",
  "Training session on new tools tomorrow at 11 AM.",
  "Great response time today, team! Keep it up.",
  "Has anyone handled a similar issue to Ticket #8976?",
  "Just created a new shortcut for common responses."
];

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedTicketTitle, setSelectedTicketTitle] = useState("");
  const [sortLeaderboard, setSortLeaderboard] = useState<"tickets" | "satisfaction" | "points">("tickets");
  
  const activityFeedRef = useRef<HTMLDivElement>(null);
  const chatFeedRef = useRef<HTMLDivElement>(null);

  // Initialize with some data
  useEffect(() => {
    // Generate initial tickets
    const initialTickets: Ticket[] = [];
    for (let i = 0; i < 7; i++) {
      const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const customerIndex = Math.floor(Math.random() * CUSTOMER_NAMES.length);
      
      initialTickets.push({
        id: `TICK-${1000 + i}`,
        title: SAMPLE_TICKETS[Math.floor(Math.random() * SAMPLE_TICKETS.length)],
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
        status: ["open", "in-progress", "resolved"][Math.floor(Math.random() * 3)] as "open" | "in-progress" | "resolved",
        assignedTo: Math.random() > 0.3 ? randomAgent : undefined,
        assignedBy: "System",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)),
        description: TICKET_DESCRIPTIONS[Math.floor(Math.random() * TICKET_DESCRIPTIONS.length)],
        customerName: CUSTOMER_NAMES[customerIndex]
      });
    }
    setTickets(initialTickets);
    
    // Generate initial activities
    const initialActivities: Activity[] = [];
    for (let i = 0; i < 10; i++) {
      const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const activityTypes: ("resolved" | "responded" | "assigned" | "logged" | "achievement")[] = ["resolved", "responded", "assigned", "logged", "achievement"];
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      let description = "";
      if (type === "resolved") {
        description = `resolved Ticket #${1000 + Math.floor(Math.random() * 500)}`;
      } else if (type === "responded") {
        description = `responded to a customer query in Ticket #${1000 + Math.floor(Math.random() * 500)}`;
      } else if (type === "assigned") {
        description = `was assigned Ticket #${1000 + Math.floor(Math.random() * 500)}`;
      } else if (type === "logged") {
        description = `logged in from a ${Math.random() > 0.5 ? 'new device' : 'new location'}`;
      } else {
        description = `earned the ${randomAgent.achievements[Math.floor(Math.random() * randomAgent.achievements.length)]} badge`;
      }
      
      initialActivities.push({
        id: `act-${i}`,
        agentId: randomAgent.id,
        type,
        description,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
        ticketId: type !== "logged" && type !== "achievement" ? `${1000 + Math.floor(Math.random() * 500)}` : undefined
      });
    }
    setActivities(initialActivities);
    
    // Generate initial team messages
    const initialMessages: Message[] = [];
    for (let i = 0; i < 8; i++) {
      const sender = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      let receiver;
      do {
        receiver = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      } while (receiver.id === sender.id);
      
      initialMessages.push({
        id: `msg-${i}`,
        senderId: sender.id,
        receiverId: receiver.id,
        content: TEAM_CHAT_MESSAGES[Math.floor(Math.random() * TEAM_CHAT_MESSAGES.length)],
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000))
      });
    }
    setMessages(initialMessages);
    
    // Generate initial reminders
    const initialReminders: Reminder[] = [];
    for (let i = 0; i < 5; i++) {
      const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      
      initialReminders.push({
        id: `rem-${i}`,
        agentId: randomAgent.id,
        message: `You have ${1 + Math.floor(Math.random() * 5)} pending tickets due today.`,
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 86400000)),
        isCompleted: Math.random() > 0.7
      });
    }
    setReminders(initialReminders);
  }, []);

  // Simulate changing agent online status and availability
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const wasOnline = agent.isOnline;
        const isOnline = Math.random() > 0.3;
        
        // If agent status changed, add an activity
        if (wasOnline !== isOnline) {
          setActivities(prev => [{
            id: `act-${Date.now()}`,
            agentId: agent.id,
            type: "logged",
            description: isOnline ? "logged in to the system" : "logged out of the system",
            timestamp: new Date()
          }, ...prev.slice(0, 29)]);
          
          // Also show notification
          if (isOnline) {
            toast(
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{agent.name} is now online</p>
                  <p className="text-xs text-muted-foreground">Available for ticket assignments</p>
                </div>
              </div>
            );
          }
        }
        
        // Randomly update availability status
        const availabilityStatuses: ("Available" | "Busy" | "On Break")[] = ["Available", "Busy", "On Break"];
        const newStatus = Math.random() > 0.8 ? availabilityStatuses[Math.floor(Math.random() * availabilityStatuses.length)] : agent.availability.status;
        
        return {
          ...agent,
          isOnline,
          lastActive: isOnline ? new Date() : agent.lastActive || new Date(),
          availability: {
            ...agent.availability,
            status: newStatus
          }
        };
      }));
    }, 5000);

    return () => clearInterval(statusInterval);
  }, []);

  // Simulate new tickets and auto-assignment
  useEffect(() => {
    const ticketInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const customerIndex = Math.floor(Math.random() * CUSTOMER_NAMES.length);
        const ticketTitle = SAMPLE_TICKETS[Math.floor(Math.random() * SAMPLE_TICKETS.length)];
        const ticketId = `TICK-${1000 + Math.floor(Math.random() * 9000)}`;
        
        const newTicket: Ticket = {
          id: ticketId,
          title: ticketTitle,
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          status: "open",
          assignedBy: "System",
          createdAt: new Date(),
          description: TICKET_DESCRIPTIONS[Math.floor(Math.random() * TICKET_DESCRIPTIONS.length)],
          customerName: CUSTOMER_NAMES[customerIndex]
        };
        
        // Auto-assign to a random online agent
        const onlineAgents = agents.filter(a => a.isOnline);
        if (onlineAgents.length > 0) {
          const randomAgent = onlineAgents[Math.floor(Math.random() * onlineAgents.length)];
          newTicket.assignedTo = randomAgent;
          newTicket.status = "in-progress";
          
          // Add to activities
          setActivities(prev => [{
            id: `act-${Date.now()}`,
            agentId: randomAgent.id,
            type: "assigned",
            description: `was assigned Ticket #${ticketId.split('-')[1]}`,
            timestamp: new Date(),
            ticketId: ticketId.split('-')[1]
          }, ...prev.slice(0, 29)]);
          
          toast(
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <TicketCheck className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="font-medium">Ticket #{ticketId.split('-')[1]} assigned</p>
                <p className="text-sm text-muted-foreground">
                  {ticketTitle} assigned to {randomAgent.name}
                </p>
                <div className="mt-1">
                  <Badge variant={
                    newTicket.priority === "high" ? "destructive" :
                    newTicket.priority === "medium" ? "default" :
                    "secondary"
                  }>
                    {newTicket.priority}
                  </Badge>
                </div>
              </div>
            </div>
          );
        }
        
        setTickets(prev => [...prev, newTicket]);
      }
      
      // Randomly resolve tickets
      if (Math.random() > 0.7 && tickets.length > 0) {
        const inProgressTickets = tickets.filter(t => t.status === "in-progress" && t.assignedTo);
        if (inProgressTickets.length > 0) {
          const ticketToResolve = inProgressTickets[Math.floor(Math.random() * inProgressTickets.length)];
          const agent = ticketToResolve.assignedTo!;
          
          // Update the ticket
          setTickets(prev => prev.map(t => 
            t.id === ticketToResolve.id ? { ...t, status: "resolved" } : t
          ));
          
          // Add to activities
          setActivities(prev => [{
            id: `act-${Date.now()}`,
            agentId: agent.id,
            type: "resolved",
            description: `resolved Ticket #${ticketToResolve.id.split('-')[1]}`,
            timestamp: new Date(),
            ticketId: ticketToResolve.id.split('-')[1]
          }, ...prev.slice(0, 29)]);
          
          // Update agent stats
          setAgents(prev => prev.map(a => 
            a.id === agent.id 
              ? { 
                ...a, 
                ticketsResolved: a.ticketsResolved + 1,
                points: a.points + (ticketToResolve.priority === "high" ? 30 : 
                                   ticketToResolve.priority === "medium" ? 20 : 10)
              } 
              : a
          ));
          
          toast(
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Ticket resolved</p>
                <p className="text-sm text-muted-foreground">
                  {agent.name} resolved ticket #{ticketToResolve.id.split('-')[1]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ticketToResolve.title}
                </p>
              </div>
            </div>
          );
        }
      }
    }, 8000);

    return () => clearInterval(ticketInterval);
  }, [agents, tickets]);

  // Simulate team communication
  useEffect(() => {
    const chatInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const sender = agents[Math.floor(Math.random() * agents.length)];
        let receiver;
        do {
          receiver = agents[Math.floor(Math.random() * agents.length)];
        } while (receiver.id === sender.id);

        const messageContent = TEAM_CHAT_MESSAGES[Math.floor(Math.random() * TEAM_CHAT_MESSAGES.length)];
        
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: sender.id,
          receiverId: receiver.id,
          content: messageContent,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev.slice(-19), newMessage]);
        
        // Scroll chat to bottom
        setTimeout(() => {
          chatFeedRef.current?.scrollTo({
            top: chatFeedRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }, 6000);

    return () => clearInterval(chatInterval);
  }, [agents]);

  // Simulate agent achievements
  useEffect(() => {
    const achievementInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        
        const achievements = [
          "SpeedDemon", "CustomerChampion", "ProblemSolver", "TopPerformer", 
          "TeamPlayer", "KnowledgeGuru", "MobileExpert", "SecuritySage"
        ];
        
        const achievement = achievements[Math.floor(Math.random() * achievements.length)];
        
        if (!randomAgent.achievements.includes(achievement)) {
          // Add achievement to agent
          setAgents(prev => prev.map(a => 
            a.id === randomAgent.id 
              ? { ...a, achievements: [...a.achievements, achievement] } 
              : a
          ));
          
          // Add to activities
          setActivities(prev => [{
            id: `act-${Date.now()}`,
            agentId: randomAgent.id,
            type: "achievement",
            description: `earned the ${achievement} badge`,
            timestamp: new Date()
          }, ...prev.slice(0, 29)]);
          
          toast(
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium">Achievement Unlocked!</p>
                <p className="text-sm text-muted-foreground">
                  {randomAgent.name} earned the {achievement} badge
                </p>
              </div>
            </div>
          );
        }
      }
    }, 25000);

    return () => clearInterval(achievementInterval);
  }, [agents]);

  // Manually assign ticket 
  const handleAssignTicket = () => {
    if (!selectedAgent || !selectedTicketTitle) {
      // Fix the toast syntax - removed 'description' property
      toast("Please select an agent and provide a ticket title", {
        className: "bg-red-50 border-red-200 text-red-600",
      });
      return;
    }
    
    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;
    
    const ticketId = `TICK-${1000 + Math.floor(Math.random() * 9000)}`;
    const customerIndex = Math.floor(Math.random() * CUSTOMER_NAMES.length);
    
    const newTicket: Ticket = {
      id: ticketId,
      title: selectedTicketTitle,
      priority: selectedPriority,
      status: "in-progress",
      assignedTo: agent,
      assignedBy: "You",
      createdAt: new Date(),
      description: TICKET_DESCRIPTIONS[Math.floor(Math.random() * TICKET_DESCRIPTIONS.length)],
      customerName: CUSTOMER_NAMES[customerIndex]
    };
    
    setTickets(prev => [...prev, newTicket]);
    
    // Add to activities
    setActivities(prev => [{
      id: `act-${Date.now()}`,
      agentId: agent.id,
      type: "assigned",
      description: `was manually assigned Ticket #${ticketId.split('-')[1]}`,
      timestamp: new Date(),
      ticketId: ticketId.split('-')[1]
    }, ...prev.slice(0, 29)]);
    
    toast(
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">
          <TicketCheck className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <p className="font-medium">Ticket Manually Assigned</p>
          <p className="text-sm text-muted-foreground">
            {selectedTicketTitle} assigned to {agent.name}
          </p>
          <div className="mt-1">
            <Badge variant={
              selectedPriority === "high" ? "destructive" :
              selectedPriority === "medium" ? "default" :
              "secondary"
            }>
              {selectedPriority}
            </Badge>
          </div>
        </div>
      </div>
    );
    
    // Reset dialog
    setShowTicketDialog(false);
    setSelectedAgent("");
    setSelectedPriority("medium");
    setSelectedTicketTitle("");
  };

  // Format time difference
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Agent Management</h1>
            <div className="flex space-x-2">
              <Button onClick={() => setShowTicketDialog(true)} className="shadow-md">
                <TicketCheck className="mr-2 h-4 w-4" />
                Assign Ticket
              </Button>
            </div>
          </div>
          
          {/* Main Dashboard - Bento Grid Layout */}
          <div className="bentoGrid mb-6">
            {/* Stats Overview - Spans 6 columns on large screens */}
            <Card className="col-span-12 lg:col-span-6 premium-card hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                    <div className="text-xs text-indigo-600 dark:text-indigo-300 mb-1 font-medium">Active Agents</div>
                    <div className="text-2xl font-bold">{agents.filter(a => a.isOnline).length}</div>
                    <div className="text-xs text-indigo-500/70 dark:text-indigo-400/70 mt-1">
                      {Math.round((agents.filter(a => a.isOnline).length / agents.length) * 100)}% online
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                    <div className="text-xs text-emerald-600 dark:text-emerald-300 mb-1 font-medium">Tickets Resolved</div>
                    <div className="text-2xl font-bold">{tickets.filter(t => t.status === "resolved").length}</div>
                    <div className="text-xs text-emerald-500/70 dark:text-emerald-400/70 mt-1">
                      Today: {Math.floor(tickets.filter(t => t.status === "resolved").length * 0.65)}
                    </div>
                  </div>
