import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Star, 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Tag, 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  Reply, 
  Forward, 
  Trash, 
  Flag,
  Search,
  Plus,
  X,
  CheckCircle,
  RefreshCcw,
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
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  labels: string[];
  folder: "inbox" | "sent" | "archive" | "trash";
}

const SAMPLE_EMAILS: Email[] = [
  {
    id: "1",
    subject: "Project Update: Q3 Goals",
    sender: {
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      avatar: "/avatars/1.png"
    },
    recipients: [
      {
        name: "Team",
        email: "team@example.com"
      }
    ],
    content: "Hi team, Here's the latest update on our Q3 goals...",
    timestamp: new Date(Date.now() - 3600000),
    isRead: false,
    isStarred: true,
    isArchived: false,
    isDeleted: false,
    labels: ["important", "work"],
    folder: "inbox"
  },
  // Add more sample emails here
];

const EmailPage = () => {
  const [emails, setEmails] = useState<Email[]>(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState<"inbox" | "sent" | "archive" | "trash">("inbox");

  useEffect(() => {
    // Simulate receiving new emails
    const emailInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newEmail: Email = {
          id: `email-${Date.now()}`,
          subject: "New Notification",
          sender: {
            name: "System",
            email: "system@example.com"
          },
          recipients: [{
            name: "User",
            email: "user@example.com"
          }],
          content: "You have a new notification...",
          timestamp: new Date(),
          isRead: false,
          isStarred: false,
          isArchived: false,
          isDeleted: false,
          labels: [],
          folder: "inbox"
        };

        setEmails(prev => [newEmail, ...prev]);
        
        toast("New email received", {
          className: "bg-blue-50 border-blue-200 text-blue-600"
        });
      }
    }, 30000);

    return () => clearInterval(emailInterval);
  }, []);

  const handleEmailAction = (emailId: string, action: "star" | "archive" | "delete" | "read") => {
    setEmails(prev => prev.map(email => {
      if (email.id === emailId) {
        switch (action) {
          case "star":
            toast("Email starred", {
              className: "bg-yellow-50 border-yellow-200 text-yellow-600"
            });
            return { ...email, isStarred: !email.isStarred };
          case "archive":
            toast("Email archived", {
              className: "bg-green-50 border-green-200 text-green-600"
            });
            return { ...email, isArchived: true, folder: "archive" };
          case "delete":
            toast("Email moved to trash", {
              className: "bg-red-50 border-red-200 text-red-600"
            });
            return { ...email, isDeleted: true, folder: "trash" };
          case "read":
            return { ...email, isRead: true };
          default:
            return email;
        }
      }
      return email;
    }));
  };

  const handleReply = (email: Email) => {
    toast("Replying to email", {
      className: "bg-blue-50 border-blue-200 text-blue-600"
    });
  };

  const handleForward = (email: Email) => {
    toast("Forwarding email", {
      className: "bg-blue-50 border-blue-200 text-blue-600"
    });
  };

  const handleRefresh = () => {
    toast("Refreshing emails", {
      className: "bg-blue-50 border-blue-200 text-blue-600"
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    toast("Searching emails", {
      className: "bg-blue-50 border-blue-200 text-blue-600"
    });
  };

  const handleFilter = () => {
    toast("Filtering emails", {
      className: "bg-blue-50 border-blue-200 text-blue-600"
    });
  };

  const handleCompose = () => {
    toast("Opening composer", {
      className: "bg-blue-50 border-blue-200 text-blue-600"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Email</h1>
            <div className="flex space-x-2">
              <Button onClick={handleCompose}>
                <Plus className="mr-2 h-4 w-4" />
                Compose
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Email Navigation */}
            <Card className="col-span-3">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setCurrentFolder("inbox")}
                  >
                    <Inbox className="mr-2 h-4 w-4" />
                    Inbox
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setCurrentFolder("sent")}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Sent
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setCurrentFolder("archive")}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setCurrentFolder("trash")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Trash
                  </Button>
                </nav>
              </CardContent>
            </Card>

            {/* Email List */}
            <Card className="col-span-9">
              <CardHeader className="p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="outline" size="icon" onClick={handleRefresh}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleFilter}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {emails
                    .filter(email => email.folder === currentFolder)
                    .map(email => (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 border-b cursor-pointer hover:bg-accent/50 ${
                          !email.isRead ? "bg-accent/20" : ""
                        }`}
                        onClick={() => {
                          setSelectedEmail(email);
                          handleEmailAction(email.id, "read");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={email.sender.avatar} />
                              <AvatarFallback>
                                {email.sender.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{email.sender.name}</p>
                              <p className="text-sm text-muted-foreground">{email.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmailAction(email.id, "star");
                              }}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  email.isStarred ? "fill-yellow-400 text-yellow-400" : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmailAction(email.id, "archive");
                              }}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmailAction(email.id, "delete");
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailPage;
