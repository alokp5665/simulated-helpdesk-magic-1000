
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailMetrics } from "./types";
import { Clock, Mail, CheckCircle } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { motion } from "framer-motion";

interface EmailMetricsProps {
  metrics: EmailMetrics;
}

const EmailMetricsComponent: React.FC<EmailMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-white border-purple-100/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-purple-700">
              <Mail className="mr-2 h-5 w-5 text-purple-500" />
              Total Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {metrics.totalReceived}
            </div>
            <p className="text-sm text-purple-600 mt-1">All incoming communications</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-white border-green-100/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {metrics.resolved}
            </div>
            <p className="text-sm text-green-600 mt-1">
              {metrics.totalReceived > 0 
                ? `${((metrics.resolved / metrics.totalReceived) * 100).toFixed(1)}% completion rate`
                : 'No emails received yet'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-white border-blue-100/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-blue-700">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Avg. Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              {metrics.averageResponseTime.toFixed(0)} min
            </div>
            <p className="text-sm text-blue-600 mt-1">Average time to resolve emails</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="col-span-1 md:col-span-3"
      >
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-white border-purple-100/40">
          <CardHeader>
            <CardTitle>Email Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.dailyEmails}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "rgba(255, 255, 255, 0.95)", 
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }} 
                  />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailMetricsComponent;
