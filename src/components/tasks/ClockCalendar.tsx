
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Sparkles,
  Star, 
  Gift,
  PartyPopper,
  Snowflake 
} from "lucide-react";

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

// Holiday data
const HOLIDAYS = [
  { date: new Date(new Date().getFullYear(), 0, 1), name: "New Year's Day", icon: <PartyPopper className="h-4 w-4 text-yellow-400" /> },
  { date: new Date(new Date().getFullYear(), 1, 14), name: "Valentine's Day", icon: <Gift className="h-4 w-4 text-red-400" /> },
  { date: new Date(new Date().getFullYear(), 7, 15), name: "Independence Day", icon: <Star className="h-4 w-4 text-orange-400" /> },
  { date: new Date(new Date().getFullYear(), 9, 24), name: "Diwali", icon: <Sparkles className="h-4 w-4 text-yellow-400" /> },
  { date: new Date(new Date().getFullYear(), 11, 25), name: "Christmas", icon: <Snowflake className="h-4 w-4 text-blue-400" /> },
];

export const ClockCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("");
  const [activeHoliday, setActiveHoliday] = useState<{name: string, icon: JSX.Element} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulated loading
    setIsLoading(true);
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

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

    // Check for holiday on current selected date
    const checkHoliday = () => {
      const holiday = HOLIDAYS.find(h => 
        h.date.getDate() === date.getDate() && 
        h.date.getMonth() === date.getMonth()
      );
      
      if (holiday) {
        setActiveHoliday({ name: holiday.name, icon: holiday.icon });
        toast.success(`${holiday.name} is coming up!`, {
          icon: holiday.icon,
        });
      } else {
        setActiveHoliday(null);
      }
    };

    checkHoliday();

    return () => {
      clearInterval(interval);
      clearInterval(reminderInterval);
      clearTimeout(loadingTimer);
    };
  }, [date]);

  // Function to add a holiday class to the selected date
  const isHoliday = (day: Date) => {
    return HOLIDAYS.some(h => 
      h.date.getDate() === day.getDate() && 
      h.date.getMonth() === day.getMonth()
    );
  };

  return (
    <Card className={`glass-card hover-scale ${activeHoliday ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-purple-200/50' : ''}`}>
      <CardHeader className={activeHoliday ? 'border-b border-purple-200/50' : ''}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className={`h-5 w-5 ${activeHoliday ? 'text-purple-500' : ''}`} />
            <span>{activeHoliday ? (
              <div className="flex items-center gap-2">
                {activeHoliday.icon}
                <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  {activeHoliday.name}
                </span>
              </div>
            ) : "Clock & Calendar"}</span>
          </div>
          <span className={`text-lg font-mono ${activeHoliday ? 'text-purple-600' : ''}`}>{time} IST</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 flex-col space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-sm">Loading calendar...</p>
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => setDate(newDate || new Date())}
            className="rounded-md border"
            modifiers={{
              holiday: (date) => isHoliday(date)
            }}
            modifiersClassNames={{
              holiday: "holiday-date bg-red-100 text-red-600 font-semibold"
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};
