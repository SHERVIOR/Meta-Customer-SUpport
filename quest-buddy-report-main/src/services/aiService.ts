import { toast } from "sonner";
import { pipeline } from "@huggingface/transformers";

interface AiResponse {
  text: string;
  error?: boolean;
}

// AI mode types
export type AiMode = "openai" | "offline";

// Check if we have a stored API key
const getStoredApiKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};

// Get the currently selected AI mode
export const getAiMode = (): AiMode => {
  return (localStorage.getItem('ai_mode') as AiMode) || 'openai';
};

// Save AI mode to localStorage
export const saveAiMode = (mode: AiMode): void => {
  localStorage.setItem('ai_mode', mode);
};

// Save API key to localStorage
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem('openai_api_key', apiKey);
};

// Clear stored API key
export const clearApiKey = (): void => {
  localStorage.removeItem('openai_api_key');
};

// Check if API key is set
export const hasApiKey = (): boolean => {
  return !!getStoredApiKey();
};

// Check if offline mode is ready (model loaded)
let offlineModelLoaded = false;
let offlinePipeline: any = null;

export const isOfflineReady = (): boolean => {
  return offlineModelLoaded;
};

// Load the offline model
export const initOfflineModel = async (): Promise<boolean> => {
  try {
    toast.info("Loading offline model... This may take a moment.");
    
    // Load a small model suitable for chat completions
    offlinePipeline = await pipeline(
      "text-generation",
      "TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF", // Using a small model for demonstration
      { 
        revision: "main" 
      }
    );
    
    offlineModelLoaded = true;
    toast.success("Offline model loaded successfully!");
    return true;
  } catch (error) {
    console.error("Failed to load offline model:", error);
    toast.error("Failed to load offline model. Please try again.");
    return false;
  }
};

export const generateAiResponse = async (message: string): Promise<AiResponse> => {
  const aiMode = getAiMode();
  
  if (aiMode === 'offline') {
    return generateOfflineResponse(message);
  } else {
    return generateOpenAiResponse(message);
  }
};

const generateOfflineResponse = async (message: string): Promise<AiResponse> => {
  try {
    if (!offlineModelLoaded) {
      const success = await initOfflineModel();
      if (!success) {
        return { 
          text: "The offline model failed to load. Please check your browser console for more details or try the online mode.", 
          error: true 
        };
      }
    }
    
    // Meta Quest context prompt (simplified for offline model)
    const questContext = `You are a helpful Meta Quest VR headset customer support assistant. Answer questions about Meta Quest headsets.`;
    
    // Generate response using the offline model
    const result = await offlinePipeline(`${questContext}\n\nUser: ${message}\n\nAssistant:`, {
      max_new_tokens: 200,
      temperature: 0.7,
      top_p: 0.9,
    });
    
    // Extract just the assistant's response from the generated text
    let response = result[0].generated_text;
    response = response.split("Assistant:").pop()?.trim() || "I'm not sure how to answer that.";
    
    return { text: response };
  } catch (error) {
    console.error("Error generating offline AI response:", error);
    return { 
      text: "I encountered an issue while generating a response in offline mode. Please try again or switch to online mode.", 
      error: true 
    };
  }
};

const generateOpenAiResponse = async (message: string): Promise<AiResponse> => {
  try {
    const apiKey = getStoredApiKey();
    
    if (!apiKey) {
      return { 
        text: "Please set your OpenAI API key in the settings to enable AI-powered responses.", 
        error: true 
      };
    }
    
    // Meta Quest documentation and guidelines context
    // This would ideally be expanded with actual Meta documentation
    const questContext = `
      You are a helpful Meta Quest VR headset customer support assistant.
      Your goal is to help users with their Meta Quest headset issues.
      
      Meta Quest Documentation Summary:
      - The Meta Quest (formerly Oculus Quest) is a line of virtual reality headsets developed by Meta Platforms.
      - Current models include the Meta Quest 2, Meta Quest Pro, and Meta Quest 3.
      - The Quest 2 features a Snapdragon XR2 processor, 6GB of RAM, and resolution of 1832×1920 per eye.
      - The Quest 3 features a Snapdragon XR2 Gen 2 processor, 8GB of RAM, and higher resolution displays.
      - Common features include inside-out tracking, touch controllers, hand tracking, and a growing app library.
      
      Common troubleshooting topics:
      - Headset setup and pairing
      - Account management and login issues
      - Battery life and charging
      - Display and visual quality
      - Controller tracking and connectivity
      - App installation and updates
      - Wi-Fi connectivity issues
      - Performance optimization
      
      Provide concise, helpful answers about Meta Quest usage, troubleshooting, features, and games.
      If you don't know something, admit it and suggest contacting official Meta support.
      Keep responses friendly but professional, focused on VR and Meta Quest products.
      Format responses with simple markdown for readability when appropriate.
    `;
    
    // Make actual API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using a cheaper model as default
        messages: [
          {
            role: "system",
            content: questContext
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      
      if (response.status === 401) {
        // Invalid API key
        clearApiKey();
        return { 
          text: "Your API key appears to be invalid. Please update it in the settings.", 
          error: true 
        };
      }
      
      throw new Error(errorData.error?.message || "Unknown API error");
    }
    
    const data = await response.json();
    return { text: data.choices[0].message.content };
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    toast.error("Failed to generate AI response. Please try again.");
    return { 
      text: "I'm sorry, I'm having trouble processing your request at the moment. Please try again in a moment.", 
      error: true 
    };
  }
};
