
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  return (
    <div 
      className={cn(
        "flex",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          role === "user" 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}
      >
        <p className="text-sm">{content}</p>
        <p className="text-xs opacity-70 mt-1 text-right">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
