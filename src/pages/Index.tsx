
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
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const generateRandomData = (points: number) => {
  return Array.from({ length: points }).map((_, i) => ({
    name: `${i}h`,
    value: Math.floor(Math.random() * 100),
  }));
};

const Index = () => {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState({
    resolved: 0,
    inProgress: 0,
    due: 0,
    new: 0,
  });

  const [chartData, setChartData] = useState(generateRandomData(24));

  useEffect(() => {
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
      clearInterval(interval);
      clearInterval(chartInterval);
    };
  }, []);

  const goToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AnalyticsCard
              title="Resolved Tickets"
              value={ticketData.resolved}
              icon={<CheckCircle className="h-4 w-4 text-green-500" />}
              description="Last 24 hours"
            />
            <AnalyticsCard
              title="In Progress"
              value={ticketData.inProgress}
              icon={<Clock className="h-4 w-4 text-blue-500" />}
              description="Currently being handled"
            />
            <AnalyticsCard
              title="Due Today"
              value={ticketData.due}
              icon={<AlertCircle className="h-4 w-4 text-yellow-500" />}
              description="Requires attention"
            />
            <AnalyticsCard
              title="New Tickets"
              value={ticketData.new}
              icon={<Ticket className="h-4 w-4 text-purple-500" />}
              description="Awaiting assignment"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-6 hover-scale">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Ticket Volume (24h)
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
    </div>
  );
};

export default Index;
