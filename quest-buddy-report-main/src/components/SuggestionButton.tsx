
import { Button } from "@/components/ui/button";

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
}

const SuggestionButton = ({ text, onClick }: SuggestionButtonProps) => {
  return (
    <Button 
      variant="outline"
      className="bg-secondary/50 hover:bg-secondary/70 border-quest-purple/30 text-sm py-1 px-3 h-auto rounded-full whitespace-normal text-left"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default SuggestionButton;
