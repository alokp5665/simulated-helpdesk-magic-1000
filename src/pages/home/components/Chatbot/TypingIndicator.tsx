
export const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg rounded-tl-none p-3">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce delay-75"></div>
          <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
};
