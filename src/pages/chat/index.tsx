
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Clock } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "agent" | "customer";
  timestamp: Date;
  agentName?: string;
  customerName?: string;
}

const CUSTOMER_MESSAGES = [
  "Hi, I need help with my recent order",
  "The delivery is taking longer than expected",
  "Can you check the status of my refund?",
  "I'm having trouble logging into my account",
  "Is there a way to change my shipping address?",
  "The product I received is different from what I ordered"
];

const AGENT_MESSAGES = [
  "I'd be happy to help you with that",
  "Let me check that for you right away",
  "I understand your concern. Let me investigate",
  "Could you please provide your order number?",
  "I'm checking our system for more information",
  "Thank you for your patience while I look into this"
];

const AGENT_NAMES = ["Sarah Johnson", "Mike Chen", "Priya Patel", "Alex Thompson"];
const CUSTOMER_NAMES = ["John Smith", "Emma Davis", "Carlos Rodriguez", "Lisa Wang"];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState({
    agentName: AGENT_NAMES[0],
    customerName: CUSTOMER_NAMES[0]
  });

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      const isCustomerMessage = Math.random() > 0.5;
      const newMessage: Message = {
        id: Date.now().toString(),
        content: isCustomerMessage 
          ? CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)]
          : AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)],
        sender: isCustomerMessage ? "customer" : "agent",
        timestamp: new Date(),
        agentName: currentChat.agentName,
        customerName: currentChat.customerName
      };

      setMessages(prev => [...prev.slice(-19), newMessage]);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentChat]);

  // Change conversation every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChat({
        agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
        customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)]
      });
      setMessages([]);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Active Chat */}
            <Card className="col-span-12 lg:col-span-8 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Live Chat</span>
                  </div>
                  <Badge variant="secondary" className="animate-pulse">
                    Live Conversation
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "agent" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className={`flex items-start max-w-[80%] space-x-2 ${
                          message.sender === "agent" ? "flex-row-reverse space-x-reverse" : ""
                        }`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg`} />
                            <AvatarFallback>
                              {message.sender === "agent" 
                                ? message.agentName?.split(" ").map(n => n[0]).join("")
                                : message.customerName?.split(" ").map(n => n[0]).join("")
                              }
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col ${
                            message.sender === "agent" ? "items-end" : "items-start"
                          }`}>
                            <div className={`rounded-lg p-3 ${
                              message.sender === "agent"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}>
                              <p>{message.content}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                              <span>{message.sender === "agent" ? message.agentName : message.customerName}</span>
                              <Clock className="h-3 w-3" />
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Info */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Current Conversation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-accent/50">
                    <h3 className="font-semibold mb-2">Agent</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {currentChat.agentName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{currentChat.agentName}</p>
                        <p className="text-sm text-muted-foreground">Customer Support</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-accent/50">
                    <h3 className="font-semibold mb-2">Customer</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {currentChat.customerName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{currentChat.customerName}</p>
                        <p className="text-sm text-muted-foreground">Active Customer</p>
                      </div>
                    </div>
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

export default ChatPage;
