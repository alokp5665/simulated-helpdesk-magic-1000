
import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  PhoneCall, 
  PhoneMissed, 
  PhoneOff, 
  Clock, 
  User, 
  PhoneOutgoing, 
  PhoneIncoming, 
  X, 
  CheckCircle, 
  Bell, 
  MoveRight, 
  Calendar, 
  PauseCircle, 
  PlayCircle, 
  BarChart3, 
  Filter, 
  RefreshCw, 
  AlertTriangle, 
  UserPlus 
} from "lucide-react";
import { AreaChart, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell, Line, LineChart, Area } from "recharts";

interface Call {
  id: string;
  type: "incoming" | "outgoing" | "missed";
  status: "ongoing" | "completed" | "missed" | "transferred";
  customerName: string;
  agentName: string;
  duration?: string;
  timestamp: Date;
  notes?: string;
}

interface CallStats {
  date: string;
  calls: number;
  missed: number;
  duration: number;
}

// Indian Hindu names for simulation
const AGENT_NAMES = [
  "Arjun Mehta", 
  "Priya Sharma", 
  "Vikram Singh", 
  "Ananya Patel", 
  "Rahul Iyer", 
  "Kavya Agarwal"
];

const CUSTOMER_NAMES = [
  "Rohan Verma", 
  "Neha Gupta", 
  "Dev Choudhury", 
  "Meera Kapoor", 
  "Aryan Malhotra", 
  "Zara Reddy", 
  "Kabir Singhania", 
  "Diya Joshi", 
  "Vihaan Khanna", 
  "Ishita Desai"
];

// Colors for charts and visualizations
const COLORS = ['#8884d8', '#4f46e5', '#7e3af2', '#83c5be', '#efc2f5', '#e8c1a0'];
const STATUS_COLORS = {
  ongoing: '#4f46e5',
  completed: '#10b981',
  missed: '#ef4444',
  transferred: '#f59e0b'
};

const CallsPage = () => {
  const { toast } = useToast();
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callStats, setCallStats] = useState<CallStats[]>([]);
  const [callQueue, setCallQueue] = useState<Call[]>([]);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [callTypeFilter, setCallTypeFilter] = useState("all");
  const [callStatusFilter, setCallStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [callNotes, setCallNotes] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledCall, setScheduledCall] = useState({
    name: "",
    date: "",
    time: "",
    notes: ""
  });
  const [pieData, setPieData] = useState([
    { name: 'Incoming', value: 35 },
    { name: 'Outgoing', value: 40 },
    { name: 'Missed', value: 15 },
    { name: 'Transferred', value: 10 }
  ]);

  // Generate call data for charts
  useEffect(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = new Date().getDay();
    
    const stats = Array(7).fill(null).map((_, i) => {
      const dayIndex = (currentDay - 6 + i + 7) % 7;
      const isFuture = i > 6 - currentDay;
      
      return {
        date: days[dayIndex],
        calls: isFuture ? 0 : Math.floor(Math.random() * 40) + 20,
        missed: isFuture ? 0 : Math.floor(Math.random() * 10) + 2,
        duration: isFuture ? 0 : Math.floor(Math.random() * 30) + 15
      };
    });
    
    setCallStats(stats);
  }, []);

  // Display notification
  const displayNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  // Simulate new calls
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeCall && Math.random() > 0.7) {
        // Decide if adding to queue or direct call
        if (Math.random() > 0.6 || callQueue.length > 0) {
          // Create new call
          const newCall: Call = {
            id: Date.now().toString(),
            type: Math.random() > 0.5 ? "incoming" : "outgoing",
            status: "ongoing",
            customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
            agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
            timestamp: new Date()
          };
          
          // Add to active call
          setActiveCall(newCall);
          setCalls(prev => [newCall, ...prev.slice(0, 19)]);
          
          // Display notification
          displayNotification(`${newCall.type === "incoming" ? "Incoming call from" : "Outgoing call to"} ${newCall.customerName}`);
          
        } else {
          // Add to queue
          const queueCall: Call = {
            id: Date.now().toString(),
            type: "incoming",
            status: "ongoing",
            customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
            agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
            timestamp: new Date()
          };
          
          setCallQueue(prev => [...prev, queueCall]);
          displayNotification(`New call in queue from ${queueCall.customerName}`);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [activeCall, callQueue]);

  // Handle active call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // End call after random duration
      const timeout = setTimeout(() => {
        setActiveCall(prev => {
          if (prev) {
            const callDurationFormatted = `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`;
            setCalls(calls => calls.map(call => 
              call.id === prev.id 
                ? { 
                    ...call, 
                    status: "completed", 
                    duration: callDurationFormatted,
                    notes: callNotes.length > 0 ? callNotes : undefined
                  }
                : call
            ));
            setCallNotes("");
            
            // Process queue
            if (callQueue.length > 0) {
              const nextCall = callQueue[0];
              setCallQueue(prev => prev.slice(1));
              setActiveCall(nextCall);
              displayNotification(`Now connecting with ${nextCall.customerName}`);
              return null;
            }
          }
          return null;
        });
      }, Math.random() * 15000 + 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [activeCall, callDuration, callNotes, callQueue]);

  // Simulate missed calls
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const missedCall: Call = {
          id: Date.now().toString(),
          type: "incoming",
          status: "missed",
          customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
          agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
          timestamp: new Date()
        };
        setCalls(prev => [missedCall, ...prev.slice(0, 19)]);
        displayNotification(`Missed call from ${missedCall.customerName}`);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Update pie chart data
  useEffect(() => {
    const interval = setInterval(() => {
      setPieData([
        { name: 'Incoming', value: 30 + Math.random() * 20 },
        { name: 'Outgoing', value: 30 + Math.random() * 20 },
        { name: 'Missed', value: 5 + Math.random() * 15 },
        { name: 'Transferred', value: 5 + Math.random() * 10 }
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle call actions
  const handleAnswer = () => {
    if (activeCall) {
      toast({
        title: "Call Answered",
        description: `Connected with ${activeCall.customerName}`,
      });
    }
  };

  const handleHangup = () => {
    if (activeCall) {
      const callDurationFormatted = `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`;
      
      setCalls(calls => calls.map(call => 
        call.id === activeCall.id 
          ? { 
              ...call, 
              status: "completed", 
              duration: callDurationFormatted,
              notes: callNotes.length > 0 ? callNotes : undefined
            } 
          : call
      ));
      
      toast({
        title: "Call Ended",
        description: `Call with ${activeCall.customerName} ended`,
      });
      
      setActiveCall(null);
      setCallNotes("");
      
      // Process queue
      if (callQueue.length > 0) {
        const nextCall = callQueue[0];
        setCallQueue(prev => prev.slice(1));
        setTimeout(() => {
          setActiveCall(nextCall);
          displayNotification(`Now connecting with ${nextCall.customerName}`);
        }, 1000);
      }
    }
  };

  const handleTransfer = () => {
    if (activeCall) {
      const availableAgents = AGENT_NAMES.filter(agent => agent !== activeCall.agentName);
      const newAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
      
      const callDurationFormatted = `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`;
      
      setCalls(calls => calls.map(call => 
        call.id === activeCall.id 
          ? { 
              ...call, 
              status: "transferred", 
              duration: callDurationFormatted,
              agentName: newAgent,
              notes: callNotes.length > 0 ? callNotes : undefined
            } 
          : call
      ));
      
      toast({
        title: "Call Transferred",
        description: `Call transferred to ${newAgent}`,
      });
      
      setActiveCall(null);
      setCallNotes("");
      
      // Process queue
      if (callQueue.length > 0) {
        const nextCall = callQueue[0];
        setCallQueue(prev => prev.slice(1));
        setTimeout(() => {
          setActiveCall(nextCall);
          displayNotification(`Now connecting with ${nextCall.customerName}`);
        }, 1000);
      }
    }
  };

  const handleScheduleCall = () => {
    if (scheduledCall.name && scheduledCall.date && scheduledCall.time) {
      toast({
        title: "Call Scheduled",
        description: `Call with ${scheduledCall.name} scheduled for ${scheduledCall.date} at ${scheduledCall.time}`,
      });
      
      setShowScheduler(false);
      setScheduledCall({
        name: "",
        date: "",
        time: "",
        notes: ""
      });
    }
  };

  // Filter calls based on selection
  const filteredCalls = calls.filter(call => {
    if (callTypeFilter !== "all" && call.type !== callTypeFilter) return false;
    if (callStatusFilter !== "all" && call.status !== callStatusFilter) return false;
    if (agentFilter !== "all" && call.agentName !== agentFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background calls-visualization">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Call Center Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Real-time call management and analytics</p>
          </div>

          {/* Notification Popup */}
          {showNotification && (
            <div className="fixed top-20 right-6 z-50 notification-animate">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 realistic-glass">
                <Bell className="h-5 w-5" />
                <span>{notificationMessage}</span>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <Tabs defaultValue="dashboard" className="mb-6" onValueChange={setCurrentTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="dashboard" className="text-sm">Dashboard</TabsTrigger>
              <TabsTrigger value="calls" className="text-sm">Active Calls</TabsTrigger>
              <TabsTrigger value="history" className="text-sm">Call History</TabsTrigger>
            </TabsList>

            {/* Dashboard View */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-12 gap-6 bentoGrid">
                {/* Call Volume Trend */}
                <Card className="col-span-12 md:col-span-8 glass-card hover-scale">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>Call Volume Trend</span>
                    </CardTitle>
                    <CardDescription>
                      Daily call volumes and missed calls over the past week
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={callStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value}`, 'Calls']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white' 
                          }}
                        />
                        <Legend />
                        <Bar dataKey="calls" name="Total Calls" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="missed" name="Missed Calls" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Call Distribution */}
                <Card className="col-span-12 md:col-span-4 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PhoneCall className="h-5 w-5 text-primary" />
                      <span>Call Distribution</span>
                    </CardTitle>
                    <CardDescription>
                      Breakdown by call type
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          className="animate-pulse-slow"
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white' 
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Call Duration Trend */}
                <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Call Duration Trend</span>
                    </CardTitle>
                    <CardDescription>
                      Average call duration over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={callStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value} min`, 'Avg Duration']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white' 
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="duration" 
                          name="Avg Duration" 
                          stroke="#8884d8" 
                          strokeWidth={3} 
                          dot={{ fill: '#8884d8', r: 6 }}
                          activeDot={{ r: 8, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Agent Performance */}
                <Card className="col-span-12 md:col-span-6 glass-card hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Agent Performance</span>
                    </CardTitle>
                    <CardDescription>
                      Call handling metrics by agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {AGENT_NAMES.slice(0, 4).map((agent, index) => (
                        <div key={agent} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{agent}</span>
                            <span className="text-muted-foreground">
                              {15 + Math.floor(Math.random() * 20)} calls today
                            </span>
                          </div>
                          <Progress 
                            value={65 + Math.random() * 25} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Active Calls View */}
            <TabsContent value="calls" className="space-y-6">
              <div className="grid grid-cols-12 gap-6 bentoGrid">
                {/* Active Call */}
                <Card className="col-span-12 lg:col-span-7 realistic-glass float-3d">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <PhoneCall className="h-5 w-5 text-primary" />
                        <span>Active Call</span>
                      </div>
                      {activeCall && (
                        <Badge variant="default" className="animate-pulse">
                          {activeCall.type === "incoming" ? "Incoming" : "Outgoing"}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeCall ? (
                      <div className="flex flex-col items-center justify-center space-y-6 py-6">
                        <div className={`p-1 rounded-full ${activeCall.type === "incoming" ? "call-incoming" : ""}`}>
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeCall.customerName.replace(" ", "+")}`} />
                            <AvatarFallback>
                              {activeCall.customerName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="text-center">
                          <h2 className="text-2xl font-semibold mb-2">{activeCall.customerName}</h2>
                          <p className="text-muted-foreground flex items-center justify-center gap-1">
                            {activeCall.type === "incoming" ? (
                              <><PhoneIncoming className="h-4 w-4" /> Incoming Call</>
                            ) : (
                              <><PhoneOutgoing className="h-4 w-4" /> Outgoing Call</>
                            )}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            with {activeCall.agentName}
                          </p>
                        </div>
                        <div className="text-3xl font-mono timer-animation">
                          {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                          <Button 
                            variant="outline" 
                            className="button-3d bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            onClick={handleAnswer}
                          >
                            <CheckCircle className="h-5 w-5 mr-1" />
                            Answer
                          </Button>
                          <Button 
                            variant="outline" 
                            className="button-3d bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                            onClick={handleTransfer}
                          >
                            <MoveRight className="h-5 w-5 mr-1" />
                            Transfer
                          </Button>
                          <Button 
                            variant="outline" 
                            className="button-3d bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                            onClick={handleHangup}
                          >
                            <X className="h-5 w-5 mr-1" />
                            End Call
                          </Button>
                        </div>
                        <div className="w-full">
                          <p className="text-sm font-medium mb-2">Call Notes</p>
                          <Textarea 
                            placeholder="Add notes about this call..."
                            value={callNotes}
                            onChange={(e) => setCallNotes(e.target.value)}
                            className="w-full min-h-[100px]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                        <PhoneOff className="h-12 w-12 mb-4" />
                        <p>No active calls</p>
                        <Button 
                          className="mt-4 premium-button"
                          onClick={() => setShowScheduler(true)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule a Call
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Call Queue and Stats */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                  {/* Call Queue */}
                  <Card className="realistic-glass hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PhoneIncoming className="h-5 w-5 text-primary" />
                        <span>Call Queue</span>
                        {callQueue.length > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {callQueue.length} waiting
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {callQueue.length > 0 ? (
                        <div className="space-y-3">
                          {callQueue.map((call, index) => (
                            <div 
                              key={call.id} 
                              className={`flex items-center justify-between p-3 rounded-lg border ${index === 0 ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 queue-animation" : "bg-card/50 border-border/50"}`}
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${call.customerName.replace(" ", "+")}`} />
                                  <AvatarFallback>
                                    {call.customerName.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{call.customerName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Waiting for {Math.floor(Math.random() * 2) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                                  </p>
                                </div>
                              </div>
                              <Badge>Waiting</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                          <p>No calls in queue</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Today's Call Stats */}
                  <Card className="realistic-glass hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span>Today's Stats</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Calls</p>
                          <p className="text-2xl font-bold">{calls.length}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                          <p className="text-green-600 dark:text-green-400 text-sm font-medium">Completed</p>
                          <p className="text-2xl font-bold">{calls.filter(c => c.status === "completed").length}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                          <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">Transferred</p>
                          <p className="text-2xl font-bold">{calls.filter(c => c.status === "transferred").length}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                          <p className="text-red-600 dark:text-red-400 text-sm font-medium">Missed</p>
                          <p className="text-2xl font-bold">{calls.filter(c => c.status === "missed").length}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Average Call Duration</p>
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-indigo-600">
                                {(Math.floor(Math.random() * 3) + 3)}:{(Math.floor(Math.random() * 60)).toString().padStart(2, '0')} mins
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                            <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Call History View */}
            <TabsContent value="history" className="space-y-6">
              <div className="grid grid-cols-12 gap-6 bentoGrid">
                {/* Filters */}
                <Card className="col-span-12 realistic-glass">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Select 
                          value={callTypeFilter} 
                          onValueChange={setCallTypeFilter}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Call Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="incoming">Incoming</SelectItem>
                            <SelectItem value="outgoing">Outgoing</SelectItem>
                            <SelectItem value="missed">Missed</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={callStatusFilter} 
                          onValueChange={setCallStatusFilter}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Call Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="missed">Missed</SelectItem>
                            <SelectItem value="transferred">Transferred</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={agentFilter} 
                          onValueChange={setAgentFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Agent" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Agents</SelectItem>
                            {AGENT_NAMES.map(agent => (
                              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="button-3d">
                          <Filter className="h-4 w-4 mr-1" />
                          Advanced Filters
                        </Button>
                        <Button 
                          className="premium-button"
                          onClick={() => setShowScheduler(true)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call Logs */}
                <Card className="col-span-12 realistic-glass float-3d">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Call History</span>
                    </CardTitle>
                    <CardDescription>
                      Recent call records and outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {filteredCalls.map(call => (
                          <div key={call.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors response-card">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${call.customerName.replace(" ", "+")}`} />
                                  <AvatarFallback>
                                    {call.customerName.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{call.customerName}</p>
                                  <p className="text-sm text-muted-foreground">with {call.agentName}</p>
                                </div>
                              </div>
                              <Badge variant={
                                call.status === "ongoing" ? "default" :
                                call.status === "completed" ? "secondary" :
                                call.status === "transferred" ? "outline" :
                                "destructive"
                              }>
                                {call.status === "ongoing" ? (
                                  <PhoneCall className="h-4 w-4 mr-1" />
                                ) : call.status === "missed" ? (
                                  <PhoneMissed className="h-4 w-4 mr-1" />
                                ) : call.status === "transferred" ? (
                                  <MoveRight className="h-4 w-4 mr-1" />
                                ) : (
                                  <Phone className="h-4 w-4 mr-1" />
                                )}
                                {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <span>
                                  {call.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                                  {call.type === "incoming" ? (
                                    <><PhoneIncoming className="h-3 w-3 inline-block mr-1" /> Incoming</>
                                  ) : (
                                    <><PhoneOutgoing className="h-3 w-3 inline-block mr-1" /> Outgoing</>
                                  )}
                                </span>
                              </div>
                              {call.duration && <span>Duration: {call.duration}</span>}
                            </div>
                            {call.notes && (
                              <div className="mt-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800/50 text-sm">
                                <p className="font-medium text-xs text-muted-foreground">Notes:</p>
                                <p>{call.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Call Scheduler Modal */}
          {showScheduler && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="w-full max-w-md mx-auto realistic-glass">
                <CardHeader>
                  <CardTitle>Schedule a Call</CardTitle>
                  <CardDescription>
                    Set up a future call with a customer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Customer Name</label>
                      <Input 
                        value={scheduledCall.name}
                        onChange={(e) => setScheduledCall({...scheduledCall, name: e.target.value})}
                        placeholder="Enter customer name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input 
                          type="date" 
                          value={scheduledCall.date} 
                          onChange={(e) => setScheduledCall({...scheduledCall, date: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Input 
                          type="time" 
                          value={scheduledCall.time} 
                          onChange={(e) => setScheduledCall({...scheduledCall, time: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea 
                        value={scheduledCall.notes}
                        onChange={(e) => setScheduledCall({...scheduledCall, notes: e.target.value})}
                        placeholder="Add any notes or call topics..."
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setShowScheduler(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleCall} className="premium-button">
                    Schedule Call
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CallsPage;
