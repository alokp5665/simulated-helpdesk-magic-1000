import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Flame,
  PlusCircle,
  Clock3,
  AlertTriangle
} from "lucide-react";

interface ScheduledTask {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  date: Date;
  assignee?: string;
}

interface ClockCalendarProps {
  onTaskScheduled?: (task: any) => void;
}

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

// Missed deadlines data
const MISSED_DEADLINES = [
  {
    task: "Update customer feedback database",
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 4),
    assignee: "Alex Chen",
    priority: "medium"
  },
  {
    task: "Send marketing campaign report",
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2),
    assignee: "Sarah Johnson",
    priority: "high"
  },
  {
    task: "Client presentation preparation",
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    assignee: "Miguel Rodriguez",
    priority: "high"
  }
];

// Rescheduled tasks data
const RESCHEDULED_TASKS = [
  {
    task: "Team training session",
    originalDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
    newDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3),
    rescheduledBy: "Priya Patel"
  },
  {
    task: "Product review meeting",
    originalDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 3),
    newDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
    rescheduledBy: "Jordan Taylor"
  }
];

export const ClockCalendar = ({ onTaskScheduled }: ClockCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("");
  const [activeHoliday, setActiveHoliday] = useState<{name: string, icon: JSX.Element} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    assignee: "Unassigned"
  });
  const [showDeadlinesOverview, setShowDeadlinesOverview] = useState(true);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);

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

  // Function to check if a date has scheduled tasks
  const hasScheduledTasks = (day: Date) => {
    return scheduledTasks.some(task => 
      task.date.getDate() === day.getDate() && 
      task.date.getMonth() === day.getMonth() &&
      task.date.getFullYear() === day.getFullYear()
    );
  };

  // Function to add a holiday class to the selected date
  const isHoliday = (day: Date) => {
    return HOLIDAYS.some(h => 
      h.date.getDate() === day.getDate() && 
      h.date.getMonth() === day.getMonth()
    );
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setTaskDialogOpen(true);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    
    const scheduledTask: ScheduledTask = {
      id: Date.now().toString(),
      title: newTask.title,
      priority: newTask.priority as "low" | "medium" | "high",
      date: new Date(date),
      assignee: newTask.assignee !== "Unassigned" ? newTask.assignee : undefined
    };
    
    setScheduledTasks(prev => [...prev, scheduledTask]);
    
    // Notify parent component about the scheduled task
    if (onTaskScheduled) {
      onTaskScheduled({
        title: newTask.title,
        priority: newTask.priority,
        deadline: date.toLocaleDateString(),
        assignee: newTask.assignee !== "Unassigned" ? newTask.assignee : undefined
      });
    }
    
    toast.success("Task scheduled successfully", {
      description: `"${newTask.title}" scheduled for ${date.toLocaleDateString()}`,
      icon: <CalendarIcon className="h-4 w-4" />,
    });
    
    setTaskDialogOpen(false);
    setNewTask({
      title: "",
      priority: "medium",
      assignee: "Unassigned"
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
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
          <>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Select a date to schedule a task</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center p-1 h-auto"
                onClick={() => setShowDeadlinesOverview(!showDeadlinesOverview)}
              >
                {showDeadlinesOverview ? "Hide" : "Show"} Deadlines Overview
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                holiday: (date) => isHoliday(date),
                scheduled: (date) => hasScheduledTasks(date)
              }}
              modifiersClassNames={{
                holiday: "holiday-date bg-red-100 text-red-600 font-semibold",
                scheduled: "scheduled-date bg-red-50 text-red-500 font-semibold border-2 border-red-300"
              }}
            />
          </>
        )}
        
        {/* Display scheduled tasks for the selected date */}
        {scheduledTasks.length > 0 && (
          <div className="mt-4 text-sm">
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <PlusCircle className="h-4 w-4 text-purple-500" />
              Your Scheduled Tasks
            </h4>
            <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
              {scheduledTasks
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((task, idx) => (
                  <div key={idx} className="flex items-center space-x-2 pb-1 border-b border-gray-100 last:border-0">
                    <div className={`h-2 w-2 rounded-full ${
                      task.priority === "high" ? "bg-red-500" : 
                      task.priority === "medium" ? "bg-amber-500" : 
                      "bg-green-500"
                    }`} />
                    <span className="flex-1">{task.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(task.date)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
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
        
        {/* Missed Deadlines & Reschedules Overview */}
        {showDeadlinesOverview && (
          <div className="mt-4 border-t pt-4 border-gray-100">
            <h4 className="font-medium flex items-center text-amber-600 mb-2">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Missed Deadlines & Reschedules
            </h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-xs text-red-500 font-medium mb-1">Missed Deadlines</h5>
                {MISSED_DEADLINES.map((item, idx) => (
                  <div key={`missed-${idx}`} className="flex items-center justify-between text-xs mb-1 pb-1 border-b border-gray-50 last:border-0">
                    <div className="flex items-center">
                      <Clock3 className="h-3 w-3 text-red-400 mr-1" />
                      <span className="flex-1 truncate max-w-[140px]">{item.task}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 font-medium">{formatDate(item.dueDate)}</span>
                      <div className="ml-1 h-4 w-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-700">
                        {item.assignee.charAt(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h5 className="text-xs text-amber-500 font-medium mb-1">Rescheduled Tasks</h5>
                {RESCHEDULED_TASKS.map((item, idx) => (
                  <div key={`reschedule-${idx}`} className="flex items-start justify-between text-xs mb-1 pb-1 border-b border-gray-50 last:border-0">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-amber-400 mr-1 mt-[2px]" />
                      <span className="flex-1 truncate max-w-[140px]">{item.task}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-red-400 line-through">{formatDate(item.originalDate)}</span>
                        <span className="mx-1">→</span>
                        <span className="text-green-500">{formatDate(item.newDate)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        by {item.rescheduledBy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-slate-500 mt-1">
                <span className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-amber-400 mr-1" />
                  Most common bottleneck days: Monday, Friday
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Task</DialogTitle>
            <DialogDescription>
              Create a task for {date.toLocaleDateString()}. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="task-title" className="text-right text-sm">
                Title
              </label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                className="col-span-3"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="priority" className="text-right text-sm">
                Priority
              </label>
              <Select 
                value={newTask.priority} 
                onValueChange={(val) => setNewTask({...newTask, priority: val})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="assignee" className="text-right text-sm">
                Assignee
              </label>
              <Select 
                value={newTask.assignee} 
                onValueChange={(val) => setNewTask({...newTask, assignee: val})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Miguel Rodriguez">Miguel Rodriguez</SelectItem>
                  <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                  <SelectItem value="Priya Patel">Priya Patel</SelectItem>
                  <SelectItem value="Jordan Taylor">Jordan Taylor</SelectItem>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
