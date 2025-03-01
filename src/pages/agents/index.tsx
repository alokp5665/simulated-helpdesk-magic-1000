
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  MessageSquare, 
  TicketCheck, 
  Users2, 
  ClipboardCheck, 
  Clock, 
  Award, 
  Star, 
  Bell, 
  Calendar as CalendarIcon, 
  ChevronUp, 
  ChevronDown, 
  Send, 
  CheckCircle2, 
  Trophy, 
  Zap,
  BarChart4,
  PieChart,
  LineChart,
  Timer
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  department: string;
  expertise: string;
  lastActive?: Date;
  metrics?: {
    ticketsResolved: number;
    responseTime: number;
    satisfaction: number;
  };
  rewards?: {
    points: number;
    badges: string[];
  };
  availability?: {
    status: "Available" | "Busy" | "On Break" | "Offline";
    startTime: string;
    endTime: string;
  };
}

interface Ticket {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  assignedTo?: Agent;
  assignedBy: string;
  createdAt: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface ActivityLog {
  id: string;
  agentId: string;
  action: string;
  details: string;
  timestamp: Date;
}

interface Reminder {
  id: string;
  agentId: string;
  message: string;
  timestamp: Date;
}

// Updated names to Indian Hindu names
const AGENTS: Agent[] = [
  { 
    id: "1", 
    name: "Aditya Sharma", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Support", 
    expertise: "Technical",
    metrics: {
      ticketsResolved: 15,
      responseTime: 4.8,
      satisfaction: 4.9
    },
    rewards: {
      points: 1250,
      badges: ["FastResponder", "Customer Hero", "Team Player"]
    },
    availability: {
      status: "Available",
      startTime: "9:00 AM",
      endTime: "5:00 PM"
    }
  },
  { 
    id: "2", 
    name: "Neeraj Patel", 
    avatar: "/placeholder.svg", 
    isOnline: false, 
    department: "Technical", 
    expertise: "Backend",
    metrics: {
      ticketsResolved: 12,
      responseTime: 5.2,
      satisfaction: 4.7
    },
    rewards: {
      points: 980,
      badges: ["Bug Crusher", "Knowledge Expert"]
    },
    availability: {
      status: "Offline",
      startTime: "10:00 AM",
      endTime: "6:00 PM"
    }
  },
  { 
    id: "3", 
    name: "Kavita Desai", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Sales", 
    expertise: "Enterprise",
    metrics: {
      ticketsResolved: 18,
      responseTime: 3.5,
      satisfaction: 4.8
    },
    rewards: {
      points: 1420,
      badges: ["Sales Star", "Enterprise Expert", "Customer Delight"]
    },
    availability: {
      status: "Busy",
      startTime: "8:30 AM",
      endTime: "4:30 PM"
    }
  },
  { 
    id: "4", 
    name: "Arjun Singh", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Support", 
    expertise: "Mobile",
    metrics: {
      ticketsResolved: 14,
      responseTime: 4.2,
      satisfaction: 4.6
    },
    rewards: {
      points: 1100,
      badges: ["Mobile Guru", "Quick Resolver"]
    },
    availability: {
      status: "Available",
      startTime: "9:00 AM",
      endTime: "5:00 PM"
    }
  },
  { 
    id: "5", 
    name: "Divya Gupta", 
    avatar: "/placeholder.svg", 
    isOnline: false, 
    department: "Technical", 
    expertise: "Frontend",
    metrics: {
      ticketsResolved: 16,
      responseTime: 3.8,
      satisfaction: 4.9
    },
    rewards: {
      points: 1350,
      badges: ["UI Wizard", "Customer Champion"]
    },
    availability: {
      status: "On Break",
      startTime: "9:30 AM",
      endTime: "5:30 PM"
    }
  },
  { 
    id: "6", 
    name: "Rohan Malhotra", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Support", 
    expertise: "General",
    metrics: {
      ticketsResolved: 13,
      responseTime: 5.0,
      satisfaction: 4.7
    },
    rewards: {
      points: 950,
      badges: ["Reliable Support", "Team Player"]
    },
    availability: {
      status: "Available",
      startTime: "8:00 AM",
      endTime: "4:00 PM"
    }
  },
  { 
    id: "7", 
    name: "Anjali Reddy", 
    avatar: "/placeholder.svg", 
    isOnline: true, 
    department: "Technical", 
    expertise: "Security",
    metrics: {
      ticketsResolved: 11,
      responseTime: 6.1,
      satisfaction: 4.5
    },
    rewards: {
      points: 870,
      badges: ["Security Specialist"]
    },
    availability: {
      status: "Busy",
      startTime: "10:00 AM",
      endTime: "6:00 PM"
    }
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
  "Checkout process failing",
  "Account verification error",
  "Premium subscription issue",
  "Data migration problem",
  "Report generation failure",
  "User profile update error",
  "Service access denied"
];

const SAMPLE_MESSAGES = [
  "Can you look into ticket #4532?",
  "Customer needs urgent assistance",
  "I've fixed the database issue",
  "Team sync at 4 PM IST",
  "Need help with this case",
  "Taking a quick break",
  "Documentation update needed",
  "Great work on that fix!",
  "Who can help with this security issue?",
  "The new update is causing issues",
  "I'll be out tomorrow, can someone cover?",
  "Has anyone seen similar errors before?",
  "Customer is very satisfied with the solution",
  "Need more details to proceed with this ticket",
  "The server is back online now",
  "Let's discuss this in the team meeting",
  "This is a recurring issue, needs permanent fix",
  "Can someone review my solution?",
  "This ticket might need escalation",
  "I've created a knowledge base article for this",
  "Customer wants a call back ASAP",
  "Similar issues reported by multiple users",
  "The workaround seems to be working",
  "Great response time on that ticket!",
  "The bug has been identified and fixed",
  "Thanks for the assistance with the complex case",
  "This will require a code update",
  "Can we schedule a team brainstorming?",
  "Let's improve our documentation on this",
  "The new process is working well so far"
];

const ACTIVITY_TYPES = [
  "resolved ticket",
  "responded to",
  "updated",
  "escalated",
  "assigned",
  "created knowledge article for",
  "closed",
  "reopened",
  "tagged team member on"
];

const BADGE_TYPES = [
  { name: "FastResponder", icon: "⚡" },
  { name: "Customer Hero", icon: "🛡️" },
  { name: "Team Player", icon: "🤝" },
  { name: "Knowledge Expert", icon: "📚" },
  { name: "Bug Crusher", icon: "🐞" },
  { name: "Solution Master", icon: "🧩" },
  { name: "Top Performer", icon: "🏆" },
  { name: "Reliable Support", icon: "🔄" },
  { name: "Security Specialist", icon: "🔒" },
  { name: "UI Wizard", icon: "✨" }
];

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high">("medium");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [ticketStats, setTicketStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  const activityEndRef = useRef<HTMLDivElement>(null);

  // Simulate changing agent online status and last active time
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const isOnlineNow = Math.random() > 0.3;
        return {
          ...agent,
          isOnline: isOnlineNow,
          lastActive: isOnlineNow ? new Date() : agent.lastActive || new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)),
          availability: {
            ...agent.availability,
            status: isOnlineNow 
              ? Math.random() > 0.7 
                ? "Busy" 
                : Math.random() > 0.8 
                  ? "On Break" 
                  : "Available"
              : "Offline"
          }
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate new tickets and auto-assignment
  useEffect(() => {
    const interval = setInterval(() => {
      if (tickets.length < 20 && Math.random() > 0.7) {
        const newTicket: Ticket = {
          id: `T-${Date.now().toString().slice(-4)}`,
          title: SAMPLE_TICKETS[Math.floor(Math.random() * SAMPLE_TICKETS.length)],
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          status: "open",
          assignedBy: "System Admin",
          createdAt: new Date()
        };
        
        // Auto-assign to a random online agent
        const onlineAgents = agents.filter(a => a.isOnline);
        if (onlineAgents.length > 0) {
          const randomAgent = onlineAgents[Math.floor(Math.random() * onlineAgents.length)];
          newTicket.assignedTo = randomAgent;
          newTicket.status = "in-progress";
          
          toast(`Ticket #${newTicket.id} assigned to ${randomAgent.name}`, {
            description: `Priority: ${newTicket.priority}`,
            duration: 3000,
          });

          // Add to activity log
          const newActivity: ActivityLog = {
            id: Date.now().toString(),
            agentId: randomAgent.id,
            action: "was assigned",
            details: `Ticket #${newTicket.id}: ${newTicket.title}`,
            timestamp: new Date()
          };
          
          setActivityLogs(prev => [newActivity, ...prev.slice(0, 29)]);
        }
        
        setTickets(prev => [...prev, newTicket]);
        updateTicketStats([...tickets, newTicket]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [agents, tickets]);

  // Simulate team communication
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const sender = agents[Math.floor(Math.random() * agents.length)];
        let receiver;
        do {
          receiver = agents[Math.floor(Math.random() * agents.length)];
        } while (receiver.id === sender.id);

        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: sender.id,
          receiverId: receiver.id,
          content: SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)],
          timestamp: new Date()
        };
        
        setMessages(prev => [newMessage, ...prev.slice(0, 29)]);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [agents]);

  // Simulate ticket resolution and metrics update
  useEffect(() => {
    const interval = setInterval(() => {
      if (tickets.length > 0 && Math.random() > 0.7) {
        const ticketIndex = Math.floor(Math.random() * tickets.length);
        const ticketToResolve = tickets[ticketIndex];
        
        if (ticketToResolve.status === "in-progress" && ticketToResolve.assignedTo) {
          const updatedTickets = [...tickets];
          updatedTickets[ticketIndex] = {
            ...ticketToResolve,
            status: "resolved"
          };
          
          // Update agent metrics
          const updatedAgents = agents.map(agent => {
            if (agent.id === ticketToResolve.assignedTo?.id) {
              const updatedMetrics = {
                ticketsResolved: (agent.metrics?.ticketsResolved || 0) + 1,
                responseTime: Math.max(2.8, ((agent.metrics?.responseTime || 5) * 10 - Math.random()) / 10),
                satisfaction: Math.min(5, ((agent.metrics?.satisfaction || 4.5) * 10 + Math.random()) / 10)
              };

              const updatedRewards = {
                points: (agent.rewards?.points || 0) + Math.floor(50 + Math.random() * 50),
                badges: agent.rewards?.badges || []
              };

              // Randomly award a new badge if points threshold met and doesn't have too many badges
              if (updatedRewards.points > 1000 && updatedRewards.badges.length < 5 && Math.random() > 0.8) {
                // Find a badge they don't have yet
                const availableBadges = BADGE_TYPES.filter(badge => 
                  !updatedRewards.badges.includes(badge.name)
                );
                
                if (availableBadges.length > 0) {
                  const newBadge = availableBadges[Math.floor(Math.random() * availableBadges.length)];
                  updatedRewards.badges = [...updatedRewards.badges, newBadge.name];
                  
                  // Show badge earned notification
                  toast(`${agent.name} earned a new badge!`, {
                    description: `${newBadge.icon} ${newBadge.name}`,
                    duration: 4000,
                  });
                }
              }

              return {
                ...agent,
                metrics: updatedMetrics,
                rewards: updatedRewards
              };
            }
            return agent;
          });

          // Add to activity log
          if (ticketToResolve.assignedTo) {
            const newActivity: ActivityLog = {
              id: Date.now().toString(),
              agentId: ticketToResolve.assignedTo.id,
              action: "resolved",
              details: `Ticket #${ticketToResolve.id}: ${ticketToResolve.title}`,
              timestamp: new Date()
            };
            
            setActivityLogs(prev => [newActivity, ...prev.slice(0, 29)]);
            
            toast(`${ticketToResolve.assignedTo.name} resolved a ticket`, {
              description: `Successfully closed #${ticketToResolve.id}`,
              duration: 3000,
            });
          }
          
          setTickets(updatedTickets);
          setAgents(updatedAgents);
          updateTicketStats(updatedTickets);
        }
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [tickets, agents]);

  // Simulate reminders
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const pendingCount = Math.floor(Math.random() * 5) + 1;
        
        const newReminder: Reminder = {
          id: Date.now().toString(),
          agentId: randomAgent.id,
          message: `You have ${pendingCount} pending ticket${pendingCount > 1 ? 's' : ''} due today.`,
          timestamp: new Date()
        };
        
        setReminders(prev => [newReminder, ...prev.slice(0, 14)]);
        
        if (Math.random() > 0.7) {
          toast(`Reminder for ${randomAgent.name}`, {
            description: newReminder.message,
            duration: 4000,
          });
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [agents]);

  // Auto scroll to bottom of activity feed
  useEffect(() => {
    if (activityEndRef.current) {
      activityEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activityLogs]);

  // Update ticket stats
  const updateTicketStats = (currentTickets: Ticket[]) => {
    setTicketStats({
      open: currentTickets.filter(t => t.status === "open").length,
      inProgress: currentTickets.filter(t => t.status === "in-progress").length,
      resolved: currentTickets.filter(t => t.status === "resolved").length
    });
  };

  // Calculate timeAgo for lastActive
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  // Handle manual ticket assignment
  const handleAssignTicket = () => {
    if (!selectedAgent || !selectedPriority) {
      toast("Please select an agent and priority", {
        description: "Both fields are required for assignment",
        duration: 3000,
      });
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const newTicket: Ticket = {
      id: `T-${Date.now().toString().slice(-4)}`,
      title: SAMPLE_TICKETS[Math.floor(Math.random() * SAMPLE_TICKETS.length)],
      priority: selectedPriority,
      status: "in-progress",
      assignedTo: agent,
      assignedBy: "You",
      createdAt: new Date()
    };

    // Add to activity log
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      agentId: agent.id,
      action: "was manually assigned",
      details: `Ticket #${newTicket.id}: ${newTicket.title}`,
      timestamp: new Date()
    };
    
    setActivityLogs(prev => [newActivity, ...prev.slice(0, 29)]);
    
    toast(`Ticket #${newTicket.id} assigned to ${agent.name}`, {
      description: `Priority: ${newTicket.priority}`,
      duration: 3000,
    });

    setTickets(prev => [...prev, newTicket]);
    updateTicketStats([...tickets, newTicket]);
    setSelectedAgent("");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 inline-block text-transparent bg-clip-text">Agent Management</h1>
          
          {/* Top row metrics */}
          <div className="bentoGrid mb-6">
            <Card className="col-span-3 glass-card hover-scale depth-effect shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                  <TicketCheck className="h-5 w-5 text-primary" />
                  <span>Ticket Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{ticketStats.open}</div>
                    <div className="text-sm text-muted-foreground">Open</div>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{ticketStats.inProgress}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{ticketStats.resolved}</div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-5 glass-card hover-scale depth-effect shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <span>Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[60px] w-full bg-accent/20 rounded-md relative overflow-hidden">
                  {/* Simulated graph with animated bars */}
                  <div className="absolute inset-0 flex items-end justify-around">
                    {[...Array(14)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-[5%] bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-sm shimmer-effect"
                        style={{ 
                          height: `${Math.max(15, Math.floor(Math.sin(i/2) * 30 + 50))}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-4 glass-card hover-scale depth-effect shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {agents
                    .sort((a, b) => (b.metrics?.ticketsResolved || 0) - (a.metrics?.ticketsResolved || 0))
                    .slice(0, 3)
                    .map((agent, index) => (
                      <div key={agent.id} className="text-center flex flex-col items-center">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={agent.avatar} />
                            <AvatarFallback className={index === 0 ? "bg-yellow-100 text-yellow-800" : index === 1 ? "bg-gray-100 text-gray-800" : "bg-amber-100 text-amber-800"}>
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <span className="absolute -top-1 -right-1 text-yellow-500">🏆</span>
                          )}
                        </div>
                        <span className="text-xs font-medium mt-1">{agent.name.split(' ')[0]}</span>
                        <span className="text-xs text-muted-foreground">{agent.metrics?.ticketsResolved || 0}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="bentoGrid gap-6">
            {/* Active Agents */}
            <Card className="col-span-12 lg:col-span-4 glass-card premium-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users2 className="h-5 w-5 text-primary" />
                  <span>Active Agents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {agents.map(agent => (
                      <div key={agent.id} className="flex flex-col p-3 rounded-lg hover:bg-accent/50 transition-colors premium-hover">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={agent.avatar} />
                                <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${agent.isOnline ? 'bg-green-500 animate-pulse-slow' : 'bg-gray-300'}`} />
                            </div>
                            <div>
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-sm text-muted-foreground">{agent.expertise}</p>
                            </div>
                          </div>
                          <Badge variant={
                            agent.availability?.status === "Available" ? "success" :
                            agent.availability?.status === "Busy" ? "warning" :
                            agent.availability?.status === "On Break" ? "default" :
                            "secondary"
                          }>
                            {agent.availability?.status || (agent.isOnline ? "Online" : "Offline")}
                          </Badge>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <TicketCheck className="h-3 w-3 text-primary" />
                            <span>{agent.metrics?.ticketsResolved || 0} tickets</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Timer className="h-3 w-3 text-primary" />
                            <span>{agent.metrics?.responseTime || 0} min avg.</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{agent.isOnline ? "Active now" : `Last active: ${agent.lastActive ? timeAgo(agent.lastActive) : "Unknown"}`}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{agent.metrics?.satisfaction || 4.5}/5.0</span>
                          </div>
                        </div>

                        {agent.rewards && agent.rewards.badges.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {agent.rewards.badges.slice(0, 3).map(badge => {
                              const badgeData = BADGE_TYPES.find(b => b.name === badge);
                              return (
                                <Badge key={badge} variant="outline" className="text-[10px] h-5 bg-accent/30">
                                  {badgeData?.icon} {badge}
                                </Badge>
                              );
                            })}
                            {agent.rewards.badges.length > 3 && (
                              <Badge variant="outline" className="text-[10px] h-5 bg-accent/30">
                                +{agent.rewards.badges.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-muted-foreground">Today's Performance</span>
                            <span className="font-medium">{agent.metrics ? Math.floor((agent.metrics.ticketsResolved / 20) * 100) : 0}%</span>
                          </div>
                          <Progress value={agent.metrics ? Math.floor((agent.metrics.ticketsResolved / 20) * 100) : 0} className="h-1 progress-gradient" />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Leaderboard and Ticket Assignment */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Leaderboard */}
              <Card className="glass-card premium-card hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span>Agent Leaderboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[220px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Rank</TableHead>
                          <TableHead>Agent</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agents
                          .sort((a, b) => (b.rewards?.points || 0) - (a.rewards?.points || 0))
                          .map((agent, index) => (
                            <TableRow key={agent.id}>
                              <TableCell className="font-medium">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={agent.avatar} />
                                    <AvatarFallback className="text-xs">{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <span>{agent.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <Zap className="h-3 w-3 text-yellow-500" />
                                  <span>{agent.rewards?.points || 0}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Manual Ticket Assignment */}
              <Card className="glass-card premium-card hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    <span>Assign Ticket</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Agent</label>
                      <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name} ({agent.expertise})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ticket Priority</label>
                      <Select value={selectedPriority} onValueChange={(value: "low" | "medium" | "high") => setSelectedPriority(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={handleAssignTicket} className="w-full">
                      Assign Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Agent Availability */}
              <Card className="glass-card premium-card hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>Availability Calendar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium">Today's Shifts</h4>
                    {agents.slice(0, 3).map(agent => (
                      <div key={agent.id} className="flex justify-between items-center text-sm p-2 rounded border bg-card/50">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${agent.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span>{agent.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {agent.availability?.startTime} - {agent.availability?.endTime}
                        </span>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View All Schedules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Tickets and Activity Feed */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Active Tickets */}
              <Card className="glass-card premium-card hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TicketCheck className="h-5 w-5 text-primary" />
                    <span>Active Tickets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[220px] pr-4">
                    <div className="space-y-4">
                      {tickets
                        .filter(ticket => ticket.status !== "resolved")
                        .slice(0, 5)
                        .map(ticket => (
                          <div key={ticket.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors premium-hover">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{ticket.title}</h3>
                              <Badge variant={
                                ticket.priority === "high" ? "destructive" :
                                ticket.priority === "medium" ? "default" :
                                "secondary"
                              }>
                                {ticket.priority}
                              </Badge>
                            </div>
                            {ticket.assignedTo && (
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <ClipboardCheck className="h-4 w-4" />
                                <span>Assigned to {ticket.assignedTo.name}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                              <Clock className="h-3 w-3" />
                              <span>Created {ticket.createdAt.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Activity Feed */}
              <Card className="glass-card premium-card hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Activity Feed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[220px] pr-4">
                    <div className="space-y-4">
                      {activityLogs.map(activity => {
                        const agent = agents.find(a => a.id === activity.agentId);
                        return (
                          <div key={activity.id} className="flex flex-col space-y-2 notification-animate" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={agent?.avatar} />
                                <AvatarFallback>{agent?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm">
                                  <span className="font-medium">{agent?.name}</span>{' '}
                                  <span className="text-muted-foreground">{activity.action}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.details}</p>
                                <p className="text-xs text-muted-foreground">
                                  {activity.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={activityEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Reminders */}
              <Card className="glass-card premium-card hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Reminders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[220px] pr-4">
                    <div className="space-y-3">
                      {reminders.slice(0, 5).map(reminder => {
                        const agent = agents.find(a => a.id === reminder.agentId);
                        return (
                          <div key={reminder.id} className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                            <div className="flex items-start space-x-2">
                              <Bell className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">{agent?.name}</p>
                                <p className="text-xs">{reminder.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {reminder.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Team Communication */}
            <Card className="col-span-12 glass-card premium-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Team Communication</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {messages.map(message => {
                      const sender = agents.find(a => a.id === message.senderId);
                      const receiver = agents.find(a => a.id === message.receiverId);
                      return (
                        <div key={message.id} className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={sender?.avatar} />
                              <AvatarFallback>{sender?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{sender?.name}</p>
                            <span className="text-xs text-muted-foreground">→</span>
                            <p className="text-sm font-medium">{receiver?.name}</p>
                            <span className="text-xs text-muted-foreground ml-auto">{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <div className="pl-8">
                            <p className="text-sm bg-accent/50 p-2 rounded-lg">{message.content}</p>
                          </div>
                          <Separator className="my-2" />
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <div className="mt-4 flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <Input placeholder="Type your message..." className="pr-10" />
                    <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentsPage;
