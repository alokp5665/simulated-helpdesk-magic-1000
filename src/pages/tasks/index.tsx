
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { ClockCalendar } from "@/components/tasks/ClockCalendar";
import { ToDoList } from "@/components/tasks/ToDoList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NewTaskFormData {
  title: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "inProgress" | "done";
  deadline?: string;
}

const TasksPage = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskFormData>({
    title: "",
    priority: "medium",
    status: "todo",
  });
  
  // Initialize addNewTaskFn as null instead of using a state setter function
  const [addNewTaskFn, setAddNewTaskFn] = useState<((status: "todo" | "inProgress" | "done", taskData: any) => void) | null>(null);

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    // Check if addNewTaskFn exists and is a function before calling it
    if (addNewTaskFn && typeof addNewTaskFn === 'function') {
      try {
        addNewTaskFn(newTask.status, {
          ...newTask,
          id: `task-${Date.now()}`,
        });
        
        toast.success("New task created", {
          description: `"${newTask.title}" added to ${newTask.status === "todo" ? "To Do" : newTask.status === "inProgress" ? "In Progress" : "Done"}`
        });
        
        // Reset form and close dialog
        setNewTask({
          title: "",
          priority: "medium",
          status: "todo",
        });
        setIsAddTaskOpen(false);
      } catch (error) {
        console.error("Error creating task:", error);
        toast.error("Could not add task. An error occurred.");
      }
    } else {
      toast.error("Could not add task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-violet-50/10">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground/90">Tasks Management</h1>
            
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add New Task</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add details for your new task below
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input 
                      id="title" 
                      className="col-span-3" 
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value: "low" | "medium" | "high") => 
                        setNewTask({...newTask, priority: value})
                      }
                    >
                      <SelectTrigger id="priority" className="col-span-3">
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
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select 
                      value={newTask.status} 
                      onValueChange={(value: "todo" | "inProgress" | "done") => 
                        setNewTask({...newTask, status: value})
                      }
                    >
                      <SelectTrigger id="status" className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline" className="text-right">Deadline</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                      className="col-span-3" 
                      value={newTask.deadline || ""}
                      onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>
                    Create Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <KanbanBoard 
                onAddTaskFunctionReady={(addTaskFn) => {
                  if (typeof addTaskFn === 'function') {
                    setAddNewTaskFn(() => addTaskFn);
                  }
                }} 
              />
            </div>
            
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <ClockCalendar onTaskScheduled={(task) => {
                if (addNewTaskFn && typeof addNewTaskFn === 'function') {
                  addNewTaskFn("todo", {
                    ...task,
                    id: `task-${Date.now()}`,
                    status: "todo"
                  });
                }
              }} />
              <ToDoList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TasksPage;
