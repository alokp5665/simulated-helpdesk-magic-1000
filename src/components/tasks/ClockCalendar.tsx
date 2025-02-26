
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

const REMINDERS = [
  "Team meeting at 2 PM",
  "Submit progress reports",
  "Parent-teacher conference",
  "Curriculum review session",
  "Staff development workshop",
  "Student counseling session",
  "Department meeting",
  "Grade submission deadline"
];

export const ClockCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Update clock every second
    const interval = setInterval(() => {
      const now = new Date();
      // Format time in IST
      const istTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      });
      setTime(istTime);
    }, 1000);

    // Simulate random reminders
    const reminderInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const reminder = REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
        toast("Reminder", {
          description: reminder,
          icon: <CalendarIcon className="h-4 w-4" />,
        });
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(reminderInterval);
    };
  }, []);

  return (
    <Card className="glass-card hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Clock & Calendar</span>
          </div>
          <span className="text-lg font-mono">{time} IST</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate || new Date())}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};
