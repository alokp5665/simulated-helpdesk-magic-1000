import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  User,
  Ticket,
  MessageSquare,
  ChevronRight,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ChartBar,
  BarChart,
  BarChart3,
  UserCheck,
  Calendar,
  Search,
  Plus,
  Activity as ActivityIcon,
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
  Filter
} from "lucide-react";

interface Email {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  recipients: {
    name: string;
    email: string;
    avatar?: string;
  }[];
  content: string;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  date: Date;
  read: boolean;
  starred: boolean;
  flagged: boolean;
  labels?: string[];
  folder: "inbox" | "sent" | "drafts" | "archive" | "trash";
}

const SAMPLE_EMAILS: Email[] = [
  {
    id: "1",
    subject: "Meeting Notes: Project Review",
    sender: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "/avatars/john-smith.jpg"
    },
    recipients: [
      {
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        avatar: "/avatars/sarah-johnson.jpg"
      }
    ],
    content: `
      Hi team,

      Here are the key points from today's project review meeting:

      1. Timeline updates
      2. Resource allocation
      3. Next steps

      Please review and let me know if you have any questions.

      Best regards,
      John
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
    date: new Date("2024-01-15T10:30:00"),
    read: true,
    starred: true,
    flagged: false,
    labels: ["Important", "Work"],
    folder: "inbox"
  },
  {
    id: "2",
    subject: "Quarterly Performance Report",
    sender: {
      name: "Finance Team",
      email: "finance@example.com",
      avatar: "/avatars/finance-team.jpg"
    },
    recipients: [
      {
        name: "All Staff",
        email: "staff@example.com"
      }
    ],
    content: `
      Dear team,

      Attached is the quarterly performance report for Q4 2023.

      Highlights:
      - Revenue growth: 15%
      - Customer satisfaction: 92%
      - New market expansion

      Please review the detailed report for more information.

      Best regards,
      Finance Team
    `,
    attachments: [
      {
        name: "Q4-2023-report.xlsx",
        size: "1.8 MB",
        type: "xlsx"
      }
    ],
    date: new Date("2024-01-14T15:45:00"),
    read: false,
    starred: false,
    flagged: true,
    labels: ["Reports", "Finance"],
    folder: "inbox"
  }
];

const EmailPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>("inbox");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Initialize with sample emails
    setEmails(SAMPLE_EMAILS);

    // Simulate receiving new email
    const newEmailInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new email
        const newEmail: Email = {
          id: Date.now().toString(),
          subject: "New Notification",
          sender: {
            name: "System",
            email: "system@example.com"
          },
          recipients: [
            {
              name: "User",
              email: "user@example.com"
            }
          ],
          content: "This is a new notification.",
          date: new Date(),
          read: false,
          starred: false,
          flagged: false,
          folder: "inbox"
        };
        
        setEmails(prev => [newEmail, ...prev]);
        toast("New email received");
      }
    }, 30000);

    return () => clearInterval(newEmailInterval);
  }, []);

  const handleEmailAction = (action: string, email: Email) => {
    switch (action) {
      case "star":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, starred: !e.starred } : e
          )
        );
        toast(email.starred ? "Email unmarked" : "Email marked as important");
        break;
      
      case "flag":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, flagged: !e.flagged } : e
          )
        );
        toast(email.flagged ? "Flag removed" : "Email flagged");
        break;
      
      case "archive":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, folder: "archive" } : e
          )
        );
        toast("Email archived");
        break;
      
      case "delete":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, folder: "trash" } : e
          )
        );
        toast("Email moved to trash");
        break;
      
      case "mark_read":
        setEmails(prev =>
          prev.map(e =>
            e.id === email.id ? { ...e, read: true } : e
          )
        );
        toast("Email marked as read");
        break;
      
      default:
        break;
    }
  };

  const filteredEmails = emails.filter(email =>
    email.folder === currentFolder &&
    (searchTerm === "" ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.sender.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1600px] mx-auto">
          <div className="flex gap-6">
            {/* Email Navigation */}
            <div className="w-64">
              <Card className="bg-white/60 border-purple-100/40">
                <CardContent className="p-4">
                  <Button className="w-full mb-4">
                    <Mail className="mr-2 h-4 w-4" /> Compose
                  </Button>
                  
                  <nav className="space-y-1">
                    <Button
                      variant={currentFolder === "inbox" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentFolder("inbox")}
                    >
                      <Inbox className="mr-2 h-4 w-4" />
                      Inbox
                      <Badge className="ml-auto" variant="secondary">
                        {emails.filter(e => e.folder === "inbox" && !e.read).length}
                      </Badge>
                    </Button>
                    
                    <Button
                      variant={currentFolder === "sent" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentFolder("sent")}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Sent
                    </Button>
                    
                    <Button
                      variant={currentFolder === "archive" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentFolder("archive")}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                    
                    <Button
                      variant={currentFolder === "trash" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentFolder("trash")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Trash
                    </Button>
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium mb-2">Labels</h3>
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="mr-2 h-4 w-4 text-yellow-500" />
                      Important
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Flag className="mr-2 h-4 w-4 text-red-500" />
                      Flagged
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Tag className="mr-2 h-4 w-4 text-blue-500" />
                      Work
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Tag className="mr-2 h-4 w-4 text-green-500" />
                      Personal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Email List and Content */}
            <div className="flex-1">
              <Card className="bg-white/60 border-purple-100/40">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">
                        {currentFolder.charAt(0).toUpperCase() + currentFolder.slice(1)}
                      </h2>
                      <Badge variant="secondary">
                        {filteredEmails.length} emails
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search emails..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
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
                  {/* Email List */}
                  <div className="col-span-5 border-r">
                    <ScrollArea className="h-full">
                      {filteredEmails.map((email) => (
                        <div
                          key={email.id}
                          className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedEmail?.id === email.id ? "bg-muted" : ""
                          } ${!email.read ? "bg-primary/5" : ""}`}
                          onClick={() => setSelectedEmail(email)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={email.sender.avatar} />
                              <AvatarFallback>
                                {email.sender.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">
                                  {email.sender.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {email.date.toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className={`text-sm truncate ${!email.read ? "font-medium" : ""}`}>
                                {email.subject}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {email.content.trim()}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {email.attachments && (
                                  <Badge variant="secondary" className="text-xs">
                                    {email.attachments.length} attachments
                                  </Badge>
                                )}
                                {email.starred && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                )}
                                {email.flagged && (
                                  <Flag className="h-3 w-3 text-red-500 fill-red-500" />
                                )}
                                {email.labels?.map((label) => (
                                  <Badge
                                    key={label}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  
                  {/* Email Content */}
                  <div className="col-span-7">
                    {selectedEmail ? (
                      <div className="h-full flex flex-col">
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEmailAction("star", selectedEmail)}
                              >
                                <Star className={`h-4 w-4 ${
                                  selectedEmail.starred ? "fill-yellow-500 text-yellow-500" : ""
                                }`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEmailAction("flag", selectedEmail)}
                              >
                                <Flag className={`h-4 w-4 ${
                                  selectedEmail.flagged ? "fill-red-500 text-red-500" : ""
                                }`} />
                              </Button>
                              <Button variant="ghost" size="icon">
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
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedEmail.sender.avatar} />
                                <AvatarFallback>
                                  {selectedEmail.sender.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{selectedEmail.sender.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedEmail.sender.email}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedEmail.date.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-sm text-muted-foreground">
                            To: {selectedEmail.recipients.map(r => r.name).join(", ")}
                          </div>
                        </div>
                        
                        <ScrollArea className="flex-1 p-4">
                          <div className="prose prose-sm max-w-none">
                            {selectedEmail.content.split("\n").map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                          
                          {selectedEmail.attachments && (
                            <div className="mt-6">
                              <h3 className="text-sm font-medium mb-2">
                                Attachments ({selectedEmail.attachments.length})
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedEmail.attachments.map((attachment) => (
                                  <div
                                    key={attachment.name}
                                    className="flex items-center gap-2 p-2 border rounded-md"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">
                                        {attachment.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {attachment.size}
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </ScrollArea>
                        
                        <div className="p-4 border-t">
                          <div className="flex items-center gap-2">
                            <Button>
                              <Reply className="mr-2 h-4 w-4" />
                              Reply
                            </Button>
                            <Button variant="outline">
                              <Forward className="mr-2 h-4 w-4" />
                              Forward
                            </Button>
                            <div className="ml-auto">
                              <Button variant="ghost" size="icon">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Select an email to view
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailPage;
