
import { useState, useEffect } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const SAMPLE_TASKS = [
  "Review student applications",
  "Prepare course material",
  "Grade assignments",
  "Schedule parent meetings",
  "Update lesson plans",
  "Review curriculum changes",
  "Organize field trip",
  "Write progress reports"
];

export const ToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    // Simulate random tasks being added
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && tasks.length < 8) {
        const randomTask = SAMPLE_TASKS[Math.floor(Math.random() * SAMPLE_TASKS.length)];
        addTask(randomTask);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = (title: string) => {
    if (title.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        completed: false
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

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task removed");
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
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyPress={e => e.key === "Enter" && addTask(newTask)}
          />
          <Button onClick={() => addTask(newTask)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={task.completed}
                  onClick={() => toggleTask(task.id)}
                />
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
