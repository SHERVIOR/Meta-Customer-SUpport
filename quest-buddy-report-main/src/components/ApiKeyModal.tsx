
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { saveApiKey, hasApiKey, clearApiKey, getAiMode, saveAiMode, initOfflineModel, isOfflineReady } from "@/services/aiService";
import { toast } from "sonner";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal = ({ isOpen, onClose }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState(getAiMode() === "offline" ? "offline" : "online");
  const [offlineLoaded, setOfflineLoaded] = useState(isOfflineReady());
  
  useEffect(() => {
    if (activeTab === "offline") {
      saveAiMode("offline");
    } else {
      saveAiMode("openai");
    }
  }, [activeTab]);
  
  const handleSave = () => {
    if (activeTab === "online") {
      if (!apiKey.trim()) {
        toast.error("Please enter a valid API key");
        return;
      }
      
      saveApiKey(apiKey.trim());
      toast.success("API key saved successfully");
    }
    onClose();
  };
  
  const handleClear = () => {
    clearApiKey();
    setApiKey("");
    toast.success("API key cleared");
  };
  
  const handleLoadOfflineModel = async () => {
    const success = await initOfflineModel();
    if (success) {
      setOfflineLoaded(true);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>
            Configure how you want the Meta Quest Assistant to answer questions.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="online">Online (OpenAI)</TabsTrigger>
            <TabsTrigger value="offline">Offline (Llama)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="online">
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apiKey" className="text-right col-span-1">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <p className="text-xs text-quest-gray mt-2">
                You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-quest-teal underline">OpenAI's website</a>.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="offline">
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-4">
                  Offline mode uses Llama to process queries locally in your browser. 
                  This requires downloading a model (~100-200MB) and may use more device resources.
                </p>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="offline-mode">Enable offline mode</Label>
                  <Button
                    variant={offlineLoaded ? "outline" : "default"}
                    onClick={handleLoadOfflineModel}
                    disabled={offlineLoaded}
                    className="bg-quest-teal hover:bg-quest-teal/90"
                  >
                    {offlineLoaded ? "Model Loaded" : "Load Model"}
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-quest-gray">
                Note: Offline mode uses WebGPU, which may not be available in all browsers. 
                Chrome is recommended for best performance.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between mt-4">
          {activeTab === "online" && (
            <Button variant="outline" onClick={handleClear} disabled={!hasApiKey()}>
              Clear Key
            </Button>
          )}
          <Button onClick={handleSave} className="bg-quest-teal hover:bg-quest-teal/90">
            {activeTab === "online" ? "Save Key" : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
