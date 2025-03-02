
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToDoList } from "@/components/tasks/ToDoList";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { ClockCalendar } from "@/components/tasks/ClockCalendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, CheckCircle2, Clock } from "lucide-react";

// Add TypeScript declaration for the window property
declare global {
  interface Window {
    KanbanSimulationTimeout: number;
  }
}

const TasksPage = () => {
  const [stats, setStats] = useState({
    totalTasks: 24,
    completedTasks: 12,
    inProgressTasks: 8,
    upcomingDeadlines: 5
  });

  // Add a custom styling for scrollbars
  useEffect(() => {
    // Add CSS for custom scrollbars
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(241, 242, 243, 0.5);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(107, 114, 128, 0.7);
      }
      
      /* Make a special style for the holiday dates */
      .holiday-date {
        position: relative;
      }
      .holiday-date::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: #e11d48;
        border-radius: 50%;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
      }
    `;
    document.head.appendChild(style);
    
    // Set a shorter timeout for the KanbanBoard simulation
    window.KanbanSimulationTimeout = 2000; // 2 seconds for Kanban simulation
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Animation classes for Bento grid items
  const bentoItemClasses = "animate-fade-in transition-all duration-500 hover:shadow-lg hover:translate-y-[-2px]";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-50/30">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1600px] mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-foreground/90">Task Management</h1>
          <p className="text-muted-foreground mb-8">Organize, track, and manage your tasks efficiently</p>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Quick Stats - Top Row, 4 cards */}
            <div className="col-span-12 lg:col-span-3 space-y-0">
              <Card className={`glass-card ${bentoItemClasses} overflow-hidden border border-purple-200/40 bg-white/60`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                      <p className="text-3xl font-bold text-primary">{stats.totalTasks}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-12 lg:col-span-3 space-y-0">
              <Card className={`glass-card ${bentoItemClasses} overflow-hidden border border-green-200/40 bg-white/60`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold text-green-500">{stats.completedTasks}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-12 lg:col-span-3 space-y-0">
              <Card className={`glass-card ${bentoItemClasses} overflow-hidden border border-blue-200/40 bg-white/60`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-3xl font-bold text-blue-500">{stats.inProgressTasks}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-12 lg:col-span-3 space-y-0">
              <Card className={`glass-card ${bentoItemClasses} overflow-hidden border border-amber-200/40 bg-white/60`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
                      <p className="text-3xl font-bold text-amber-500">{stats.upcomingDeadlines}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Middle Row - Clock/Calendar and To-Do */}
            <div className="col-span-12 lg:col-span-6">
              <div className={bentoItemClasses}>
                <ClockCalendar />
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-6">
              <div className={bentoItemClasses}>
                <ToDoList />
              </div>
            </div>
            
            {/* Bottom Row - Kanban Board */}
            <div className="col-span-12">
              <div className={bentoItemClasses}>
                <KanbanBoard />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TasksPage;
