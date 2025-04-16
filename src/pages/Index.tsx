
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
  Calendar,
  FileText,
  ClipboardCheck,
  GitPullRequestDraft,
  GitMerge,
  Milestone
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

// Professional names for simulation
const professionalNames = [
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

// Generate random professional name
const getRandomName = () => {
  return professionalNames[Math.floor(Math.random() * professionalNames.length)];
};

// This generates a smooth wave-like data for the charts 
const generateSmoothData = (points: number, amplitude = 30, offset = 50) => {
  return Array.from({ length: points }).map((_, i) => ({
    name: `${i}h`,
    value: Math.sin(i / 5) * amplitude + offset + (Math.random() * 10 - 5),
  }));
};

// Project types for simulation
const projectTypes = ["Feature Development", "Bug Fix", "UI Update", "Infrastructure", "Product Launch"];

// Generate random project
const generateRandomProject = () => {
  const id = Math.floor(10000 + Math.random() * 90000);
  return {
    id: `PR-${id}`,
    manager: getRandomName(),
    type: projectTypes[Math.floor(Math.random() * projectTypes.length)],
    status: ["Planning", "In Progress", "Review", "Completed"][Math.floor(Math.random() * 4)],
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
  const [projectData, setProjectData] = useState({
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    new: 0,
  });

  const [chartData, setChartData] = useState(generateSmoothData(24));
  const [deliveryTimeData, setDeliveryTimeData] = useState(generateSmoothData(24, 25, 20));
  const [salesData, setSalesData] = useState({
    daily: generateSmoothData(24, 40, 60),
    weekly: generateSmoothData(7, 50, 70),
    monthly: generateSmoothData(30, 60, 80),
    yearly: generateSmoothData(12, 70, 90),
  });
  
  const [taskFeed, setTaskFeed] = useState<any[]>([]);
  const [updateFeed, setUpdateFeed] = useState<any[]>([]);
  const [teamFeed, setTeamFeed] = useState<any[]>([]);
  const [milestoneFeed, setMilestoneFeed] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [selectedSalesView, setSelectedSalesView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Initial data
      setProjectData({
        completed: Math.floor(Math.random() * 100),
        inProgress: Math.floor(Math.random() * 50),
        upcoming: Math.floor(Math.random() * 30),
        new: Math.floor(Math.random() * 20),
      });
      
      // Generate initial feeds
      updateAllFeeds();
      
      // Generate initial projects
      const initialProjects = Array(5).fill(null).map(() => generateRandomProject());
      setRecentProjects(initialProjects);
      
      // Generate top performers
      const initialPerformers = [
        { name: "Priya Sharma", projects: 15, ontime: 98 },
        { name: "Amit Patel", projects: 12, ontime: 96 },
        { name: "Neha Gupta", projects: 10, ontime: 99 },
      ];
      setTopPerformers(initialPerformers);
      
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to update all feeds
  const updateAllFeeds = () => {
    // Task feed
    const newTask = {
      assignee: getRandomName(),
      title: ["Update project dashboard", "Create new milestone", "Fix critical bug", "Update documentation"][Math.floor(Math.random() * 4)],
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setTaskFeed(prev => [newTask, ...prev].slice(0, 5));
    
    // Update feed
    const projects = ["Website Redesign", "Mobile App", "CRM Integration", "Cloud Migration"];
    const project = projects[Math.floor(Math.random() * projects.length)];
    const newUpdate = {
      user: getRandomName(),
      project,
      message: [
        "added a new comment",
        "updated the timeline",
        "created a milestone",
        "shared project assets",
      ][Math.floor(Math.random() * 4)],
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setUpdateFeed(prev => [newUpdate, ...prev].slice(0, 5));
    
    // Team feed
    const newTeam = {
      name: getRandomName(),
      action: ["completed task", "started shift", "assigned to project", "completed training"][Math.floor(Math.random() * 4)],
      detail: `#${Math.floor(1000 + Math.random() * 9000)}`,
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setTeamFeed(prev => [newTeam, ...prev].slice(0, 5));
    
    // Milestone feed
    const newMilestone = {
      name: ["Phase 1 Complete", "Beta Launch", "Design Approval", "User Testing"][Math.floor(Math.random() * 4)],
      project: projects[Math.floor(Math.random() * projects.length)],
      completionPercent: Math.floor(Math.random() * 100),
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setMilestoneFeed(prev => [newMilestone, ...prev].slice(0, 5));
    
    // Activity feed
    const newActivity = {
      type: ["Project", "Task", "Review", "Meeting"][Math.floor(Math.random() * 4)],
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      action: ["created", "updated", "completed", "assigned"][Math.floor(Math.random() * 4)],
      by: getRandomName(),
      time: `${Math.floor(Math.random() * 60)} min ago`
    };
    setActivityFeed(prev => [newActivity, ...prev].slice(0, 5));
  };

  // Simulate real-time updates
  useEffect(() => {
    if (isLoading) return;
    
    // Simulate real-time project updates
    const projectInterval = setInterval(() => {
      setProjectData({
        completed: Math.floor(Math.random() * 100),
        inProgress: Math.floor(Math.random() * 50),
        upcoming: Math.floor(Math.random() * 30),
        new: Math.floor(Math.random() * 20),
      });
    }, 4000);
    
    // Simulate real-time chart data updates
    const chartInterval = setInterval(() => {
      setChartData(generateSmoothData(24));
      setDeliveryTimeData(generateSmoothData(24, 25, 20));
      
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
      
      // Update recent projects
      const newProject = generateRandomProject();
      setRecentProjects(prev => [newProject, ...prev].slice(0, 5));
      
    }, 8000);
    
    return () => {
      clearInterval(projectInterval);
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
  const [oceanWaveData3, setOceanWaveData3] = useState(generateSmoothData(24, 25, 65));
  const [isHoveringWave1, setIsHoveringWave1] = useState(false);
  const [isHoveringWave2, setIsHoveringWave2] = useState(false);
  const [isHoveringWave3, setIsHoveringWave3] = useState(false);

  // Simulate real-time updates for ocean wave charts
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
      if (!isHoveringWave3) {
        setOceanWaveData3(generateSmoothData(24, 25, 65));
      }
    }, 4000);
    
    return () => {
      clearInterval(oceanWaveInterval);
    };
  }, [isLoading, isHoveringWave1, isHoveringWave2, isHoveringWave3]);

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
            <h1 className="text-3xl font-bold text-foreground/90">Project Dashboard</h1>
            <p className="text-muted-foreground">Real-time metrics and project analytics</p>
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
                title="Completed Projects"
                value={isLoading ? "..." : projectData.completed}
                icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                description="Last 30 days"
                className="relative overflow-hidden border-green-100/50 bg-gradient-to-br from-white to-green-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{Math.min(100, Math.round(projectData.completed))}%</span>
                    </div>
                    <Progress value={Math.min(100, projectData.completed)} className="h-1.5 bg-green-100" />
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
                title="Active Projects"
                value={isLoading ? "..." : projectData.inProgress}
                icon={<Clock className="h-5 w-5 text-blue-500" />}
                description="Currently being managed"
                className="relative overflow-hidden border-blue-100/50 bg-gradient-to-br from-white to-blue-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Assigned</span>
                      <span className="font-medium">{Math.min(100, Math.round(projectData.inProgress * 2))}%</span>
                    </div>
                    <Progress value={Math.min(100, projectData.inProgress * 2)} className="h-1.5 bg-blue-100" />
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
                title="Upcoming Deadlines"
                value={isLoading ? "..." : projectData.upcoming}
                icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
                description="Next 7 days"
                className="relative overflow-hidden border-amber-100/50 bg-gradient-to-br from-white to-amber-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Critical</span>
                      <span className="font-medium">{Math.round(projectData.upcoming / 3)}%</span>
                    </div>
                    <Progress value={Math.round(projectData.upcoming / 3)} className="h-1.5 bg-amber-100" />
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
                title="New Projects"
                value={isLoading ? "..." : projectData.new}
                icon={<FileText className="h-5 w-5 text-purple-500" />}
                description="Awaiting kickoff"
                className="relative overflow-hidden border-purple-100/50 bg-gradient-to-br from-white to-purple-50/60"
              >
                {!isLoading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Unassigned</span>
                      <span className="font-medium">{Math.round(100 - (projectData.new * 2))}%</span>
                    </div>
                    <Progress value={Math.round(100 - (projectData.new * 2))} className="h-1.5 bg-purple-100" />
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
                    <span>Project Budget Utilization</span>
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
                        budget: { label: "Budget", theme: { light: "#8875FF", dark: "#8875FF" } },
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
                              name="budget"
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
            
            {/* Recent Projects */}
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
                    <FileText className="h-5 w-5 text-violet-500" />
                    <span>Recent Projects</span>
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
                    recentProjects.map((project, i) => (
                      <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="mb-3 p-3 bg-violet-50/50 rounded-lg border border-violet-100/20 hover:bg-violet-50/80 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{project.id}</p>
                            <p className="text-xs text-muted-foreground">{project.manager}</p>
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full font-medium 
                            ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                              project.status === 'Review' ? 'bg-amber-100 text-amber-700' : 
                              'bg-purple-100 text-purple-700'}`}>
                            {project.status}
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>{project.type}</span>
                          <span>{project.timeAgo}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Ocean Wave Analytics */}
            <motion.div 
              className="col-span-12 lg:col-span-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              <Card 
                className="glass-card hover-scale overflow-hidden border border-blue-200/20 bg-white/90 h-[250px]"
                onMouseEnter={() => setIsHoveringWave1(true)}
                onMouseLeave={() => setIsHoveringWave1(false)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-blue-500" />
                    <span>Project Completion Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[170px]">
                    {isLoading ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
                      </div>
                    ) : (
                      <ChartContainer config={{
                        completion: { label: "Completion Rate", theme: { light: "#3b82f6", dark: "#3b82f6" } },
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={oceanWaveData1}>
                            <defs>
                              <linearGradient id="colorWave1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                              name="completion"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              fill="url(#colorWave1)"
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
            
            <motion.div 
              className="col-span-12 lg:col-span-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <Card 
                className="glass-card hover-scale overflow-hidden border border-emerald-200/20 bg-white/90 h-[250px]"
                onMouseEnter={() => setIsHoveringWave2(true)}
                onMouseLeave={() => setIsHoveringWave2(false)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>Team Velocity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[170px]">
                    {isLoading ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
                      </div>
                    ) : (
                      <ChartContainer config={{
                        velocity: { label: "Points/Sprint", theme: { light: "#10b981", dark: "#10b981" } },
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={oceanWaveData2}>
                            <defs>
                              <linearGradient id="colorWave2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                              name="velocity"
                              stroke="#10b981"
                              strokeWidth={2}
                              fill="url(#colorWave2)"
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
            
            <motion.div 
              className="col-span-12 lg:col-span-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.9 }}
            >
              <Card 
                className="glass-card hover-scale overflow-hidden border border-purple-200/20 bg-white/90 h-[250px]"
                onMouseEnter={() => setIsHoveringWave3(true)}
                onMouseLeave={() => setIsHoveringWave3(false)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span>Resource Utilization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[170px]">
                    {isLoading ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
                      </div>
                    ) : (
                      <ChartContainer config={{
                        utilization: { label: "Utilization %", theme: { light: "#8b5cf6", dark: "#8b5cf6" } },
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={oceanWaveData3}>
                            <defs>
                              <linearGradient id="colorWave3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                              name="utilization"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              fill="url(#colorWave3)"
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
            
            {/* Bottom Row - Activity Feeds */}
            <motion.div 
              className="col-span-12 lg:col-span-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-blue-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-blue-500" />
                      <span>Recent Tasks</span>
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
                      taskFeed.map((task, i) => (
                        <FeedItem 
                          key={i}
                          icon={<ClipboardCheck className="h-4 w-4" />}
                          title={task.assignee}
                          message={task.title}
                          time={task.time}
                          colorClass="blue"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
                
                {/* Update Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-rose-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-rose-500" />
                      <span>Project Updates</span>
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
                      updateFeed.map((update, i) => (
                        <FeedItem 
                          key={i}
                          icon={<MessageSquare className="h-4 w-4" />}
                          title={`${update.user} on ${update.project}`}
                          message={update.message}
                          time={update.time}
                          colorClass="rose"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Team Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-amber-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-500" />
                      <span>Team Activities</span>
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
                      teamFeed.map((team, i) => (
                        <FeedItem 
                          key={i}
                          icon={<Users className="h-4 w-4" />}
                          title={team.name}
                          message={`${team.action} ${team.detail}`}
                          time={team.time}
                          colorClass="amber"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
                
                {/* Milestone Feed */}
                <Card className="glass-card hover-scale overflow-hidden border border-green-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <Milestone className="h-4 w-4 text-green-500" />
                      <span>Milestone Updates</span>
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
                      milestoneFeed.map((milestone, i) => (
                        <FeedItem 
                          key={i}
                          icon={<Milestone className="h-4 w-4" />}
                          title={milestone.name}
                          message={`${milestone.project}: ${milestone.completionPercent}% complete`}
                          time={milestone.time}
                          colorClass="green"
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            {/* Delivery Time + Top Performers */}
            <motion.div 
              className="col-span-12 lg:col-span-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.1 }}
            >
              <div className="space-y-6">
                {/* Delivery Time Chart */}
                <Card className="glass-card hover-scale overflow-hidden border border-teal-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-teal-500" />
                      <span>Project Delivery Time</span>
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
                          delivery: { label: "Days", theme: { light: "#14b8a6", dark: "#14b8a6" } },
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={deliveryTimeData}>
                              <defs>
                                <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.5}/>
                                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
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
                                name="delivery"
                                stroke="#14b8a6"
                                strokeWidth={2}
                                fill="url(#colorResponse)"
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
                
                {/* Top Performers */}
                <Card className="glass-card hover-scale overflow-hidden border border-amber-200/20 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Top Project Managers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      Array(3).fill(null).map((_, i) => (
                        <div key={i} className="mb-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))
                    ) : (
                      topPerformers.map((performer, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center justify-between mb-4 last:mb-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                              {i + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{performer.name}</p>
                              <p className="text-xs text-muted-foreground">{performer.projects} projects</p>
                            </div>
                          </div>
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {performer.ontime}% On-time
                          </div>
                        </motion.div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
