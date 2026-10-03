import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Wifi, WifiOff, Settings, Upload } from "lucide-react";
import { useState } from "react";

interface MLModelStatusProps {
  isConnected: boolean;
  onConnect: (endpoint: string, apiKey: string) => void;
}

export const MLModelStatus = ({ isConnected, onConnect }: MLModelStatusProps) => {
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  const handleConnect = () => {
    if (endpoint && apiKey) {
      onConnect(endpoint, apiKey);
      setShowConfig(false);
    }
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          ML Model Connection
        </CardTitle>
        <CardDescription>
          Connect your trained heart failure mortality prediction model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-success" />
            ) : (
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              Status: {isConnected ? "Connected" : "Disconnected"}
            </span>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Active" : "Offline"}
            </Badge>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Configure
          </Button>
        </div>

        {showConfig && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Model API Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="https://your-model-api.com/predict"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your model API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <Button onClick={handleConnect} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Connect Model
            </Button>
          </div>
        )}

        {!isConnected && !showConfig && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Configure your ML model endpoint to enable predictions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};