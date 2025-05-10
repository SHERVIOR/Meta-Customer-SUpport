import { useRef, useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";
import SuggestionButton from "./SuggestionButton";
import { questTopics, Topic } from "@/data/questTopics";
import { generateAiResponse } from "@/services/aiService";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Send welcome message on first load
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome-" + Date.now().toString(),
      text: "👋 Hello! I'm your Meta Quest Assistant. How can I help you with your VR headset today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = {
      id: "user-" + Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      // Get AI response
      const aiResponse = await generateAiResponse(userMessage.text);
      
      const botResponse = {
        id: "bot-" + Date.now().toString(),
        text: aiResponse.text,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in AI response:", error);
      toast.error("Failed to get a response. Please try again.");
      
      // Fallback response
      const errorResponse = {
        id: "error-" + Date.now().toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = async (topic: Topic) => {
    const userMessage = {
      id: "user-" + Date.now().toString(),
      text: topic.question,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // Get AI response instead of using predefined responses
      const aiResponse = await generateAiResponse(topic.question);
      
      const botResponse = {
        id: "bot-" + Date.now().toString(),
        text: aiResponse.text,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in AI response:", error);
      
      // Fall back to predefined responses if AI fails
      const botResponse = {
        id: "bot-" + Date.now().toString(),
        text: topic.response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-quest-blue/80 p-4 rounded-t-xl flex items-center border-b border-quest-purple/20">
        <div className="h-10 w-10 rounded-full bg-quest-teal/20 flex items-center justify-center mr-3">
          <span className="text-quest-teal text-xl font-bold">Q</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Meta Quest Assistant</h1>
          <p className="text-xs text-quest-gray">Customer Support AI</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.text}
            isBot={msg.isBot}
            timestamp={msg.timestamp}
          />
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="self-start flex items-center space-x-2 p-3 bg-secondary/30 rounded-lg animate-pulse">
            <span className="w-2 h-2 bg-quest-teal rounded-full"></span>
            <span className="w-2 h-2 bg-quest-teal rounded-full animation-delay-150"></span>
            <span className="w-2 h-2 bg-quest-teal rounded-full animation-delay-300"></span>
          </div>
        )}
        
        {/* Empty div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="px-4 py-3">
          <p className="text-xs text-quest-gray mb-2">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {questTopics.slice(0, 3).map((topic) => (
              <SuggestionButton 
                key={topic.id}
                text={topic.question}
                onClick={() => handleTopicClick(topic)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-quest-purple/20 p-4">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your question here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="bg-secondary/50 border-quest-purple/30 focus-visible:ring-quest-teal"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-quest-teal hover:bg-quest-teal/90 text-white"
            size="icon"
            disabled={loading || inputValue.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
