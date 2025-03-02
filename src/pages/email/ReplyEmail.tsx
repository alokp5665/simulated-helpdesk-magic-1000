
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";
import { Email } from "./types";

interface ReplyEmailProps {
  isOpen: boolean;
  onClose: () => void;
  email: Email | null;
  onSend: () => void;
}

const ReplyEmail: React.FC<ReplyEmailProps> = ({ isOpen, onClose, email, onSend }) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen && email) {
      setReplyContent("");
    }
  }, [isOpen, email]);

  const handleSend = () => {
    if (!replyContent.trim()) {
      toast.error("Please enter your reply");
      return;
    }

    setIsSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      onSend();
      setIsSending(false);
      setReplyContent("");
      onClose();
      toast.success("Reply sent successfully");
    }, 1200);
  };

  if (!email) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="text-xl font-semibold">Reply to: {email.subject}</span>
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
        
        <div className="border p-3 rounded-md bg-gray-50 mb-4">
          <div className="text-sm text-gray-500 mb-2">
            <strong>From:</strong> {email.sender.name} &lt;{email.sender.email}&gt;<br />
            <strong>Date:</strong> {email.date.toLocaleString()}<br />
            <strong>Subject:</strong> {email.subject}
          </div>
          <div className="text-sm text-gray-600 border-t pt-2 mt-2">
            {email.content.split('\n').map((line, i) => (
              <p key={i} className="my-1">{line}</p>
            ))}
          </div>
        </div>
        
        <Textarea
          placeholder="Write your reply here..."
          className="min-h-[200px] transition-all focus:ring-2 focus:ring-purple-500/30"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
        
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
                Send Reply
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyEmail;
