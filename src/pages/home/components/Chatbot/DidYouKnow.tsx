
import { AlertCircle } from "lucide-react";

interface DidYouKnowProps {
  tip: string;
}

export const DidYouKnow = ({ tip }: DidYouKnowProps) => {
  return (
    <div className="p-3 bg-primary/5 border-b">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
        <div>
          <p className="text-xs font-medium">Did you know?</p>
          <p className="text-xs text-muted-foreground">{tip}</p>
        </div>
      </div>
    </div>
  );
};
