
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, TicketCheck, Users2, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  department: string;
}

interface Ticket {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  assignedTo?: Agent;
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
  { id: "1", name: "Sarah Johnson", avatar: "/placeholder.svg", isOnline: true, department: "Support" },
  { id: "2", name: "Alex Chen", avatar: "/placeholder.svg", isOnline: false, department: "Technical" },
  { id: "3", name: "Mike Brown", avatar: "/placeholder.svg", isOnline: true, department: "Sales" },
  { id: "4", name: "Emily Davis", avatar: "/placeholder.svg", isOnline: true, department: "Support" },
  { id: "5", name: "Chris Wilson", avatar: "/placeholder.svg", isOnline: false, department: "Technical" }
];

const SAMPLE_TICKETS = [
  "Login issue with mobile app",
  "Cannot access dashboard",
  "Payment processing error",
  "Integration not working",
  "Data sync failed",
  "Account verification issue",
  "API rate limit exceeded",
  "Password reset problem"
];

const SAMPLE_MESSAGES = [
  "Can you take a look at ticket #1234?",
  "I've resolved the login issue",
  "Customer needs urgent assistance",
  "Taking my lunch break",
  "Great job on handling that case!",
  "Need help with a technical issue",
  "Team meeting in 10 minutes",
  "Documentation has been updated"
];

const Index = () => {
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

  // Simulate new tickets being created
  useEffect(() => {
    const interval = setInterval(() => {
      if (tickets.length < 10 && Math.random() > 0.7) {
        const newTicket: Ticket = {
          id: Date.now().toString(),
          title: SAMPLE_TICKETS[Math.floor(Math.random() * SAMPLE_TICKETS.length)],
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          status: "open",
          createdAt: new Date()
        };
        
        // Auto-assign to a random online agent
        const onlineAgents = agents.filter(a => a.isOnline);
        if (onlineAgents.length > 0) {
          const randomAgent = onlineAgents[Math.floor(Math.random() * onlineAgents.length)];
          newTicket.assignedTo = randomAgent;
          toast.success(`New ticket assigned to ${randomAgent.name}`);
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
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-4xl font-bold mb-8">Agent Dashboard</h1>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Agents Status */}
        <Card className="col-span-12 md:col-span-4 glass-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users2 className="h-5 w-5" />
              <span>Agents Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
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
                        <p className="text-sm text-muted-foreground">{agent.department}</p>
                      </div>
                    </div>
                    <Badge variant={agent.isOnline ? "success" : "secondary"}>
                      {agent.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Active Tickets */}
        <Card className="col-span-12 md:col-span-4 glass-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TicketCheck className="h-5 w-5" />
              <span>Active Tickets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="p-3 rounded-lg border bg-card">
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {ticket.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Team Chat */}
        <Card className="col-span-12 md:col-span-4 glass-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Team Chat</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map(message => {
                  const sender = agents.find(a => a.id === message.senderId);
                  const receiver = agents.find(a => a.id === message.receiverId);
                  return (
                    <div key={message.id} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={sender?.avatar} />
                          <AvatarFallback>{sender?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">{sender?.name}</p>
                        <span className="text-xs text-muted-foreground">to</span>
                        <p className="text-sm font-medium">{receiver?.name}</p>
                      </div>
                      <div className="pl-8">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-muted-foreground">
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
  );
};

export default Index;
