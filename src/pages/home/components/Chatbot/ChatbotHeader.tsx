
import { Button } from "@/components/ui/button";
import { Bot, Maximize2, Minimize2, X } from "lucide-react";

interface ChatbotHeaderProps {
  isChatbotMinimized: boolean;
  setIsChatbotMinimized: (value: boolean) => void;
  closeChatbot: () => void;
}

export const ChatbotHeader = ({ 
  isChatbotMinimized, 
  setIsChatbotMinimized,
  closeChatbot 
}: ChatbotHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-primary/10">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-sm">EduCare Assistant</h3>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {isChatbotMinimized ? (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={() => setIsChatbotMinimized(false)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={() => setIsChatbotMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        )}
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7" 
          onClick={closeChatbot}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
