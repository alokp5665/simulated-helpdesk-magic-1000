
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, TicketCheck, Users2, ClipboardCheck, Clock } from "lucide-react";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  department: string;
  expertise: string;
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

const AGENTS: Agent[] = [
  { id: "1", name: "Priya Sharma", avatar: "/placeholder.svg", isOnline: true, department: "Support", expertise: "Technical" },
  { id: "2", name: "Rahul Patel", avatar: "/placeholder.svg", isOnline: false, department: "Technical", expertise: "Backend" },
  { id: "3", name: "Anita Desai", avatar: "/placeholder.svg", isOnline: true, department: "Sales", expertise: "Enterprise" },
  { id: "4", name: "Vikram Singh", avatar: "/placeholder.svg", isOnline: true, department: "Support", expertise: "Mobile" },
  { id: "5", name: "Neha Gupta", avatar: "/placeholder.svg", isOnline: false, department: "Technical", expertise: "Frontend" }
];

const SAMPLE_TICKETS = [
  "Mobile app sync issue",
  "Dashboard loading slow",
  "Payment gateway error",
  "API integration failure",
  "User authentication bug",
  "Database connection error",
  "Push notification issue",
  "Search functionality broken"
];

const SAMPLE_MESSAGES = [
  "Can you look into ticket #4532?",
  "Customer needs urgent assistance",
  "I've fixed the database issue",
  "Team sync at 4 PM IST",
  "Need help with this case",
  "Taking a quick break",
  "Documentation update needed",
  "Great work on that fix!"
];

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Simulate changing agent online status
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        isOnline: Math.random() > 0.3
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate new tickets and auto-assignment
  useEffect(() => {
    const interval = setInterval(() => {
      if (tickets.length < 12 && Math.random() > 0.7) {
        const newTicket: Ticket = {
          id: Date.now().toString(),
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
          
          toast.success(`New ticket assigned to ${randomAgent.name}`, {
            description: `Priority: ${newTicket.priority}`,
          });
        }
        
        setTickets(prev => [...prev, newTicket]);
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
        
        setMessages(prev => [...prev.slice(-19), newMessage]);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Agent Management</h1>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Active Agents */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale">
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
                      <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={agent.avatar} />
                              <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${agent.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm text-muted-foreground">{agent.expertise}</p>
                          </div>
                        </div>
                        <Badge variant={agent.isOnline ? "default" : "secondary"}>
                          {agent.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Active Tickets */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TicketCheck className="h-5 w-5 text-primary" />
                  <span>Active Tickets</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
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

            {/* Team Chat */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Team Communication</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
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
                          </div>
                          <div className="pl-8">
                            <p className="text-sm bg-accent/50 p-2 rounded-lg">{message.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <Separator className="my-2" />
                        </div>
                      );
                    })}
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

export default AgentsPage;
