
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Mail,
  Send,
  Archive,
  Star,
  Trash2,
  MailPlus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Heart,
  User,
  Users,
  Calendar as CalendarIcon,
  Forward,
  Reply,
  MessageSquare,
  Filter,
  RefreshCw,
  BellRing,
  Tags,
  Flag,
  Clock8,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/social.css"; // Using existing social.css for animations

// Define types for our email system
interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
  isStarred: boolean;
  sentiment?: "positive" | "neutral" | "negative";
  thread?: {
    lastEmail: Date;
    count: number;
  };
  tags?: string[];
  priority?: "high" | "medium" | "low";
}

// Indian Hindu names for our simulation
const SAMPLE_EMAILS_FROM = [
  "arjun.sharma@example.com",
  "priya.patel@company.com",
  "vikram.agarwal@tech.com",
  "neha.kapoor@service.com",
  "rahul.malhotra@business.net",
  "ananya.deshmukh@support.org",
  "karan.singh@example.com",
  "divya.rajput@company.org",
  "siddharth.joshi@tech.co",
  "pooja.reddy@service.in",
];

const SAMPLE_AGENT_NAMES = [
  "Aarav Mehta",
  "Priya Patel",
  "Vikram Agarwal",
  "Neha Kapoor",
  "Arjun Sharma",
  "Ritu Verma",
  "Sanjay Gupta",
  "Divya Rajput",
  "Rahul Malhotra",
  "Kavita Singhania"
];

// Sample email subjects
const SAMPLE_SUBJECTS = [
  "Account Verification Required",
  "Your Recent Order #12345",
  "Weekly Technology Updates",
  "Invoice for March 2024",
  "Support Request: Login Issues",
  "Product Delivery Status",
  "New Feature Announcement",
  "Security Alert: Password Change",
  "Promotional Offer: 25% Discount",
  "Feedback Request on Recent Purchase",
  "Account Statement Available",
  "Website Maintenance Notice",
  "Subscription Renewal Information",
  "Important Update: Privacy Policy",
  "Invitation: Product Launch Event"
];

// Sample email content
const SAMPLE_CONTENT = [
  "Namaste, please verify your account to access all features of our platform. Click the link below to complete the verification process.",
  "Thank you for your order. We're happy to inform you that your package has been shipped and is on its way to you. Here's your tracking information.",
  "Check out the latest trends in technology this week. We've compiled a list of innovative products and services that are making waves in the industry.",
  "Your monthly invoice is ready for review. Please find attached the detailed breakdown of your services and the corresponding charges.",
  "We've noticed you're having trouble logging into your account. Our team is here to help you regain access quickly and securely.",
  "Your product is currently being processed at our warehouse. Expected delivery date is within the next 3-5 business days.",
  "We're excited to announce a new feature that will enhance your experience with our platform. Learn how it can help streamline your workflow.",
  "For your account security, we recommend changing your password regularly. Please use a strong, unique password to protect your information.",
  "As a valued customer, we're offering you an exclusive 25% discount on your next purchase. Use code PREMIUM25 at checkout.",
  "We value your opinion! Please take a moment to share your thoughts on your recent purchase. Your feedback helps us improve our services.",
  "Your monthly account statement is now available for download. Please review it and contact us if you notice any discrepancies.",
  "Our website will be undergoing maintenance from 2AM to 4AM IST tomorrow. We apologize for any inconvenience this may cause.",
  "Your subscription is due for renewal next week. To ensure uninterrupted service, please update your payment information.",
  "We've updated our privacy policy to better protect your data. Please review the changes and let us know if you have any questions.",
  "You're invited to our exclusive product launch event next month. Join us to be among the first to experience our newest innovations."
];

// Automated responses
const AUTOMATED_RESPONSES = [
  "Namaste! Thank you for your email. We will get back to you shortly with more information.",
  "We have received your inquiry and our team is working to address your concerns as quickly as possible.",
  "Thank you for reaching out to us. Your request has been assigned to a specialist who will contact you within 24 hours.",
  "We appreciate your patience. Your case has been escalated to our senior support team for immediate attention.",
  "Thank you for your valuable feedback. We're constantly working to improve our services based on customer insights.",
  "We apologize for any inconvenience caused. Our team is committed to resolving your issue promptly.",
  "Your satisfaction is our priority. We're reviewing your request and will respond with a comprehensive solution.",
  "We've received your support ticket and have assigned it the highest priority. Expect a resolution soon."
];

const EmailPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    content: "",
  });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "unread" | "starred" | "resolved">("all");
  const [sentimentStats, setSentimentStats] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [queueCount, setQueueCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [scheduledEmails, setScheduledEmails] = useState<{date: Date, to: string, subject: string}[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [forwardContent, setForwardContent] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showForwardInput, setShowForwardInput] = useState(false);
  const [forwardTo, setForwardTo] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingEmail, setCurrentTypingEmail] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);
  const emailListRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sentiment analysis function
  const analyzeSentiment = (content: string): "positive" | "neutral" | "negative" => {
    const positiveWords = ["thank", "thanks", "appreciate", "great", "excellent", "good", "happy", "pleased", "satisfied", "wonderful", "awesome", "love"];
    const negativeWords = ["issue", "problem", "disappointing", "bad", "unhappy", "error", "mistake", "failed", "poor", "terrible", "awful", "hate", "wrong"];
    
    content = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => content.includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  // Update filtered emails when emails or filter changes
  useEffect(() => {
    let filtered = [...emails];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        email => 
          email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    switch (filterBy) {
      case "unread":
        filtered = filtered.filter(email => !email.isRead);
        break;
      case "starred":
        filtered = filtered.filter(email => email.isStarred);
        break;
      case "resolved":
        filtered = filtered.filter(email => email.isResolved);
        break;
      default:
        // all emails
        break;
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setFilteredEmails(filtered);
    
    // Calculate sentiment stats
    const stats = {
      positive: emails.filter(e => e.sentiment === "positive").length,
      neutral: emails.filter(e => e.sentiment === "neutral").length,
      negative: emails.filter(e => e.sentiment === "negative").length
    };
    setSentimentStats(stats);
  }, [emails, searchQuery, filterBy]);

  // Generate initial emails
  useEffect(() => {
    const initialEmails: Email[] = [];
    
    // Create initial emails with diverse data
    for (let i = 0; i < 10; i++) {
      const fromIndex = Math.floor(Math.random() * SAMPLE_EMAILS_FROM.length);
      const subjectIndex = Math.floor(Math.random() * SAMPLE_SUBJECTS.length);
      const contentIndex = Math.floor(Math.random() * SAMPLE_CONTENT.length);
      
      // Create random timestamp within the last 7 days
      const daysAgo = Math.random() * 7;
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      
      // Randomly add thread information for some emails
      const hasThread = Math.random() > 0.6;
      const thread = hasThread ? {
        lastEmail: new Date(timestamp.getTime() - Math.random() * 86400000 * 10), // 0-10 days before the current email
        count: 1 + Math.floor(Math.random() * 5) // 1-5 previous emails in thread
      } : undefined;
      
      // Determine sentiment
      const content = SAMPLE_CONTENT[contentIndex];
      const sentiment = analyzeSentiment(content);
      
      // Generate tags
      const possibleTags = ["important", "work", "personal", "finance", "shopping", "travel"];
      const tagCount = Math.floor(Math.random() * 3); // 0-2 tags
      const tags = [];
      for (let j = 0; j < tagCount; j++) {
        const tagIndex = Math.floor(Math.random() * possibleTags.length);
        tags.push(possibleTags[tagIndex]);
      }
      
      // Determine priority
      const priorityOptions: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
      const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
      
      // Create the email
      const email: Email = {
        id: `email-${Date.now()}-${i}`,
        from: SAMPLE_EMAILS_FROM[fromIndex],
        subject: SAMPLE_SUBJECTS[subjectIndex],
        content: SAMPLE_CONTENT[contentIndex],
        timestamp: timestamp,
        isRead: Math.random() > 0.3, // 70% chance to be read
        isResolved: Math.random() > 0.7, // 30% chance to be resolved
        isStarred: Math.random() > 0.8, // 20% chance to be starred
        sentiment: sentiment,
        thread: thread,
        tags: tags.length > 0 ? tags : undefined,
        priority: priority
      };
      
      initialEmails.push(email);
    }
    
    setEmails(initialEmails);
    setQueueCount(Math.floor(Math.random() * 5)); // 0-4 emails in queue
  }, []);

  // Simulate new emails arriving
  useEffect(() => {
    const interval = setInterval(() => {
      if (emails.length < 30 && Math.random() > 0.7) {
        // Increment the queue count
        setQueueCount(prev => prev + 1);
        
        // Pick a random sender
        const fromIndex = Math.floor(Math.random() * SAMPLE_EMAILS_FROM.length);
        const from = SAMPLE_EMAILS_FROM[fromIndex];
        
        // Show typing indicator for 2-4 seconds
        setIsTyping(true);
        setCurrentTypingEmail(from);
        
        // After "typing", add the email
        setTimeout(() => {
          setIsTyping(false);
          setCurrentTypingEmail("");
          
          const subjectIndex = Math.floor(Math.random() * SAMPLE_SUBJECTS.length);
          const contentIndex = Math.floor(Math.random() * SAMPLE_CONTENT.length);
          const content = SAMPLE_CONTENT[contentIndex];
          
          const newEmail: Email = {
            id: `email-${Date.now()}`,
            from: from,
            subject: SAMPLE_SUBJECTS[subjectIndex],
            content: content,
            timestamp: new Date(),
            isRead: false,
            isResolved: false,
            isStarred: false,
            sentiment: analyzeSentiment(content),
            priority: Math.random() > 0.8 ? "high" : Math.random() > 0.5 ? "medium" : "low"
          };
          
          setEmails(prev => [newEmail, ...prev]);
          setQueueCount(prev => Math.max(0, prev - 1));
          
          // Show notification
          toast({
            title: (
              <div className="flex items-center">
                <MailPlus className="mr-2 h-4 w-4 text-indigo-500" />
                <span>New Email Received</span>
              </div>
            ),
            description: `From: ${from.split('@')[0]} - ${newEmail.subject.substring(0, 30)}${newEmail.subject.length > 30 ? '...' : ''}`,
            className: "notification-animate"
          });
          
          // Show high priority alert sometimes
          if (newEmail.priority === "high") {
            setTimeout(() => {
              toast({
                title: (
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>High Priority Email</span>
                  </div>
                ),
                description: `Urgent attention required: ${from}`,
                className: "notification-animate bg-red-50 border-red-200"
              });
            }, 1000);
          }
        }, 2000 + Math.random() * 2000);
      }
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, [emails]);

  // Handle sending a new email
  const handleSendEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        className: "bg-red-50 border-red-200"
      });
      return;
    }

    toast({
      title: (
        <div className="flex items-center">
          <Send className="mr-2 h-4 w-4 text-green-500" />
          <span>Email Sent Successfully</span>
        </div>
      ),
      description: `To: ${newEmail.to}`,
      className: "notification-animate bg-green-50 border-green-200"
    });

    setNewEmail({ to: "", subject: "", content: "" });
    setShowCompose(false);
  };

  // Toggle email status (read, resolved, starred)
  const toggleEmailStatus = (emailId: string, status: "read" | "resolved" | "starred") => {
    setEmails(prev =>
      prev.map(email =>
        email.id === emailId
          ? {
              ...email,
              isRead: status === "read" ? !email.isRead : email.isRead,
              isResolved: status === "resolved" ? !email.isResolved : email.isResolved,
              isStarred: status === "starred" ? !email.isStarred : email.isStarred,
            }
          : email
      )
    );

    // If marking as resolved, show a toast
    if (status === "resolved") {
      const email = emails.find(e => e.id === emailId);
      if (email && !email.isResolved) {
        toast({
          title: (
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              <span>Email Resolved</span>
            </div>
          ),
          description: `${email.subject} has been marked as resolved`,
          className: "notification-animate bg-green-50 border-green-200"
        });
      }
    }
  };

  // Handle refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      // Sort emails by timestamp (newest first)
      setEmails(prev => [...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      setIsRefreshing(false);
      
      toast({
        title: "Refreshed",
        description: "Email list has been updated",
        className: "notification-animate"
      });
    }, 1500);
  };

  // Handle scheduling an email
  const handleScheduleEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content || !scheduledDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields including the schedule date",
        className: "bg-red-50 border-red-200"
      });
      return;
    }

    // Parse the time
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const scheduledDateTime = new Date(scheduledDate);
    scheduledDateTime.setHours(hours, minutes);

    // Check if the scheduled time is in the past
    if (scheduledDateTime <= new Date()) {
      toast({
        title: "Error",
        description: "Please select a future date and time",
        className: "bg-red-50 border-red-200"
      });
      return;
    }

    // Add to scheduled emails
    setScheduledEmails(prev => [
      ...prev,
      {
        date: scheduledDateTime,
        to: newEmail.to,
        subject: newEmail.subject
      }
    ]);

    toast({
      title: (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
          <span>Email Scheduled</span>
        </div>
      ),
      description: `To: ${newEmail.to} on ${format(scheduledDateTime, "PPP 'at' p")}`,
      className: "notification-animate bg-indigo-50 border-indigo-200"
    });

    setNewEmail({ to: "", subject: "", content: "" });
    setScheduledDate(null);
    setScheduledTime("09:00");
    setShowScheduler(false);
  };

  // Handle reply to email
  const handleReply = () => {
    if (!selectedEmail || !replyContent.trim()) return;
    
    setIsTyping(true);
    
    // Simulate typing delay then send
    setTimeout(() => {
      setIsTyping(false);
      
      toast({
        title: (
          <div className="flex items-center">
            <Reply className="mr-2 h-4 w-4 text-blue-500" />
            <span>Reply Sent</span>
          </div>
        ),
        description: `Your reply to ${selectedEmail.from.split('@')[0]} has been sent`,
        className: "notification-animate bg-blue-50 border-blue-200"
      });
      
      // Add the reply to the current email thread
      const updatedEmails = emails.map(email => {
        if (email.id === selectedEmail.id) {
          // Add a thread if it doesn't exist
          const threadInfo = email.thread 
            ? { ...email.thread, count: email.thread.count + 1, lastEmail: new Date() }
            : { count: 1, lastEmail: new Date() };
          
          return {
            ...email,
            thread: threadInfo,
            isResolved: true // Mark as resolved once replied
          };
        }
        return email;
      });
      
      setEmails(updatedEmails);
      setReplyContent("");
      setShowReplyInput(false);
      
      // Simulate an automatic follow-up after 3-5 seconds
      setTimeout(() => {
        if (Math.random() > 0.5 && selectedEmail) {
          setIsTyping(true);
          setCurrentTypingEmail(selectedEmail.from);
          
          setTimeout(() => {
            setIsTyping(false);
            setCurrentTypingEmail("");
            
            // Generate automatic reply from the customer
            const autoReply = "Thank you for your prompt response. I appreciate your help!";
            
            toast({
              title: (
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>New Reply Received</span>
                </div>
              ),
              description: `From: ${selectedEmail.from.split('@')[0]} - "${autoReply.substring(0, 30)}${autoReply.length > 30 ? '...' : ''}"`,
              className: "notification-animate"
            });
          }, 2000 + Math.random() * 1000);
        }
      }, 3000 + Math.random() * 2000);
    }, 1500 + Math.random() * 1000);
  };

  // Handle forward email
  const handleForward = () => {
    if (!selectedEmail || !forwardTo || !forwardContent.trim()) return;
    
    setIsForwarding(true);
    
    // Simulate delay then send
    setTimeout(() => {
      setIsForwarding(false);
      
      toast({
        title: (
          <div className="flex items-center">
            <Forward className="mr-2 h-4 w-4 text-purple-500" />
            <span>Email Forwarded</span>
          </div>
        ),
        description: `Email forwarded to ${forwardTo}`,
        className: "notification-animate bg-purple-50 border-purple-200"
      });
      
      setForwardTo("");
      setForwardContent("");
      setShowForwardInput(false);
    }, 2000);
  };

  // Helper function to get sentiment badge color
  const getSentimentColor = (sentiment?: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "neutral":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Helper function to get priority badge color
  const getPriorityColor = (priority?: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Email Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage, respond and track all customer communications
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className={`relative hover-scale ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setShowScheduler(true);
                      setShowCompose(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="hover-scale"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Email</DialogTitle>
                    <DialogDescription>
                      Set the date and time to automatically send this email.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="scheduleTo" className="text-sm font-medium col-span-1">
                        To
                      </label>
                      <Input
                        id="scheduleTo"
                        value={newEmail.to}
                        onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="scheduleSubject" className="text-sm font-medium col-span-1">
                        Subject
                      </label>
                      <Input
                        id="scheduleSubject"
                        value={newEmail.subject}
                        onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label htmlFor="scheduleContent" className="text-sm font-medium col-span-1">
                        Message
                      </label>
                      <Textarea
                        id="scheduleContent"
                        value={newEmail.content}
                        onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                        className="col-span-3"
                        rows={5}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label className="text-sm font-medium col-span-1">
                        Date
                      </label>
                      <div className="col-span-3">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          className="border rounded-md p-2"
                          disabled={(date) => date < new Date()}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="scheduleTime" className="text-sm font-medium col-span-1">
                        Time
                      </label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowScheduler(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleScheduleEmail}>
                      Schedule Email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={() => {
                  setShowCompose(true);
                  setShowScheduler(false);
                }}
                variant="premium"
                className="hover-scale"
              >
                <MailPlus className="mr-2 h-4 w-4" />
                Compose
              </Button>
            </div>
          </div>

          {/* Filter and Search Row */}
          <Card className="mb-6 glass-card shadow-sm border-0 hover-scale">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-950 bg-opacity-50 backdrop-blur-sm"
                  />
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  <Button
                    variant={filterBy === "all" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setFilterBy("all")}
                    className="whitespace-nowrap"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    All Emails
                  </Button>
                  <Button
                    variant={filterBy === "unread" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setFilterBy("unread")}
                    className="whitespace-nowrap"
                  >
                    <Circle className="mr-2 h-4 w-4" />
                    Unread
                    {emails.filter(e => !e.isRead).length > 0 && (
                      <Badge className="ml-2 bg-indigo-600" variant="default">
                        {emails.filter(e => !e.isRead).length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant={filterBy === "starred" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setFilterBy("starred")}
                    className="whitespace-nowrap"
                  >
                    <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Starred
                  </Button>
                  <Button
                    variant={filterBy === "resolved" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setFilterBy("resolved")}
                    className="whitespace-nowrap"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Resolved
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                    {sentimentStats.positive}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                    <div className="h-2 w-2 bg-gray-500 rounded-full mr-1"></div>
                    {sentimentStats.neutral}
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    <div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div>
                    {sentimentStats.negative}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Queue Info */}
          {queueCount > 0 && (
            <div className="flex justify-between items-center mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 notification-animate">
              <div className="flex items-center space-x-2">
                <BellRing className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  {queueCount} new email{queueCount !== 1 ? 's' : ''} in queue
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setQueueCount(0)}
              >
                Dismiss
              </Button>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {currentTypingEmail ? `${currentTypingEmail.split('@')[0]} is typing...` : 'Someone is typing...'}
                </span>
              </div>
            </div>
          )}

          {/* Main Content - Bento Grid */}
          <div className="bentoGrid">
            {/* Email List */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-indigo-600" />
                    <span>Inbox</span>
                    <Badge variant="default" className="ml-2">
                      {filteredEmails.length}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <ScrollArea className="h-[600px] pr-4" ref={emailListRef}>
                  <div className="space-y-4">
                    {filteredEmails.length > 0 ? (
                      filteredEmails.map((email, index) => (
                        <div
                          key={email.id}
                          onClick={() => {
                            setSelectedEmail(email);
                            
                            // Mark as read if unread
                            if (!email.isRead) {
                              toggleEmailStatus(email.id, "read");
                            }
                            
                            // Scroll content to top when selecting a new email
                            if (contentRef.current) {
                              contentRef.current.scrollTop = 0;
                            }
                          }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            !email.isRead ? 
                              "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800" : 
                              selectedEmail?.id === email.id ?
                                "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700" :
                                "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                          } premium-hover`}
                          style={{animationDelay: `${index * 100}ms`}}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium text-gray-900 dark:text-gray-100 truncate ${!email.isRead ? "font-semibold" : ""}`}>
                              {email.subject}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {email.priority && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className={getPriorityColor(email.priority)}>
                                        {email.priority}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Priority: {email.priority}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {email.isStarred && (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              )}
                              {email.isResolved && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                              {email.from.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                                {email.from.split('@')[0]}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                {email.from}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {email.content.substring(0, 100)}{email.content.length > 100 ? '...' : ''}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {format(email.timestamp, 'MMM d, h:mm a')}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{format(email.timestamp, 'PPPp')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              {email.thread && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-xs py-0 h-5">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        {email.thread.count}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {email.thread.count} message{email.thread.count !== 1 ? 's' : ''} in thread<br />
                                        Last activity: {format(email.thread.lastEmail, 'PPP')}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              
                              {email.sentiment && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>
                                        {email.sentiment === 'positive' ? (
                                          <Heart className="h-3.5 w-3.5 text-green-500" />
                                        ) : email.sentiment === 'negative' ? (
                                          <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                                        ) : (
                                          <Circle className="h-3.5 w-3.5 text-gray-400" />
                                        )}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Sentiment: {email.sentiment}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEmailStatus(email.id, "read");
                                }}
                              >
                                {email.isRead ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : (
                                  <Circle className="h-3.5 w-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEmailStatus(email.id, "starred");
                                }}
                              >
                                <Star className={`h-3.5 w-3.5 ${email.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                              </Button>
                            </div>
                          </div>
                          
                          {email.tags && email.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {email.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                          <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">No emails found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No emails match your current filters. Try adjusting your search criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Email Content */}
            <Card className="col-span-12 lg:col-span-8 glass-card hover-scale shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-indigo-600" />
                    <span>{selectedEmail ? "Email Content" : "Select an email"}</span>
                  </div>
                  
                  {selectedEmail && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEmailStatus(selectedEmail.id, "resolved")}
                        className="gap-1"
                      >
                        <CheckCircle2 className={`h-4 w-4 ${
                          selectedEmail.isResolved ? "text-green-500" : ""
                        }`} />
                        {selectedEmail.isResolved ? "Resolved" : "Mark as Resolved"}
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <ScrollArea className="h-[600px] pr-4" ref={contentRef}>
                  {selectedEmail ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedEmail.subject}</h2>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                              {selectedEmail.from.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{selectedEmail.from.split('@')[0]}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedEmail.from}</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(selectedEmail.timestamp, 'PPpp')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          {selectedEmail.sentiment && (
                            <Badge className={`${getSentimentColor(selectedEmail.sentiment)}`}>
                              Sentiment: {selectedEmail.sentiment}
                            </Badge>
                          )}
                          
                          {selectedEmail.priority && (
                            <Badge className={`${getPriorityColor(selectedEmail.priority)}`}>
                              Priority: {selectedEmail.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="min-h-[200px] p-4 rounded-lg bg-white dark:bg-gray-900/50 border dark:border-gray-800">
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{selectedEmail.content}</p>
                        
                        {selectedEmail.thread && selectedEmail.thread.count > 1 && (
                          <div className="mt-6 pt-6 border-t border-dashed">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Thread History</h3>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 gap-1 text-xs"
                              >
                                <Clock8 className="h-3 w-3" />
                                {format(selectedEmail.thread.lastEmail, 'MMM d, h:mm a')}
                              </Button>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                              This thread contains {selectedEmail.thread.count} previous messages. 
                              Last activity was on {format(selectedEmail.thread.lastEmail, 'PPPP')}.
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 pt-2">
                        <Button 
                          variant={showReplyInput ? "secondary" : "outline"}
                          onClick={() => {
                            setShowReplyInput(!showReplyInput);
                            setShowForwardInput(false);
                          }}
                          className="premium-hover"
                        >
                          <Reply className="mr-2 h-4 w-4" />
                          Reply
                        </Button>
                        
                        <Button 
                          variant={showForwardInput ? "secondary" : "outline"}
                          onClick={() => {
                            setShowForwardInput(!showForwardInput);
                            setShowReplyInput(false);
                          }}
                          className="premium-hover"
                        >
                          <Forward className="mr-2 h-4 w-4" />
                          Forward
                        </Button>
                      </div>
                      
                      {showReplyInput && (
                        <div className="space-y-3 animate-fade-in pt-2">
                          <Textarea
                            placeholder="Type your reply here..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[150px] contact-field"
                          />
                          <div className="flex justify-between">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setReplyContent(AUTOMATED_RESPONSES[Math.floor(Math.random() * AUTOMATED_RESPONSES.length)])}
                              >
                                Use Template
                              </Button>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                onClick={() => {
                                  setShowReplyInput(false);
                                  setReplyContent("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleReply}
                                disabled={!replyContent.trim()}
                                className="premium-hover"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {showForwardInput && (
                        <div className="space-y-3 animate-fade-in pt-2">
                          <div className="space-y-3">
                            <Input
                              placeholder="Recipient email address"
                              value={forwardTo}
                              onChange={(e) => setForwardTo(e.target.value)}
                              className="contact-field"
                            />
                            
                            <Textarea
                              placeholder="Add a message (optional)"
                              value={forwardContent}
                              onChange={(e) => setForwardContent(e.target.value)}
                              className="min-h-[150px] contact-field"
                            />
                            
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                              <div className="text-sm font-medium mb-2">Forwarded Content:</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p><strong>From:</strong> {selectedEmail.from}</p>
                                <p><strong>Subject:</strong> {selectedEmail.subject}</p>
                                <p><strong>Date:</strong> {format(selectedEmail.timestamp, 'PPpp')}</p>
                                <Separator className="my-2" />
                                <p className="whitespace-pre-wrap">{selectedEmail.content.substring(0, 100)}...</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              onClick={() => {
                                setShowForwardInput(false);
                                setForwardTo("");
                                setForwardContent("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleForward}
                              disabled={!forwardTo || isForwarding}
                              className={`premium-hover ${isForwarding ? 'animate-pulse' : ''}`}
                            >
                              <Forward className="mr-2 h-4 w-4" />
                              {isForwarding ? 'Forwarding...' : 'Forward Email'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4 text-gray-500 dark:text-gray-400">
                      <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Mail className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select an email</h3>
                        <p className="max-w-md mt-2">
                          Choose an email from the list to view its content and take action
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCompose(true)}
                        className="mt-4"
                      >
                        <MailPlus className="mr-2 h-4 w-4" />
                        Compose New Email
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Email Statistics Row */}
            <Card className="col-span-12 glass-card hover-scale shadow-lg border-0 bg-white/70 dark:bg-gray-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Email Analytics
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
                    {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              
              {showAnalytics && (
                <CardContent className="py-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Total Emails</p>
                          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{emails.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                          <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-1">
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">
                          {queueCount} in queue
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">Resolved</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {emails.filter(e => e.isResolved).length}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={(emails.filter(e => e.isResolved).length / emails.length) * 100}
                          className="h-1.5 bg-green-100 dark:bg-green-900"
                        />
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {Math.round((emails.filter(e => e.isResolved).length / emails.length) * 100)}% completion rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Response Time</p>
                          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">4.2h</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-1">
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          15% faster than last week
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Sentiment Score</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {Math.round((sentimentStats.positive / (sentimentStats.positive + sentimentStats.neutral + sentimentStats.negative || 1)) * 100)}%
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                          <Heart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="flex h-1.5 rounded-full">
                            <div
                              style={{ width: `${(sentimentStats.positive / (emails.length || 1)) * 100}%` }}
                              className="bg-green-500"
                            />
                            <div
                              style={{ width: `${(sentimentStats.neutral / (emails.length || 1)) * 100}%` }}
                              className="bg-gray-400"
                            />
                            <div
                              style={{ width: `${(sentimentStats.negative / (emails.length || 1)) * 100}%` }}
                              className="bg-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
              
              <CardFooter className="pt-2 pb-4">
                <div className="w-full flex flex-wrap items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {format(new Date(), "MMM d, h:mm a")}
                  </div>
                  
                  {scheduledEmails.length > 0 && (
                    <div>
                      <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {scheduledEmails.length} scheduled email{scheduledEmails.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Compose Email Popover */}
      <Popover open={showCompose} onOpenChange={setShowCompose}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-4" align="end">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Compose Email</h3>
            <Input
              placeholder="To"
              value={newEmail.to}
              onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
              className="contact-field"
            />
            <Input
              placeholder="Subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
              className="contact-field"
            />
            <Textarea
              placeholder="Content"
              value={newEmail.content}
              onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
              className="min-h-[200px] contact-field"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCompose(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} className="premium-hover">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EmailPage;
