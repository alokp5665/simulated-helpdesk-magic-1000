
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
  Snowflake,
  Sun,
  Music,
  Flame
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

// Holiday data - expanded with Indian festivals and international holidays
const HOLIDAYS = [
  { date: new Date(new Date().getFullYear(), 0, 1), name: "New Year's Day", icon: <PartyPopper className="h-4 w-4 text-yellow-400" /> },
  { date: new Date(new Date().getFullYear(), 0, 14), name: "Makar Sankranti", icon: <Sun className="h-4 w-4 text-orange-400" /> },
  { date: new Date(new Date().getFullYear(), 0, 26), name: "Republic Day", icon: <Star className="h-4 w-4 text-orange-400" /> },
  { date: new Date(new Date().getFullYear(), 1, 14), name: "Valentine's Day", icon: <Gift className="h-4 w-4 text-red-400" /> },
  { date: new Date(new Date().getFullYear(), 2, 7), name: "Holi", icon: <Flame className="h-4 w-4 text-purple-400" /> },
  { date: new Date(new Date().getFullYear(), 2, 25), name: "Ugadi", icon: <Sun className="h-4 w-4 text-yellow-400" /> },
  { date: new Date(new Date().getFullYear(), 3, 14), name: "Baisakhi", icon: <Music className="h-4 w-4 text-green-400" /> },
  { date: new Date(new Date().getFullYear(), 4, 3), name: "Eid al-Fitr", icon: <Star className="h-4 w-4 text-green-400" /> },
  { date: new Date(new Date().getFullYear(), 7, 15), name: "Independence Day", icon: <Star className="h-4 w-4 text-orange-400" /> },
  { date: new Date(new Date().getFullYear(), 7, 19), name: "Janmashtami", icon: <Sparkles className="h-4 w-4 text-blue-400" /> },
  { date: new Date(new Date().getFullYear(), 8, 5), name: "Teachers' Day", icon: <Gift className="h-4 w-4 text-indigo-400" /> },
  { date: new Date(new Date().getFullYear(), 9, 2), name: "Gandhi Jayanti", icon: <Star className="h-4 w-4 text-orange-400" /> },
  { date: new Date(new Date().getFullYear(), 9, 12), name: "Dussehra", icon: <Flame className="h-4 w-4 text-red-400" /> },
  { date: new Date(new Date().getFullYear(), 9, 24), name: "Diwali", icon: <Sparkles className="h-4 w-4 text-yellow-400" /> },
  { date: new Date(new Date().getFullYear(), 10, 4), name: "Guru Nanak Jayanti", icon: <Star className="h-4 w-4 text-orange-400" /> },
  { date: new Date(new Date().getFullYear(), 11, 25), name: "Christmas", icon: <Snowflake className="h-4 w-4 text-blue-400" /> },
  { date: new Date(new Date().getFullYear(), 11, 31), name: "New Year's Eve", icon: <PartyPopper className="h-4 w-4 text-purple-400" /> },
  
  // Add events for the current month to make them more visible
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), name: "Team Building Event", icon: <Star className="h-4 w-4 text-green-400" /> },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5), name: "Annual Meeting", icon: <PartyPopper className="h-4 w-4 text-blue-400" /> },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8), name: "Staff Appreciation Day", icon: <Gift className="h-4 w-4 text-purple-400" /> },
];

export const ClockCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("");
  const [activeHoliday, setActiveHoliday] = useState<{name: string, icon: JSX.Element} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // No loading delay
    setIsLoading(false);

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

    // Simulate random reminders, but less frequently
    const reminderInterval = setInterval(() => {
      if (Math.random() > 0.9) { // Reduced frequency
        const reminder = REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
        toast("Reminder", {
          description: reminder,
          icon: <CalendarIcon className="h-4 w-4" />,
        });
      }
    }, 15000); // Increased interval to 15 seconds

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
        
        {/* Display upcoming events for the next 7 days */}
        <div className="mt-4 text-sm">
          <h4 className="font-medium mb-2">Upcoming Events</h4>
          <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
            {HOLIDAYS
              .filter(h => {
                const now = new Date();
                const daysDiff = Math.floor((h.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return daysDiff >= 0 && daysDiff <= 30;
              })
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((holiday, idx) => (
                <div key={idx} className="flex items-center space-x-2 pb-1 border-b border-gray-100 last:border-0">
                  {holiday.icon}
                  <span className="flex-1">{holiday.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {holiday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
