
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageSquare, Circle, CheckCircle2, Star, Clock } from "lucide-react";

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

interface EmailListProps {
  filteredEmails: Email[];
  selectedEmail: Email | null;
  setSelectedEmail: React.Dispatch<React.SetStateAction<Email | null>>;
  toggleEmailStatus: (emailId: string, status: "read" | "resolved" | "starred") => void;
  getSentimentColor: (sentiment?: "positive" | "neutral" | "negative") => string;
  getPriorityColor: (priority?: "high" | "medium" | "low") => string;
  isTyping: boolean;
  currentTypingEmail: string;
}

export const EmailList = ({
  filteredEmails,
  selectedEmail,
  setSelectedEmail,
  toggleEmailStatus,
  getSentimentColor,
  getPriorityColor,
  isTyping,
  currentTypingEmail,
}: EmailListProps) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Inbox</h3>
      </div>
      <ScrollArea className="h-[calc(100vh-300px)] custom-scrollbar">
        <div>
          {isTyping && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20 animate-pulse">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                {currentTypingEmail.split('@')[0]} is typing...
              </div>
            </div>
          )}
          
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : email.isRead
                    ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    : 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 font-medium'
                }`}
                onClick={() => {
                  setSelectedEmail(email);
                  if (!email.isRead) {
                    toggleEmailStatus(email.id, "read");
                  }
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    {!email.isRead ? (
                      <Circle className="h-2 w-2 text-blue-600 dark:text-blue-400 mr-2" />
                    ) : (
                      <div className="h-2 w-2 mr-2" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {email.from.split('@')[0]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {email.priority && (
                      <Badge className={getPriorityColor(email.priority)}>
                        {email.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[70%]">
                      {email.subject}
                    </h4>
                    <div className="flex space-x-1">
                      {email.sentiment && (
                        <Badge className={getSentimentColor(email.sentiment)}>
                          {email.sentiment === "positive" ? (
                            <Heart className="h-3 w-3 mr-1" />
                          ) : email.sentiment === "negative" ? (
                            <MessageSquare className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {email.sentiment}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {email.content.substring(0, 100)}
                    {email.content.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex mt-2 space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmailStatus(email.id, "starred");
                      }}
                      className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          email.isStarred ? 'text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmailStatus(email.id, "resolved");
                      }}
                      className="text-gray-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          email.isResolved ? 'text-green-500 dark:text-green-400' : ''
                        }`}
                      />
                    </button>
                    {email.thread && (
                      <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {email.thread.count}
                      </Badge>
                    )}
                    {email.tags && email.tags.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                        {email.tags[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No emails found matching your criteria
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
