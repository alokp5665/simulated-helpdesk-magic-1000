
import { useState, useEffect } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  subTasks?: SubTask[];
}

const SAMPLE_TASKS = [
  {
    title: "Review student applications",
    subTasks: ["Review grades", "Check recommendations", "Verify backgrounds"]
  },
  {
    title: "Prepare course material",
    subTasks: ["Update slides", "Create exercises", "Review literature"]
  },
  {
    title: "Grade assignments",
    subTasks: ["Review submissions", "Provide feedback", "Record grades"]
  },
  {
    title: "Schedule parent meetings",
    subTasks: ["Contact parents", "Book meeting room", "Prepare agenda"]
  },
  {
    title: "Update lesson plans",
    subTasks: ["Review curriculum", "Incorporate feedback", "Add new material"]
  },
  {
    title: "Review curriculum changes",
    subTasks: ["Assess new standards", "Identify gaps", "Create implementation plan"]
  },
  {
    title: "Organize field trip",
    subTasks: ["Book transportation", "Get permissions", "Create itinerary"]
  },
  {
    title: "Write progress reports",
    subTasks: ["Collect data", "Analyze performance", "Draft reports"]
  }
];

export const ToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial data load with loading simulation
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Simulate random tasks being added
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && tasks.length < 8) {
        const randomTaskIndex = Math.floor(Math.random() * SAMPLE_TASKS.length);
        const randomTask = SAMPLE_TASKS[randomTaskIndex];
        
        const subTasks = randomTask.subTasks.map(title => ({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          title,
          completed: Math.random() > 0.5
        }));
        
        const newTask = {
          id: Date.now().toString(),
          title: randomTask.title,
          completed: false,
          subTasks
        };
        
        setTasks(prev => [...prev, newTask]);
        toast.success("New task added");
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [tasks]);

  const addTask = (title: string) => {
    if (title.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        completed: false,
        subTasks: [
          { id: "st1" + Date.now().toString(), title: "Initial planning", completed: false },
          { id: "st2" + Date.now().toString(), title: "Implementation", completed: false },
          { id: "st3" + Date.now().toString(), title: "Review", completed: false }
        ]
      };
      setTasks(prev => [...prev, newTask]);
      setNewTask("");
      toast.success("New task added");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.success(`Task ${!task.completed ? "completed" : "uncompleted"}`);
    }
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: task.subTasks?.map(st => 
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          )
        } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task removed");
  };

  const getTaskProgress = (task: Task) => {
    if (!task.subTasks || task.subTasks.length === 0) return 0;
    const completed = task.subTasks.filter(st => st.completed).length;
    return Math.round((completed / task.subTasks.length) * 100);
  };

  return (
    <Card className="glass-card hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          To-Do List
          <span className="text-sm text-muted-foreground">
            {tasks.filter(t => t.completed).length}/{tasks.length} Done
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40 flex-col space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-sm">Loading tasks...</p>
          </div>
        ) : (
          <>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyPress={e => e.key === "Enter" && addTask(newTask)}
                className="bg-white/50 backdrop-blur-sm border border-white/10"
              />
              <Button onClick={() => addTask(newTask)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white/40 backdrop-blur-md rounded-lg p-4 shadow-sm transition-all hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={task.completed}
                        onClick={() => toggleTask(task.id)}
                      />
                      <span className={task.completed ? "line-through text-muted-foreground" : "font-medium"}>
                        {task.title}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {task.subTasks && task.subTasks.length > 0 && (
                    <div className="ml-6 mt-2 space-y-3">
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                        <span>Progress: {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} Subtasks</span>
                        <span>{getTaskProgress(task)}%</span>
                      </div>
                      <Progress value={getTaskProgress(task)} className="h-2" />
                      
                      <div className="space-y-1 pt-1 max-h-[100px] overflow-y-auto scrollbar-thin">
                        {task.subTasks.map(subTask => (
                          <div key={subTask.id} className="flex items-center space-x-2 text-sm">
                            <Checkbox 
                              checked={subTask.completed}
                              onClick={() => toggleSubTask(task.id, subTask.id)}
                              className="h-3 w-3"
                            />
                            <span className={subTask.completed ? "line-through text-muted-foreground text-xs" : "text-xs"}>
                              {subTask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
