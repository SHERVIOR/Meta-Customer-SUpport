
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Small delay for animation purposes
    const timer = setTimeout(() => {
      setVisible(true);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={cn(
        "p-4 rounded-lg mb-4 max-w-[85%] shadow-sm transition-opacity duration-300",
        isBot ? 
          "bot-message self-start animate-fade-in" : 
          "user-message self-end animate-bounce-in",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex items-center mb-1">
        <span className={cn(
          "text-xs font-medium",
          isBot ? "text-quest-teal" : "text-quest-lightPurple"
        )}>
          {isBot ? "Quest Assistant" : "You"}
        </span>
        {timestamp && (
          <span className="text-xs text-quest-gray ml-2">
            {timestamp}
          </span>
        )}
      </div>
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default ChatMessage;
