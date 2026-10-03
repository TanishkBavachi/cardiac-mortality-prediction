import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceAssistantProps {
  onTranscript?: (text: string) => void;
}

export const VoiceAssistant = ({ onTranscript }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleStartListening = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      
      toast({
        title: "Listening...",
        description: "Voice assistant is now active. Speak your command.",
      });

      // Simulate voice transcription after 3 seconds
      setTimeout(() => {
        const mockTranscript = "Patient is 65 years old with ejection fraction of 35%";
        onTranscript?.(mockTranscript);
        setIsListening(false);
        
        toast({
          title: "Voice Command Received",
          description: mockTranscript,
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice commands.",
        variant: "destructive",
      });
    }
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-primary/30 shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary animate-pulse" />
            <CardTitle className="text-foreground">Voice Assistant</CardTitle>
          </div>
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Ready
          </Badge>
        </div>
        <CardDescription>
          Use voice commands to input patient data quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button
            onClick={isListening ? handleStopListening : handleStartListening}
            size="lg"
            className={`rounded-full w-24 h-24 ${
              isListening
                ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isListening ? "Listening..." : "Click to start voice command"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isListening ? "Speak clearly into your microphone" : "Tap the microphone to begin"}
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-xs font-medium text-foreground">Supported Commands:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• "Patient age is [number]"</li>
            <li>• "Ejection fraction is [number]"</li>
            <li>• "Patient has diabetes/hypertension"</li>
            <li>• "Set serum creatinine to [number]"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
