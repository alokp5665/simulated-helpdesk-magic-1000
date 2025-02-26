
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TasksPage from "./pages/tasks";
import EmailPage from "./pages/email";
import AgentsPage from "./pages/agents";
import ChatPage from "./pages/chat";
import CallsPage from "./pages/calls";
import SocialPage from "./pages/social";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/email" element={<EmailPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/calls" element={<CallsPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
