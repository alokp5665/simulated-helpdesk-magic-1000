
import { Email } from "./EmailTypes";

// Indian Hindu names for our simulation
export const SAMPLE_EMAILS_FROM = [
  "arjun.sharma@example.com",
  "priya.patel@company.com",
  "vikram.agarwal@tech.com",
  "neha.kapoor@service.com",
  "rahul.malhotra@business.net",
  "ananya.deshmukh@support.org",
  "karan.singh@example.com",
  "divya.rajput@company.org",
  "siddharth.joshi@tech.co",
  "pooja.reddy@service.in",
];

export const SAMPLE_AGENT_NAMES = [
  "Aarav Mehta",
  "Priya Patel",
  "Vikram Agarwal",
  "Neha Kapoor",
  "Arjun Sharma",
  "Ritu Verma",
  "Sanjay Gupta",
  "Divya Rajput",
  "Rahul Malhotra",
  "Kavita Singhania"
];

// Sample email subjects
export const SAMPLE_SUBJECTS = [
  "Account Verification Required",
  "Your Recent Order #12345",
  "Weekly Technology Updates",
  "Invoice for March 2024",
  "Support Request: Login Issues",
  "Product Delivery Status",
  "New Feature Announcement",
  "Security Alert: Password Change",
  "Promotional Offer: 25% Discount",
  "Feedback Request on Recent Purchase",
  "Account Statement Available",
  "Website Maintenance Notice",
  "Subscription Renewal Information",
  "Important Update: Privacy Policy",
  "Invitation: Product Launch Event"
];

// Sample email content
export const SAMPLE_CONTENT = [
  "Namaste, please verify your account to access all features of our platform. Click the link below to complete the verification process.",
  "Thank you for your order. We're happy to inform you that your package has been shipped and is on its way to you. Here's your tracking information.",
  "Check out the latest trends in technology this week. We've compiled a list of innovative products and services that are making waves in the industry.",
  "Your monthly invoice is ready for review. Please find attached the detailed breakdown of your services and the corresponding charges.",
  "We've noticed you're having trouble logging into your account. Our team is here to help you regain access quickly and securely.",
  "Your product is currently being processed at our warehouse. Expected delivery date is within the next 3-5 business days.",
  "We're excited to announce a new feature that will enhance your experience with our platform. Learn how it can help streamline your workflow.",
  "For your account security, we recommend changing your password regularly. Please use a strong, unique password to protect your information.",
  "As a valued customer, we're offering you an exclusive 25% discount on your next purchase. Use code PREMIUM25 at checkout.",
  "We value your opinion! Please take a moment to share your thoughts on your recent purchase. Your feedback helps us improve our services.",
  "Your monthly account statement is now available for download. Please review it and contact us if you notice any discrepancies.",
  "Our website will be undergoing maintenance from 2AM to 4AM IST tomorrow. We apologize for any inconvenience this may cause.",
  "Your subscription is due for renewal next week. To ensure uninterrupted service, please update your payment information.",
  "We've updated our privacy policy to better protect your data. Please review the changes and let us know if you have any questions.",
  "You're invited to our exclusive product launch event next month. Join us to be among the first to experience our newest innovations."
];

// Automated responses
export const AUTOMATED_RESPONSES = [
  "Namaste! Thank you for your email. We will get back to you shortly with more information.",
  "We have received your inquiry and our team is working to address your concerns as quickly as possible.",
  "Thank you for reaching out to us. Your request has been assigned to a specialist who will contact you within 24 hours.",
  "We appreciate your patience. Your case has been escalated to our senior support team for immediate attention.",
  "Thank you for your valuable feedback. We're constantly working to improve our services based on customer insights.",
  "We apologize for any inconvenience caused. Our team is committed to resolving your issue promptly.",
  "Your satisfaction is our priority. We're reviewing your request and will respond with a comprehensive solution.",
  "We've received your support ticket and have assigned it the highest priority. Expect a resolution soon."
];

// Helper function to analyze sentiment
export const analyzeSentiment = (content: string): "positive" | "neutral" | "negative" => {
  const positiveWords = ["thank", "thanks", "appreciate", "great", "excellent", "good", "happy", "pleased", "satisfied", "wonderful", "awesome", "love"];
  const negativeWords = ["issue", "problem", "disappointing", "bad", "unhappy", "error", "mistake", "failed", "poor", "terrible", "awful", "hate", "wrong"];
  
  content = content.toLowerCase();
  const positiveCount = positiveWords.filter(word => content.includes(word)).length;
  const negativeCount = negativeWords.filter(word => content.includes(word)).length;
  
  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
};

// Generate initial emails
export const generateInitialEmails = (): Email[] => {
  const initialEmails: Email[] = [];
  
  // Create initial emails with diverse data
  for (let i = 0; i < 10; i++) {
    const fromIndex = Math.floor(Math.random() * SAMPLE_EMAILS_FROM.length);
    const subjectIndex = Math.floor(Math.random() * SAMPLE_SUBJECTS.length);
    const contentIndex = Math.floor(Math.random() * SAMPLE_CONTENT.length);
    
    // Create random timestamp within the last 7 days
    const daysAgo = Math.random() * 7;
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    
    // Randomly add thread information for some emails
    const hasThread = Math.random() > 0.6;
    const thread = hasThread ? {
      lastEmail: new Date(timestamp.getTime() - Math.random() * 86400000 * 10), // 0-10 days before the current email
      count: 1 + Math.floor(Math.random() * 5) // 1-5 previous emails in thread
    } : undefined;
    
    // Determine sentiment
    const content = SAMPLE_CONTENT[contentIndex];
    const sentiment = analyzeSentiment(content);
    
    // Generate tags
    const possibleTags = ["important", "work", "personal", "finance", "shopping", "travel"];
    const tagCount = Math.floor(Math.random() * 3); // 0-2 tags
    const tags = [];
    for (let j = 0; j < tagCount; j++) {
      const tagIndex = Math.floor(Math.random() * possibleTags.length);
      tags.push(possibleTags[tagIndex]);
    }
    
    // Determine priority
    const priorityOptions: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
    const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    
    // Create the email
    const email: Email = {
      id: `email-${Date.now()}-${i}`,
      from: SAMPLE_EMAILS_FROM[fromIndex],
      subject: SAMPLE_SUBJECTS[subjectIndex],
      content: SAMPLE_CONTENT[contentIndex],
      timestamp: timestamp,
      isRead: Math.random() > 0.3, // 70% chance to be read
      isResolved: Math.random() > 0.7, // 30% chance to be resolved
      isStarred: Math.random() > 0.8, // 20% chance to be starred
      sentiment: sentiment,
      thread: thread,
      tags: tags.length > 0 ? tags : undefined,
      priority: priority
    };
    
    initialEmails.push(email);
  }
  
  return initialEmails;
};
