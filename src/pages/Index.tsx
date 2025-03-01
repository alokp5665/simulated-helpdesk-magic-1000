import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Mail,
  User,
  Bell,
  CreditCard,
  Users,
  MessageSquare,
  Award,
  BarChart,
  LineChart,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Helper function to generate random data
const generateRandomData = (points: number, min = 0, max = 100) => {
  return Array.from({ length: points }).map((_, i) => ({
    name: `${i}h`,
    value: Math.floor(Math.random() * (max - min) + min),
  }));
};

// Indian Hindu Names for simulation
const indianNames = [
  "Aarav Sharma",
  "Priya Patel",
  "Arjun Singh",
  "Divya Mehta",
  "Vikram Verma",
  "Ananya Joshi",
  "Raj Kumar",
  "Meera Gupta",
  "Rohan Malhotra",
  "Neha Reddy",
  "Karan Kapoor",
  "Aishwarya Iyer",
  "Sanjay Desai",
  "Pooja Bansal",
  "Anil Agarwal",
];

// Generate random Indian name
const getRandomName = () => {
  return indianNames[Math.floor(Math.random() * indianNames.length)];
};

// This generates a smooth wave-like data for the charts 
const generateSmoothData = (points: number, amplitude = 30, offset = 50) => {
  return Array.from({ length: points }).map((_, i) => ({
    name: `${i}h`,
    value: Math.sin(i / 5) * amplitude + offset + (Math.random() * 10 - 5),
  }));
};

// Ticket types for simulation
const ticketTypes = ["Technical Issue", "Billing Question", "Feature Request", "Account Access", "General Inquiry"];

// Generate random ticket
const generateRandomTicket = () => {
  const id = Math.floor(10000 + Math.random() * 90000);
  return {
    id: `TK-${id}`,
    customer: getRandomName(),
    type: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
    status: ["Open", "In Progress", "Resolved"][Math.floor(Math.random() * 3)],
    priority: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
    timeAgo: `${Math.floor(Math.random() * 60)} min ago`,
  };
};

// Component for feed items with animation
interface FeedItemProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
  colorClass: string;
}

const FeedItem = ({ icon, title, message, time, colorClass }: FeedItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 p-3 rounded-lg border border-${colorClass}-100/20 bg-white/90 shadow-sm hover:shadow-md transition-all duration-300 mb-3 backdrop-blur-sm`}
    >
      <div className={`h-10 w-10 rounded-full bg-${colorClass}-500/10 flex items-center justify-center text-${colorClass}-500 shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground mb-0.5">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{message}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">{time}</p>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState({
    resolved: 0,
    inProgress: 0,
    due: 0,
    new: 0,
  });

  const [chartData, setChartData] = useState(generateSmoothData(24));
  const [responseTimeData, setResponseTimeData] = useState(generateSmoothData(24, 25, 20));
  const [salesData, setSalesData] = useState({
    daily: generateSmoothData(24, 40, 60),
    weekly: generateSmoothData(7, 50, 70),
    monthly: generateSmoothData(30, 60, 80),
    yearly: generateSmoothData(12, 70, 90),
  });
  
  const [emailFeed, setEmailFeed] = useState<any[]>([]);
  const [socialFeed, setSocialFeed] = useState<any[]>([]);
  const [agentFeed, setAgentFeed] = useState<any[]>([]);
  const [customerFeed, setCustomerFeed] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [selectedSalesView, setSelectedSalesView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Initial data
      setTicketData({
        resolved: Math.floor(Math.random() * 100),
        inProgress: Math.floor(Math.random() * 50),
        due: Math.floor(Math.random() * 30),
        new: Math.floor(Math.random() * 20),
      });
      
      // Generate initial feeds
      updateAllFeeds();
      
      // Generate initial tickets
      const initialTickets = Array(5).fill(null).map(() => generateRandomTicket());
      setRecentTickets(initialTickets);
      
      // Generate top performers
      const initialPerformers = [
        { name: "Priya Sharma", tickets: 15, satisfaction: 98 },
        { name: "Amit Patel", tickets: 12, satisfaction: 96 },
        { name: "Neha Gupta", tickets: 10, satisfaction: 99 },
      ];
      setTopPerformers(initialPerformers);
      
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to update all feeds
  const updateAllFeeds = () => {
    // Email feed
    const newEmail = {
      sender: getRandomName(),
      subject: ["Question about my order", "Support needed", "Thank you for help", "Product inquiry"][Math.floor(Math.random() * 4)],
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setEmailFeed(prev => [newEmail, ...prev].slice(0, 5));
    
    // Social feed
    const platforms = ["Twitter", "Facebook", "Instagram", "LinkedIn"];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const newSocial = {
      user: getRandomName(),
      platform,
      message: [
        "Need assistance with the product",
        "Loving the new features!",
        "Having trouble logging in",
        "Can someone help me with setup?",
      ][Math.floor(Math.random() * 4)],
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setSocialFeed(prev => [newSocial, ...prev].slice(0, 5));
    
    // Agent feed
    const newAgent = {
      name: getRandomName(),
      action: ["resolved ticket", "started shift", "assigned to case", "completed training"][Math.floor(Math.random() * 4)],
      detail: `#${Math.floor(1000 + Math.random() * 9000)}`,
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setAgentFeed(prev => [newAgent, ...prev].slice(0, 5));
    
    // Customer feed
    const newCustomer = {
      name: getRandomName(),
      action: ["updated profile", "placed order", "submitted feedback", "registered account"][Math.floor(Math.random() * 4)],
      detail: `#${Math.floor(10000 + Math.random() * 90000)}`,
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setCustomerFeed(prev => [newCustomer, ...prev].slice(0, 5));
    
    // Activity feed
    const newActivity = {
      type: ["Ticket", "Order", "Review", "Inquiry"][Math.floor(Math.random() * 4)],
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      action: ["created", "updated", "resolved", "assigned"][Math.floor(Math.random() * 4)],
      by: getRandomName(),
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setActivityFeed(prev => [newActivity, ...prev].slice(0, 5));
  };

  // Simulate real-time updates
  useEffect(() => {
    if (isLoading) return;
    
    // Simulate real-time ticket updates
    const ticketInterval = setInterval(() => {
      setTicketData({
        resolved: Math.floor(Math.random() * 100),
        inProgress: Math.floor(Math.random() * 50),
        due: Math.floor(Math.random() * 30),
        new: Math.floor(Math.random() * 20),
      });
    }, 4000);
    
    // Simulate real-time chart data updates
    const chartInterval = setInterval(() => {
      setChartData(generateSmoothData(24));
      setResponseTimeData(generateSmoothData(24, 25, 20));
      
      // Update sales data
      setSalesData({
        daily: generateSmoothData(24, 40, 60),
        weekly: generateSmoothData(7, 50, 70),
        monthly: generateSmoothData(30, 60, 80),
        yearly: generateSmoothData(12, 70, 90),
      });
    }, 4000);
    
    // Simulate feed updates
    const feedInterval = setInterval(() => {
      updateAllFeeds();
      
      // Update recent tickets
      const newTicket = generateRandomTicket();
      setRecentTickets(prev => [newTicket, ...prev].slice(0, 5));
      
    }, 8000);
    
    return () => {
      clearInterval(ticketInterval);
      clearInterval(chartInterval);
      clearInterval(feedInterval);
    };
  }, [isLoading]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Add two new state variables for ocean wave analytics data
  const [oceanWaveData1, setOceanWaveData1] = useState(generateSmoothData(24, 35, 55));
  const [oceanWaveData2, setOceanWaveData2] = useState(generateSmoothData(24, 30, 45));
  const [isHoveringWave1, setIsHoveringWave1] = useState(false);
  const [isHoveringWave2, setIsHoveringWave2] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (isLoading) return;
    
    // Update ocean wave data every 4 seconds if not being hovered
    const oceanWaveInterval = setInterval(() => {
      if (!isHoveringWave1) {
        setOceanWaveData1(generateSmoothData(24, 35, 55));
      }
      if (!isHoveringWave2) {
        setOceanWaveData2(generateSmoothData(24, 30, 45));
      }
    }, 4000);
    
    return () => {
      clearInterval(ticketInterval);
      clearInterval(chartInterval);
      clearInterval(feedInterval);
      clearInterval(oceanWaveInterval);
    };
  }, [isLoading, isHoveringWave1, isHoveringWave2]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-violet-50/10">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1600px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground/90">Dashboard Overview</h1>
            <p className="text-muted-foreground">Real-time metrics and analytics</p>
          </motion.div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Top Row - Key Metrics */}
            <motion.div 
              className="col-span-12 lg:col-span-3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <AnalyticsCard
                title="Resolved Tickets"
                value={isLoading ? "..." : ticketData.resolved}
                icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                description="Last 24 hours"
                className="relative overflow-hidden border-green-100/50 bg-gradient-to-br from-white to-green-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{Math.min(100, Math.round(ticketData.resolved))}%</span>
                    </div>
                    <Progress value={Math.min(100, ticketData.resolved)} className="h-1.5 bg-green-100" />
                  </div>
                )}
              </AnalyticsCard>
            </motion.div>
            
            <motion.div 
              className="col-span-12 lg:col-span-3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <AnalyticsCard
                title="In Progress"
                value={isLoading ? "..." : ticketData.inProgress}
                icon={<Clock className="h-5 w-5 text-blue-500" />}
                description="Currently being handled"
                className="relative overflow-hidden border-blue-100/50 bg-gradient-to-br from-white to-blue-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Assigned</span>
                      <span className="font-medium">{Math.min(100, Math.round(ticketData.inProgress * 2))}%</span>
                    </div>
                    <Progress value={Math.min(100, ticketData.inProgress * 2)} className="h-1.5 bg-blue-100" />
                  </div>
                )}
              </AnalyticsCard>
            </motion.div>
            
            <motion.div 
              className="col-span-12 lg:col-span-3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <AnalyticsCard
                title="Due Today"
                value={isLoading ? "..." : ticketData.due}
                icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
                description="Requires attention"
                className="relative overflow-hidden border-amber-100/50 bg-gradient-to-br from-white to-amber-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Critical</span>
                      <span className="font-medium">{Math.round(ticketData.due / 3)}%</span>
                    </div>
                    <Progress value={Math.round(ticketData.due / 3)} className="h-1.5 bg-amber-100" />
                  </div>
                )}
              </AnalyticsCard>
            </motion.div>
            
            <motion.div 
              className="col-span-12 lg:col-span-3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <AnalyticsCard
                title="New Tickets"
                value={isLoading ? "..." : ticketData.new}
                icon={<Ticket className="h-5 w-5 text-purple-500" />}
                description="Awaiting assignment"
                className="relative overflow-hidden border-purple-100/50 bg-gradient-to-br from-white to-purple-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Unassigned</span>
                      <span className="font-medium">{Math.round(100 - (ticketData.new * 2))}%</span>
                    </div>
                    <Progress value={Math.round(100 - (ticketData.new * 2))} className="h-1.5 bg-purple-100" />
                  </div>
                )}
              </AnalyticsCard>
            </motion.div>
            
            {/* Middle Row - Charts */}
            <motion.div 
              className="col-span-12 lg:col-span-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card hover-scale overflow-hidden border border-indigo-200/20 bg-white/90 h-[350px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                    <span>Total Sales</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setSelectedSalesView(view)}
                        className={`px-3 py-1 text-xs rounded-full transition-all ${
                          selectedSalesView === view
                            ? 'bg-indigo-500 text-white shadow-md'
                            : 'bg-transparent text-muted-foreground hover:bg-indigo-100'
                        }`}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px]">
                    {isLoading ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
                      </div>
                    ) : (
                      <ChartContainer config={{
                        sales: { label: "Sales", theme: { light: "#8875FF", dark: "#8875FF" } },
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={salesData[selectedSalesView]}>
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8875FF" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#8875FF" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="name" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10 }}
                            />
                            <ChartTooltip
                              content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              name="sales"
                              stroke="#8875FF"
                              strokeWidth={2}
                              fill="url(#colorSales)"
                              dot={false}
                              activeDot={{ r: 5 }}
                              className="ocean-wave"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Recent Tickets */}
            <motion.div 
              className="col-span-12 lg:col-span-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-card hover-scale overflow-hidden border border-violet-200/20 bg-white/90 h-[350px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-violet-500" />
                    <span>Recent Tickets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[270px] custom-scrollbar">
                  {isLoading ? (
                    Array(4).fill(null).map((_, i) => (
                      <div key={i} className="mb-3 animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))
                  ) : (
                    recentTickets.map((ticket, i) => (
                      <motion.div 
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="mb-3 p-3 bg-violet-50/50 rounded-lg border border-violet-100/20 hover:bg-violet-50/80 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{ticket.id}</p>
                            <p className="text-xs text-muted-foreground">{ticket.customer}</p>
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full font-medium 
                            ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                              ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'}`}>
                            {ticket.status}
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>{ticket.type}</span>
                          <span>{ticket.timeAgo}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Bottom Row - Activity Feeds */}
            <motion.div 
              className="col-span-12 lg:col-span-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-blue-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span>Email Notifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-auto max-h-[220px] custom-scrollbar">
                    {isLoading ? (
                      Array(3).fill(null).map((_, i) => (
                        <div key={i} className="mb-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))
                    ) : (
                      emailFeed.map((email, i) => (
                        <FeedItem 
                          key={i}
                          icon={<Mail className="h-4 w-4" />}
                          title={email.sender}
                          message={email.subject}
                          time={email.time}
                          colorClass="blue"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
                
                {/* Social Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-rose-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-rose-500" />
                      <span>Social Media Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-auto max-h-[220px] custom-scrollbar">
                    {isLoading ? (
                      Array(3).fill(null).map((_, i) => (
                        <div key={i} className="mb-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))
                    ) : (
                      socialFeed.map((social, i) => (
                        <FeedItem 
                          key={i}
                          icon={<MessageSquare className="h-4 w-4" />}
                          title={`${social.user} on ${social.platform}`}
                          message={social.message}
                          time={social.time}
                          colorClass="rose"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Agent Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-amber-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-500" />
                      <span>Agent Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-auto max-h-[220px] custom-scrollbar">
                    {isLoading ? (
                      Array(3).fill(null).map((_, i) => (
                        <div key={i} className="mb-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))
                    ) : (
                      agentFeed.map((agent, i) => (
                        <FeedItem 
                          key={i}
                          icon={<Users className="h-4 w-4" />}
                          title={agent.name}
                          message={`${agent.action} ${agent.detail}`}
                          time={agent.time}
                          colorClass="amber"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
                
                {/* Customer Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-green-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <User className="h-4 w-4 text-green-500" />
                      <span>Customer Updates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-auto max-h-[220px] custom-scrollbar">
                    {isLoading ? (
                      Array(3).fill(null).map((_, i) => (
                        <div key={i} className="mb-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))
                    ) : (
                      customerFeed.map((customer, i) => (
                        <FeedItem 
                          key={i}
                          icon={<User className="h-4 w-4" />}
                          title={customer.name}
                          message={`${customer.action} ${customer.detail}`}
                          time={customer.time}
                          colorClass="green"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            {/* Response Time + Top Performers */}
            <motion.div 
              className="col-span-12 lg:col-span-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <div className="space-y-6">
                {/* Response Time Chart */}
                <Card className="glass-card hover-scale overflow-hidden border border-teal-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-teal-500" />
                      <span>Response Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
                        </div>
                      ) : (
                        <ChartContainer config={{
                          response: { label: "Minutes", theme: { light: "#14b8a6", dark: "#14b8a6" } },
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={responseTimeData}>
                              <defs>
                                <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.5}/>
                                  <stop offset="95%" stopColor="#14b8a6
