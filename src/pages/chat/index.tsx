
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
  Calendar,
  CalendarClock
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
  history?: {
    lastConversation: Date;
    conversationCount: number;
  };
  scheduled?: Date;
}

// Indian Hindu names for our simulation
const AGENT_NAMES = [
  "Aarav Sharma", "Priya Patel", "Vikram Agarwal", "Neha Kapoor", "Arjun Mehta",
  "Ritu Verma", "Sanjay Gupta", "Divya Rajput", "Rahul Malhotra", "Kavita Singhania",
  "Vivek Chauhan", "Ananya Deshmukh", "Rohit Tiwari", "Pooja Reddy", "Siddharth Joshi"
];

const CUSTOMER_NAMES = [
  "Ravi Singh", "Ananya Desai", "Karan Malhotra", "Divya Gupta", "Siddharth Joshi",
  "Anjali Sharma", "Prakash Kumar", "Meera Pandit", "Arun Chatterjee", "Sunita Patel",
  "Deepak Sinha", "Jyoti Rao", "Kunal Trivedi", "Nisha Bajaj", "Vijay Mehra"
];

// Expanded Customer message templates
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
  "When will my order be delivered?",
  "My payment method was declined",
  "Can I get a discount on my next purchase?",
  "How do I reset my password?",
  "I can't find the item I'm looking for",
  "Can I change my payment method?",
  "The website is not loading properly for me",
  "I received a damaged product",
  "What are your business hours?",
  "Do you ship internationally?",
  "How long does shipping take?",
  "Can I speak to a manager?",
  "I have a question about your return policy",
  "My coupon code isn't working",
  "I'm getting an error when I try to checkout",
  "Do you offer gift wrapping?",
  "I need to update my contact information",
  "Is there a warranty on this product?",
  "Can I get an invoice for my purchase?",
  "I didn't receive my order confirmation email",
  "Do you offer expedited shipping?",
  "I want to change my order",
  "My account seems to have been hacked",
  "I found a bug on your website",
  "Can I add more items to my existing order?",
  "What payment methods do you accept?",
  "Do you have a loyalty program?",
  "I want to submit a product review",
  "Are there any ongoing promotions?",
  "How do I apply for a refund?",
  "Can I get a price match?",
  "My product is missing parts",
  "Do you have a physical store location?",
  "I need help installing the product",
  "Can I get the assembly instructions again?",
  "I'd like to provide some feedback",
  "When will an out-of-stock item be available?",
  "Do you have any recommendations for me?",
  "What's the difference between these two products?",
  "Can I get technical support for this item?"
];

// Expanded Agent message templates
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
  "I apologize for the inconvenience",
  "Thank you for bringing this to our attention",
  "I'll need to verify some information first",
  "That's a great question",
  "I'll send you an email with detailed instructions",
  "Let me find the best solution for you",
  "I can definitely help you resolve this issue",
  "Would you mind waiting a moment while I check?",
  "I've updated your account information",
  "Your request has been processed successfully",
  "I recommend trying the following steps",
  "Let me explain how this works",
  "That's unusual, let me look into it further",
  "I'll make a note of your feedback",
  "I can see the status of your order now",
  "We value your business and want to make this right",
  "I'll need to transfer you to our technical team",
  "Would you like me to place a new order for you?",
  "The refund has been processed and will appear in 3-5 business days",
  "I've reset your password, please check your email",
  "Let me suggest an alternative product",
  "We have several options available for you",
  "I'd be happy to explain our policy",
  "That's covered under our warranty",
  "I've added a discount to your account for your next purchase",
  "Your feedback is important to us",
  "I've submitted a request for expedited shipping",
  "We can certainly arrange that for you",
  "Please allow 24-48 hours for processing",
  "I've sent you the tracking information",
  "Would you like me to walk you through the process?",
  "That's a common issue with a simple fix",
  "I'll make sure this doesn't happen again",
  "Your satisfaction is our top priority",
  "I've noted your preference for future reference",
  "We have a special offer that might interest you",
  "I understand how frustrating this must be",
  "I've applied the promo code to your account",
  "Let me find the most cost-effective solution",
  "I appreciate your patience during this process"
];

// Sentiment analysis function
const analyzeSentiment = (message: string): "positive" | "neutral" | "negative" => {
  const positiveWords = ["happy", "thanks", "good", "great", "excellent", "appreciate", "helpful", "resolved", "perfect", "wonderful", "fantastic", "pleased", "satisfied", "amazing", "solved", "best", "awesome", "love", "grateful"];
  const negativeWords = ["bad", "unhappy", "issue", "problem", "wrong", "disappointed", "terrible", "poor", "awful", "horrible", "angry", "upset", "annoyed", "frustrated", "broken", "mistake", "fail", "hate", "worst", "useless"];
  
  const lowerMessage = message.toLowerCase();
  
  let positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  let negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  
  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
};

// Pre-built conversation templates
const generateConversationTemplate = (customerName: string, agentName: string): Message[] => {
  const templates = [
    // Template 1: Order Status Inquiry
    [
      { sender: "customer", content: "Hi, I ordered a product last week and haven't received any updates. Can you help?" },
      { sender: "agent", content: "Hello! I'd be happy to help. Could you please provide your order number?" },
      { sender: "customer", content: "Sure, it's ORD-29875" },
      { sender: "agent", content: "Thank you. I can see your order is currently in transit and expected to be delivered tomorrow." },
      { sender: "customer", content: "That's great news! Thank you for checking." },
      { sender: "agent", content: "You're welcome! Is there anything else I can assist you with today?" }
    ],
    // Template 2: Technical Support
    [
      { sender: "customer", content: "I can't log into my account. I keep getting an error message." },
      { sender: "agent", content: "I'm sorry to hear that. Let's troubleshoot. Have you tried resetting your password?" },
      { sender: "customer", content: "Yes, but I never receive the reset email." },
      { sender: "agent", content: "Let me check your account details. Could you confirm the email address you're using?" },
      { sender: "customer", content: "It's customer@example.com" },
      { sender: "agent", content: "Thank you. It appears there was an issue with our email system. I've manually reset your password and sent the instructions to your email. Please check in about 5 minutes." },
      { sender: "customer", content: "I'll do that. Thanks for your help!" }
    ],
    // Template 3: Product Return
    [
      { sender: "customer", content: "I need to return a product I purchased. It's not working as expected." },
      { sender: "agent", content: "I'm sorry to hear that. I'd be happy to help with the return process. Could you share your order number?" },
      { sender: "customer", content: "Yes, it's ORD-45123" },
      { sender: "agent", content: "Thank you. I can see you purchased this item 10 days ago. Our return policy allows returns within 30 days, so you're eligible for a return." },
      { sender: "customer", content: "Great! How do I proceed?" },
      { sender: "agent", content: "I'll email you a return label. Once you receive it, package the item and attach the label. Then you can drop it off at any delivery center." },
      { sender: "customer", content: "And how long will the refund take?" },
      { sender: "agent", content: "Once we receive the item, the refund will be processed within 3-5 business days." },
      { sender: "customer", content: "Perfect. Thank you!" }
    ],
    // Template 4: Product Recommendation
    [
      { sender: "customer", content: "I'm looking for a good gift for my wife's birthday." },
      { sender: "agent", content: "I'd be happy to help you find something special! What types of things does she enjoy?" },
      { sender: "customer", content: "She loves reading and gardening." },
      { sender: "agent", content: "We have some excellent choices for book lovers and gardening enthusiasts. Our premium gardening tool set has been very popular, and we also have a curated book collection on exotic plants." },
      { sender: "customer", content: "The gardening tool set sounds perfect! Do you offer gift wrapping?" },
      { sender: "agent", content: "Yes, we do! We can add gift wrapping for just ₹150 extra. Would you like to add that?" },
      { sender: "customer", content: "Yes, please! And can you add a gift message?" },
      { sender: "agent", content: "Absolutely! You can enter your gift message at checkout in the 'Special Instructions' field." }
    ],
    // Template 5: Complaint Resolution
    [
      { sender: "customer", content: "I'm very disappointed with my recent purchase. The quality is much lower than advertised." },
      { sender: "agent", content: "I'm truly sorry to hear about your experience. Customer satisfaction is our top priority. Could you please share which product you're referring to?" },
      { sender: "customer", content: "It's the premium leather wallet. The material feels like plastic, not genuine leather." },
      { sender: "agent", content: "I sincerely apologize for this experience. This is not the standard we aim for. I'd like to offer you a full refund and a 20% discount on your next purchase." },
      { sender: "customer", content: "I appreciate that. How do I get the refund?" },
      { sender: "agent", content: "You don't need to return the item. I've processed the refund to your original payment method. It should reflect in 3-5 business days. I've also added the discount code to your account for your next purchase." },
      { sender: "customer", content: "Thank you for resolving this quickly. I appreciate the good customer service." }
    ]
  ];

  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Base timestamp for the conversation
  const baseTime = new Date();
  baseTime.setHours(baseTime.getHours() - 1); // Start 1 hour ago
  
  // Convert the template to actual messages
  return template.map((msg, index) => {
    const timestamp = new Date(baseTime.getTime() + index * 2 * 60000); // Add 2 minutes per message
    return {
      id: `template-msg-${Date.now()}-${index}`,
      content: msg.content,
      sender: msg.sender as "agent" | "customer",
      timestamp: timestamp,
      agentName: msg.sender === "agent" ? agentName : undefined,
      customerName: msg.sender === "customer" ? customerName : undefined,
      sentiment: analyzeSentiment(msg.content),
      read: true
    };
  });
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
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledCustomer, setScheduledCustomer] = useState("");
  const [scheduledAgent, setScheduledAgent] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Create initial sessions with more diverse data
  useEffect(() => {
    const initialSessions: ChatSession[] = [];
    
    // Create several initial chat sessions
    for (let i = 0; i < 8; i++) {
      const customerId = Math.floor(Math.random() * CUSTOMER_NAMES.length);
      const agentId = Math.floor(Math.random() * AGENT_NAMES.length);
      
      // Assign status with proper distribution
      let status: "active" | "waiting" | "resolved" | "transferred";
      if (i === 0) {
        status = "active";
      } else if (i < 3) {
        status = "waiting";
      } else if (i < 6) {
        status = "resolved";
      } else {
        status = "transferred";
      }
      
      // Random start time in the past 24 hours
      const hoursAgo = Math.random() * 24;
      const startTime = new Date(Date.now() - hoursAgo * 3600000);
      
      // Activity time is more recent than start time
      const minutesAfterStart = Math.random() * hoursAgo * 60;
      const lastActive = new Date(startTime.getTime() + minutesAfterStart * 60000);
      
      // Add chat history for some sessions
      const hasHistory = Math.random() > 0.5;
      const history = hasHistory ? {
        lastConversation: new Date(Date.now() - (1 + Math.floor(Math.random() * 7)) * 86400000), // 1-7 days ago
        conversationCount: 1 + Math.floor(Math.random() * 5) // 1-5 previous conversations
      } : undefined;
      
      // Create session
      const session: ChatSession = {
        id: `session-${Date.now()}-${i}`,
        customer: CUSTOMER_NAMES[customerId],
        agent: AGENT_NAMES[agentId],
        status: status,
        startTime: startTime,
        lastActive: lastActive,
        messages: [],
        history: history
      };
      
      // For some future sessions, add scheduled time
      if (i > 5 && Math.random() > 0.7) {
        const futureHours = 1 + Math.floor(Math.random() * 72); // 1-72 hours in future
        session.scheduled = new Date(Date.now() + futureHours * 3600000);
      }
      
      // Add messages using templates or random generation
      if (Math.random() > 0.5 && i < 5) {
        // Use a pre-built conversation template
        session.messages = generateConversationTemplate(session.customer, session.agent);
      } else {
        // Generate random messages
        const messageCount = 2 + Math.floor(Math.random() * 6); // 2-7 messages
        for (let j = 0; j < messageCount; j++) {
          const isAgent = j % 2 === 1;
          const msgContent = isAgent 
            ? AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)]
            : CUSTOMER_MESSAGES[Math.floor(Math.random() * CUSTOMER_MESSAGES.length)];
            
          session.messages.push({
            id: `msg-${Date.now()}-${j}`,
            content: msgContent,
            sender: isAgent ? "agent" : "customer",
            timestamp: new Date(session.startTime.getTime() + (j * 60000 * (1 + Math.random() * 5))), // Add 1-6 minutes per message
            agentName: session.agent,
            customerName: session.customer,
            sentiment: analyzeSentiment(msgContent),
            read: j < messageCount - (isAgent ? 0 : 2) // Last 1-2 customer messages might be unread
          });
        }
      }
      
      initialSessions.push(session);
    }
    
    setAllSessions(initialSessions);
    setActiveSession(initialSessions[0]);
    setQueueCount(2 + Math.floor(Math.random() * 5)); // 2-6 in queue
    
    // Update analytics with more realistic data
    setAnalytics({
      totalChats: 35 + Math.floor(Math.random() * 40), // 35-74 total chats
      resolvedChats: 25 + Math.floor(Math.random() * 30), // 25-54 resolved chats
      averageResponseTime: `${1 + Math.floor(Math.random() * 3)}m ${Math.floor(Math.random() * 60)}s`,
      customerSatisfaction: 75 + Math.floor(Math.random() * 20) // 75-94% satisfaction
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
        
        const randomCustomer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
        
        toast({
          title: "Customer in Queue",
          description: `New customer waiting: ${randomCustomer}`,
          className: "notification-animate"
        });
        
        // Also show alert for new chat sometimes
        if (Math.random() > 0.7) {
          toast({
            title: "Alert: New Chat Request",
            description: `${randomCustomer} is requesting urgent assistance`,
            className: "notification-animate bg-red-100 border-red-300"
          });
        }
      }
    }, 20000 + Math.random() * 20000);
    
    // Simulate a new chat session every 30-60 seconds
    const newChatInterval = setInterval(() => {
      if (Math.random() > 0.7 && queueCount > 0) {
        const customerId = Math.floor(Math.random() * CUSTOMER_NAMES.length);
        const agentId = Math.floor(Math.random() * AGENT_NAMES.length);
        
        // Determine if this should be a returning customer with history
        const isReturningCustomer = Math.random() > 0.7;
        
        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          customer: CUSTOMER_NAMES[customerId],
          agent: AGENT_NAMES[agentId],
          status: "waiting" as const,
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
        
        // Add chat history for returning customers
        if (isReturningCustomer) {
          newSession.history = {
            lastConversation: new Date(Date.now() - (1 + Math.floor(Math.random() * 14)) * 86400000), // 1-14 days ago
            conversationCount: 1 + Math.floor(Math.random() * 8) // 1-8 previous conversations
          };
        }
        
        setAllSessions(prev => [...prev, newSession]);
        setQueueCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "New Chat Started",
          description: `${newSession.customer} has started a new chat${isReturningCustomer ? ' (returning customer)' : ''}`,
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
    const updatedSession = { ...activeSession, status: "resolved" as const };
    
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
          session.id === nextActiveSession.id ? { ...session, status: "active" as const } : session
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
      status: "transferred" as const,
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
          session.id === nextActiveSession.id ? { ...session, status: "active" as const } : session
        )
      );
      
      // Reduce queue count if we're taking from the queue
      if (nextActiveSession.status === "waiting") {
        setQueueCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Chat Transferred",
        description: `Chat with ${activeSession.customer} transferred to ${newAgent}. New chat with ${nextActiveSession.customer} activated.`,
        className: "notification-animate"
      });
    } else {
      setActiveSession(null);
      
      toast({
        title: "Chat Transferred",
        description: `Chat with ${activeSession.customer} transferred to ${newAgent}. No more chats in queue.`,
        className: "notification-animate"
      });
    }
  };

  // Render UI
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-900">
          {/* Left column: Chat sessions */}
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Chats</h2>
                <Badge variant="success" size="sm" className="ml-2">{queueCount} in queue</Badge>
              </div>
              <div className="mt-2">
                <Input 
                  type="search" 
                  placeholder="Search conversations..." 
                  className="w-full" 
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-2 space-y-2">
                {allSessions.map(session => (
                  <Card 
                    key={session.id} 
                    className={`cursor-pointer border-l-4 ${
                      session.id === activeSession?.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                        : session.status === 'waiting'
                          ? 'border-yellow-500'
                          : session.status === 'resolved'
                            ? 'border-green-500'
                            : session.status === 'transferred'
                              ? 'border-purple-500'
                              : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => {
                      if (session.status !== 'resolved' && session.status !== 'transferred') {
                        setActiveSession(session);
                        // Mark unread messages as read
                        if (session.messages.some(msg => !msg.read)) {
                          const updatedMessages = session.messages.map(msg => ({
                            ...msg, 
                            read: true
                          }));
                          const updatedSession = { ...session, messages: updatedMessages };
                          setAllSessions(prev => 
                            prev.map(s => s.id === session.id ? updatedSession : s)
                          );
                        }
                      }
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${session.customer.replace(" ", "+")}&background=random`} />
                            <AvatarFallback>{session.customer.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-sm">{session.customer}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                              {session.messages.length > 0 
                                ? session.messages[session.messages.length - 1].content.substring(0, 25) + (session.messages[session.messages.length - 1].content.length > 25 ? '...' : '')
                                : 'No messages yet'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            session.status === 'active' ? 'default' :
                            session.status === 'waiting' ? 'warning' :
                            session.status === 'resolved' ? 'success' :
                            'secondary'
                          } size="sm">
                            {session.status}
                          </Badge>
                          {session.messages.some(msg => !msg.read && msg.sender === 'customer') && (
                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 ml-auto"></div>
                          )}
                          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            {new Date(session.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Middle column: Active chat */}
          <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
            {activeSession ? (
              <>
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${activeSession.customer.replace(" ", "+")}&background=random`} />
                      <AvatarFallback>{activeSession.customer.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold flex items-center">
                        {activeSession.customer}
                        {activeSession.history && (
                          <Badge variant="secondary" size="sm" className="ml-2">
                            {activeSession.history.conversationCount} past chats
                          </Badge>
                        )}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(activeSession.startTime).toLocaleString()} 
                        {activeSession.scheduled && (
                          <span className="ml-2 flex items-center">
                            <CalendarClock className="w-3 h-3 mr-1" />
                            Scheduled: {new Date(activeSession.scheduled).toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleTransferChat}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Transfer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleResolveChat}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeSession.messages.map(message => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.sender === 'agent' 
                            ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
                            : 'bg-gray-100 dark:bg-gray-700 rounded-r-lg rounded-tl-lg'
                        } p-3 shadow-sm`}>
                          {message.sender === 'agent' && message.agentName === 'System' ? (
                            <div className="italic text-sm text-white">{message.content}</div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">
                                  {message.sender === 'agent' ? message.agentName : message.customerName}
                                </span>
                                <span className="text-xs opacity-70 ml-2">
                                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                              <p className={`text-sm ${message.sender === 'agent' ? 'text-white' : ''}`}>{message.content}</p>
                              <div className="flex justify-between items-center mt-1">
                                <Badge 
                                  variant={
                                    message.sentiment === 'positive' ? 'success' :
                                    message.sentiment === 'negative' ? 'destructive' :
                                    'secondary'
                                  }
                                  size="sm"
                                >
                                  {message.sentiment}
                                </Badge>
                                {message.sender === 'agent' && (
                                  <div className="text-xs text-white">
                                    {message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {isTyping} is typing...
                        </div>
                        <div className="ml-2 flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex">
                    <Textarea
                      placeholder="Type your message here..."
                      className="flex-1 min-h-[80px] resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="ml-2 h-[80px]"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No active chat</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Select a conversation from the list or wait for a new customer.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column: Customer info and analytics */}
          <div className="col-span-3 space-y-4">
            {/* Customer Details */}
            {activeSession && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${activeSession.customer.replace(" ", "+")}&background=random`} />
                      <AvatarFallback>{activeSession.customer.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{activeSession.customer}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: #CUS{Math.floor(Math.random() * 10000)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium mr-2">Total Chats:</span>
                      <span>{activeSession.history ? activeSession.history.conversationCount + 1 : 1}</span>
                    </div>
                    {activeSession.history && (
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium mr-2">Last Contact:</span>
                        <span>{new Date(activeSession.history.lastConversation).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Heart className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium mr-2">Sentiment:</span>
                      <span>
                        {(() => {
                          // Calculate average sentiment
                          const customerMsgs = activeSession.messages.filter(msg => msg.sender === 'customer');
                          if (customerMsgs.length === 0) return 'N/A';
                          
                          const sentiments = {
                            positive: customerMsgs.filter(msg => msg.sentiment === 'positive').length,
                            neutral: customerMsgs.filter(msg => msg.sentiment === 'neutral').length,
                            negative: customerMsgs.filter(msg => msg.sentiment === 'negative').length
                          };
                          
                          if (sentiments.positive > sentiments.neutral && sentiments.positive > sentiments.negative)
                            return 'Positive';
                          if (sentiments.negative > sentiments.neutral && sentiments.negative > sentiments.positive)
                            return 'Negative';
                          return 'Neutral';
                        })()}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">View Orders</Button>
                      <Button variant="outline" size="sm" className="text-xs">Account History</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => setShowScheduler(prev => !prev)}
                      >
                        Schedule Follow-up
                      </Button>
                    </div>
                  </div>
                  
                  {showScheduler && (
                    <div className="mt-4 space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <h4 className="font-medium text-sm">Schedule Follow-up</h4>
                      <div className="grid gap-2">
                        <Input
                          type="date"
                          className="text-xs"
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setScheduledDate(e.target.value ? new Date(e.target.value) : null)}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              if (scheduledDate) {
                                toast({
                                  title: "Follow-up Scheduled",
                                  description: `Follow-up with ${activeSession.customer} scheduled for ${scheduledDate.toLocaleDateString()}`,
                                  className: "notification-animate"
                                });
                                setShowScheduler(false);
                              }
                            }}
                          >
                            Schedule
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => setShowScheduler(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Analytics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart2 className="w-5 h-5 mr-2" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Total Chats Today</span>
                    <span className="text-sm">{analytics.totalChats}</span>
                  </div>
                  <Progress value={(analytics.totalChats / 100) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Resolved Chats</span>
                    <span className="text-sm">{analytics.resolvedChats}</span>
                  </div>
                  <Progress value={(analytics.resolvedChats / analytics.totalChats) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-sm">{analytics.averageResponseTime}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                    <span className="text-sm">{analytics.customerSatisfaction}%</span>
                  </div>
                  <Progress value={analytics.customerSatisfaction} className="h-2" />
                </div>
                
                <Alert>
                  <AlertTitle className="text-sm font-medium">Peak Hours</AlertTitle>
                  <AlertDescription className="text-xs">
                    Current peak time is between 2:00 PM - 4:00 PM with {Math.round(analytics.totalChats * 0.4)} chats.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
