
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday, isYesterday, isSameWeek, subDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Inbox,
  Send,
  Archive,
  Trash2,
  Star,
  Flag,
  Tag,
  MoreVertical,
  Reply,
  Forward,
  Download,
  Printer,
  Filter,
  Search,
  Plus,
  CheckCircle2,
  CalendarIcon,
  X,
  Bell,
  AlertCircle,
  BarChart3
} from "lucide-react";

import { Email, EmailMetrics } from "./types";
import { 
  indianNames, 
  generateRandomEmail, 
  calculateEmailMetrics 
} from "./utils";
import EmailMetricsComponent from "./EmailMetrics";
import ComposeEmail from "./ComposeEmail";
import ReplyEmail from "./ReplyEmail";

const SAMPLE_EMAILS: Email[] = [
  {
    id: "1",
    subject: "Project Review Meeting Notes",
    sender: {
      name: "Arjun Sharma",
      email: "arjun.sharma@example.com",
      avatar: "/avatars/arjun-sharma.jpg"
    },
    recipients: [
      {
        name: "You",
        email: "you@example.com"
      }
    ],
    content: `
      Namaste,

      Here are the key points from today's project review meeting:

      1. Timeline updates for the marketing campaign
      2. Resource allocation for Q2
      3. Next steps for the product launch

      Please review and let me know if you have any questions.

      Warm regards,
      Arjun
    `,
    attachments: [
      {
        name: "meeting-notes.pdf",
        size: "2.4 MB",
        type: "pdf"
      },
      {
        name: "presentation.pptx",
        size: "5.8 MB",
        type: "pptx"
      }
    ],
    date: new Date(Date.now() - 86400000),
    read: true,
    starred: true,
    flagged: false,
    labels: ["Important", "Work"],
    folder: "inbox",
    status: "read",
    responseTime: 45
  },
  {
    id: "2",
    subject: "Quarterly Performance Report",
    sender: {
      name: "Priya Patel",
      email: "priya.patel@example.com",
      avatar: "/avatars/priya-patel.jpg"
    },
    recipients: [
      {
        name: "You",
        email: "you@example.com"
      }
    ],
    content: `
      Dear Team,

      Attached is the quarterly performance report for Q4 2023.

      Highlights:
      - Revenue growth: 15%
      - Customer satisfaction: 92%
      - New market expansion in South India

      Please review the detailed report for more information.

      Best regards,
      Priya
    `,
    attachments: [
      {
        name: "Q4-2023-report.xlsx",
        size: "1.8 MB",
        type: "xlsx"
      }
    ],
    date: new Date(Date.now() - 172800000),
    read: false,
    starred: false,
    flagged: true,
    labels: ["Reports", "Finance"],
    folder: "inbox",
    status: "unread",
    responseTime: 78
  }
];

const EmailPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [emailMetrics, setEmailMetrics] = useState<EmailMetrics>({
    totalReceived: 0,
    resolved: 0,
    averageResponseTime: 0,
    dailyEmails: []
  });
  const [showingMetrics, setShowingMetrics] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setEmails(SAMPLE_EMAILS);
    setEmailMetrics(calculateEmailMetrics(SAMPLE_EMAILS));
    
    setTimeout(() => {
      toast("Welcome to Premium Email Dashboard", {
        description: "Your personalized email experience is ready",
        icon: <Mail className="h-4 w-4 text-purple-500" />
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const newEmail = generateRandomEmail(Date.now().toString());
      
      setEmails(prev => [newEmail, ...prev]);
      
      setEmailMetrics(calculateEmailMetrics([newEmail, ...emails]));
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [emails]);

  const handleEmailAction = (action: string, email: Email) => {
    switch (action) {
      case "star":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, starred: !e.starred } : e
          )
        );
        toast(email.starred ? "Email unmarked" : "Email marked as important");
        
        if (selectedEmail && selectedEmail.id === email.id) {
          setSelectedEmail({ ...selectedEmail, starred: !selectedEmail.starred });
        }
        break;
      
      case "flag":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, flagged: !e.flagged } : e
          )
        );
        toast(email.flagged ? "Flag removed" : "Email flagged");
        
        if (selectedEmail && selectedEmail.id === email.id) {
          setSelectedEmail({ ...selectedEmail, flagged: !selectedEmail.flagged });
        }
        break;
      
      case "archive":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, folder: "archive" } : e
          )
        );
        toast("Email archived");
        
        if (selectedEmail && selectedEmail.id === email.id) {
          setSelectedEmail(null);
        }
        break;
      
      case "delete":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, folder: "trash" } : e
          )
        );
        toast("Email moved to trash");
        
        if (selectedEmail && selectedEmail.id === email.id) {
          setSelectedEmail(null);
        }
        break;
      
      case "mark_read":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, read: true, status: e.status === "unread" ? "read" : e.status } : e
          )
        );
        toast("Email marked as read");
        
        if (selectedEmail && selectedEmail.id === email.id) {
          setSelectedEmail({ 
            ...selectedEmail, 
            read: true, 
            status: selectedEmail.status === "unread" ? "read" : selectedEmail.status 
          });
        }
        break;
      
      case "mark_unread":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, read: false, status: "unread" } : e
          )
        );
        toast("Email marked as unread");
        
        if (selectedEmail && selectedEmail.id === email.id) {
          setSelectedEmail({ ...selectedEmail, read: false, status: "unread" });
        }
        break;
      
      case "mark_resolved":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, status: "resolved", read: true } : e
          )
        );
        toast("Email marked as resolved");
        
        setEmailMetrics(prev => ({
          ...prev,
          resolved: prev.resolved + 1
        }));
        
        if (selectedEmail && selectedEmail.id === email.id) {
          setSelectedEmail({ ...selectedEmail, status: "resolved", read: true });
        }
        break;
      
      default:
        break;
    }
  };

  const handleComposeEmail = (email: { to: string; subject: string; content: string }) => {
    const newEmail: Email = {
      id: Date.now().toString(),
      subject: email.subject,
      sender: {
        name: "You",
        email: "you@example.com"
      },
      recipients: [
        {
          name: email.to.split('@')[0],
          email: email.to
        }
      ],
      content: email.content,
      date: new Date(),
      read: true,
      starred: false,
      flagged: false,
      folder: "sent",
      status: "read",
      responseTime: 0
    };
    
    setEmails(prev => [newEmail, ...prev]);
  };

  const handleReplyEmail = () => {
    if (selectedEmail) {
      handleEmailAction("mark_resolved", selectedEmail);
    }
  };

  const formatEmailDate = (date: Date) => {
    if (isToday(date)) {
      return format(date, "'Today at' h:mm a");
    } else if (isYesterday(date)) {
      return format(date, "'Yesterday at' h:mm a");
    } else if (isSameWeek(date, new Date())) {
      return format(date, "EEEE 'at' h:mm a");
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };

  const filteredEmails = emails.filter(email => {
    if (email.folder !== currentFolder) return false;
    
    if (statusFilter !== "all" && email.status !== statusFilter) return false;
    
    if (dateFilter) {
      const emailDate = new Date(email.date);
      if (
        emailDate.getDate() !== dateFilter.getDate() ||
        emailDate.getMonth() !== dateFilter.getMonth() ||
        emailDate.getFullYear() !== dateFilter.getFullYear()
      ) {
        return false;
      }
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        email.subject.toLowerCase().includes(term) ||
        email.sender.name.toLowerCase().includes(term) ||
        email.sender.email.toLowerCase().includes(term) ||
        email.content.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800 border-red-200";
      case "read":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1600px] mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Email Center
              </h1>
              <p className="text-gray-600">Manage and respond to communications</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowingMetrics(!showingMetrics)}
                className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                {showingMetrics ? (
                  <>
                    <X className="h-4 w-4" />
                    Hide Analytics
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Show Analytics
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => setIsComposeOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 group transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                Compose Email
              </Button>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {showingMetrics && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-6"
              >
                <EmailMetricsComponent metrics={emailMetrics} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid gap-6 grid-cols-12">
            <motion.div 
              className="col-span-12 md:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-white border-purple-100/40 shadow-md">
                <CardContent className="p-4">
                  <Button 
                    className="w-full mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 group transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => setIsComposeOpen(true)}
                  >
                    <Mail className="mr-2 h-4 w-4" /> 
                    <span>Compose</span>
                  </Button>
                  
                  <nav className="space-y-1">
                    <Button
                      variant={currentFolder === "inbox" ? "secondary" : "ghost"}
                      className="w-full justify-start hover:bg-purple-50"
                      onClick={() => setCurrentFolder("inbox")}
                    >
                      <Inbox className="mr-2 h-4 w-4" />
                      Inbox
                      <Badge 
                        className="ml-auto bg-red-100 text-red-800 hover:bg-red-200"
                        variant="outline"
                      >
                        {emails.filter(e => e.folder === "inbox" && !e.read).length}
                      </Badge>
                    </Button>
                    
                    <Button
                      variant={currentFolder === "sent" ? "secondary" : "ghost"}
                      className="w-full justify-start hover:bg-purple-50"
                      onClick={() => setCurrentFolder("sent")}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Sent
                    </Button>
                    
                    <Button
                      variant={currentFolder === "archive" ? "secondary" : "ghost"}
                      className="w-full justify-start hover:bg-purple-50"
                      onClick={() => setCurrentFolder("archive")}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                    
                    <Button
                      variant={currentFolder === "trash" ? "secondary" : "ghost"}
                      className="w-full justify-start hover:bg-purple-50"
                      onClick={() => setCurrentFolder("trash")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Trash
                    </Button>
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium mb-2">Labels</h3>
                    <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                      <Star className="mr-2 h-4 w-4 text-yellow-500" />
                      Important
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                      <Flag className="mr-2 h-4 w-4 text-red-500" />
                      Flagged
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                      <Tag className="mr-2 h-4 w-4 text-blue-500" />
                      Work
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                      <Tag className="mr-2 h-4 w-4 text-green-500" />
                      Personal
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Status Filters</h3>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Date Filter</h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                            {dateFilter && (
                              <X
                                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDateFilter(undefined);
                                }}
                              />
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFilter}
                            onSelect={setDateFilter}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              className="col-span-12 md:col-span-9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-white border-purple-100/40 shadow-md">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {currentFolder.charAt(0).toUpperCase() + currentFolder.slice(1)}
                      </h2>
                      <Badge variant="secondary">
                        {filteredEmails.length} emails
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search emails..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64 pl-10 focus:ring-2 focus:ring-purple-500/20 transition-all rounded-full border-gray-200"
                        />
                      </div>
                      <Button variant="ghost" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <div className="grid grid-cols-12 h-[calc(100vh-13rem)]">
                  <div className="col-span-12 md:col-span-5 border-r overflow-hidden">
                    <ScrollArea className="h-full">
                      <AnimatePresence initial={false}>
                        {filteredEmails.length > 0 ? (
                          <motion.div className="divide-y">
                            {filteredEmails.map((email) => (
                              <motion.div
                                key={email.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 cursor-pointer hover:bg-purple-50 transition-colors ${
                                  selectedEmail?.id === email.id ? "bg-purple-50" : ""
                                } ${!email.read ? "bg-indigo-50/70" : ""}`}
                                onClick={() => {
                                  setSelectedEmail(email);
                                  if (!email.read) {
                                    handleEmailAction("mark_read", email);
                                  }
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={email.sender.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
                                      {email.sender.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className={`font-medium truncate ${!email.read ? "text-black" : "text-gray-700"}`}>
                                        {email.sender.name}
                                      </span>
                                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                        {formatEmailDate(email.date)}
                                      </span>
                                    </div>
                                    <h3 className={`text-sm truncate mt-1 ${!email.read ? "font-semibold" : "font-medium text-gray-800"}`}>
                                      {email.subject}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                      {email.content.trim()}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getStatusColor(email.status)}`}
                                      >
                                        {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                                      </Badge>
                                      
                                      {email.attachments && (
                                        <Badge variant="secondary" className="text-xs">
                                          {email.attachments.length} files
                                        </Badge>
                                      )}
                                      
                                      {email.starred && (
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                      )}
                                      
                                      {email.flagged && (
                                        <Flag className="h-3 w-3 text-red-500 fill-red-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full p-6 text-center"
                          >
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                              <Mail className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-medium">No emails found</h3>
                            <p className="text-gray-500 mt-1 max-w-xs">
                              {currentFolder === "sent" 
                                ? "You haven't sent any emails yet" 
                                : "No emails match your current filters"}
                            </p>
                            {currentFolder === "sent" && (
                              <Button 
                                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600"
                                onClick={() => setIsComposeOpen(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Compose Email
                              </Button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </ScrollArea>
                  </div>
                  
                  <div className="col-span-12 md:col-span-7 overflow-hidden">
                    {selectedEmail ? (
                      <motion.div 
                        className="h-full flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEmailAction("star", selectedEmail)}
                                className="hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                              >
                                <Star className={`h-4 w-4 ${
                                  selectedEmail.starred ? "fill-yellow-500 text-yellow-500" : ""
                                }`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEmailAction("flag", selectedEmail)}
                                className="hover:bg-red-50 hover:text-red-700 transition-colors"
                              >
                                <Flag className={`h-4 w-4 ${
                                  selectedEmail.flagged ? "fill-red-500 text-red-500" : ""
                                }`} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                onClick={() => setIsReplyOpen(true)}
                              >
                                <Reply className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Forward className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEmailAction("archive", selectedEmail)}
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEmailAction("delete", selectedEmail)}
                                className="hover:bg-red-50 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={selectedEmail.sender.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
                                  {selectedEmail.sender.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{selectedEmail.sender.name}</div>
                                <div className="text-sm text-gray-500">
                                  {selectedEmail.sender.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-sm text-gray-500">
                                {formatEmailDate(selectedEmail.date)}
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`mt-1 ${getStatusColor(selectedEmail.status)}`}
                              >
                                {selectedEmail.status.charAt(0).toUpperCase() + selectedEmail.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-500">
                            To: {selectedEmail.recipients.map(r => r.name).join(", ")}
                          </div>
                        </div>
                        
                        <ScrollArea className="flex-1">
                          <div className="p-4">
                            <div className="prose prose-sm max-w-none">
                              {selectedEmail.content.split("\n").map((line, i) => (
                                <p key={i} className="my-2">{line}</p>
                              ))}
                            </div>
                            
                            {selectedEmail.attachments && (
                              <div className="mt-6">
                                <h3 className="text-sm font-medium mb-2">
                                  Attachments ({selectedEmail.attachments.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {selectedEmail.attachments.map((attachment) => (
                                    <div
                                      key={attachment.name}
                                      className="flex items-center gap-2 p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors group"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">
                                          {attachment.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {attachment.size}
                                        </div>
                                      </div>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                        
                        <div className="p-4 border-t">
                          <div className="flex items-center gap-2">
                            <Button 
                              className="bg-gradient-to-r from-purple-600 to-indigo-600"
                              onClick={() => setIsReplyOpen(true)}
                            >
                              <Reply className="mr-2 h-4 w-4" />
                              Reply
                            </Button>
                            <Button variant="outline">
                              <Forward className="mr-2 h-4 w-4" />
                              Forward
                            </Button>
                            <Button 
                              variant="outline" 
                              className="ml-auto"
                              onClick={() => handleEmailAction("mark_resolved", selectedEmail)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                              Mark as Resolved
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                          <Mail className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-medium">Select an email to view</h3>
                        <p className="text-gray-500 mt-1 max-w-sm">
                          Choose an email from the list to view its contents
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      {isComposeOpen && (
        <ComposeEmail 
          isOpen={isComposeOpen} 
          onClose={() => setIsComposeOpen(false)} 
          onSend={handleComposeEmail}
        />
      )}
      
      {isReplyOpen && selectedEmail && (
        <ReplyEmail 
          isOpen={isReplyOpen} 
          onClose={() => setIsReplyOpen(false)} 
          email={selectedEmail}
          onSend={handleReplyEmail}
        />
      )}
    </div>
  );
};

export default EmailPage;
