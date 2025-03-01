import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { DidYouKnow } from "./DidYouKnow";
import { ChatInput } from "./ChatInput";
import { ChatbotHeader } from "./ChatbotHeader";

// Mock chatbot responses data
const chatbotResponses = [
  {
    query: "How do I create a new ticket?",
    response: "To create a new ticket, navigate to the Tickets section and click on the 'New Ticket' button in the top right corner. Fill in the required fields in the form that appears, and click 'Submit'. You can also create tickets via email by sending a message to your designated support email address."
  },
  {
    query: "What is SLA management?",
    response: "SLA (Service Level Agreement) management in PrimeCare Helpdesk allows you to define and track response and resolution times for different types of tickets. You can set up different SLA policies based on ticket priority, category, or customer type. The system will automatically track adherence to these SLAs and alert agents when tickets are approaching or have breached their SLA targets."
  },
  {
    query: "How do I reset my password?",
    response: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password. If you're already logged in and want to change your password, go to your user profile settings and select the 'Change Password' option."
  },
  {
    query: "How can I set up automation rules?",
    response: "To set up automation rules, go to Settings > Automation. Click 'Add Rule' and define the conditions and actions for your rule. Conditions determine when the rule will be triggered (e.g., when a ticket is created or updated), and actions define what happens when those conditions are met (e.g., assign the ticket to a specific agent or team, change the status, or send a notification)."
  },
  {
    query: "Can I customize the ticket fields?",
    response: "Yes, you can customize ticket fields in PrimeCare Helpdesk. Go to Settings > Ticket Fields to add, edit, or remove fields. You can create various field types including text, dropdown, checkbox, date, and more. You can also make fields required or optional, and control their visibility to agents and customers."
  },
  {
    query: "How do I export reports?",
    response: "To export reports, navigate to the Reports section and generate the report you need. Once the report is displayed, look for the 'Export' button, usually located in the top right corner of the report view. You can export reports in various formats including CSV, Excel, PDF, and more depending on your subscription plan."
  },
  {
    query: "What integrations are available?",
    response: "PrimeCare Helpdesk offers numerous integrations with popular business tools. These include CRM systems like Salesforce and HubSpot, communication tools like Slack and Microsoft Teams, email providers like Gmail and Outlook, calendar apps, project management tools like Jira and Asana, and more. You can find the full list in Settings > Integrations."
  },
  {
    query: "How do I add a new agent to the system?",
    response: "To add a new agent, go to Settings > Agents > Add New Agent. Fill in their details including name, email, and role. The system will send an invitation email with instructions to set up their account. You can also assign them to specific teams, define their permissions, and set up their availability for ticket assignments."
  },
  {
    query: "How can I merge duplicate tickets?",
    response: "To merge duplicate tickets, select the tickets you want to merge from the ticket list by checking their checkboxes. Then click on the 'More Actions' or 'Actions' dropdown and select 'Merge Tickets'. Choose which ticket should be the primary one, and all conversations and attachments from the other tickets will be moved to this primary ticket."
  },
  {
    query: "How do I set up canned responses?",
    response: "To set up canned responses (also called saved replies), go to Settings > Saved Replies. Click 'Add New Reply', give it a name, and enter the response text. You can include placeholders for dynamic content such as customer name or ticket ID. Once created, agents can use these replies while responding to tickets, saving time on repetitive responses."
  },
  {
    query: "What are tags used for?",
    response: "Tags in PrimeCare Helpdesk help categorize and organize tickets for better management and reporting. You can add tags to tickets based on their nature, the type of issue, or any other classification that makes sense for your workflow. Tags can be used for filtering tickets, creating automation rules, and generating reports on specific types of issues."
  },
  {
    query: "How do I configure email notifications?",
    response: "To configure email notifications, go to Settings > Notifications. Here you can define which events trigger notifications (e.g., new ticket created, ticket assigned, comment added) and who receives these notifications. You can customize the email templates used for these notifications by going to Settings > Email Templates."
  },
  {
    query: "Can I set up a knowledge base?",
    response: "Yes, PrimeCare Helpdesk includes a comprehensive knowledge base feature. To set it up, go to the Knowledge Base section and click 'Settings'. Here you can configure categories, visibility settings, and access permissions. To add articles, click 'Add Article', create your content using the rich text editor, assign categories, and publish when ready."
  },
  {
    query: "How does the ticket routing work?",
    response: "Ticket routing in PrimeCare Helpdesk can be automatic or manual. For automatic routing, you can set up rules based on various criteria like ticket category, priority, or keywords in the subject/description. These rules can assign tickets to specific agents or teams based on expertise or availability. For manual routing, team leads or admins can assign tickets to appropriate agents through the ticket management interface."
  },
  {
    query: "What reporting capabilities are available?",
    response: "PrimeCare Helpdesk offers extensive reporting capabilities including predefined reports and custom report builders. You can generate reports on ticket volume, response times, resolution times, SLA compliance, agent performance, customer satisfaction, and more. Reports can be scheduled to run automatically and be sent to specified email addresses. Advanced analytics dashboards are available on higher-tier plans."
  },
  {
    query: "How do I set up teams?",
    response: "To set up teams, go to Settings > Teams > Add New Team. Give the team a name and description, then add members by selecting from your agent list. You can designate team leaders who will have additional permissions for tickets assigned to the team. Teams can be used in routing rules, SLA policies, and for organizing your support structure into specialized groups."
  },
  {
    query: "What are macros and how do I use them?",
    response: "Macros in PrimeCare Helpdesk are predefined sets of actions that can be applied to a ticket with a single click. To create a macro, go to Settings > Macros > Add New Macro. Define a sequence of actions like changing status, assigning to a team, adding tags, or sending a response. Macros help streamline repetitive workflows and ensure consistent ticket handling procedures."
  },
  {
    query: "How do I customize the customer portal?",
    response: "To customize the customer portal, go to Settings > Customer Portal. Here you can adjust the branding (logo, colors, fonts), configure which fields are visible to customers when they submit tickets, set up welcome messages, and control features like knowledge base access. You can also create custom fields specifically for the customer portal interface."
  },
  {
    query: "Can I implement ticket approval workflows?",
    response: "Yes, you can implement ticket approval workflows in PrimeCare Helpdesk using the Approvals feature. Go to Settings > Approvals to set up approval rules. You can define which types of tickets require approval, who the approvers are, and what happens after approval or rejection. This is particularly useful for change requests, purchase requests, or other tickets that require management sign-off."
  },
  {
    query: "How do I track time spent on tickets?",
    response: "PrimeCare Helpdesk includes time tracking functionality for tickets. Agents can log time manually by clicking the 'Add Time Log' button on a ticket and entering the duration and a description. The system can also track time automatically when agents are actively working on a ticket. Time logs can be used for billing, productivity analysis, and resource allocation planning."
  },
  {
    query: "How secure is my data in PrimeCare Helpdesk?",
    response: "PrimeCare Helpdesk implements industry-standard security measures to protect your data. These include data encryption in transit and at rest, regular security audits, role-based access controls, two-factor authentication, IP restrictions, and single sign-on options. We're compliant with major regulations including GDPR, HIPAA, and SOC 2. Detailed security information is available in our security whitepaper."
  },
  {
    query: "Can I customize the ticket status workflow?",
    response: "Yes, you can customize the ticket status workflow in Settings > Ticket Statuses. Here you can create new status options beyond the default ones (Open, Pending, Resolved, Closed), define their properties, and establish the allowed transitions between statuses. This allows you to create a workflow that matches your specific support processes."
  },
  {
    query: "How do I set up SLA policies?",
    response: "To set up SLA policies, go to Settings > SLA Policies > Add New Policy. Define the conditions when this policy applies (e.g., ticket priority, category, customer type) and set the target response and resolution times. You can also configure escalation rules that trigger when SLA targets are approaching or have been breached, such as notifications to managers or automatic priority increases."
  },
  {
    query: "How do I implement a satisfaction survey?",
    response: "To implement a customer satisfaction survey, go to Settings > Satisfaction Survey. Enable the survey feature and customize the questions, rating scale, and when surveys are sent (typically after a ticket is resolved). You can choose between different survey types including simple rating questions, Net Promoter Score (NPS), or custom question sets. Survey results are available in the reporting section."
  },
  {
    query: "How do I handle multiple brands or products?",
    response: "PrimeCare Helpdesk supports multi-brand helpdesk management. Go to Settings > Brands to set up different brands or products. For each brand, you can configure unique email addresses, customer portals, knowledge bases, and email templates with appropriate branding. This allows you to provide tailored support experiences for different products or divisions within your organization."
  },
  {
    query: "What mobile options are available?",
    response: "PrimeCare Helpdesk offers mobile apps for iOS and Android, allowing agents to manage tickets on the go. The mobile apps include features like ticket creation and updates, internal notes, file attachments, and notifications. Additionally, both the agent interface and customer portal are responsive and can be accessed via mobile web browsers if preferred."
  },
  {
    query: "How do I customize my dashboard?",
    response: "To customize your dashboard, click the 'Customize' button in the top right corner of your dashboard. You can add, remove, and rearrange widgets by dragging and dropping. Available widgets include recent tickets, ticket statistics, SLA compliance metrics, knowledge base usage, and agent performance. Individual agents can personalize their own dashboards to focus on metrics relevant to their role."
  },
  {
    query: "How do I set up email piping?",
    response: "To set up email piping, go to Settings > Channels > Email. Add your support email address and configure the mail server settings (or use our built-in email service). Once configured, any emails sent to this address will automatically be converted into tickets in your helpdesk. You can set up multiple email addresses for different departments or brands, with separate automation rules for each."
  },
  {
    query: "What languages does PrimeCare Helpdesk support?",
    response: "PrimeCare Helpdesk supports multiple languages for both the agent interface and customer portal. Available languages include English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Japanese, Chinese, and more. Agents can work in their preferred language, and the customer portal can automatically detect and display in the customer's language based on their browser settings."
  },
  {
    query: "How do I import existing tickets from another system?",
    response: "To import existing tickets from another system, go to Settings > Import/Export > Import Tickets. The system supports importing from CSV files and direct migration from several popular helpdesk platforms. You'll need to map the fields from your source system to PrimeCare Helpdesk fields. For complex migrations, our professional services team can provide assistance to ensure a smooth transition."
  },
];

// Knowledge tips for the "Did you know?" feature
const knowledgeTips = [
  "You can create automation rules to automatically assign tickets based on keywords in the subject line.",
  "Keyboard shortcuts can significantly speed up your ticket processing. Press 'K' to view all available shortcuts.",
  "You can merge duplicate tickets to keep your helpdesk organized and provide a unified response to customers.",
  "Setting up canned responses for common questions can save your agents hours of repetitive typing each week.",
  "The 'Snooze' feature lets you temporarily hide tickets until they need attention again.",
  "PrimeCare Helpdesk can automatically suggest relevant knowledge base articles when agents are responding to tickets.",
  "You can schedule reports to be automatically emailed to stakeholders on a regular basis.",
  "Internal notes allow agents to collaborate on tickets without the customer seeing these comments.",
  "Tags can be used to categorize tickets and create powerful reports on specific types of issues.",
  "The collision detection feature alerts agents when multiple people are viewing or replying to the same ticket.",
  "Use SLA policies to ensure your team meets response time commitments to customers.",
  "The 'Customer Satisfaction Score' feature automatically surveys customers after their tickets are resolved.",
  "You can create custom ticket fields to collect specific information needed for your support process.",
  "Time tracking features allow you to measure how much time is spent on different types of support issues.",
  "The knowledge base analytics show which articles are most viewed, helping you improve your self-service content.",
];

// Helper type for chat messages
type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

export const ChatbotComponent = () => {
  const { toast } = useToast();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  const [currentTip, setCurrentTip] = useState(knowledgeTips[0]);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "👋 Hi there! I'm your EduCare assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [usedResponses, setUsedResponses] = useState<Record<string, string[]>>({});

  // Change the tip every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = knowledgeTips[Math.floor(Math.random() * knowledgeTips.length)];
      setCurrentTip(randomTip);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Find matching responses
    setTimeout(() => {
      setIsTyping(false);
      
      // Find all potential matching responses
      const matchingResponses = chatbotResponses.filter(
        (item) => item.query.toLowerCase().includes(inputMessage.toLowerCase()) || 
                  inputMessage.toLowerCase().includes(item.query.toLowerCase())
      );
      
      let botResponse = "";
      
      if (matchingResponses.length > 0) {
        // Initialize if not exists
        if (!usedResponses[inputMessage.toLowerCase()]) {
          setUsedResponses(prev => ({
            ...prev,
            [inputMessage.toLowerCase()]: []
          }));
        }
        
        // Filter out previously used responses for this query
        const unusedResponses = matchingResponses.filter(
          resp => !usedResponses[inputMessage.toLowerCase()]?.includes(resp.response)
        );
        
        if (unusedResponses.length > 0) {
          // Use a random unused response
          const randomResponse = unusedResponses[Math.floor(Math.random() * unusedResponses.length)];
          botResponse = randomResponse.response;
          
          // Add to used responses
          setUsedResponses(prev => ({
            ...prev,
            [inputMessage.toLowerCase()]: [...(prev[inputMessage.toLowerCase()] || []), botResponse]
          }));
        } else {
          // If all responses were used, reset and start over
          const randomResponse = matchingResponses[Math.floor(Math.random() * matchingResponses.length)];
          botResponse = randomResponse.response;
          
          // Reset used responses for this query
          setUsedResponses(prev => ({
            ...prev,
            [inputMessage.toLowerCase()]: [botResponse]
          }));
        }
      } else {
        botResponse = "I don't have specific information about that yet. Please try asking about creating tickets, SLA management, password resets, or other helpdesk features. Alternatively, you can contact our support team for more assistance.";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: botResponse,
        timestamp: new Date(),
      };
      
      setChatMessages((prev) => [...prev, botMessage]);
    }, 1500 + Math.random() * 1000);
  };

  const openChatbot = () => {
    setIsChatbotOpen(true);
    setIsChatbotMinimized(false);
    toast({
      title: "AI Assistant Activated",
      description: "Ask any question about EduCare.",
    });
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
    setIsChatbotMinimized(false);
  };

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300 shadow-xl",
      isChatbotMinimized ? "w-auto" : isChatbotOpen ? "w-80 sm:w-96" : "w-auto"
    )}>
      {!isChatbotOpen ? (
        <Button 
          onClick={openChatbot} 
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all"
        >
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <Card className={cn(
          "shadow-lg transition-all duration-300 border-primary/20",
          isChatbotMinimized ? "h-14" : "h-[450px]"
        )}>
          <ChatbotHeader 
            isChatbotMinimized={isChatbotMinimized}
            setIsChatbotMinimized={setIsChatbotMinimized}
            closeChatbot={closeChatbot}
          />
          
          {!isChatbotMinimized && (
            <>
              <DidYouKnow tip={currentTip} />
              
              {/* Chat Messages */}
              <div className="flex-1 p-3 overflow-y-auto h-[310px]">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <ChatMessage 
                      key={msg.id}
                      role={msg.role}
                      content={msg.content}
                      timestamp={msg.timestamp}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <ChatInput 
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
              />
            </>
          )}
        </Card>
      )}
    </div>
  );
};
