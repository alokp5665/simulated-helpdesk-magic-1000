
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ListTodo, Timer, CheckCircle2 } from "lucide-react";

interface KanbanTask {
  id: string;
  content: string;
  status: "todo" | "inProgress" | "done";
}

const SAMPLE_TASKS = [
  "Review curriculum updates",
  "Grade student assignments",
  "Prepare lesson materials",
  "Schedule parent conferences",
  "Update student records",
  "Plan field trip activities",
  "Create assessment tests",
  "Write progress reports"
];

export const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: [] as KanbanTask[],
    inProgress: [] as KanbanTask[],
    done: [] as KanbanTask[]
  });

  useEffect(() => {
    // Simulate random task movement
    const interval = setInterval(() => {
      const randomAction = Math.random();
      
      if (randomAction > 0.7) {
        // Add new task
        const newTask = {
          id: Date.now().toString(),
          content: SAMPLE_TASKS[Math.floor(Math.random() * SAMPLE_TASKS.length)],
          status: "todo" as const
        };
        setColumns(prev => ({
          ...prev,
          todo: [...prev.todo, newTask]
        }));
        toast.info("New task added to backlog");
      } else if (columns.todo.length > 0 && randomAction > 0.4) {
        // Move task to in progress
        const taskToMove = columns.todo[0];
        setColumns(prev => ({
          ...prev,
          todo: prev.todo.slice(1),
          inProgress: [...prev.inProgress, { ...taskToMove, status: "inProgress" }]
        }));
        toast.info("Task moved to in progress");
      } else if (columns.inProgress.length > 0 && randomAction <= 0.4) {
        // Complete task
        const taskToComplete = columns.inProgress[0];
        setColumns(prev => ({
          ...prev,
          inProgress: prev.inProgress.slice(1),
          done: [...prev.done, { ...taskToComplete, status: "done" }]
        }));
        toast.success("Task completed");
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [columns]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId as keyof typeof columns];
      const copiedTasks = [...column];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: copiedTasks
      });
    } else {
      const sourceColumn = columns[source.droppableId as keyof typeof columns];
      const destColumn = columns[destination.droppableId as keyof typeof columns];
      const copiedSourceTasks = [...sourceColumn];
      const copiedDestTasks = [...destColumn];
      const [removed] = copiedSourceTasks.splice(source.index, 1);
      copiedDestTasks.splice(destination.index, 0, {
        ...removed,
        status: destination.droppableId as KanbanTask["status"]
      });
      
      setColumns({
        ...columns,
        [source.droppableId]: copiedSourceTasks,
        [destination.droppableId]: copiedDestTasks
      });
    }
  };

  return (
    <Card className="glass-card hover-scale">
      <CardHeader>
        <CardTitle>Kanban Board</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ListTodo className="text-yellow-500" />
                <h3 className="font-semibold">To Do</h3>
                <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full text-sm">
                  {columns.todo.length}
                </span>
              </div>
              <Droppable droppableId="todo">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-yellow-500/5 rounded-lg p-4 min-h-[200px]"
                  >
                    {columns.todo.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-lg p-3 mb-2 shadow-sm"
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* In Progress Column */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Timer className="text-blue-500" />
                <h3 className="font-semibold">In Progress</h3>
                <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full text-sm">
                  {columns.inProgress.length}
                </span>
              </div>
              <Droppable droppableId="inProgress">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-blue-500/5 rounded-lg p-4 min-h-[200px]"
                  >
                    {columns.inProgress.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-lg p-3 mb-2 shadow-sm"
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Done Column */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle2 className="text-green-500" />
                <h3 className="font-semibold">Done</h3>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-sm">
                  {columns.done.length}
                </span>
              </div>
              <Droppable droppableId="done">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-green-500/5 rounded-lg p-4 min-h-[200px]"
                  >
                    {columns.done.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-lg p-3 mb-2 shadow-sm"
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};
