
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
} from "lucide-react";
import { toast } from "sonner";

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
  isStarred: boolean;
}

const SAMPLE_EMAILS = [
  {
    from: "john.doe@example.com",
    subject: "Account Verification Required",
    content: "Please verify your account to access all features.",
  },
  {
    from: "support@company.com",
    subject: "Your Recent Order #12345",
    content: "Thank you for your order. Here's your tracking information.",
  },
  {
    from: "newsletter@tech.com",
    subject: "Weekly Technology Updates",
    content: "Check out the latest trends in technology this week.",
  },
  {
    from: "billing@service.com",
    subject: "Invoice for March 2024",
    content: "Your monthly invoice is ready for review.",
  },
];

const EmailPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    content: "",
  });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Generate random emails
  useEffect(() => {
    const interval = setInterval(() => {
      if (emails.length < 20) {
        const sampleEmail = SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)];
        const newEmail: Email = {
          id: Date.now().toString(),
          from: sampleEmail.from,
          subject: sampleEmail.subject,
          content: sampleEmail.content,
          timestamp: new Date(),
          isRead: false,
          isResolved: false,
          isStarred: false,
        };
        
        setEmails(prev => [newEmail, ...prev]);
        toast.info("New email received", {
          description: `From: ${newEmail.from}`,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [emails]);

  const handleSendEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Email sent successfully", {
      description: `To: ${newEmail.to}`,
    });

    setNewEmail({ to: "", subject: "", content: "" });
    setShowCompose(false);
  };

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
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Email Management</h1>
            <Button onClick={() => setShowCompose(true)} className="hover-scale">
              <MailPlus className="mr-2 h-4 w-4" />
              Compose
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Email List */}
            <Card className="col-span-12 lg:col-span-5 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Inbox</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {emails.map(email => (
                      <div
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          !email.isRead ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">{email.subject}</h3>
                          <div className="flex items-center space-x-2">
                            {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                            {email.isResolved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{email.from}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {email.timestamp.toLocaleTimeString()}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEmailStatus(email.id, "read");
                              }}
                            >
                              {email.isRead ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEmailStatus(email.id, "starred");
                              }}
                            >
                              <Star className={`h-4 w-4 ${email.isStarred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Email Content */}
            <Card className="col-span-12 lg:col-span-7 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{selectedEmail ? "Email Content" : "Select an email"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmail ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                        <p className="text-sm text-muted-foreground">From: {selectedEmail.from}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => toggleEmailStatus(selectedEmail.id, "resolved")}
                        >
                          <CheckCircle2 className={`mr-2 h-4 w-4 ${
                            selectedEmail.isResolved ? "text-green-500" : ""
                          }`} />
                          {selectedEmail.isResolved ? "Resolved" : "Mark as Resolved"}
                        </Button>
                        <Button variant="ghost">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="min-h-[400px] p-4 rounded-lg bg-accent/50">
                      <p className="whitespace-pre-wrap">{selectedEmail.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                    <Mail className="h-12 w-12 mb-4" />
                    <p>Select an email to view its content</p>
                  </div>
                )}
              </CardContent>
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
            <h3 className="font-semibold">Compose Email</h3>
            <Input
              placeholder="To"
              value={newEmail.to}
              onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
            />
            <Input
              placeholder="Subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
            />
            <Textarea
              placeholder="Content"
              value={newEmail.content}
              onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
              className="min-h-[200px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCompose(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail}>
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
