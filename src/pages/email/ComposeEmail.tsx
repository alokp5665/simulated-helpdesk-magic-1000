
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Paperclip, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ComposeEmailProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: {
    to: string;
    subject: string;
    content: string;
  }) => void;
}

const ComposeEmail: React.FC<ComposeEmailProps> = ({ isOpen, onClose, onSend }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!to || !subject || !content) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      onSend({ to, subject, content });
      setIsSending(false);
      resetForm();
      onClose();
      toast.success("Email sent successfully");
    }, 1500);
  };

  const resetForm = () => {
    setTo("");
    setSubject("");
    setContent("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="text-xl font-semibold">Compose New Email</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">
              To:
            </Label>
            <Input
              id="to"
              placeholder="recipient@example.com"
              className="col-span-3 transition-all focus:ring-2 focus:ring-purple-500/30"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject:
            </Label>
            <Input
              id="subject"
              placeholder="Email subject"
              className="col-span-3 transition-all focus:ring-2 focus:ring-purple-500/30"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right">
              Message:
            </Label>
            <Textarea
              id="content"
              placeholder="Write your message here..."
              className="col-span-3 min-h-[200px] transition-all focus:ring-2 focus:ring-purple-500/30"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <div className="flex items-center gap-2 mr-auto">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <Button 
            onClick={handleSend} 
            disabled={isSending}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isSending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeEmail;
