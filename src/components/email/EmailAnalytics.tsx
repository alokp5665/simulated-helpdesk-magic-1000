
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Heart, MessageSquare, Clock, BellRing, CheckCircle2 } from "lucide-react";
import { ScheduledEmail } from "./EmailTypes";

interface EmailAnalyticsProps {
  sentimentStats: { positive: number; neutral: number; negative: number };
  queueCount: number;
  scheduledEmails: ScheduledEmail[];
  showAnalytics: boolean;
  setShowAnalytics: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmailAnalytics = ({
  sentimentStats,
  queueCount,
  scheduledEmails,
  showAnalytics,
  setShowAnalytics,
}: EmailAnalyticsProps) => {
  const totalSentiments = sentimentStats.positive + sentimentStats.neutral + sentimentStats.negative;
  
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Email Analytics</CardTitle>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showAnalytics ? "Hide Details" : "Show Details"}
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {queueCount > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md flex items-center animate-pulse">
              <BellRing className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm text-amber-800 dark:text-amber-300">
                {queueCount} email{queueCount > 1 ? 's' : ''} queued for processing
              </span>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <Heart className="h-4 w-4 text-green-500 mr-1" />
                Positive
              </span>
              <span className="font-medium">{sentimentStats.positive}</span>
            </div>
            <Progress value={totalSentiments > 0 ? (sentimentStats.positive / totalSentiments) * 100 : 0} className="h-2 bg-gray-100 dark:bg-gray-700" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                Neutral
              </span>
              <span className="font-medium">{sentimentStats.neutral}</span>
            </div>
            <Progress value={totalSentiments > 0 ? (sentimentStats.neutral / totalSentiments) * 100 : 0} className="h-2 bg-gray-100 dark:bg-gray-700" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 text-red-500 mr-1" />
                Negative
              </span>
              <span className="font-medium">{sentimentStats.negative}</span>
            </div>
            <Progress value={totalSentiments > 0 ? (sentimentStats.negative / totalSentiments) * 100 : 0} className="h-2 bg-gray-100 dark:bg-gray-700" />
          </div>
          
          {showAnalytics && scheduledEmails.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 mr-1" />
                Scheduled Emails
              </h4>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>To</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Scheduled For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledEmails.map((email, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium truncate max-w-[100px]">
                          {email.to}
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]">
                          {email.subject}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {email.date.toLocaleString()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
