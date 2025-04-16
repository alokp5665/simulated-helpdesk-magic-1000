
import { useState, useEffect } from 'react';
import { Bell, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  message: string;
  time: string;
}

export const TopBar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate new notifications every 5-10 seconds
    const interval = setInterval(() => {
      const notification = generateRandomNotification();
      setNotifications(prev => [notification, ...prev].slice(0, 5));
      setUnreadCount(prev => prev + 1);
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomNotification = (): Notification => {
    const messages = [
      "New project milestone reached",
      "Task assigned to you",
      "Team member update",
      "Project deadline approaching",
      "Meeting scheduled",
    ];
    
    return {
      id: Date.now(),
      message: messages[Math.floor(Math.random() * messages.length)],
      time: new Date().toLocaleTimeString(),
    };
  };

  const handleLogout = () => {
    toast.success("Logout Successful", {
      description: "You have been successfully logged out.",
    });
    navigate('/auth/login');
  };

  return (
    <div className="fixed top-0 right-0 left-0 h-16 bg-white/50 backdrop-blur-lg border-b border-border z-50 px-4">
      <div className="h-full max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">PrimeCare Project Management</div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-sm text-muted-foreground">{notification.time}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/knowledge')}>Help</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/surveys')}>Feedback</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative" size="icon">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/settings')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Account</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
