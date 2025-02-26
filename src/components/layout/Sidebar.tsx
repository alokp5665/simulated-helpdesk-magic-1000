
import {
  BarChart3,
  CheckSquare,
  Users,
  Ticket,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  FileHeart,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", path: "/" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Users, label: "Agents", path: "/agents" },
  { icon: Ticket, label: "Tickets", path: "/tickets" },
  { icon: Mail, label: "Emails", path: "/emails" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Phone, label: "Calls", path: "/calls" },
  { icon: Share2, label: "Social", path: "/social" },
  { icon: FileHeart, label: "Feedback", path: "/feedback" },
  { icon: Shield, label: "Permissions", path: "/permissions" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white/50 backdrop-blur-lg border-r border-border pt-20 px-3">
      <div className="flex flex-col space-y-2">
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
    </div>
  );
};
