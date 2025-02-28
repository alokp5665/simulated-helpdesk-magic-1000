
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Ticket, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  Plus, 
  User, 
  X, 
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

type TicketStatus = "Open" | "In Progress" | "Resolved";
type TicketPriority = "Low" | "Medium" | "High" | "Critical";

interface Agent {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

interface TicketComment {
  id: number;
  userId: number;
  username: string;
  content: string;
  timestamp: Date;
}

interface TicketData {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  assignee: Agent | null;
  createdBy: string;
  comments: TicketComment[];
}

// Mock data
const mockAgents: Agent[] = [
  { id: 1, name: "Alex Johnson", avatar: "/placeholder.svg", status: "online" },
  { id: 2, name: "Samantha Lee", avatar: "/placeholder.svg", status: "online" },
  { id: 3, name: "Marcus Chen", avatar: "/placeholder.svg", status: "away" },
  { id: 4, name: "Priya Sharma", avatar: "/placeholder.svg", status: "offline" },
  { id: 5, name: "Jordan Smith", avatar: "/placeholder.svg", status: "online" },
];

// Initial tickets data
const initialTickets: TicketData[] = [
  {
    id: 1,
    title: "Website login issue",
    description: "Users are unable to log in with correct credentials",
    status: "Open",
    priority: "High",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000), // 12 hours ago
    assignee: mockAgents[0],
    createdBy: "customer@example.com",
    comments: [
      {
        id: 1,
        userId: 1,
        username: "Alex Johnson",
        content: "I'll look into this issue right away.",
        timestamp: new Date(Date.now() - 50000000),
      },
    ],
  },
  {
    id: 2,
    title: "Payment processing failed",
    description: "Transaction gateway errors when completing checkout",
    status: "In Progress",
    priority: "Critical",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 21600000), // 6 hours ago
    assignee: mockAgents[1],
    createdBy: "merchant@example.com",
    comments: [],
  },
  {
    id: 3,
    title: "Mobile app crashes on startup",
    description: "iOS users reporting immediate crash after latest update",
    status: "In Progress",
    priority: "High",
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    updatedAt: new Date(Date.now() - 86400000), // 1 day ago
    assignee: mockAgents[2],
    createdBy: "developer@example.com",
    comments: [],
  },
  {
    id: 4,
    title: "Feature request: Dark mode",
    description: "Multiple users requesting dark mode implementation",
    status: "Open",
    priority: "Medium",
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
    updatedAt: new Date(Date.now() - 345600000), // 4 days ago
    assignee: null,
    createdBy: "user_feedback@example.com",
    comments: [],
  },
  {
    id: 5,
    title: "Email notifications not sending",
    description: "Notifications for order confirmations are delayed",
    status: "Resolved",
    priority: "Medium",
    createdAt: new Date(Date.now() - 518400000), // 6 days ago
    updatedAt: new Date(Date.now() - 172800000), // 2 days ago
    assignee: mockAgents[3],
    createdBy: "support@example.com",
    comments: [
      {
        id: 2,
        userId: 4,
        username: "Priya Sharma",
        content: "Fixed the SMTP configuration issue that was causing delays.",
        timestamp: new Date(Date.now() - 172800000),
      },
      {
        id: 3,
        userId: 1,
        username: "Alex Johnson",
        content: "Confirmed resolution. Email delivery times now normal.",
        timestamp: new Date(Date.now() - 130000000),
      },
    ],
  },
  {
    id: 6,
    title: "Product image not loading",
    description: "Product gallery shows missing images on certain products",
    status: "Resolved",
    priority: "Low",
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
    updatedAt: new Date(Date.now() - 259200000), // 3 days ago
    assignee: mockAgents[4],
    createdBy: "content_manager@example.com",
    comments: [],
  },
];

// Ticket status icons and colors
const statusConfig = {
  "Open": { icon: Circle, color: "text-blue-500", bg: "bg-blue-100" },
  "In Progress": { icon: PlayCircle, color: "text-amber-500", bg: "bg-amber-100" },
  "Resolved": { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
};

// Get priority class
const getPriorityClass = (priority: TicketPriority) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const TicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketData[]>(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>(initialTickets);
  const [activeStatus, setActiveStatus] = useState<TicketStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicketData, setNewTicketData] = useState({
    title: "",
    description: "",
    priority: "Medium" as TicketPriority,
  });
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ticketCreationProgress, setTicketCreationProgress] = useState(0);

  // Filter tickets based on status and search query
  useEffect(() => {
    let result = [...tickets];
    
    // Filter by status
    if (activeStatus !== "All") {
      result = result.filter(ticket => ticket.status === activeStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        ticket => 
          ticket.title.toLowerCase().includes(query) || 
          ticket.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTickets(result);
  }, [tickets, activeStatus, searchQuery]);

  // Function to update ticket status
  const updateTicketStatus = (ticketId: number, status: TicketStatus) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status,
          updatedAt: new Date()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    toast.success(`Ticket #${ticketId} status updated to ${status}`);
  };

  // Function to assign ticket to agent
  const assignTicket = (ticketId: number, agent: Agent) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          assignee: agent,
          updatedAt: new Date()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    toast.success(`Ticket #${ticketId} assigned to ${agent.name}`);
  };

  // Function to add comment to ticket
  const addComment = (ticketId: number) => {
    if (!newComment.trim()) return;
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedComments = [
          ...ticket.comments,
          {
            id: Date.now(),
            userId: 1, // Assuming current user
            username: "Alex Johnson", // Assuming current user
            content: newComment,
            timestamp: new Date()
          }
        ];
        
        return {
          ...ticket,
          comments: updatedComments,
          updatedAt: new Date()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setNewComment("");
    toast.success("Comment added successfully");
  };

  // Create new ticket
  const handleCreateTicket = () => {
    if (!newTicketData.title || !newTicketData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    // Simulate progress for a more premium feel
    const interval = setInterval(() => {
      setTicketCreationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      const newTicket: TicketData = {
        id: tickets.length + 1,
        title: newTicketData.title,
        description: newTicketData.description,
        status: "Open",
        priority: newTicketData.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignee: null,
        createdBy: "current_user@example.com",
        comments: []
      };
      
      setTickets([newTicket, ...tickets]);
      setNewTicketData({ title: "", description: "", priority: "Medium" });
      setIsDialogOpen(false);
      setTicketCreationProgress(0);
      
      toast.success("Ticket created successfully", {
        description: `Ticket #${newTicket.id} has been created and is awaiting assignment.`
      });
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopBar />
      <Sidebar />
      
      <main className="pt-20 pl-64 pr-4 pb-10">
        <motion.div 
          className="mx-auto max-w-7xl" 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div 
            className="flex justify-between items-center mb-6" 
            variants={fadeIn}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
              <p className="text-gray-600 mt-1">Manage, track and resolve support tickets</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="group hover:shadow-lg transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Create Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Support Ticket</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new support ticket.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={newTicketData.title}
                      onChange={(e) => setNewTicketData({...newTicketData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Detailed explanation of the issue"
                      rows={5}
                      value={newTicketData.description}
                      onChange={(e) => setNewTicketData({...newTicketData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={`w-full justify-start ${getPriorityClass(newTicketData.priority)} border-0`}>
                          {newTicketData.priority}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={() => setNewTicketData({...newTicketData, priority: "Low"})}>
                          Low
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewTicketData({...newTicketData, priority: "Medium"})}>
                          Medium
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewTicketData({...newTicketData, priority: "High"})}>
                          High
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewTicketData({...newTicketData, priority: "Critical"})}>
                          Critical
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {ticketCreationProgress > 0 && (
                    <div className="mt-2">
                      <Progress value={ticketCreationProgress} className="h-2" />
                      <p className="text-xs text-center mt-1 text-gray-500">
                        {ticketCreationProgress === 100 ? 'Completing...' : 'Processing...'}
                      </p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateTicket} disabled={ticketCreationProgress > 0}>
                    Create Ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
          
          {/* Search and Filter Section */}
          <motion.div 
            className="flex flex-wrap gap-4 mb-8" 
            variants={fadeIn}
          >
            <div className="relative flex-grow max-w-md">
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 backdrop-blur-sm bg-white/80 border-gray-200 focus:border-blue-500 transition-all"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Tabs 
              defaultValue="All" 
              value={activeStatus} 
              onValueChange={(value) => setActiveStatus(value as TicketStatus | "All")}
              className="flex-grow"
            >
              <TabsList className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-md">
                <TabsTrigger 
                  value="All" 
                  className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  All Tickets
                </TabsTrigger>
                <TabsTrigger 
                  value="Open"
                  className="flex-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  <Circle className="h-4 w-4 mr-1 text-blue-500" />
                  Open
                </TabsTrigger>
                <TabsTrigger 
                  value="In Progress"
                  className="flex-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
                >
                  <PlayCircle className="h-4 w-4 mr-1 text-amber-500" />
                  In Progress
                </TabsTrigger>
                <TabsTrigger 
                  value="Resolved"
                  className="flex-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  Resolved
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
          
          {/* Main Content - Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm bg-white/90">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Ticket className="mr-2 h-5 w-5 text-primary" />
                    Support Tickets
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {filteredTickets.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <ScrollArea className="h-[600px] pr-4">
                    {filteredTickets.length > 0 ? (
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredTickets.map((ticket) => {
                          const StatusIcon = statusConfig[ticket.status].icon;
                          return (
                            <motion.div 
                              key={ticket.id}
                              variants={itemVariants}
                              whileHover={{ scale: 1.01 }}
                              className="group bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded-full ${statusConfig[ticket.status].bg} mt-1`}>
                                    <StatusIcon className={`h-5 w-5 ${statusConfig[ticket.status].color}`} />
                                  </div>
                                  <div>
                                    <h3 className="font-medium group-hover:text-primary transition-colors">
                                      {ticket.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {ticket.description}
                                    </p>
                                    <div className="mt-2 flex items-center text-xs text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>
                                        Created {format(ticket.createdAt, "MMM dd, yyyy")}
                                      </span>
                                      <span className="mx-2">•</span>
                                      <span className={`px-2 py-1 rounded-full ${getPriorityClass(ticket.priority)}`}>
                                        {ticket.priority}
                                      </span>
                                      {ticket.comments.length > 0 && (
                                        <>
                                          <span className="mx-2">•</span>
                                          <MessageSquare className="h-3 w-3 mr-1" />
                                          <span>{ticket.comments.length}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {ticket.assignee ? (
                                  <div className="flex flex-col items-end">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                      {ticket.assignee.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                      {ticket.assignee.name}
                                    </span>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      assignTicket(ticket.id, mockAgents[Math.floor(Math.random() * mockAgents.length)]);
                                    }}
                                  >
                                    Assign
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Ticket className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm">
                          No tickets match your current filters. Try adjusting your search or create a new ticket.
                        </p>
                        <Button 
                          className="mt-4"
                          onClick={() => {
                            setIsDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Ticket
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Ticket Details / Live Feed */}
            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm bg-white/90">
                <CardHeader className="pb-3">
                  <CardTitle>
                    {selectedTicket ? 'Ticket Details' : 'Live Ticket Feed'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  {selectedTicket ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">#{selectedTicket.id}: {selectedTicket.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedTicket(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[selectedTicket.status].bg} ${statusConfig[selectedTicket.status].color}`}>
                            {selectedTicket.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(selectedTicket.priority)}`}>
                            {selectedTicket.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            Created {format(selectedTicket.createdAt, "PPP")}
                          </span>
                        </div>
                        <p className="mt-4 text-gray-700">{selectedTicket.description}</p>
                        
                        <div className="mt-6">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Assignee</h4>
                            {selectedTicket.assignee ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">Reassign</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {mockAgents.map(agent => (
                                    <DropdownMenuItem 
                                      key={agent.id}
                                      onClick={() => {
                                        if (selectedTicket) {
                                          assignTicket(selectedTicket.id, agent);
                                          setSelectedTicket({
                                            ...selectedTicket,
                                            assignee: agent,
                                            updatedAt: new Date()
                                          });
                                        }
                                      }}
                                    >
                                      {agent.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button>Assign</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {mockAgents.map(agent => (
                                    <DropdownMenuItem 
                                      key={agent.id}
                                      onClick={() => {
                                        if (selectedTicket) {
                                          assignTicket(selectedTicket.id, agent);
                                          setSelectedTicket({
                                            ...selectedTicket,
                                            assignee: agent,
                                            updatedAt: new Date()
                                          });
                                        }
                                      }}
                                    >
                                      {agent.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          
                          {selectedTicket.assignee ? (
                            <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-gray-50">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                                {selectedTicket.assignee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium">{selectedTicket.assignee.name}</p>
                                <p className="text-xs text-gray-500">
                                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${selectedTicket.assignee.status === 'online' ? 'bg-green-500' : selectedTicket.assignee.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
                                  {selectedTicket.assignee.status.charAt(0).toUpperCase() + selectedTicket.assignee.status.slice(1)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic mt-2">No agent assigned</p>
                          )}
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Status</h4>
                          <div className="flex gap-2">
                            {(["Open", "In Progress", "Resolved"] as TicketStatus[]).map((status) => (
                              <Button
                                key={status}
                                variant={selectedTicket.status === status ? "default" : "outline"}
                                size="sm"
                                className={selectedTicket.status === status ? "" : "bg-white"}
                                onClick={() => {
                                  if (selectedTicket.status !== status) {
                                    updateTicketStatus(selectedTicket.id, status);
                                    setSelectedTicket({
                                      ...selectedTicket,
                                      status,
                                      updatedAt: new Date()
                                    });
                                  }
                                }}
                              >
                                {status}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium mb-3">Comments ({selectedTicket.comments.length})</h4>
                        <ScrollArea className="h-[180px] pr-4 -mr-4">
                          {selectedTicket.comments.length > 0 ? (
                            <div className="space-y-4">
                              {selectedTicket.comments.map((comment) => (
                                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                        {comment.username.split(' ').map(n => n[0]).join('')}
                                      </div>
                                      <span className="font-medium text-sm">{comment.username}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {format(comment.timestamp, "MMM d, h:mm a")}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic text-sm">No comments yet</p>
                          )}
                        </ScrollArea>
                        
                        <div className="mt-4">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="resize-none"
                            rows={2}
                          />
                          <div className="flex justify-end mt-2">
                            <Button 
                              onClick={() => {
                                if (selectedTicket) {
                                  addComment(selectedTicket.id);
                                  // Update selected ticket with new comment
                                  if (newComment.trim()) {
                                    const newCommentObj = {
                                      id: Date.now(),
                                      userId: 1,
                                      username: "Alex Johnson",
                                      content: newComment,
                                      timestamp: new Date()
                                    };
                                    setSelectedTicket({
                                      ...selectedTicket,
                                      comments: [...selectedTicket.comments, newCommentObj],
                                      updatedAt: new Date()
                                    });
                                  }
                                }
                              }}
                              disabled={!newComment.trim()}
                            >
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Recent Activity</h3>
                      {tickets.slice(0, 5).map((ticket, index) => (
                        <motion.div 
                          key={`activity-${ticket.id}`}
                          variants={itemVariants}
                          className="p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${index % 3 === 0 ? 'bg-blue-100' : index % 3 === 1 ? 'bg-amber-100' : 'bg-green-100'} mt-1`}>
                              {index % 3 === 0 ? (
                                <Plus className="h-4 w-4 text-blue-500" />
                              ) : index % 3 === 1 ? (
                                <User className="h-4 w-4 text-amber-500" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">
                                  {index % 3 === 0
                                    ? 'New ticket created'
                                    : index % 3 === 1
                                    ? ticket.assignee ? `Assigned to ${ticket.assignee.name}` : 'Awaiting assignment'
                                    : `Status changed to ${ticket.status}`}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Ticket #{ticket.id}: {ticket.title}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {format(ticket.updatedAt, "MMM d, h:mm a")}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Stats Card */}
            <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm bg-white/90">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ticket Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500 rounded-full text-white">
                          <Circle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-600 font-medium">Open Tickets</p>
                          <p className="text-2xl font-bold text-blue-700">
                            {tickets.filter(t => t.status === "Open").length}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-blue-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(tickets.filter(t => t.status === "Open").length / tickets.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500 rounded-full text-white">
                          <PlayCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-600 font-medium">In Progress</p>
                          <p className="text-2xl font-bold text-amber-700">
                            {tickets.filter(t => t.status === "In Progress").length}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-amber-200 rounded-full">
                          <div 
                            className="h-2 bg-amber-500 rounded-full" 
                            style={{ width: `${(tickets.filter(t => t.status === "In Progress").length / tickets.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500 rounded-full text-white">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-green-600 font-medium">Resolved</p>
                          <p className="text-2xl font-bold text-green-700">
                            {tickets.filter(t => t.status === "Resolved").length}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-green-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${(tickets.filter(t => t.status === "Resolved").length / tickets.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Checkbox id="autoRefresh" />
                      <label htmlFor="autoRefresh">Auto-refresh</label>
                    </div>
                    <p>Last updated: {format(new Date(), "MMM d, h:mm a")}</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TicketsPage;
