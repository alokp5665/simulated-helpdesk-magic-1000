import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ListTodo, Timer, CheckCircle2, AlertTriangle, BarChart, Clock, Layers } from "lucide-react";

interface KanbanTask {
  id: string;
  content: string;
  status: "todo" | "inProgress" | "done";
  priority: "low" | "medium" | "high";
  progress: number;
  deadline?: string;
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

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumns>(INITIAL_TASKS);
  const [isLoading, setIsLoading] = useState(false);

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
    count 
  }: { 
    icon: any; 
    title: string; 
    color: string; 
    count: number 
  }) => (
    <div className="flex items-center space-x-2 mb-4">
      <Icon className={color} />
      <h3 className="font-semibold">{title}</h3>
      <span className={`${color.replace('text-', 'bg-')}/10 ${color} px-2 py-1 rounded-full text-sm`}>
        {count}
      </span>
    </div>
  );

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
          <Button variant="outline" size="sm" className="group">
            <BarChart className="h-4 w-4 mr-2 group-hover:text-primary" />
            View Stats
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-500/5 rounded-lg p-4 transition-all">
              <ColumnHeader 
                icon={ListTodo} 
                title="To Do" 
                color="text-yellow-500" 
                count={columns.todo.length} 
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
