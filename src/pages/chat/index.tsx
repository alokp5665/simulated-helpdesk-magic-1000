
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  User, 
  Clock, 
  Send, 
  Check, 
  CheckCheck, 
  Heart, 
  BarChart2, 
  PhoneCall, 
  UserPlus, 
  Clock8, 
  Inbox, 
  X, 
  RefreshCw, 
  CheckCircle, 
  Users, 
  Calendar
} from "lucide-react";

// Types for our chat application
interface Message {
  id: string;
  content: string;
  sender: "agent" | "customer";
  timestamp: Date;
  agentName?: string;
  customerName?: string;
  sentiment?: "positive" | "neutral" | "negative";
  read: boolean;
}

interface ChatSession {
  id: string;
  customer: string;
  agent: string;
  status: "active" | "waiting" | "resolved" | "transferred";
  startTime: Date;
  lastActive: Date;
  messages: Message[];
}

// Indian Hindu names for our simulation
const AGENT_NAMES = ["Aarav Sharma", "Priya Patel", "Vikram Agarwal", "Neha Kapoor", "Arjun Mehta"];
const CUSTOMER_NAMES = ["Ravi Singh", "Ananya Desai", "Karan Malhotra", "Divya Gupta", "Siddharth Joshi"];

// Customer message templates
const CUSTOMER_MESSAGES = [
  "I need help with my recent order",
  "My package hasn't arrived yet",
  "Can you check the status of my refund?",
  "I'm having trouble logging into my account",
  "Is there a way to change my shipping address?",
  "The product I received is different from what I ordered",
  "How do I track my delivery?",
  "I want to cancel my subscription",
  "Do you have this item in a different color?",
  "I need to return an item",
];

// Agent message templates
const AGENT_MESSAGES = [
  "I'd be happy to help you with that",
  "Let me check that for you right away",
  "I understand your concern. Let me investigate",
  "Could you please provide your order number?",
  "I'm checking our system for more information",
  "Thank you for your patience while I look into this",
  "I've found your account details",
  "I've escalated this to our specialist team",
  "Is there anything else I can assist you with today?",
  "Let me connect you with our specialized department",
];

// Sentiment analysis function
const analyzeSentiment = (message: string): "positive" | "neutral" | "negative" => {
  const positiveWords = ["happy", "thanks", "good", "great", "excellent", "appreciate", "helpful", "resolved"];
  const negativeWords = ["bad", "unhappy", "issue", "problem", "wrong", "disappointed", "terrible", "poor"];
  
  const lowerMessage = message.toLowerCase();
  
  let positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  let negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  
  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
};

const ChatPage = () => {
  const [allSessions, setAllSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [queueCount, setQueueCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState({
    totalChats: 0,
    resolvedChats: 0,
    averageResponseTime: "2m 15s",
    customerSatisfaction: 87
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Create initial sessions
  useEffect(() => {
    const initialSessions: ChatSession[] = [];
    
    // Create 3 initial chat sessions
    for (let i = 0; i < 3; i++) {
      const customerId = Math.floor(Math.random() * CUSTOMER_NAMES.length);
      const agentId = Math.floor(Math.random() * AGENT_NAMES.length);
      
      const session: ChatSession = {
        id: `session-${Date.now()}-${i}`,
        customer: CUSTOMER_NAMES[customerId],
        agent: AGENT_NAMES[agentId],
        status: i === 0 ? "active" : i === 1 ? "waiting" : "resolved",
        startTime: new Date(Date.now() - Math.random() * 3600000),
        lastActive: new Date(),
        messages: []
      };
      
      // Add 3-6 messages to each chat
      const messageCount = 3 + Math.floor(Math.random() * 4);
      for (let j = 0; j < messageCount; j++) {
        const isAgent = j % 2 === 1;
        const msgContent = isAgent 
          ? AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)]
          : CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)];
          
        session.messages.push({
          id: `msg-${Date.now()}-${j}`,
          content: msgContent,
          sender: isAgent ? "agent" : "customer",
          timestamp: new Date(session.startTime.getTime() + (j * 60000)),
          agentName: session.agent,
          customerName: session.customer,
          sentiment: analyzeSentiment(msgContent),
          read: true
        });
      }
      
      initialSessions.push(session);
    }
    
    setAllSessions(initialSessions);
    setActiveSession(initialSessions[0]);
    setQueueCount(Math.floor(Math.random() * 5) + 1);
    
    // Update analytics
    setAnalytics({
      totalChats: 23 + Math.floor(Math.random() * 30),
      resolvedChats: 18 + Math.floor(Math.random() * 20),
      averageResponseTime: `${1 + Math.floor(Math.random() * 3)}m ${Math.floor(Math.random() * 60)}s`,
      customerSatisfaction: 80 + Math.floor(Math.random() * 15)
    });
  }, []);
  
  // Simulate new messages and update chat state
  useEffect(() => {
    if (!activeSession) return;
    
    // Simulate customer typing every 8-15 seconds
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsTyping(activeSession.customer);
        
        // After typing for 1-3 seconds, send the message
        setTimeout(() => {
          setIsTyping(null);
          
          // 50% chance to actually send a message
          if (Math.random() > 0.5) {
            const newCustomerMessage = CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)];
            
            // Add the new message to the active session
            const updatedSession = { ...activeSession };
            updatedSession.messages.push({
              id: `msg-${Date.now()}`,
              content: newCustomerMessage,
              sender: "customer",
              timestamp: new Date(),
              customerName: activeSession.customer,
              sentiment: analyzeSentiment(newCustomerMessage),
              read: false
            });
            updatedSession.lastActive = new Date();
            
            // Update the session
            setActiveSession(updatedSession);
            
            // Also update in all sessions
            setAllSessions(prev => 
              prev.map(session => 
                session.id === activeSession.id ? updatedSession : session
              )
            );
            
            // Show notification
            toast({
              title: "New message",
              description: `${activeSession.customer}: ${newCustomerMessage.substring(0, 30)}${newCustomerMessage.length > 30 ? '...' : ''}`,
              className: "notification-animate"
            });
            
            // Simulate agent typing response after 1-2 seconds
            setTimeout(() => {
              setIsTyping(activeSession.agent);
              
              // After typing for 1-3 seconds, send the response
              setTimeout(() => {
                setIsTyping(null);
                const newAgentMessage = AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)];
                
                // Add the agent response
                const respondedSession = { ...updatedSession };
                respondedSession.messages.push({
                  id: `msg-${Date.now()}`,
                  content: newAgentMessage,
                  sender: "agent",
                  timestamp: new Date(),
                  agentName: activeSession.agent,
                  sentiment: analyzeSentiment(newAgentMessage),
                  read: true
                });
                respondedSession.lastActive = new Date();
                
                // Update the session
                setActiveSession(respondedSession);
                
                // Also update in all sessions
                setAllSessions(prev => 
                  prev.map(session => 
                    session.id === activeSession.id ? respondedSession : session
                  )
                );
              }, 1000 + Math.random() * 2000);
            }, 1000 + Math.random() * 1000);
          }
        }, 1000 + Math.random() * 2000);
      }
    }, 8000 + Math.random() * 7000);
    
    // Simulate new customer in queue every 20-40 seconds
    const queueInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newQueueCount = queueCount + 1;
        setQueueCount(newQueueCount);
        
        toast({
          title: "Customer in Queue",
          description: `New customer waiting: ${CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)]}`,
          className: "notification-animate"
        });
      }
    }, 20000 + Math.random() * 20000);
    
    // Simulate a new chat session every 30-60 seconds
    const newChatInterval = setInterval(() => {
      if (Math.random() > 0.7 && queueCount > 0) {
        const customerId = Math.floor(Math.random() * CUSTOMER_NAMES.length);
        const agentId = Math.floor(Math.random() * AGENT_NAMES.length);
        
        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          customer: CUSTOMER_NAMES[customerId],
          agent: AGENT_NAMES[agentId],
          status: "waiting",
          startTime: new Date(),
          lastActive: new Date(),
          messages: [{
            id: `msg-${Date.now()}`,
            content: CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)],
            sender: "customer",
            timestamp: new Date(),
            customerName: CUSTOMER_NAMES[customerId],
            sentiment: "neutral",
            read: false
          }]
        };
        
        setAllSessions(prev => [...prev, newSession]);
        setQueueCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "New Chat Started",
          description: `${newSession.customer} has started a new chat`,
          className: "notification-animate"
        });
      }
    }, 30000 + Math.random() * 30000);
    
    // Clean up intervals
    return () => {
      clearInterval(typingInterval);
      clearInterval(queueInterval);
      clearInterval(newChatInterval);
    };
  }, [activeSession, queueCount, toast]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeSession) return;
    
    // Add the message to the active session
    const updatedSession = { ...activeSession };
    updatedSession.messages.push({
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: "agent",
      timestamp: new Date(),
      agentName: activeSession.agent,
      sentiment: analyzeSentiment(newMessage),
      read: true
    });
    updatedSession.lastActive = new Date();
    
    // Update the session
    setActiveSession(updatedSession);
    
    // Also update in all sessions
    setAllSessions(prev => 
      prev.map(session => 
        session.id === activeSession.id ? updatedSession : session
      )
    );
    
    // Clear the input
    setNewMessage("");
    
    // Simulate customer typing response after 2-5 seconds
    setTimeout(() => {
      if (Math.random() > 0.3) {
        setIsTyping(activeSession.customer);
        
        // After typing for 1-3 seconds, send the response
        setTimeout(() => {
          setIsTyping(null);
          
          const newCustomerMessage = CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)];
          
          // Add the customer response
          const respondedSession = { ...updatedSession };
          respondedSession.messages.push({
            id: `msg-${Date.now()}`,
            content: newCustomerMessage,
            sender: "customer",
            timestamp: new Date(),
            customerName: activeSession.customer,
            sentiment: analyzeSentiment(newCustomerMessage),
            read: true
          });
          respondedSession.lastActive = new Date();
          
          // Update the session
          setActiveSession(respondedSession);
          
          // Also update in all sessions
          setAllSessions(prev => 
            prev.map(session => 
              session.id === activeSession.id ? respondedSession : session
            )
          );
          
          // Show notification
          toast({
            title: "New message",
            description: `${activeSession.customer}: ${newCustomerMessage.substring(0, 30)}${newCustomerMessage.length > 30 ? '...' : ''}`,
            className: "notification-animate"
          });
        }, 1000 + Math.random() * 2000);
      }
    }, 2000 + Math.random() * 3000);
  };
  
  // Handle resolving a chat
  const handleResolveChat = () => {
    if (!activeSession) return;
    
    // Mark the session as resolved
    const updatedSession = { ...activeSession, status: "resolved" };
    
    // Update in all sessions
    setAllSessions(prev => 
      prev.map(session => 
        session.id === activeSession.id ? updatedSession : session
      )
    );
    
    // Set a new active session if available
    const nextActiveSession = allSessions.find(session => 
      session.id !== activeSession.id && session.status === "waiting"
    );
    
    if (nextActiveSession) {
      setActiveSession(nextActiveSession);
      
      // Update the next session's status
      setAllSessions(prev => 
        prev.map(session => 
          session.id === nextActiveSession.id ? { ...session, status: "active" } : session
        )
      );
      
      // Reduce queue count if we're taking from the queue
      if (nextActiveSession.status === "waiting") {
        setQueueCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Chat Resolved",
        description: `Chat with ${activeSession.customer} marked as resolved. New chat with ${nextActiveSession.customer} activated.`,
        className: "notification-animate"
      });
    } else {
      setActiveSession(null);
      
      toast({
        title: "Chat Resolved",
        description: `Chat with ${activeSession.customer} marked as resolved. No more chats in queue.`,
        className: "notification-animate"
      });
    }
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      resolvedChats: prev.resolvedChats + 1,
      customerSatisfaction: Math.min(100, prev.customerSatisfaction + Math.floor(Math.random() * 3))
    }));
  };
  
  // Handle transferring a chat
  const handleTransferChat = () => {
    if (!activeSession) return;
    
    // Find a new agent
    const currentAgentIndex = AGENT_NAMES.indexOf(activeSession.agent);
    let newAgentIndex;
    
    do {
      newAgentIndex = Math.floor(Math.random() * AGENT_NAMES.length);
    } while (newAgentIndex === currentAgentIndex);
    
    const newAgent = AGENT_NAMES[newAgentIndex];
    
    // Mark the session as transferred and assign new agent
    const updatedSession = { 
      ...activeSession, 
      status: "transferred",
      agent: newAgent
    };
    
    // Add a system message about the transfer
    updatedSession.messages.push({
      id: `msg-transfer-${Date.now()}`,
      content: `Chat transferred to ${newAgent}`,
      sender: "agent",
      timestamp: new Date(),
      agentName: "System",
      sentiment: "neutral",
      read: true
    });
    
    // Update in all sessions
    setAllSessions(prev => 
      prev.map(session => 
        session.id === activeSession.id ? updatedSession : session
      )
    );
    
    // Set a new active session if available
    const nextActiveSession = allSessions.find(session => 
      session.id !== activeSession.id && session.status === "waiting"
    );
    
    if (nextActiveSession) {
      setActiveSession(nextActiveSession);
      
      // Update the next session's status
      setAllSessions(prev => 
        prev.map(session => 
          session.id === nextActiveSession.id ? { ...session, status: "active" } : session
        )
      );
      
      toast({
        title: "Chat Transferred",
        description: `Chat transferred to ${newAgent}. New chat with ${nextActiveSession.customer} activated.`,
        className: "notification-animate"
      });
    } else {
      setActiveSession(null);
      
      toast({
        title: "Chat Transferred",
        description: `Chat transferred to ${newAgent}. No more chats in queue.`,
        className: "notification-animate"
      });
    }
  };
  
  // Handle switching to a different chat
  const handleSwitchChat = (sessionId: string) => {
    const session = allSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // If current active session exists, mark it as waiting
    if (activeSession) {
      setAllSessions(prev => 
        prev.map(s => 
          s.id === activeSession.id && s.status === "active" ? { ...s, status: "waiting" } : s
        )
      );
    }
    
    // Mark the new session as active
    setAllSessions(prev => 
      prev.map(s => 
        s.id === sessionId ? { ...s, status: "active" } : s
      )
    );
    
    // Set as active session
    setActiveSession(session);
  };
  
  // Get sentiment class for styling
  const getSentimentClass = (sentiment: "positive" | "neutral" | "negative" | undefined) => {
    switch (sentiment) {
      case "positive": return "bg-green-500";
      case "negative": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Bento Grid Layout */}
          <div className="bentoGrid">
            {/* Chat Window - Spans 8 columns */}
            <Card className="col-span-8 row-span-2 glass-card hover-scale depth-effect shadow-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Live Chat</span>
                    {activeSession && (
                      <Badge variant="outline" className="ml-2 bg-primary/10 animate-pulse-slow">
                        Active Conversation
                      </Badge>
                    )}
                  </div>
                  
                  {activeSession && (
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                        <div className="flex items-center space-x-1">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span>Live</span>
                        </div>
                      </Badge>
                      <Badge variant="outline">
                        {activeSession.messages.length} messages
                      </Badge>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              
              {activeSession ? (
                <>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[420px] p-4">
                      <div className="space-y-4">
                        {activeSession.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === "agent" ? "justify-end" : "justify-start"
                            } fade-in`}
                          >
                            <div className={`flex items-start max-w-[80%] space-x-2 ${
                              message.sender === "agent" ? "flex-row-reverse space-x-reverse" : ""
                            }`}>
                              <Avatar className={`h-8 w-8 ring-2 ring-offset-2 ${
                                message.sender === "agent" ? "ring-primary/30" : "ring-secondary/30"
                              }`}>
                                <AvatarImage src={`/placeholder.svg`} />
                                <AvatarFallback className={
                                  message.sender === "agent" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
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
                                <div className={`rounded-lg p-3 shadow-md transition-all ${
                                  message.sender === "agent"
                                    ? "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground premium-card"
                                    : "bg-gradient-to-br from-secondary/80 to-secondary/95 text-secondary-foreground premium-card"
                                } premium-hover`}>
                                  <p>{message.content}</p>
                                  {message.sentiment && (
                                    <div className="mt-1 text-xs flex items-center justify-end opacity-70">
                                      <span className={`inline-block h-2 w-2 rounded-full mr-1 ${getSentimentClass(message.sentiment)}`}></span>
                                      <span className="capitalize">{message.sentiment}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                                  <span>{message.sender === "agent" ? message.agentName : message.customerName}</span>
                                  <span>•</span>
                                  <span>{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  {message.sender === "agent" && (
                                    <span>{message.read ? <CheckCheck className="h-3 w-3 text-primary" /> : <Check className="h-3 w-3" />}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Typing indicator */}
                        {isTyping && (
                          <div className="flex justify-start fade-in">
                            <div className="flex items-start max-w-[80%] space-x-2">
                              <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-secondary/30">
                                <AvatarImage src={`/placeholder.svg`} />
                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                  {isTyping.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col items-start">
                                <div className="rounded-lg p-3 bg-secondary/50 text-secondary-foreground premium-card">
                                  <div className="flex space-x-1">
                                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "600ms" }}></div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                                  <span>{isTyping}</span>
                                  <span>•</span>
                                  <span>typing...</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Scroll anchor */}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                  
                  <CardFooter className="border-t border-border/30 p-4">
                    <div className="flex w-full space-x-2">
                      <Textarea 
                        placeholder="Type your message here..." 
                        className="min-h-[60px] premium-card"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      />
                      <div className="flex flex-col space-y-2">
                        <Button 
                          onClick={handleSendMessage} 
                          className="premium-button hover:shadow-lg"
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={handleResolveChat}
                          className="hover:shadow-lg"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleTransferChat}
                          className="hover:shadow-lg"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <CardContent className="h-[500px] flex flex-col items-center justify-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                  <h3 className="text-xl font-medium text-center">No Active Chat</h3>
                  <p className="text-muted-foreground text-center mt-2">Select a chat from the list or wait for a new customer</p>
                </CardContent>
              )}
            </Card>
            
            {/* Chat List - Spans 4 columns */}
            <Card className="col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Inbox className="h-5 w-5 text-primary" />
                    <span>Conversations</span>
                  </div>
                  {queueCount > 0 && (
                    <Badge className="bg-yellow-500/90 text-white">
                      {queueCount} in queue
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allSessions.map(session => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        activeSession?.id === session.id 
                          ? "bg-primary/10 border-l-4 border-primary" 
                          : "hover:bg-secondary/50 border-l-4 border-transparent"
                      } premium-hover`}
                      onClick={() => handleSwitchChat(session.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-primary/20">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {session.customer.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium flex items-center">
                              {session.customer}
                              {session.status === "active" && (
                                <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {session.messages.length > 0 
                                ? session.messages[session.messages.length - 1].content 
                                : "No messages yet"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${session.status === "active" ? "bg-green-500/20 text-green-700 dark:text-green-300" : ""} 
                              ${session.status === "waiting" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" : ""}
                              ${session.status === "resolved" ? "bg-blue-500/20 text-blue-700 dark:text-blue-300" : ""}
                              ${session.status === "transferred" ? "bg-purple-500/20 text-purple-700 dark:text-purple-300" : ""}
                            `}
                          >
                            <span className="capitalize">{session.status}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground mt-1">
                            {new Date(session.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Customer Info - Spans 2 columns */}
            <Card className="col-span-2 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Customer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSession ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary/20 mb-3">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-lg">
                          {activeSession.customer.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium text-lg">{activeSession.customer}</h3>
                      <p className="text-sm text-muted-foreground">Premium Customer</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Status</div>
                      <div className="font-medium capitalize">{activeSession.status}</div>
                      
                      <div className="text-muted-foreground">Started</div>
                      <div className="font-medium">
                        {activeSession.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      
                      <div className="text-muted-foreground">Messages</div>
                      <div className="font-medium">{activeSession.messages.length}</div>
                      
                      <div className="text-muted-foreground">Agent</div>
                      <div className="font-medium">{activeSession.agent}</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Order History</span>
                        <span className="font-medium">12 orders</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Total Spent</span>
                        <span className="font-medium">₹24,350</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Last Purchase</span>
                        <span className="font-medium">3 days ago</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <User className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                    <p className="text-muted-foreground text-center">No customer selected</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Agent Info - Spans 2 columns */}
            <Card className="col-span-2 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Agent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSession ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary/20 mb-3">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                          {activeSession.agent.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium text-lg">{activeSession.agent}</h3>
                      <p className="text-sm text-muted-foreground">Senior Support Agent</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Response Rate</span>
                          <span>98%</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Customer Satisfaction</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Avg Response Time</span>
                          <span>1m 15s</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{activeSession.messages.filter(m => m.sender === "agent").length}</div>
                        <div className="text-xs text-muted-foreground">Responses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-muted-foreground">Active Chats</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">23</div>
                        <div className="text-xs text-muted-foreground">Today's Chats</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                    <p className="text-muted-foreground text-center">No agent assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Stats Grid - Spans full width */}
            <Card className="col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  <span>Chat Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-primary/10 p-3 premium-card premium-hover">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Total Chats</div>
                    <div className="text-2xl font-bold gradient-text">{analytics.totalChats}</div>
                    <div className="text-xs text-muted-foreground mt-1">Today</div>
                  </div>
                  
                  <div className="rounded-lg bg-green-500/10 p-3 premium-card premium-hover">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Resolved Chats</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.resolvedChats}</div>
                    <div className="text-xs text-muted-foreground mt-1">Today</div>
                  </div>
                  
                  <div className="rounded-lg bg-blue-500/10 p-3 premium-card premium-hover">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Avg Response Time</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.averageResponseTime}</div>
                    <div className="text-xs text-muted-foreground mt-1">Today</div>
                  </div>
                  
                  <div className="rounded-lg bg-purple-500/10 p-3 premium-card premium-hover">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Customer Satisfaction</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.customerSatisfaction}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Scheduled Chats - Spans 4 columns */}
            <Card className="col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Scheduled Chats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 premium-card premium-hover">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{CUSTOMER_NAMES[i].split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{CUSTOMER_NAMES[i]}</h4>
                          <p className="text-xs text-muted-foreground">Product Demo and Pricing Discussion</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300">
                          <Clock8 className="h-3 w-3 mr-1" />
                          {new Date(Date.now() + (i + 1) * 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule New Chat
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

export default ChatPage;
