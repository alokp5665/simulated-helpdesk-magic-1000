import { useState, useEffect, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { 
  ListTodo, 
  Timer, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart, 
  Clock, 
  Layers, 
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users,
  Clock3
} from "lucide-react";

interface KanbanTask {
  id: string;
  content: string;
  status: "todo" | "inProgress" | "done";
  priority: "low" | "medium" | "high";
  progress: number;
  deadline?: string;
  assignee?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

interface KanbanColumns {
  todo: KanbanTask[];
  inProgress: KanbanTask[];
  done: KanbanTask[];
}

// Pre-defined tasks for simulation
const SAMPLE_TASKS = [
  {
    content: "Review Customer Survey Results",
    priority: "high" as const,
    subtasks: ["Analyze feedback trends", "Identify key issues", "Prepare summary report"]
  },
  {
    content: "Schedule Social Media Post",
    priority: "medium" as const, 
    subtasks: ["Create content calendar", "Design graphics", "Write captions"]
  },
  {
    content: "Update Agent Training Materials",
    priority: "high" as const,
    subtasks: ["Review current modules", "Add new procedures", "Create assessment questions"]
  }
];

// Team members for assignees
const TEAM_MEMBERS = [
  "Sarah Johnson",
  "Miguel Rodriguez",
  "Alex Chen",
  "Priya Patel",
  "Jordan Taylor"
];

// Pre-filled tasks
const INITIAL_TASKS: KanbanColumns = {
  todo: [
    {
      id: "task-1",
      content: "Update Knowledge Base Article",
      status: "todo",
      priority: "medium",
      progress: 30,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toLocaleDateString(),
      subtasks: [
        { id: "st-1-1", title: "Research new information", completed: true },
        { id: "st-1-2", title: "Update documentation", completed: false },
        { id: "st-1-3", title: "Review with team", completed: false }
      ]
    },
    {
      id: "task-2",
      content: "Respond to Customer Feedback",
      status: "todo",
      priority: "high",
      progress: 0,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toLocaleDateString(),
      subtasks: [
        { id: "st-2-1", title: "Review feedback details", completed: false },
        { id: "st-2-2", title: "Prepare response", completed: false },
        { id: "st-2-3", title: "Follow up with customer", completed: false }
      ]
    }
  ],
  inProgress: [
    {
      id: "task-3",
      content: "Fix Login Issue on Mobile App",
      status: "inProgress",
      priority: "high",
      progress: 50,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toLocaleDateString(),
      subtasks: [
        { id: "st-3-1", title: "Reproduce issue", completed: true },
        { id: "st-3-2", title: "Identify root cause", completed: true },
        { id: "st-3-3", title: "Implement fix", completed: false },
        { id: "st-3-4", title: "Test fix", completed: false }
      ]
    },
    {
      id: "task-4",
      content: "Create New Dashboard Widget",
      status: "inProgress",
      priority: "medium",
      progress: 75,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toLocaleDateString(),
      subtasks: [
        { id: "st-4-1", title: "Design widget layout", completed: true },
        { id: "st-4-2", title: "Implement frontend", completed: true },
        { id: "st-4-3", title: "Connect to data source", completed: true },
        { id: "st-4-4", title: "Add user settings", completed: false }
      ]
    }
  ],
  done: [
    {
      id: "task-5",
      content: "Resolve Ticket #1234",
      status: "done",
      priority: "high",
      progress: 100,
      deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toLocaleDateString(),
      subtasks: [
        { id: "st-5-1", title: "Investigate issue", completed: true },
        { id: "st-5-2", title: "Implement solution", completed: true },
        { id: "st-5-3", title: "Test solution", completed: true },
        { id: "st-5-4", title: "Close ticket", completed: true }
      ]
    },
    {
      id: "task-6",
      content: "Deploy New Feature Update",
      status: "done",
      priority: "medium",
      progress: 100,
      deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleDateString(),
      subtasks: [
        { id: "st-6-1", title: "Prepare release notes", completed: true },
        { id: "st-6-2", title: "Run final tests", completed: true },
        { id: "st-6-3", title: "Deploy to production", completed: true },
        { id: "st-6-4", title: "Monitor for issues", completed: true }
      ]
    }
  ]
};

const getRandomSubtasks = (subtasks: string[]) => {
  return subtasks.map((title, index) => ({
    id: `subtask-${Date.now()}-${index}`,
    title,
    completed: Math.random() > 0.5
  }));
};

const getProgressFromSubtasks = (subtasks: { completed: boolean }[]) => {
  if (!subtasks.length) return 0;
  const completed = subtasks.filter(st => st.completed).length;
  return Math.round((completed / subtasks.length) * 100);
};

interface KanbanBoardProps {
  onAddTaskFunctionReady?: (addTaskFn: (status: "todo" | "inProgress" | "done", taskData: any) => void) => void;
}

export const KanbanBoard = ({ onAddTaskFunctionReady }: KanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumns>(INITIAL_TASKS);
  const [isLoading, setIsLoading] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const newTaskInputRef = useRef<HTMLInputElement>(null);

  const addNewTask = useCallback((status: "todo" | "inProgress" | "done", taskData: any) => {
    const newTask: KanbanTask = {
      id: taskData.id || `task-${Date.now()}`,
      content: taskData.title || taskData.content,
      status,
      priority: taskData.priority || "medium",
      progress: status === "done" ? 100 : 0,
      deadline: taskData.deadline,
      assignee: taskData.assignee || TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)],
      subtasks: taskData.subtasks || [
        { id: `st-${Date.now()}-1`, title: "First step", completed: false },
        { id: `st-${Date.now()}-2`, title: "Review", completed: false }
      ]
    };
    
    setColumns(prev => ({
      ...prev,
      [status]: [...prev[status], newTask]
    }));
    
    return newTask;
  }, []);

  useEffect(() => {
    if (onAddTaskFunctionReady) {
      onAddTaskFunctionReady(addNewTask);
    }
  }, [addNewTask, onAddTaskFunctionReady]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    const interval = setInterval(() => {
      const randomAction = Math.random();
      
      if (randomAction > 0.7) {
        const randomTaskIndex = Math.floor(Math.random() * SAMPLE_TASKS.length);
        const randomTaskObj = SAMPLE_TASKS[randomTaskIndex];
        const subtasks = getRandomSubtasks(randomTaskObj.subtasks || []);
        const progress = getProgressFromSubtasks(subtasks);
        
        const newTask: KanbanTask = {
          id: Date.now().toString(),
          content: randomTaskObj.content,
          status: "todo",
          priority: randomTaskObj.priority,
          progress,
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 14)).toLocaleDateString(),
          subtasks
        };
        
        setColumns(prev => ({
          ...prev,
          todo: [...prev.todo, newTask]
        }));
        toast.info("New task added to backlog", {
          description: newTask.content,
          icon: <ListTodo className="h-4 w-4" />
        });
      } else if (columns.todo.length > 0 && randomAction > 0.4) {
        const taskToMove = columns.todo[0];
        setColumns(prev => ({
          ...prev,
          todo: prev.todo.slice(1),
          inProgress: [...prev.inProgress, { ...taskToMove, status: "inProgress" }]
        }));
        toast.info("Task moved to in progress", {
          description: taskToMove.content,
          icon: <Timer className="h-4 w-4" />
        });
      } else if (columns.inProgress.length > 0 && randomAction <= 0.4) {
        const taskToComplete = columns.inProgress[0];
        
        const updatedSubtasks = taskToComplete.subtasks?.map(st => ({
          ...st,
          completed: true
        }));
        
        setColumns(prev => ({
          ...prev,
          inProgress: prev.inProgress.slice(1),
          done: [...prev.done, { 
            ...taskToComplete, 
            status: "done", 
            progress: 100,
            subtasks: updatedSubtasks
          }]
        }));
        toast.success("Task completed", {
          description: taskToComplete.content,
          icon: <CheckCircle2 className="h-4 w-4" />
        });
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [columns]);

  const handleAddNewTask = (status: "todo" | "inProgress" | "done") => {
    if (!newTaskContent.trim()) {
      toast.error("Task name cannot be empty");
      return;
    }

    const randomAssignee = TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)];
    
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      content: newTaskContent,
      status,
      priority: newTaskPriority,
      progress: status === "done" ? 100 : 0,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 14) + 1).toLocaleDateString(),
      assignee: randomAssignee,
      subtasks: [
        { id: `st-${Date.now()}-1`, title: "First step", completed: false },
        { id: `st-${Date.now()}-2`, title: "Review", completed: false }
      ]
    };
    
    setColumns(prev => ({
      ...prev,
      [status]: [...prev[status], newTask]
    }));
    
    setNewTaskContent("");
    toast.success("New task added", {
      description: newTask.content,
      icon: <ListTodo className="h-4 w-4" />
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    const animateTaskMovement = (task: KanbanTask, newStatus: "todo" | "inProgress" | "done") => {
      let statusMessage = "";
      let icon = <ListTodo className="h-4 w-4" />;
      
      if (newStatus === "inProgress") {
        statusMessage = "Task moved to In Progress";
        icon = <Timer className="h-4 w-4" />;
      } else if (newStatus === "done") {
        statusMessage = "Task marked as Complete";
        icon = <CheckCircle2 className="h-4 w-4" />;
      } else {
        statusMessage = "Task moved to To Do";
      }
      
      toast(statusMessage, {
        description: task.content,
        icon: icon
      });
    };
    
    if (source.droppableId === destination.droppableId) {
      const sourceKey = source.droppableId as keyof KanbanColumns;
      const column = [...columns[sourceKey]];
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [sourceKey]: column
      });
    } else {
      const sourceKey = source.droppableId as keyof KanbanColumns;
      const destKey = destination.droppableId as keyof KanbanColumns;
      
      const sourceColumn = [...columns[sourceKey]];
      const destColumn = [...columns[destKey]];
      const [removed] = sourceColumn.splice(source.index, 1);
      
      const updatedTask = {
        ...removed,
        status: destKey
      };
      
      if (destKey === "done") {
        updatedTask.progress = 100;
        updatedTask.subtasks = updatedTask.subtasks?.map(st => ({
          ...st,
          completed: true
        }));
      }
      
      destColumn.splice(destination.index, 0, updatedTask);
      
      setColumns({
        ...columns,
        [sourceKey]: sourceColumn,
        [destKey]: destColumn
      });
      
      animateTaskMovement(updatedTask, updatedTask.status);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-100";
      case "medium": return "text-amber-500 bg-amber-100";
      case "low": return "text-green-500 bg-green-100";
      default: return "text-blue-500 bg-blue-100";
    }
  };

  const ColumnHeader = ({ 
    icon: Icon, 
    title, 
    color, 
    count,
    columnId
  }: { 
    icon: any; 
    title: string; 
    color: string; 
    count: number;
    columnId: "todo" | "inProgress" | "done";
  }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Icon className={color} />
        <h3 className="font-semibold">{title}</h3>
        <span className={`${color.replace('text-', 'bg-')}/10 ${color} px-2 py-1 rounded-full text-sm`}>
          {count}
        </span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" className={`h-8 w-8 rounded-full ${color.replace('text-', 'hover:bg-')}/10`}>
            <Plus className={`h-4 w-4 ${color}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="grid gap-2">
            <h4 className="font-medium">Add New Task</h4>
            <Input 
              placeholder="Task name" 
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              className="col-span-2"
              ref={newTaskInputRef}
            />
            <div className="flex gap-2 items-center">
              <div className="flex-1">Priority:</div>
              <Button
                size="sm"
                variant={newTaskPriority === "low" ? "default" : "outline"} 
                onClick={() => setNewTaskPriority("low")}
                className={newTaskPriority === "low" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                Low
              </Button>
              <Button 
                size="sm"
                variant={newTaskPriority === "medium" ? "default" : "outline"} 
                onClick={() => setNewTaskPriority("medium")}
                className={newTaskPriority === "medium" ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                Med
              </Button>
              <Button 
                size="sm"
                variant={newTaskPriority === "high" ? "default" : "outline"} 
                onClick={() => setNewTaskPriority("high")}
                className={newTaskPriority === "high" ? "bg-red-500 hover:bg-red-600" : ""}
              >
                High
              </Button>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => setNewTaskContent("")}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={() => handleAddNewTask(columnId)}>
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  const teamAnalytics = {
    taskOwnership: [
      { name: 'Sarah Johnson', count: 4, color: '#4338ca' },
      { name: 'Miguel Rodriguez', count: 3, color: '#6366f1' },
      { name: 'Alex Chen', count: 5, color: '#818cf8' },
      { name: 'Priya Patel', count: 2, color: '#a5b4fc' },
      { name: 'Jordan Taylor', count: 2, color: '#c7d2fe' }
    ],
    completionTrends: [
      { name: 'Mon', value: 3 },
      { name: 'Tue', value: 2 },
      { name: 'Wed', value: 5 },
      { name: 'Thu', value: 1 },
      { name: 'Fri', value: 4 }
    ],
    averageCompletionDays: 3.2,
    taskDistribution: {
      overloaded: ["Alex Chen", "Sarah Johnson"],
      underTasked: ["Priya Patel", "Jordan Taylor"]
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card hover-scale">
        <CardHeader>
          <CardTitle>Kanban Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading your tasks...</p>
            <div className="w-64 bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card hover-scale overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
            Kanban Board
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="group"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <Users className="h-4 w-4 mr-2 group-hover:text-primary" />
              {showAnalytics ? "Hide" : "Show"} Team Analytics
              {showAnalytics ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>
            <Button variant="outline" size="sm" className="group">
              <BarChart className="h-4 w-4 mr-2 group-hover:text-primary" />
              View Stats
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAnalytics && (
          <div className="mb-6 p-4 bg-muted/40 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              Team Collaboration Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Task Ownership</h4>
                <div className="space-y-2">
                  {teamAnalytics.taskOwnership.map((member) => (
                    <div key={member.name} className="flex items-center justify-between">
                      <span className="text-sm">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-200 w-24 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full" 
                            style={{ 
                              width: `${(member.count / Math.max(...teamAnalytics.taskOwnership.map(m => m.count))) * 100}%`,
                              backgroundColor: member.color
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">{member.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Completion Trends (This Week)</h4>
                <div className="h-24 flex items-end justify-between gap-1">
                  {teamAnalytics.completionTrends.map((day) => (
                    <div key={day.name} className="flex flex-col items-center gap-1">
                      <div 
                        className="bg-purple-500/60 w-6 rounded-t-sm" 
                        style={{ height: `${(day.value / Math.max(...teamAnalytics.completionTrends.map(d => d.value))) * 80}px` }}
                      ></div>
                      <span className="text-xs">{day.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Team Workload</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Average completion time:</span>
                      <span className="font-medium">{teamAnalytics.averageCompletionDays} days</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs text-red-500 flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      Overloaded team members:
                    </h5>
                    <div className="flex gap-1 flex-wrap">
                      {teamAnalytics.taskDistribution.overloaded.map(member => (
                        <span key={member} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs text-green-500 flex items-center gap-1 mb-1">
                      <Users className="h-3 w-3" />
                      Available capacity:
                    </h5>
                    <div className="flex gap-1 flex-wrap">
                      {teamAnalytics.taskDistribution.underTasked.map(member => (
                        <span key={member} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-500/5 rounded-lg p-4 transition-all">
              <ColumnHeader 
                icon={ListTodo} 
                title="To Do" 
                color="text-yellow-500" 
                count={columns.todo.length}
                columnId="todo"
              />
              <Droppable droppableId="todo">
                {(provided, snapshot) => (
                  <ScrollArea className={`h-[400px] transition-colors duration-300 ${snapshot.isDraggingOver ? 'bg-yellow-500/10' : ''}`}>
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[400px] pr-4"
                    >
                      {columns.todo.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white/80 backdrop-blur-md rounded-lg p-4 mb-3 shadow-sm transition-all duration-300 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-yellow-300/50 rotate-1' : 'hover:shadow-md'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{task.content}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              
                              {task.assignee && (
                                <div className="flex items-center mt-2 mb-2">
                                  <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-xs text-purple-700 mr-1">
                                    {task.assignee.charAt(0)}
                                  </div>
                                  <span className="text-xs text-slate-600">{task.assignee}</span>
                                </div>
                              )}
                              
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                    <span>Progress: {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                                    <span>{task.progress}%</span>
                                  </div>
                                  <Progress value={task.progress} className="h-1.5 bg-yellow-100" />
                                </div>
                              )}
                              
                              {task.deadline && (
                                <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Due: {task.deadline}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
            </div>

            <div className="bg-blue-500/5 rounded-lg p-4 transition-all">
              <ColumnHeader 
                icon={Timer} 
                title="In Progress" 
                color="text-blue-500" 
                count={columns.inProgress.length}
                columnId="inProgress"
              />
              <Droppable droppableId="inProgress">
                {(provided, snapshot) => (
                  <ScrollArea className={`h-[400px] transition-colors duration-300 ${snapshot.isDraggingOver ? 'bg-blue-500/10' : ''}`}>
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[400px] pr-4"
                    >
                      {columns.inProgress.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white/80 backdrop-blur-md rounded-lg p-4 mb-3 shadow-sm transition-all duration-300 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-300/50 rotate-1' : 'hover:shadow-md'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{task.content}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              
                              {task.assignee && (
                                <div className="flex items-center mt-2 mb-2">
                                  <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-xs text-purple-700 mr-1">
                                    {task.assignee.charAt(0)}
                                  </div>
                                  <span className="text-xs text-slate-600">{task.assignee}</span>
                                </div>
                              )}
                              
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                    <span>Progress: {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                                    <span>{task.progress}%</span>
                                  </div>
                                  <Progress value={task.progress} className="h-1.5 bg-blue-100" />
                                </div>
                              )}
                              
                              {task.deadline && (
                                <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Due: {task.deadline}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
            </div>

            <div className="bg-green-500/5 rounded-lg p-4 transition-all">
              <ColumnHeader 
                icon={CheckCircle2} 
                title="Done" 
                color="text-green-500" 
                count={columns.done.length}
                columnId="done"
              />
              <Droppable droppableId="done">
                {(provided, snapshot) => (
                  <ScrollArea className={`h-[400px] transition-colors duration-300 ${snapshot.isDraggingOver ? 'bg-green-500/10' : ''}`}>
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[400px] pr-4"
                    >
                      {columns.done.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white/80 backdrop-blur-md rounded-lg p-4 mb-3 shadow-sm transition-all duration-300 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-green-300/50 rotate-1' : 'hover:shadow-md'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{task.content}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              
                              {task.assignee && (
                                <div className="flex items-center mt-2 mb-2">
                                  <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-xs text-purple-700 mr-1">
                                    {task.assignee.charAt(0)}
                                  </div>
                                  <span className="text-xs text-slate-600">{task.assignee}</span>
                                </div>
                              )}
                              
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                    <span>Complete</span>
                                    <span>100%</span>
                                  </div>
                                  <Progress value={100} className="h-1.5 bg-green-100" />
                                </div>
                              )}
                              
                              <div className="flex items-center mt-3 text-xs text-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Completed</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

KanbanBoard.displayName = "KanbanBoard";
