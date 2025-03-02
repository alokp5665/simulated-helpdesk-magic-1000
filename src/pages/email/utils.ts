
import { Email, EmailMetrics } from "./types";

// Generate Indian Hindu names for senders
export const indianNames = [
  { name: "Arjun Sharma", email: "arjun.sharma@example.com", avatar: "/avatars/arjun-sharma.jpg" },
  { name: "Priya Patel", email: "priya.patel@example.com", avatar: "/avatars/priya-patel.jpg" },
  { name: "Vikram Singh", email: "vikram.singh@example.com", avatar: "/avatars/vikram-singh.jpg" },
  { name: "Ananya Desai", email: "ananya.desai@example.com", avatar: "/avatars/ananya-desai.jpg" },
  { name: "Raj Malhotra", email: "raj.malhotra@example.com", avatar: "/avatars/raj-malhotra.jpg" },
  { name: "Meera Verma", email: "meera.verma@example.com", avatar: "/avatars/meera-verma.jpg" },
  { name: "Rahul Gupta", email: "rahul.gupta@example.com", avatar: "/avatars/rahul-gupta.jpg" },
  { name: "Sonia Kapoor", email: "sonia.kapoor@example.com", avatar: "/avatars/sonia-kapoor.jpg" },
  { name: "Karan Reddy", email: "karan.reddy@example.com", avatar: "/avatars/karan-reddy.jpg" },
  { name: "Divya Joshi", email: "divya.joshi@example.com", avatar: "/avatars/divya-joshi.jpg" },
];

// Email subjects
export const emailSubjects = [
  "Quarterly Project Update",
  "Meeting Agenda for Tomorrow",
  "Budget Approval Request",
  "New Client Proposal",
  "Team Performance Review",
  "Product Launch Timeline",
  "Customer Feedback Analysis",
  "Training Session Schedule",
  "Marketing Campaign Results",
  "System Maintenance Notification",
  "Revised Sales Strategy",
  "Holiday Schedule Announcement",
  "Office Relocation Details",
  "New Policy Implementation",
  "Research Findings Summary",
];

// Email content generator
export const generateEmailContent = (): string => {
  const greetings = ["Namaste", "Greetings", "Hello", "Dear Team"];
  const bodies = [
    "I hope this email finds you well. I wanted to discuss the latest project developments and our timeline for completion.",
    "Please find attached the documents for our upcoming meeting. Kindly review them before we gather to discuss the next steps.",
    "I'm writing to inform you about the recent changes to our company policies. These updates will be effective starting next month.",
    "Thank you for your prompt response. I've reviewed your suggestions and have some additional points to consider.",
    "We need to schedule a meeting to address the concerns raised by the clients. Please let me know your availability this week.",
  ];
  const closings = ["Regards", "Best wishes", "Thank you", "Warm regards", "Sincerely"];
  
  const randomName = indianNames[Math.floor(Math.random() * indianNames.length)].name.split(" ")[0];
  
  return `
    ${greetings[Math.floor(Math.random() * greetings.length)]},

    ${bodies[Math.floor(Math.random() * bodies.length)]}

    ${closings[Math.floor(Math.random() * closings.length)]},
    ${randomName}
  `;
};

// Generate random attachment
export const generateAttachment = () => {
  const types = ["pdf", "docx", "xlsx", "pptx", "jpg"];
  const names = ["report", "document", "presentation", "spreadsheet", "image"];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const size = `${(Math.random() * 10).toFixed(1)} MB`;
  
  return {
    name: `${name}-${Math.floor(Math.random() * 1000)}.${type}`,
    size,
    type
  };
};

// Generate a random email
export const generateRandomEmail = (id: string): Email => {
  const sender = indianNames[Math.floor(Math.random() * indianNames.length)];
  const hasAttachments = Math.random() > 0.7;
  const attachmentsCount = hasAttachments ? Math.floor(Math.random() * 3) + 1 : 0;
  const attachments = [];
  
  for (let i = 0; i < attachmentsCount; i++) {
    attachments.push(generateAttachment());
  }
  
  // Generate random response time between 5 and 120 minutes
  const responseTime = Math.floor(Math.random() * 115) + 5;
  
  return {
    id,
    subject: emailSubjects[Math.floor(Math.random() * emailSubjects.length)],
    sender,
    recipients: [
      {
        name: "You",
        email: "you@example.com"
      }
    ],
    content: generateEmailContent(),
    attachments: attachments.length > 0 ? attachments : undefined,
    date: new Date(),
    read: false,
    starred: Math.random() > 0.8,
    flagged: Math.random() > 0.9,
    labels: Math.random() > 0.7 ? ["Work", "Important"] : undefined,
    folder: "inbox",
    status: "unread",
    responseTime
  };
};

// Calculate email metrics
export const calculateEmailMetrics = (emails: Email[]): EmailMetrics => {
  const totalReceived = emails.length;
  const resolved = emails.filter(email => email.status === "resolved").length;
  
  // Calculate average response time (only for emails that have responseTime)
  const emailsWithResponseTime = emails.filter(email => email.responseTime !== undefined);
  const totalResponseTime = emailsWithResponseTime.reduce((sum, email) => sum + (email.responseTime || 0), 0);
  const averageResponseTime = emailsWithResponseTime.length > 0 
    ? totalResponseTime / emailsWithResponseTime.length 
    : 0;
    
  // Calculate daily emails for the past 7 days
  const today = new Date();
  const dailyEmails = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count = emails.filter(email => {
      const emailDate = new Date(email.date);
      return emailDate.getDate() === date.getDate() && 
             emailDate.getMonth() === date.getMonth() && 
             emailDate.getFullYear() === date.getFullYear();
    }).length;
    
    dailyEmails.push({ date: dateString, count });
  }
  
  return {
    totalReceived,
    resolved,
    averageResponseTime,
    dailyEmails
  };
};
