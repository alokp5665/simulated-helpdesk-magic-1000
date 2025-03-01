
export interface Email {
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

export interface ScheduledEmail {
  date: Date;
  to: string;
  subject: string;
}
