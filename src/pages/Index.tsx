
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Toaster } from "@/components/ui/toaster";

const generateRandomData = (points: number) => {
  return Array.from({ length: points }).map((_, i) => ({
    name: `${i}h`,
    value: Math.floor(Math.random() * 100),
  }));
};

const Index = () => {
  const [ticketData, setTicketData] = useState({
    resolved: 0,
    inProgress: 0,
    due: 0,
    new: 0,
  });

  const [chartData, setChartData] = useState(generateRandomData(24));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.querySelector('.page-loader')?.classList.add('loader-hidden');
    }, 1000);

    // Simulate real-time ticket updates
    const interval = setInterval(() => {
      setTicketData({
        resolved: Math.floor(Math.random() * 100),
        inProgress: Math.floor(Math.random() * 50),
        due: Math.floor(Math.random() * 30),
        new: Math.floor(Math.random() * 20),
      });
    }, 4000);

    // Simulate real-time chart data updates
    const chartInterval = setInterval(() => {
      setChartData(generateRandomData(24));
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      clearInterval(chartInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Page loader */}
      <div className="page-loader">
        <div className="loader-circle"></div>
      </div>

      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 rounded-lg hover-scale">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Tickets</p>
                  <h3 className="text-2xl font-bold mt-1">{ticketData.resolved}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                </div>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg hover-scale">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <h3 className="text-2xl font-bold mt-1">{ticketData.inProgress}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Currently being handled</p>
                </div>
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg hover-scale">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Due Today</p>
                  <h3 className="text-2xl font-bold mt-1">{ticketData.due}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                </div>
                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg hover-scale">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Tickets</p>
                  <h3 className="text-2xl font-bold mt-1">{ticketData.new}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
                </div>
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <Ticket className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-6 hover-scale">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Student Query Volume (24h)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      className="ocean-wave"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6 hover-scale">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Response Time
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateRandomData(24)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      className="ocean-wave"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
