
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { 
  Phone, 
  PhoneCall, 
  PhoneMissed, 
  PhoneOff, 
  Clock, 
  User, 
  Calendar, 
  BarChart3, 
  ChevronDown, 
  Check, 
  X, 
  Play, 
  Pause, 
  MicOff, 
  PhoneOutgoing,
  PhoneIncoming,
  Plus,
  Clock1,
  Users,
  FileText,
  Volume,
  Volume2,
  VolumeX,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";

// Define call types and status
enum CallType {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
  MISSED = "missed"
}

enum CallStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  MISSED = "missed",
  TRANSFERRED = "transferred",
  QUEUED = "queued"
}

// Define interfaces for our data
interface Call {
  id: string;
  type: CallType;
  status: CallStatus;
  customerName: string;
  agentName: string;
  duration?: string;
  timestamp: Date;
  notes?: string;
  recordingUrl?: string;
  phoneNumber?: string;
  department?: string;
}

interface CallAnalytics {
  totalCalls: number;
  missedCalls: number;
  averageDuration: string;
  callsByType: { name: string; value: number }[];
  callsTrend: { date: string; calls: number; duration: number }[];
  agentPerformance: { name: string; calls: number; duration: number }[];
}

// Indian Hindu names for simulation
const AGENT_NAMES = [
  "Arjun Sharma", 
  "Divya Patel", 
  "Rajesh Gupta", 
  "Anjali Verma", 
  "Vikram Malhotra", 
  "Meera Iyer",
  "Karthik Subramaniam",
  "Neha Desai"
];

const CUSTOMER_NAMES = [
  "Aditya Kapoor", 
  "Priya Singh", 
  "Rahul Mahajan", 
  "Ananya Reddy", 
  "Siddharth Joshi", 
  "Kavita Menon",
  "Vivek Khanna",
  "Sudha Nair",
  "Rohan Mittal",
  "Lakshmi Tiwari",
  "Nitin Agarwal",
  "Sunita Choudhary"
];

// Example call analytics data
const generateAnalyticsData = (): CallAnalytics => {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return {
    totalCalls: Math.floor(Math.random() * 100) + 50,
    missedCalls: Math.floor(Math.random() * 20) + 5,
    averageDuration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
    callsByType: [
      { name: "Incoming", value: Math.floor(Math.random() * 40) + 20 },
      { name: "Outgoing", value: Math.floor(Math.random() * 30) + 10 },
      { name: "Missed", value: Math.floor(Math.random() * 15) + 5 },
      { name: "Transferred", value: Math.floor(Math.random() * 10) + 2 }
    ],
    callsTrend: dates.map(date => ({
      date,
      calls: Math.floor(Math.random() * 20) + 5,
      duration: Math.floor(Math.random() * 300) + 60
    })),
    agentPerformance: AGENT_NAMES.slice(0, 5).map(name => ({
      name: name.split(' ')[0],
      calls: Math.floor(Math.random() * 30) + 10,
      duration: Math.floor(Math.random() * 200) + 100
    }))
  };
};

// Utility function to format time
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Call page component
const CallsPage = () => {
  // State
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [queuedCalls, setQueuedCalls] = useState<Call[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [callAnalytics, setCallAnalytics] = useState<CallAnalytics>(generateAnalyticsData());
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterAgent, setFilterAgent] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // Refs
  const notesRef = useRef<HTMLTextAreaElement>(null);
  
  // Hooks
  const { toast } = useToast();

  // Colors for charts
  const COLORS = ['#8B5CF6', '#EC4899', '#F97316', '#06B6D4'];
  
  // Effects
  
  // Generate initial calls
  useEffect(() => {
    const initialCalls: Call[] = [];
    
    // Generate some initial call history
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
      
      const callType = Math.random() > 0.7 
        ? CallType.MISSED 
        : (Math.random() > 0.5 ? CallType.INCOMING : CallType.OUTGOING);
      
      const callStatus = callType === CallType.MISSED 
        ? CallStatus.MISSED 
        : CallStatus.COMPLETED;
      
      const duration = callStatus === CallStatus.COMPLETED 
        ? `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`
        : undefined;
      
      initialCalls.push({
        id: `initial-${i}`,
        type: callType,
        status: callStatus,
        customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
        agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
        duration,
        timestamp: date,
        phoneNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
      });
    }
    
    setCalls(initialCalls);
    
    // Load analytics
    refreshAnalytics();
    
    return () => {
      // Cleanup timers
    };
  }, []);

  // Simulate new calls
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeCall && Math.random() > 0.7) {
        // Determine if call goes to queue or becomes active
        const shouldQueue = queuedCalls.length === 0 && Math.random() > 0.7;
        
        const newCall: Call = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? CallType.INCOMING : CallType.OUTGOING,
          status: shouldQueue ? CallStatus.QUEUED : CallStatus.ONGOING,
          customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
          agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
          timestamp: new Date(),
          phoneNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
        };
        
        if (shouldQueue) {
          setQueuedCalls(prev => [...prev, newCall]);
          toast({
            title: "Call Queued",
            description: `${newCall.customerName} has been added to the call queue`,
            variant: "default",
          });
        } else if (!activeCall) {
          setActiveCall(newCall);
          setCalls(prev => [newCall, ...prev]);
          
          toast({
            title: `${newCall.type === CallType.INCOMING ? 'Incoming' : 'Outgoing'} Call`,
            description: `${newCall.customerName} - ${newCall.phoneNumber}`,
            variant: "default",
          });
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [activeCall, queuedCalls]);

  // Handle active call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeCall) {
      setCallDuration(0);
      setCallNotes("");
      
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // End call after random duration if not manually handled
      const timeout = setTimeout(() => {
        if (Math.random() > 0.7) {
          handleEndCall();
        }
      }, Math.random() * 20000 + 15000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [activeCall]);

  // Simulate missed calls
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const missedCall: Call = {
          id: Date.now().toString(),
          type: CallType.INCOMING,
          status: CallStatus.MISSED,
          customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
          agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
          timestamp: new Date(),
          phoneNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
        };
        
        setCalls(prev => [missedCall, ...prev]);
        
        toast({
          title: "Missed Call",
          description: `You missed a call from ${missedCall.customerName}`,
          variant: "destructive",
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Periodically update analytics
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAnalytics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Functions
  
  // Handle ending a call
  const handleEndCall = () => {
    setActiveCall(prev => {
      if (prev) {
        const updatedCall = { 
          ...prev, 
          status: CallStatus.COMPLETED, 
          duration: formatTime(callDuration),
          notes: callNotes
        };
        
        setCalls(calls => calls.map(call => 
          call.id === prev.id ? updatedCall : call
        ));
        
        toast({
          title: "Call Ended",
          description: `Call with ${prev.customerName} ended. Duration: ${formatTime(callDuration)}`,
        });
        
        // Check if there are queued calls to handle
        if (queuedCalls.length > 0) {
          setTimeout(() => {
            const [nextCall, ...remainingCalls] = queuedCalls;
            setQueuedCalls(remainingCalls);
            setActiveCall({
              ...nextCall,
              status: CallStatus.ONGOING
            });
            
            setCalls(calls => [
              {
                ...nextCall,
                status: CallStatus.ONGOING
              },
              ...calls
            ]);
            
            toast({
              title: "Next Call",
              description: `Taking next call from ${nextCall.customerName}`,
            });
          }, 1500);
        }
      }
      return null;
    });
    
    setIsMuted(false);
    setIsRecording(false);
  };
  
  // Handle rejecting a call
  const handleRejectCall = () => {
    setActiveCall(prev => {
      if (prev) {
        const rejectedCall = {
          ...prev,
          status: CallStatus.MISSED,
        };
        
        setCalls(calls => calls.map(call => 
          call.id === prev.id ? rejectedCall : call
        ));
        
        toast({
          title: "Call Rejected",
          description: `Call from ${prev.customerName} was rejected`,
          variant: "destructive",
        });
      }
      return null;
    });
    
    setIsMuted(false);
    setIsRecording(false);
  };
  
  // Handle transferring a call
  const handleTransferCall = (agent: string) => {
    setActiveCall(prev => {
      if (prev) {
        const transferredCall = {
          ...prev,
          status: CallStatus.TRANSFERRED,
          agentName: agent
        };
        
        setCalls(calls => calls.map(call => 
          call.id === prev.id ? transferredCall : call
        ));
        
        toast({
          title: "Call Transferred",
          description: `Call transferred to ${agent}`,
        });
      }
      return null;
    });
    
    setIsMuted(false);
    setIsRecording(false);
  };
  
  // Handle toggling mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: isMuted ? "Call has been unmuted" : "Call has been muted",
    });
  };
  
  // Handle toggling recording
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Call recording stopped" : "Call recording started",
    });
  };
  
  // Refresh analytics data
  const refreshAnalytics = () => {
    setLoadingAnalytics(true);
    // Simulate loading delay
    setTimeout(() => {
      setCallAnalytics(generateAnalyticsData());
      setLoadingAnalytics(false);
    }, 1000);
  };
  
  // Schedule a call
  const handleScheduleCall = () => {
    if (!scheduleDate) return;
    
    const newScheduledCall: Call = {
      id: `scheduled-${Date.now()}`,
      type: CallType.OUTGOING,
      status: CallStatus.QUEUED,
      customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
      agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
      timestamp: new Date(scheduleDate),
      phoneNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };
    
    setQueuedCalls(prev => [...prev, newScheduledCall]);
    setShowScheduleDialog(false);
    setScheduleDate("");
    
    toast({
      title: "Call Scheduled",
      description: `Call scheduled with ${newScheduledCall.customerName} for ${new Date(scheduleDate).toLocaleString()}`,
    });
  };
  
  // Filter calls
  const getFilteredCalls = () => {
    return calls.filter(call => {
      // Filter by date
      if (filterDate && new Date(filterDate).toDateString() !== call.timestamp.toDateString()) {
        return false;
      }
      
      // Filter by agent
      if (filterAgent && call.agentName !== filterAgent) {
        return false;
      }
      
      // Filter by status
      if (filterStatus && call.status !== filterStatus) {
        return false;
      }
      
      return true;
    });
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilterDate("");
    setFilterAgent("");
    setFilterStatus("");
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  // Get color based on call status
  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case CallStatus.COMPLETED:
        return "bg-green-500 hover:bg-green-600";
      case CallStatus.MISSED:
        return "bg-red-500 hover:bg-red-600";
      case CallStatus.ONGOING:
        return "bg-blue-500 hover:bg-blue-600";
      case CallStatus.TRANSFERRED:
        return "bg-amber-500 hover:bg-amber-600";
      case CallStatus.QUEUED:
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  // Get badge variant based on call status
  const getStatusVariant = (status: CallStatus) => {
    switch (status) {
      case CallStatus.COMPLETED:
        return "secondary";
      case CallStatus.MISSED:
        return "destructive";
      case CallStatus.ONGOING:
        return "default";
      case CallStatus.TRANSFERRED:
        return "outline";
      case CallStatus.QUEUED:
        return "secondary";
      default:
        return "secondary";
    }
  };
  
  // Get icon based on call status and type
  const getCallIcon = (call: Call) => {
    if (call.status === CallStatus.MISSED) {
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    } else if (call.type === CallType.INCOMING) {
      return <PhoneIncoming className="h-4 w-4 text-green-500" />;
    } else {
      return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Render function
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1800px] mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Call Center Dashboard</h1>
            <div className="flex space-x-3">
              <Button onClick={() => setShowScheduleDialog(true)} className="premium-button">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
              <Button onClick={refreshAnalytics} className="premium-button">
                <BarChart3 className="mr-2 h-4 w-4" />
                Refresh Analytics
              </Button>
            </div>
          </div>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <AnalyticsCard
              title="Total Calls"
              value={callAnalytics.totalCalls}
              icon={<Phone className="h-5 w-5 text-primary" />}
              className="col-span-12 md:col-span-6 lg:col-span-3"
            />
            <AnalyticsCard
              title="Missed Calls"
              value={callAnalytics.missedCalls}
              icon={<PhoneMissed className="h-5 w-5 text-red-500" />}
              className="col-span-12 md:col-span-6 lg:col-span-3"
            />
            <AnalyticsCard
              title="Average Duration"
              value={callAnalytics.averageDuration}
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              className="col-span-12 md:col-span-6 lg:col-span-3"
            />
            <AnalyticsCard
              title="Calls in Queue"
              value={queuedCalls.length}
              icon={<Users className="h-5 w-5 text-indigo-500" />}
              className="col-span-12 md:col-span-6 lg:col-span-3"
            />
          </div>
          
          {/* Charts and Call Content */}
          <div className="bentoGrid mb-6">
            {/* Active Call Panel */}
            <Card className="col-span-12 lg:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="h-5 w-5 text-primary" />
                    <span>Active Call</span>
                  </div>
                  {activeCall && (
                    <Badge variant="default" className="animate-pulse">
                      On Call
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeCall ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="flex flex-col items-center md:items-start space-y-2 mb-4 md:mb-0">
                        <Avatar className="h-20 w-20 border-2 border-primary/20">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl">
                            {activeCall.customerName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left">
                          <h2 className="text-xl font-semibold">{activeCall.customerName}</h2>
                          <p className="text-muted-foreground">{activeCall.phoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-mono animate-pulse">
                          {formatTime(callDuration)}
                        </div>
                        <Badge variant={activeCall.type === CallType.INCOMING ? "default" : "secondary"} className="mt-2">
                          {activeCall.type === CallType.INCOMING ? 
                            <PhoneIncoming className="mr-1 h-3 w-3" /> : 
                            <PhoneOutgoing className="mr-1 h-3 w-3" />}
                          {activeCall.type === CallType.INCOMING ? "Incoming" : "Outgoing"}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Call Controls */}
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button 
                        onClick={handleToggleMute} 
                        variant="outline" 
                        className={`${isMuted ? "bg-red-100 hover:bg-red-200" : ""}`}>
                        {isMuted ? <MicOff className="mr-1 h-4 w-4" /> : <Volume2 className="mr-1 h-4 w-4" />}
                        {isMuted ? "Unmute" : "Mute"}
                      </Button>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <ArrowRight className="mr-1 h-4 w-4" />
                            Transfer
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-0">
                          <div className="p-2">
                            <h3 className="font-medium mb-2">Transfer to:</h3>
                            <div className="space-y-1">
                              {AGENT_NAMES.map((agent) => (
                                <Button 
                                  key={agent} 
                                  variant="ghost" 
                                  className="w-full justify-start text-sm"
                                  onClick={() => handleTransferCall(agent)}>
                                  <User className="mr-2 h-4 w-4" />
                                  {agent}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Button 
                        onClick={handleToggleRecording} 
                        variant="outline"
                        className={`${isRecording ? "bg-green-100 hover:bg-green-200" : ""}`}>
                        {isRecording ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
                        {isRecording ? "Stop Recording" : "Record"}
                      </Button>
                      
                      <Button onClick={handleRejectCall} variant="destructive">
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                      
                      <Button onClick={handleEndCall}>
                        <Phone className="mr-1 h-4 w-4" />
                        End Call
                      </Button>
                    </div>
                    
                    {/* Call Notes */}
                    <div className="border rounded-md p-3">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Call Notes
                      </h3>
                      <textarea
                        ref={notesRef}
                        className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Add notes about this call..."
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                    <PhoneOff className="h-12 w-12 mb-4" />
                    <p className="text-lg mb-2">No active calls</p>
                    {queuedCalls.length > 0 ? (
                      <div className="text-center mt-4">
                        <p className="text-sm mb-2">{queuedCalls.length} calls in queue</p>
                        <Button 
                          onClick={() => {
                            const [nextCall, ...remainingCalls] = queuedCalls;
                            setQueuedCalls(remainingCalls);
                            setActiveCall({
                              ...nextCall,
                              status: CallStatus.ONGOING
                            });
                            setCalls(calls => [
                              {
                                ...nextCall,
                                status: CallStatus.ONGOING
                              },
                              ...calls
                            ]);
                          }}
                          className="mt-2">
                          Take Next Call
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Waiting for incoming calls</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Call Analytics */}
            <Card className="col-span-12 lg:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Call Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingAnalytics ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Call Volume - Last 7 Days</h3>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={callAnalytics.callsTrend}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.1} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{ 
                                background: 'rgba(15, 23, 42, 0.8)', 
                                border: 'none', 
                                borderRadius: '0.5rem',
                                backdropFilter: 'blur(12px)'
                              }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="calls" 
                              stroke="#8B5CF6" 
                              strokeWidth={2} 
                              activeDot={{ r: 8 }} 
                              name="Calls"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Call Distribution</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={callAnalytics.callsByType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                innerRadius={40}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {callAnalytics.callsByType.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Agent Performance</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={callAnalytics.agentPerformance}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.1} />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip 
                                contentStyle={{ 
                                  background: 'rgba(15, 23, 42, 0.8)', 
                                  border: 'none', 
                                  borderRadius: '0.5rem',
                                  backdropFilter: 'blur(12px)'
                                }} 
                              />
                              <Bar dataKey="calls" name="Calls" fill="#8B5CF6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Call Queue */}
            <Card className="col-span-12 md:col-span-6 lg:col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock1 className="h-5 w-5 text-primary" />
                  <span>Call Queue</span>
                  {queuedCalls.length > 0 && (
                    <Badge>{queuedCalls.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {queuedCalls.length > 0 ? (
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-3">
                      {queuedCalls.map((call) => (
                        <div 
                          key={call.id} 
                          className="p-3 border rounded-lg bg-card/80 hover:bg-card/90 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {call.customerName.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{call.customerName}</p>
                              <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                            </div>
                          </div>
                          <HoverCard>
                            <HoverCardTrigger>
                              <Button variant="ghost" size="sm">
                                <Clock className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-48">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Scheduled Time</p>
                                <p className="text-sm">{call.timestamp.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {call.agentName}
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                    <PhoneOff className="h-8 w-8 mb-2" />
                    <p>No calls in queue</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => setShowScheduleDialog(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Schedule New Call
                </Button>
              </CardFooter>
            </Card>
          
            {/* Alerts Panel */}
            <Card className="col-span-12 md:col-span-6 lg:col-span-8 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PhoneMissed className="h-5 w-5 text-red-500" />
                  <span>Recent Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px]">
                  <div className="space-y-2">
                    {calls
                      .filter(call => call.status === CallStatus.MISSED)
                      .slice(0, 5)
                      .map((call) => (
                        <Alert key={call.id} className="bg-card/40 hover:bg-card/60 transition-colors">
                          <AlertTitle className="flex items-center text-sm font-medium">
                            <PhoneMissed className="h-4 w-4 mr-2 text-red-500" />
                            Missed Call from {call.customerName}
                          </AlertTitle>
                          <AlertDescription className="text-xs flex justify-between">
                            <span>{call.timestamp.toLocaleString()}</span>
                            <span>{call.phoneNumber}</span>
                          </AlertDescription>
                        </Alert>
                      ))}
                    
                    {calls
                      .filter(call => call.status === CallStatus.TRANSFERRED)
                      .slice(0, 3)
                      .map((call) => (
                        <Alert key={call.id} className="bg-card/40 hover:bg-card/60 transition-colors">
                          <AlertTitle className="flex items-center text-sm font-medium">
                            <ArrowRight className="h-4 w-4 mr-2 text-amber-500" />
                            Call Transferred to {call.agentName}
                          </AlertTitle>
                          <AlertDescription className="text-xs flex justify-between">
                            <span>{call.timestamp.toLocaleString()}</span>
                            <span>{call.customerName}</span>
                          </AlertDescription>
                        </Alert>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={refreshAnalytics}>
                  Refresh Alerts
                </Button>
              </CardFooter>
            </Card>
            
            {/* Call Logs with Filters */}
            <Card className="col-span-12 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Call History</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="date"
                      className="px-3 py-1 rounded-md border text-sm"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                    
                    <select
                      className="px-3 py-1 rounded-md border text-sm"
                      value={filterAgent}
                      onChange={(e) => setFilterAgent(e.target.value)}
                    >
                      <option value="">All Agents</option>
                      {AGENT_NAMES.map((agent) => (
                        <option key={agent} value={agent}>{agent}</option>
                      ))}
                    </select>
                    
                    <select
                      className="px-3 py-1 rounded-md border text-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      {Object.values(CallStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    
                    <Button size="sm" onClick={handleApplyFilters}>
                      {isLoading ? (
                        <span className="flex items-center">
                          <Skeleton className="h-4 w-4 rounded-full mr-2" />
                          Filtering...
                        </span>
                      ) : (
                        "Apply Filters"
                      )}
                    </Button>
                    
                    <Button size="sm" variant="outline" onClick={handleResetFilters}>
                      Reset
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredCalls().slice(0, 10).map((call) => (
                        <TableRow key={call.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10">
                                  {call.customerName.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{call.customerName}</p>
                                <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{call.agentName}</TableCell>
                          <TableCell>{call.timestamp.toLocaleTimeString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getCallIcon(call)}
                              <span className="ml-2">{call.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(call.status)}>
                              {call.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{call.duration || "-"}</TableCell>
                          <TableCell>
                            {call.notes ? (
                              <HoverCard>
                                <HoverCardTrigger>
                                  <Button variant="ghost" size="sm">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <p className="text-sm font-medium">Call Notes</p>
                                  <p className="text-sm mt-2">{call.notes}</p>
                                </HoverCardContent>
                              </HoverCard>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Schedule Call Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Schedule a Call</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="datetime" className="text-sm font-medium">
                Date and Time
              </label>
              <input
                id="datetime"
                type="datetime-local"
                className="w-full px-3 py-2 rounded-md border"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleCall}>
              Schedule Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallsPage;
