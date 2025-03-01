
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Reply, Forward, CheckCircle2, Star, Archive, Trash2, User } from "lucide-react";

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

interface EmailDetailProps {
  selectedEmail: Email | null;
  toggleEmailStatus: (emailId: string, status: "read" | "resolved" | "starred") => void;
  replyContent: string;
  setReplyContent: React.Dispatch<React.SetStateAction<string>>;
  showReplyInput: boolean;
  setShowReplyInput: React.Dispatch<React.SetStateAction<boolean>>;
  handleReply: () => void;
  forwardTo: string;
  setForwardTo: React.Dispatch<React.SetStateAction<string>>;
  forwardContent: string;
  setForwardContent: React.Dispatch<React.SetStateAction<string>>;
  showForwardInput: boolean;
  setShowForwardInput: React.Dispatch<React.SetStateAction<boolean>>;
  handleForward: () => void;
  isForwarding: boolean;
  getSentimentColor: (sentiment?: "positive" | "neutral" | "negative") => string;
  getPriorityColor: (priority?: "high" | "medium" | "low") => string;
}

export const EmailDetail = ({
  selectedEmail,
  toggleEmailStatus,
  replyContent,
  setReplyContent,
  showReplyInput,
  setShowReplyInput,
  handleReply,
  forwardTo,
  setForwardTo,
  forwardContent,
  setForwardContent,
  showForwardInput,
  setShowForwardInput,
  handleForward,
  isForwarding,
  getSentimentColor,
  getPriorityColor,
}: EmailDetailProps) => {
  if (!selectedEmail) {
    return (
      <Card className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 border-dashed">
        <div className="text-center p-6">
          <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">Select an email</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Choose an email from the list to view its contents
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{selectedEmail.subject}</h3>
            <div className="flex items-center mt-1 space-x-2">
              <div className="flex items-center">
                <span className="bg-gray-100 dark:bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center text-gray-800 dark:text-gray-200 mr-2">
                  {selectedEmail.from.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium">{selectedEmail.from}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(selectedEmail.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {selectedEmail.sentiment && (
                <Badge className={getSentimentColor(selectedEmail.sentiment)}>
                  {selectedEmail.sentiment}
                </Badge>
              )}
              
              {selectedEmail.priority && (
                <Badge className={getPriorityColor(selectedEmail.priority)}>
                  {selectedEmail.priority}
                </Badge>
              )}
              
              {selectedEmail.tags && selectedEmail.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleEmailStatus(selectedEmail.id, "starred")}
              className={selectedEmail.isStarred ? "text-yellow-500" : ""}
            >
              <Star className={`h-4 w-4 ${selectedEmail.isStarred ? "fill-yellow-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleEmailStatus(selectedEmail.id, "resolved")}
              className={selectedEmail.isResolved ? "text-green-500" : ""}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-4 flex-grow overflow-auto custom-scrollbar">
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line">{selectedEmail.content}</p>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="flex flex-col pt-4 space-y-4">
        {!showReplyInput && !showForwardInput && (
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowReplyInput(true);
                setShowForwardInput(false);
              }}
              className="flex-1"
            >
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowForwardInput(true);
                setShowReplyInput(false);
              }}
              className="flex-1"
            >
              <Forward className="mr-2 h-4 w-4" />
              Forward
            </Button>
          </div>
        )}
        
        {showReplyInput && (
          <div className="w-full space-y-3">
            <Textarea
              placeholder="Write your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full min-h-[120px]"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowReplyInput(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleReply}>
                <Reply className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        )}
        
        {showForwardInput && (
          <div className="w-full space-y-3">
            <Input
              placeholder="Forward to (email address)"
              value={forwardTo}
              onChange={(e) => setForwardTo(e.target.value)}
              className="w-full"
            />
            <Textarea
              placeholder="Add a message (optional)"
              value={forwardContent}
              onChange={(e) => setForwardContent(e.target.value)}
              className="w-full min-h-[120px]"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowForwardInput(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleForward}
                disabled={isForwarding}
              >
                <Forward className="mr-2 h-4 w-4" />
                {isForwarding ? "Forwarding..." : "Forward Email"}
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
