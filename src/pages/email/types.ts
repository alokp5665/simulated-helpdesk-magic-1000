
export interface Email {
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
  status: "unread" | "read" | "resolved";
  responseTime?: number; // in minutes
}

export interface EmailMetrics {
  totalReceived: number;
  resolved: number;
  averageResponseTime: number; // in minutes
  dailyEmails: {
    date: string;
    count: number;
  }[];
}
