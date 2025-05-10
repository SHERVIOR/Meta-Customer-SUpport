
import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ApiKeyModal from "@/components/ApiKeyModal";
import { Button } from "@/components/ui/button";
import { Settings, Wifi, WifiOff } from "lucide-react";
import { hasApiKey, getAiMode } from "@/services/aiService";

const Index = () => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  return (
    <div className="app-main">
      <div className="w-full max-w-2xl h-[600px] chat-container rounded-xl shadow-xl overflow-hidden flex flex-col">
        <ChatInterface />
      </div>
      
      <div className="fixed top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsApiKeyModalOpen(true)}
          className={`rounded-full ${!hasApiKey() && getAiMode() === 'openai' ? 'border-red-500 animate-pulse' : ''}`}
          title="AI Settings"
        >
          <Settings className={`h-4 w-4 ${!hasApiKey() && getAiMode() === 'openai' ? 'text-red-500' : ''}`} />
        </Button>
      </div>
      
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
      
      <div className="fixed bottom-2 right-2 text-xs space-y-1">
        <p className="text-quest-teal/80 flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-quest-teal mr-1.5 animate-pulse"></span>
          {getAiMode() === 'offline' ? (
            <>Powered by <WifiOff className="h-3 w-3 mx-1" /> Offline AI</>
          ) : (
            <>Powered by <Wifi className="h-3 w-3 mx-1" /> OpenAI</>
          )}
        </p>
        <p className="text-quest-gray/50">
          Meta Quest is a trademark of Meta Platforms, Inc.
        </p>
      </div>
    </div>
  );
};

export default Index;
