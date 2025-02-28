
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landing";
import Index from "./pages/Index";
import HomePage from "./pages/home";
import KnowledgeBasePage from "./pages/knowledge";
import TasksPage from "./pages/tasks";
import EmailPage from "./pages/email";
import AgentsPage from "./pages/agents";
import ChatPage from "./pages/chat";
import CallsPage from "./pages/calls";
import SocialPage from "./pages/social";
import RolesPage from "./pages/roles";
import SurveysPage from "./pages/surveys";
import SettingsPage from "./pages/settings";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import NotFound from "./pages/NotFound";
import TicketsPage from "./pages/tickets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          
          {/* Dashboard and protected routes */}
          <Route path="/dashboard" element={<Index />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/email" element={<EmailPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/calls" element={<CallsPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/surveys" element={<SurveysPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
