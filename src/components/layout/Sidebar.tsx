
import {
  BarChart3,
  CheckSquare,
  Users,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Shield,
  Home,
  Ticket,
  FileHeart,
  Book,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Users, label: "Agents", path: "/agents" },
  { icon: Ticket, label: "Tickets", path: "/tickets" },
  { icon: Mail, label: "Emails", path: "/email" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Phone, label: "Calls", path: "/calls" },
  { icon: Share2, label: "Social", path: "/social" },
  { icon: Book, label: "Knowledge Base", path: "/knowledge" },
  { icon: FileHeart, label: "Feedback", path: "/surveys" },
  { icon: Shield, label: "Permissions", path: "/roles" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // In a real app, this would handle authentication logout
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white/50 backdrop-blur-lg border-r border-border pt-20 px-3 flex flex-col">
      <div className="flex flex-col space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                location.pathname === item.path && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </div>
      
      <div className="mt-auto pb-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
};
