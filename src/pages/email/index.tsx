import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { MailPlus, Send, Reply, Forward, AlertCircle, Mail, CheckCircle2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import "@/styles/social.css";

// Import types and data
import { Email, ScheduledEmail } from "@/components/email/EmailTypes";
import { generateInitialEmails, analyzeSentiment, SAMPLE_EMAILS_FROM, SAMPLE_SUBJECTS, SAMPLE_CONTENT } from "@/components/email/EmailData";

// Import helper functions
import { getSentimentColor, getPriorityColor } from "@/components/email/helpers";

// Import components
import { EmailHeader } from "@/components/email/EmailHeader";
import { EmailComposer } from "@/components/email/EmailComposer";
import { EmailScheduler } from "@/components/email/EmailScheduler";
import { EmailList } from "@/components/email/EmailList";
import { EmailDetail } from "@/components/email/EmailDetail";
import { EmailAnalytics } from "@/components/email/EmailAnalytics";

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
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
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
    const initialEmails = generateInitialEmails();
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
          toast(
            <div className="flex items-center">
              <MailPlus className="mr-2 h-4 w-4 text-indigo-500" />
              <span>New Email Received</span>
            </div>,
            {
              description: `From: ${from.split('@')[0]} - ${newEmail.subject.substring(0, 30)}${newEmail.subject.length > 30 ? '...' : ''}`,
              className: "notification-animate"
            }
          );
          
          // Show high priority alert sometimes
          if (newEmail.priority === "high") {
            setTimeout(() => {
              toast(
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  <span>High Priority Email</span>
                </div>,
                {
                  description: `Urgent attention required: ${from}`,
                  className: "notification-animate bg-red-50 border-red-200"
                }
              );
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
      toast("Error", {
        description: "Please fill in all fields",
        className: "bg-red-50 border-red-200"
      });
      return;
    }

    toast(
      <div className="flex items-center">
        <Send className="mr-2 h-4 w-4 text-green-500" />
        <span>Email Sent Successfully</span>
      </div>,
      {
        description: `To: ${newEmail.to}`,
        className: "notification-animate bg-green-50 border-green-200"
      }
    );

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
        toast(
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            <span>Email Resolved</span>
          </div>,
          {
            description: `${email.subject} has been marked as resolved`,
            className: "notification-animate bg-green-50 border-green-200"
          }
        );
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
      
      toast("Refreshed", {
        description: "Email list has been updated",
        className: "notification-animate"
      });
    }, 1500);
  };

  // Handle scheduling an email
  const handleScheduleEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content || !scheduledDate) {
      toast("Error", {
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
      toast("Error", {
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

    toast(
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
        <span>Email Scheduled</span>
      </div>,
      {
        description: `To: ${newEmail.to} on ${format(scheduledDateTime, "PPP 'at' p")}`,
        className: "notification-animate bg-indigo-50 border-indigo-200"
      }
    );

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
      
      toast(
        <div className="flex items-center">
          <Reply className="mr-2 h-4 w-4 text-blue-500" />
          <span>Reply Sent</span>
        </div>,
        {
          description: `Your reply to ${selectedEmail.from.split('@')[0]} has been sent`,
          className: "notification-animate bg-blue-50 border-blue-200"
        }
      );
      
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
            
            toast(
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-indigo-500" />
                <span>New Reply Received</span>
              </div>,
              {
                description: `From: ${selectedEmail.from.split('@')[0]} - "${autoReply.substring(0, 30)}${autoReply.length > 30 ? '...' : ''}"`,
                className: "notification-animate"
              }
            );
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
      
      toast(
        <div className="flex items-center">
          <Forward className="mr-2 h-4 w-4 text-purple-500" />
          <span>Email Forwarded</span>
        </div>,
        {
          description: `Email forwarded to ${forwardTo}`,
          className: "notification-animate bg-purple-50 border-purple-200"
        }
      );
      
      setForwardTo("");
      setForwardContent("");
      setShowForwardInput(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
          <Card className="mb-6 glass-card shadow-sm border-0 hover-scale">
            <CardContent className="p-4">
              <EmailHeader 
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                setShowScheduler={setShowScheduler}
                setShowCompose={setShowCompose}
                unreadCount={emails.filter(e => !e.isRead).length}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Email List */}
            <div className="lg:col-span-1">
              <EmailList 
                filteredEmails={filteredEmails}
                selectedEmail={selectedEmail}
                setSelectedEmail={setSelectedEmail}
                toggleEmailStatus={toggleEmailStatus}
                getSentimentColor={getSentimentColor}
                getPriorityColor={getPriorityColor}
                isTyping={isTyping}
                currentTypingEmail={currentTypingEmail}
              />
            </div>
            
            {/* Middle Column: Email Detail/Compose */}
            <div className="lg:col-span-1">
              {showCompose ? (
                <EmailComposer 
                  newEmail={newEmail}
                  setNewEmail={setNewEmail}
                  handleSendEmail={handleSendEmail}
                />
              ) : showScheduler ? (
                <EmailScheduler 
                  newEmail={newEmail}
                  setNewEmail={setNewEmail}
                  scheduledDate={scheduledDate}
                  setScheduledDate={setScheduledDate}
                  scheduledTime={scheduledTime}
                  setScheduledTime={setScheduledTime}
                  handleScheduleEmail={handleScheduleEmail}
                />
              ) : (
                <EmailDetail 
                  selectedEmail={selectedEmail}
                  toggleEmailStatus={toggleEmailStatus}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  showReplyInput={showReplyInput}
                  setShowReplyInput={setShowReplyInput}
                  handleReply={handleReply}
                  forwardTo={forwardTo}
                  setForwardTo={setForwardTo}
                  forwardContent={forwardContent}
                  setForwardContent={setForwardContent}
                  showForwardInput={showForwardInput}
                  setShowForwardInput={setShowForwardInput}
                  handleForward={handleForward}
                  isForwarding={isForwarding}
                  getSentimentColor={getSentimentColor}
                  getPriorityColor={getPriorityColor}
                />
              )}
            </div>
            
            {/* Right Column: Analytics and Metrics */}
            <div className="lg:col-span-1">
              <EmailAnalytics 
                sentimentStats={sentimentStats}
                queueCount={queueCount}
                scheduledEmails={scheduledEmails}
                showAnalytics={showAnalytics}
                setShowAnalytics={setShowAnalytics}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailPage;
