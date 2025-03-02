import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  MessagesSquare,
  Phone,
  CheckCircle,
  Clock,
  Tag,
  ArrowDown,
  MoreVertical,
  Filter,
  CalendarDays,
  UserRound,
  RefreshCcw,
  Users,
  AlertTriangle,
  Ban,
  PlusCircle,
  Check,
  X,
  Paperclip,
  AlignLeft,
  Menu
} from "lucide-react";

const FIRST_NAMES = [
  "Aditya", "Ananya", "Arjun", "Divya", "Ishaan", "Kavya", "Krishna", "Lakshmi", 
  "Neha", "Nikhil", "Priya", "Rahul", "Rishi", "Rohan", "Samaira", "Sanjay", 
  "Shreya", "Tanvi", "Vikram", "Vivaan"
];

const LAST_NAMES = [
  "Agarwal", "Chakraborty", "Desai", "Gupta", "Iyer", "Joshi", "Kapoor", "Malhotra", 
  "Nair", "Patel", "Reddy", "Sharma", "Singh", "Trivedi", "Verma", "Yadav", 
  "Bhatia", "Choudhury", "Mehta", "Raj"
];

const PRODUCTS = [
  "SaaS Analytics Dashboard",
  "CRM Suite Pro",
  "Enterprise Security Suite",
  "Cloud Storage Manager",
  "Customer Portal",
  "API Gateway",
  "Mobile App Accounts",
  "Payment Processing System",
  "Data Visualization Tool",
  "Multi-factor Authentication"
];

interface Ticket {
  id: string;
  subject: string;
  customer: {
    name: string;
    email: string;
    imageUrl?: string;
  };
  assignee?: {
    name: string;
    imageUrl?: string;
  };
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  product: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    name: string;
    type: "customer" | "agent" | "system";
    imageUrl?: string;
  };
  attachments?: {
    name: string;
    type: string;
    size: string;
  }[];
}

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDate = (startDate: Date, endDate: Date): Date => {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  return new Date(randomTimestamp);
};

const generateRandomName = (): string => {
  return `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`;
};

const generateRandomEmail = (name: string): string => {
  const [firstName, lastName] = name.split(" ");
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
};

const generateTicket = (id: string): Ticket => {
  const customerName = generateRandomName();
  const assigneeName = generateRandomName();
  const status = getRandomElement(["open", "pending", "resolved", "closed"] as const);
  const priority = getRandomElement(["low", "medium", "high", "urgent"] as const);
  const product = getRandomElement(PRODUCTS);
  const createdAt = generateRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
  const updatedAt = generateRandomDate(createdAt, new Date());
  const tags = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
    return getRandomElement([
      "billing", "technical", "feature-request", "bug", "account", "subscription", "security", "payment"
    ]);
  });

  const messages = Array.from(
    { length: Math.floor(Math.random() * 5) + 1 },
    (_, i): TicketMessage => {
      const isFirst = i === 0;
      const sender = {
        name: isFirst ? customerName : Math.random() > 0.5 ? customerName : assigneeName,
        type: isFirst || Math.random() > 0.5 ? "customer" : "agent" as "customer" | "agent" | "system",
        imageUrl: undefined,
      };

      return {
        id: `msg-${id}-${i}`,
        content: generateRandomMessage(sender.type, product),
        timestamp: generateRandomDate(createdAt, updatedAt),
        sender,
        attachments: Math.random() > 0.7 ? generateRandomAttachments() : undefined,
      };
    }
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return {
    id,
    subject: generateRandomSubject(product),
    customer: {
      name: customerName,
      email: generateRandomEmail(customerName),
    },
    assignee: status !== "open" ? { name: assigneeName } : undefined,
    status,
    priority,
    createdAt,
    updatedAt,
    tags,
    product,
    messages,
  };
};

const generateRandomSubject = (product: string): string => {
  const subjects = [
    `Issue with ${product} access`,
    `${product} login problem`,
    `Can't configure ${product} settings`,
    `${product} data not syncing`,
    `Need help with ${product} integration`,
    `${product} performance issues`,
    `Error message in ${product}`,
    `${product} not loading correctly`,
    `Question about ${product} billing`,
    `${product} feature not working`,
  ];
  return getRandomElement(subjects);
};

const generateRandomMessage = (type: "customer" | "agent" | "system", product: string): string => {
  if (type === "customer") {
    const messages = [
      `I'm having an issue with ${product}. It's not working as expected.`,
      `The ${product} dashboard keeps showing an error when I try to access my reports. Can you help?`,
      `I need help setting up ${product} for my team. The documentation isn't clear.`,
      `${product} is very slow lately. Is there a known issue?`,
      `I'm getting a strange error message when using ${product}: "Error code 5023".`,
      `My account on ${product} seems to be locked. I need immediate assistance.`,
      `We're having trouble with the API integration for ${product}. The endpoints are returning 404.`,
      `Is there a way to customize the reports in ${product}? I need more detailed analytics.`,
      `The recent update to ${product} broke our workflow. We need a fix ASAP.`,
      `I'd like to upgrade our plan for ${product}. What are the options?`
    ];
    return getRandomElement(messages);
  } else if (type === "agent") {
    const messages = [
      `I understand you're having an issue with ${product}. I'll help you troubleshoot it.`,
      `Thanks for reporting this problem with ${product}. Let me check our systems.`,
      `I can definitely help you set up ${product} for your team. Let's go through it step by step.`,
      `We're aware of the performance issues with ${product} and our engineering team is working on it.`,
      `That error code in ${product} usually indicates a permission issue. Let me reset that for you.`,
      `I've unlocked your account on ${product}. Please try logging in again.`,
      `Let me check the API documentation for ${product} to help with your integration issue.`,
      `Yes, there are several ways to customize reports in ${product}. I can show you how.`,
      `I apologize for the inconvenience with the recent update. Let me provide a workaround.`,
      `I'd be happy to discuss upgrade options for ${product}. What specific features are you interested in?`
    ];
    return getRandomElement(messages);
  } else {
    const messages = [
      `Ticket opened for ${product} issue.`,
      `Status changed to pending.`,
      `Ticket assigned to support team.`,
      `Ticket priority updated to high.`,
      `Customer requested callback.`,
      `Ticket escalated to level 2 support.`,
      `Automated system check completed for ${product}.`,
      `Maintenance notification: ${product} will undergo scheduled maintenance.`,
      `Ticket merged with related issue #5789.`,
      `Customer satisfaction survey sent.`
    ];
    return getRandomElement(messages);
  }
};

const generateRandomAttachments = () => {
  const attachmentTypes = [
    { type: "image/png", ext: "png" },
    { type: "image/jpg", ext: "jpg" },
    { type: "application/pdf", ext: "pdf" },
    { type: "text/csv", ext: "csv" },
    { type: "application/zip", ext: "zip" }
  ];
  
  const attachmentNames = [
    "screenshot",
    "error_log",
    "system_info",
    "account_details",
    "invoice",
    "configuration",
    "debug_info"
  ];
  
  const count = Math.floor(Math.random() * 2) + 1;
  
  return Array.from({ length: count }, () => {
    const type = getRandomElement(attachmentTypes);
    const name = `${getRandomElement(attachmentNames)}.${type.ext}`;
    const sizes = ["12KB", "347KB", "1.2MB", "5.4MB", "892KB"];
    
    return {
      name,
      type: type.type,
      size: getRandomElement(sizes)
    };
  });
};

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("all");
  
  useEffect(() => {
    const initialTickets = Array.from({ length: 50 }, (_, i) => 
      generateTicket(`ticket-${i + 1}`)
    );
    setTickets(initialTickets);
    setFilteredTickets(initialTickets);
    setSelectedTicket(initialTickets[0]);
  }, []);
  
  useEffect(() => {
    let result = tickets;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.subject.toLowerCase().includes(term) ||
        ticket.customer.name.toLowerCase().includes(term) ||
        ticket.customer.email.toLowerCase().includes(term) ||
        ticket.product.toLowerCase().includes(term) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    if (currentTab !== "all") {
      result = result.filter(ticket => ticket.status === currentTab);
    }
    
    if (activeFilter) {
      switch(activeFilter) {
        case "high-priority":
          result = result.filter(ticket => ticket.priority === "high" || ticket.priority === "urgent");
          break;
        case "unassigned":
          result = result.filter(ticket => !ticket.assignee);
          break;
        case "recent":
          result = result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          break;
        default:
          break;
      }
    }
    
    setFilteredTickets(result);
    
    if (selectedTicket && !result.find(t => t.id === selectedTicket.id)) {
      setSelectedTicket(result.length > 0 ? result[0] : null);
    }
  }, [searchTerm, tickets, currentTab, activeFilter, selectedTicket]);
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };
  
  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };
  
  const handleStatusChange = (ticketId: string, newStatus: "open" | "pending" | "resolved" | "closed") => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status: newStatus,
              updatedAt: new Date(),
              messages: [
                ...ticket.messages,
                {
                  id: `msg-status-${Date.now()}`,
                  content: `Status changed to ${newStatus}`,
                  timestamp: new Date(),
                  sender: {
                    name: "System",
                    type: "system"
                  }
                }
              ]
            }
          : ticket
      )
    );
  };
  
  const handleAssign = (ticketId: string, assigneeName: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              assignee: { name: assigneeName },
              updatedAt: new Date(),
              messages: [
                ...ticket.messages,
                {
                  id: `msg-assign-${Date.now()}`,
                  content: `Ticket assigned to ${assigneeName}`,
                  timestamp: new Date(),
                  sender: {
                    name: "System",
                    type: "system"
                  }
                }
              ]
            }
          : ticket
      )
    );
  };
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col pl-64">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Tickets</h1>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Button variant="outline">
                  <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
                </Button>
                <Button variant="default">
                  <PlusCircle className="h-4 w-4 mr-2" /> New Ticket
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-5">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search tickets..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <Tabs defaultValue="all" value={currentTab} onValueChange={handleTabChange}>
                      <TabsList className="w-full">
                        <TabsTrigger className="flex-1" value="all">
                          All
                        </TabsTrigger>
                        <TabsTrigger className="flex-1" value="open">
                          Open
                        </TabsTrigger>
                        <TabsTrigger className="flex-1" value="pending">
                          Pending
                        </TabsTrigger>
                        <TabsTrigger className="flex-1" value="resolved">
                          Resolved
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="px-4 py-2 border-b bg-muted/50 flex gap-1.5">
                      <Button
                        size="sm"
                        variant={activeFilter === "high-priority" ? "default" : "outline"}
                        className="h-7 text-xs"
                        onClick={() => handleFilterChange("high-priority")}
                      >
                        High Priority
                      </Button>
                      <Button
                        size="sm"
                        variant={activeFilter === "unassigned" ? "default" : "outline"}
                        className="h-7 text-xs"
                        onClick={() => handleFilterChange("unassigned")}
                      >
                        Unassigned
                      </Button>
                      <Button
                        size="sm"
                        variant={activeFilter === "recent" ? "default" : "outline"}
                        className="h-7 text-xs"
                        onClick={() => handleFilterChange("recent")}
                      >
                        Recent
                      </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-320px)]">
                      {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                          <div
                            key={ticket.id}
                            className={`border-b px-4 py-3 cursor-pointer hover:bg-muted/50 flex flex-col gap-2 ${
                              selectedTicket?.id === ticket.id ? "bg-muted" : ""
                            }`}
                            onClick={() => handleTicketSelect(ticket)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div 
                                  className={`w-2 h-2 rounded-full ${
                                    ticket.priority === "urgent" ? "bg-red-500" :
                                    ticket.priority === "high" ? "bg-orange-500" :
                                    ticket.priority === "medium" ? "bg-yellow-500" :
                                    "bg-green-500"
                                  }`}
                                />
                                <h3 className="font-medium text-sm truncate">{ticket.subject}</h3>
                              </div>
                              <Badge 
                                variant={
                                  ticket.status === "open" ? "destructive" :
                                  ticket.status === "pending" ? "default" :
                                  ticket.status === "resolved" ? "outline" :
                                  "secondary"
                                }
                                className="text-xs h-5"
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>#{ticket.id.split('-')[1]}</span>
                              <span>•</span>
                              <span>{ticket.customer.name}</span>
                              <span>•</span>
                              <span>{ticket.updatedAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {ticket.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          No tickets found matching your criteria
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              
              <div className="col-span-7">
                {selectedTicket ? (
                  <Card>
                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>{selectedTicket.subject}</CardTitle>
                        <CardDescription>
                          Ticket #{selectedTicket.id.split('-')[1]} • Opened {selectedTicket.createdAt.toLocaleDateString()}
                        </CardDescription>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {selectedTicket.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          <Badge 
                            variant={
                              selectedTicket.priority === "urgent" ? "destructive" :
                              selectedTicket.priority === "high" ? "default" :
                              "outline"
                            }
                            className="text-xs"
                          >
                            {selectedTicket.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ticket Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <MessagesSquare className="h-4 w-4 mr-2" /> Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" /> Call Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" /> Assign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <Ban className="h-4 w-4 mr-2" /> Close Ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {selectedTicket.customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{selectedTicket.customer.name}</h4>
                            <p className="text-sm text-muted-foreground">{selectedTicket.customer.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <UserRound className="h-4 w-4 mr-2" /> View Profile
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg mb-4">
                        <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                          <h3 className="font-medium">Product</h3>
                          <Badge variant="outline">{selectedTicket.product}</Badge>
                        </div>
                        <div className="p-3 border-b flex items-center justify-between">
                          <h3 className="font-medium">Status</h3>
                          <Select 
                            value={selectedTicket.status}
                            onValueChange={(value) => handleStatusChange(
                              selectedTicket.id, 
                              value as "open" | "pending" | "resolved" | "closed"
                            )}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="p-3 border-b flex items-center justify-between">
                          <h3 className="font-medium">Assignee</h3>
                          {selectedTicket.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {selectedTicket.assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{selectedTicket.assignee.name}</span>
                            </div>
                          ) : (
                            <Select onValueChange={(value) => handleAssign(selectedTicket.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Vikram Sharma">Vikram Sharma</SelectItem>
                                <SelectItem value="Ananya Patel">Ananya Patel</SelectItem>
                                <SelectItem value="Rahul Malhotra">Rahul Malhotra</SelectItem>
                                <SelectItem value="Priya Desai">Priya Desai</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <h3 className="font-medium">Last Updated</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>
                              {selectedTicket.updatedAt.toLocaleDateString()} at {selectedTicket.updatedAt.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Conversation</h3>
                        <ScrollArea className="h-[calc(100vh-600px)] pr-4">
                          {selectedTicket.messages.map((message) => (
                            <div key={message.id} className="mb-4">
                              {message.sender.type === "system" ? (
                                <div className="flex items-center gap-2 py-2 px-3 bg-muted/30 rounded text-xs text-muted-foreground">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>{message.content}</span>
                                  <span className="text-xs ml-auto">
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              ) : (
                                <div className={`flex gap-3 ${message.sender.type === "agent" ? "flex-row-reverse" : ""}`}>
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs">
                                      {message.sender.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={`flex flex-col max-w-[80%] ${message.sender.type === "agent" ? "items-end" : ""}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium">{message.sender.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {message.timestamp.toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <div className={`rounded-lg p-3 ${
                                      message.sender.type === "agent" 
                                        ? "bg-primary text-primary-foreground" 
                                        : "bg-muted"
                                    }`}>
                                      <p className="text-sm">{message.content}</p>
                                      
                                      {message.attachments && message.attachments.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-primary/20">
                                          <p className="text-xs mb-1">Attachments:</p>
                                          <div className="space-y-1">
                                            {message.attachments.map((attachment, i) => (
                                              <div 
                                                key={i}
                                                className="flex items-center gap-1 text-xs p-1.5 rounded bg-primary/10"
                                              >
                                                <Paperclip className="h-3 w-3" />
                                                <span>{attachment.name}</span>
                                                <span className="ml-auto">{attachment.size}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      <div className="relative w-full">
                        <div className="absolute bottom-full left-0 right-0 p-2 flex gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Check className="h-3 w-3 mr-1" /> Resolve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <X className="h-3 w-3 mr-1" /> Close
                          </Button>
                        </div>
                        <textarea
                          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                          placeholder="Type your reply here..."
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="outline" className="h-7">
                              <Paperclip className="h-3 w-3 mr-1" /> Attach
                            </Button>
                            <Button size="sm" variant="outline" className="h-7">
                              <AlignLeft className="h-3 w-3 mr-1" /> Templates
                            </Button>
                          </div>
                          <Button size="sm">
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center">
                      <Menu className="h-10 w-10 text-muted-foreground mb-4 mx-auto" />
                      <h3 className="text-lg font-medium mb-1">No ticket selected</h3>
                      <p className="text-muted-foreground">Select a ticket from the list to view its details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
