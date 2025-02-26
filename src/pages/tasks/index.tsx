
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToDoList } from "@/components/tasks/ToDoList";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { ClockCalendar } from "@/components/tasks/ClockCalendar";

const TasksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">Task Management</h1>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Clock & Calendar - Spans 4 columns */}
            <div className="col-span-12 lg:col-span-4">
              <ClockCalendar />
            </div>
            
            {/* To-Do List - Spans 4 columns */}
            <div className="col-span-12 lg:col-span-4">
              <ToDoList />
            </div>
            
            {/* Quick Actions - Spans 4 columns */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold text-primary">24</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-500">12</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Kanban Board - Spans full width */}
            <div className="col-span-12">
              <KanbanBoard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TasksPage;
