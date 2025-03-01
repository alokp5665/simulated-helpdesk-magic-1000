
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: () => void;
}

export const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage }: ChatInputProps) => {
  return (
    <div className="p-3 border-t">
      <div className="flex items-center gap-2">
        <Textarea 
          placeholder="Ask me anything about EduCare..." 
          className="min-h-9 resize-none"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          size="icon" 
          className="h-9 w-9 rounded-full flex-shrink-0"
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
