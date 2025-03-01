
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  User,
  Clock,
  Send,
  UserCheck,
  CheckCircle,
  UserPlus,
  Calendar,
  Clock8,
  Users,
  BellRing,
  AlarmClock,
  Activity,
  ArrowUpRight,
  ThumbsUp,
  Heart,
  UserCog,
  MoreHorizontal,
  Calendar as CalendarIcon
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "agent" | "customer";
  timestamp: Date;
  agentName?: string;
  customerName?: string;
  read?: boolean;
  sentiment?: "positive" | "negative" | "neutral";
}

// Indian Hindu Names
const AGENT_NAMES = [
  "Aanya Sharma", 
  "Arjun Patel", 
  "Divya Malhotra", 
  "Vikram Singh", 
  "Neha Kapoor", 
  "Raj Mehta"
];

const CUSTOMER_NAMES = [
  "Ravi Kumar", 
  "Priya Verma", 
  "Amit Gupta", 
  "Sunita Agarwal", 
  "Deepak Iyer", 
  "Meera Reddy"
];

// Customer Messages - Pre-written 50+ messages
const CUSTOMER_MESSAGES = [
  "I need help with my recent order",
  "The delivery is taking longer than expected",
  "Can you check the status of my refund?",
  "I'm having trouble logging into my account",
  "Is there a way to change my shipping address?",
  "The product I received is different from what I ordered",
  "How do I reset my password?",
  "My payment was declined, but money was deducted from my account",
  "When will my order be shipped?",
  "I want to cancel my subscription",
  "The discount code isn't working at checkout",
  "Can I exchange a product I just purchased?",
  "The website is not loading properly on my mobile",
  "How do I track my package?",
  "I didn't receive a confirmation email after placing my order",
  "Can I add more items to my existing order?",
  "What's your return policy?",
  "The product description doesn't match what I received",
  "How long does shipping usually take?",
  "Is there an option for express delivery?",
  "I need to change my payment method",
  "My credit card was charged twice for one order",
  "I'm missing an item from my delivery",
  "Do you offer international shipping?",
  "What are your business hours?",
  "Can I get a duplicate invoice?",
  "My promo code expired before I could use it",
  "I need help choosing between two products",
  "Is this product available in a different color?",
  "The size chart is confusing, can you help?",
  "Can I get a price match from your competitor?",
  "How do I unsubscribe from your emails?",
  "Will this product work with my existing setup?",
  "I'd like to speak to a manager, please",
  "The quality of the product is not as expected",
  "Can I get a partial refund?",
  "How do I apply for your loyalty program?",
  "The instructions manual is missing from my package",
  "What's the warranty period for this product?",
  "Can I pay using UPI?",
  "Do you offer EMI options?",
  "Is cash on delivery available in my area?",
  "I received someone else's order by mistake",
  "Can I schedule a delivery for a specific date?",
  "Does this product need assembly?",
  "The gift wrapping I requested wasn't done",
  "I need to know about your bulk order discounts",
  "My account shows incorrect purchase history",
  "Can you recommend products similar to what I've bought?",
  "I've been waiting for customer service for 20 minutes",
  "Can I have an extended warranty for this product?"
];

// Agent Messages - Pre-written 30+ responses
const AGENT_MESSAGES = [
  "I'd be happy to help you with that",
  "Let me check that for you right away",
  "I understand your concern. Let me investigate",
  "Could you please provide your order number?",
  "I'm checking our system for more information",
  "Thank you for your patience while I look into this",
  "I apologize for the inconvenience you're experiencing",
  "I've located your order in our system",
  "Let me connect you with our specialized team for this issue",
  "Your refund has been processed and will reflect in 3-5 business days",
  "I've escalated this to our technical team",
  "Is there anything else I can assist you with today?",
  "I've sent the reset password link to your registered email",
  "I can see that your order is currently being processed",
  "Your order has been shipped and will arrive by tomorrow",
  "I've applied a discount to your account for the inconvenience",
  "We value your feedback and will use it to improve our services",
  "I'll make that change to your account right away",
  "Our team is working on resolving this issue",
  "Can you please confirm your delivery address?",
  "I've updated your shipping information in our system",
  "Your satisfaction is our priority",
  "Let me guide you through the process step by step",
  "I'd recommend trying our new feature that addresses this issue",
  "I've added detailed notes to your account about this conversation",
  "Would you like me to send you our detailed policy document?",
  "Your feedback has been recorded and will be shared with the product team",
  "I've generated a new invoice and sent it to your email",
  "We appreciate your patience and understanding",
  "I'm transferring you to a specialist who can better assist with this query"
];

// Chat sentiment types
const SENTIMENTS = ["positive", "negative", "neutral"];

// Queue information
const QUEUE_STATUSES = [
  "1 chat in queue", 
  "3 chats in queue", 
  "5 chats in queue", 
  "No chats in queue"
];

// Activity updates for feed
const ACTIVITY_UPDATES = [
  "assigned a high priority ticket to",
  "resolved customer issue for",
  "transferred chat to",
  "joined the conversation with",
  "scheduled a follow-up with",
  "received positive feedback from",
  "handled multiple queries from",
  "escalated issue from",
  "created knowledge base article about",
  "completed training on new product for"
];

const ChatPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string>("");
  const [queueStatus, setQueueStatus] = useState<string>(QUEUE_STATUSES[0]);
  const [activityFeed, setActivityFeed] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>(AGENT_NAMES[0]);
  const [currentChat, setCurrentChat] = useState({
    agentName: AGENT_NAMES[0],
    customerName: CUSTOMER_NAMES[0],
    status: "active"
  });
  const [waitingChats, setWaitingChats] = useState<{name: string, query: string, time: string}[]>([
    { name: CUSTOMER_NAMES[1], query: "Payment issue", time: "2m ago" },
    { name: CUSTOMER_NAMES[2], query: "Order cancellation", time: "5m ago" },
    { name: CUSTOMER_NAMES[3], query: "Return request", time: "12m ago" }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Simulate typing indicator
  const simulateTyping = (user: string) => {
    setIsTyping(true);
    setTypingUser(user);
    setTimeout(() => {
      setIsTyping(false);
      setTypingUser("");
    }, Math.random() * 2000 + 1000);
  };

  // Generate a new customer message
  const generateCustomerMessage = () => {
    simulateTyping(currentChat.customerName);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)],
        sender: "customer",
        timestamp: new Date(),
        customerName: currentChat.customerName,
        sentiment: SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)] as "positive" | "negative" | "neutral"
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Notify about new message
      toast({
        description: `New message from ${currentChat.customerName}`,
        duration: 3000,
      });
      
      scrollToBottom();
      
      // Maybe generate an agent response
      if (Math.random() > 0.3) {
        setTimeout(() => generateAgentResponse(), Math.random() * 4000 + 2000);
      }
    }, Math.random() * 2000 + 1000);
  };

  // Generate a new agent response
  const generateAgentResponse = () => {
    simulateTyping(currentChat.agentName);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)],
        sender: "agent",
        timestamp: new Date(),
        agentName: currentChat.agentName,
        sentiment: "neutral"
      };
      
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    }, Math.random() * 2000 + 1000);
  };

  // Update activity feed
  const updateActivityFeed = () => {
    const agent = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
    const customer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    const activity = ACTIVITY_UPDATES[Math.floor(Math.random() * ACTIVITY_UPDATES.length)];
    
    const newActivity = `${agent} ${activity} ${customer}`;
    setActivityFeed(prev => [newActivity, ...prev.slice(0, 9)]);
  };

  // Update queue status
  const updateQueueStatus = () => {
    setQueueStatus(QUEUE_STATUSES[Math.floor(Math.random() * QUEUE_STATUSES.length)]);
  };

  // Handle sending a manual message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const manualMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "agent",
      timestamp: new Date(),
      agentName: currentChat.agentName,
      sentiment: "positive"
    };
    
    setMessages(prev => [...prev, manualMessage]);
    setNewMessage("");
    scrollToBottom();
    
    toast({
      description: "Message sent successfully",
      duration: 2000,
    });
    
    // Simulate customer response
    setTimeout(() => generateCustomerMessage(), Math.random() * 6000 + 3000);
  };

  // Handle chat resolution
  const handleResolveChat = () => {
    toast({
      description: `Chat with ${currentChat.customerName} marked as resolved`,
      duration: 3000,
    });
    
    // Change to a new chat
    setTimeout(() => {
      const newCustomerIndex = Math.floor(Math.random() * CUSTOMER_NAMES.length);
      const newAgentIndex = Math.floor(Math.random() * AGENT_NAMES.length);
      
      setCurrentChat({
        agentName: AGENT_NAMES[newAgentIndex],
        customerName: CUSTOMER_NAMES[newCustomerIndex],
        status: "active"
      });
      
      setMessages([]);
      
      // Remove one waiting chat if available
      if (waitingChats.length > 0) {
        setWaitingChats(prev => prev.slice(1));
      }
      
      // Add a new waiting chat
      const newCustomer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
      const newQuery = CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)].substring(0, 20) + "...";
      
      if (Math.random() > 0.5) {
        setWaitingChats(prev => [...prev, { 
          name: newCustomer, 
          query: newQuery, 
          time: "just now" 
        }]);
      }
      
      // Generate first message for new chat
      setTimeout(() => generateCustomerMessage(), 1500);
    }, 1000);
  };

  // Transfer chat to another agent
  const handleTransferChat = () => {
    const newAgentIndex = (AGENT_NAMES.indexOf(currentChat.agentName) + 1) % AGENT_NAMES.length;
    const newAgent = AGENT_NAMES[newAgentIndex];
    
    toast({
      description: `Chat transferred to ${newAgent}`,
      duration: 3000,
    });
    
    // Add system message about transfer
    const transferMessage: Message = {
      id: Date.now().toString(),
      content: `Chat transferred to ${newAgent}`,
      sender: "agent",
      timestamp: new Date(),
      agentName: "System",
      sentiment: "neutral"
    };
    
    setMessages(prev => [...prev, transferMessage]);
    
    // Update current chat
    setCurrentChat(prev => ({
      ...prev,
      agentName: newAgent
    }));
    
    // Update activity feed
    setActivityFeed(prev => [
      `${currentChat.agentName} transferred chat to ${newAgent}`,
      ...prev.slice(0, 9)
    ]);
    
    scrollToBottom();
  };

  // Schedule a follow-up
  const handleScheduleFollowUp = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const timeString = tomorrow.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    });
    
    toast({
      description: `Follow-up scheduled with ${currentChat.customerName} for ${timeString}`,
      duration: 3000,
    });
    
    // Update activity feed
    setActivityFeed(prev => [
      `${currentChat.agentName} scheduled a follow-up with ${currentChat.customerName} for ${timeString}`,
      ...prev.slice(0, 9)
    ]);
  };

  // Initialize conversations and set up intervals
  useEffect(() => {
    // Generate an initial customer message
    setTimeout(() => generateCustomerMessage(), 1500);
    
    // Set up intervals for various simulations
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        generateCustomerMessage();
      }
    }, 12000);
    
    const activityInterval = setInterval(() => {
      updateActivityFeed();
    }, 5000);
    
    const queueInterval = setInterval(() => {
      updateQueueStatus();
    }, 7000);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(activityInterval);
      clearInterval(queueInterval);
    };
  }, [currentChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bentoGrid">
            {/* Chat Section */}
            <Card className="col-span-12 lg:col-span-8 premium-card shadow-lg hover-scale">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Live Chat</span>
                  </CardTitle>
                  <Badge variant="secondary" className="animate-pulse-slow">
                    {queueStatus}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Chat with {currentChat.customerName}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {currentChat.status === "active" ? "Active" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px] pr-4 email-content-scroll">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "agent" ? "justify-end" : "justify-start"
                        } transition-all duration-300 animate-in fade-in`}
                      >
                        <div className={`flex items-start max-w-[80%] space-x-2 ${
                          message.sender === "agent" ? "flex-row-reverse space-x-reverse" : ""
                        }`}>
                          <Avatar className="h-8 w-8 ring-2 ring-background depth-effect">
                            <AvatarImage src={`/placeholder.svg`} />
                            <AvatarFallback className={
                              message.sender === "agent" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-secondary text-secondary-foreground"
                            }>
                              {message.sender === "agent" 
                                ? message.agentName?.split(" ").map(n => n[0]).join("")
                                : message.customerName?.split(" ").map(n => n[0]).join("")
                              }
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col ${
                            message.sender === "agent" ? "items-end" : "items-start"
                          }`}>
                            <div className={`rounded-lg p-3 shadow-sm hover-scale premium-hover ${
                              message.sender === "agent"
                                ? "bg-primary text-primary-foreground"
                                : message.sentiment === "positive"
                                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100"
                                : message.sentiment === "negative"
                                ? "bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-100"
                                : "bg-muted"
                            }`}>
                              <p>{message.content}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                              <span className="font-medium">
                                {message.sender === "agent" ? message.agentName : message.customerName}
                              </span>
                              <Clock className="h-3 w-3" />
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              {message.sentiment && message.sender === "customer" && (
                                <Badge variant="outline" className={`text-xs ${
                                  message.sentiment === "positive" ? "border-emerald-200 text-emerald-700" :
                                  message.sentiment === "negative" ? "border-rose-200 text-rose-700" :
                                  "border-gray-200 text-gray-700"
                                }`}>
                                  {message.sentiment}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start max-w-[80%] space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg`} />
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              {typingUser.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <div className="rounded-lg p-3 bg-muted shadow-sm">
                              <div className="typing-indicator flex space-x-1">
                                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full"></span>
                                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full"></span>
                                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full"></span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                              <span>{typingUser}</span>
                              <span className="text-xs italic text-muted-foreground">typing...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <div className="w-full flex items-center space-x-2">
                  <Textarea 
                    placeholder="Type your message..." 
                    className="flex-1 min-h-[80px] contact-field"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleTransferChat}
                      className="button-3d"
                    >
                      <UserCog className="h-4 w-4 mr-1" />
                      Transfer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleScheduleFollowUp}
                      className="button-3d"
                    >
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleResolveChat}
                      className="button-3d"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      size="sm"
                      className="premium-button"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Chat Info and Dashboard */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Current Conversation */}
              <Card className="premium-card shadow-lg hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Current Conversation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-accent/50 glass-card">
                      <h3 className="font-semibold mb-2">Agent</h3>
                      <div className="flex items-center space-x-3">
                        <Avatar className="ring-2 ring-primary/20 depth-effect">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {currentChat.agentName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{currentChat.agentName}</p>
                          <p className="text-sm text-muted-foreground">
                            <span className="agent-status-dot online">Customer Support</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50 glass-card">
                      <h3 className="font-semibold mb-2">Customer</h3>
                      <div className="flex items-center space-x-3">
                        <Avatar className="ring-2 ring-secondary/20 depth-effect">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
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

              {/* Waiting Chats */}
              <Card className="premium-card shadow-lg hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock8 className="h-5 w-5 text-primary" />
                    <span>Waiting Chats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {waitingChats.length > 0 ? (
                      waitingChats.map((chat, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors hover-scale premium-hover flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary text-secondary-foreground">
                                {chat.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{chat.name}</p>
                              <p className="text-xs text-muted-foreground truncate w-40">{chat.query}</p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">{chat.time}</div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-24 text-muted-foreground">
                        No waiting chats
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="premium-card shadow-lg hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Activity Feed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {activityFeed.map((activity, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg border border-border bg-background hover:bg-accent/20 transition-colors"
                        >
                          <p className="text-sm">{activity}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(Date.now() - index * 60000).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
