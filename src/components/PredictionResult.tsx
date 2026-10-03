import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Heart, TrendingUp } from "lucide-react";

interface PredictionData {
  riskScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  confidence: number;
  factors: Array<{
    factor: string;
    impact: "positive" | "negative";
    weight: number;
  }>;
  recommendations: string[];
}

interface PredictionResultProps {
  prediction: PredictionData | null;
  isVisible: boolean;
}

export const PredictionResult = ({ prediction, isVisible }: PredictionResultProps) => {
  if (!isVisible || !prediction) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-success";
      case "moderate": return "text-warning";
      case "high": return "text-destructive";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "low": return "default";
      case "moderate": return "secondary";
      case "high": return "destructive";
      case "critical": return "destructive";
      default: return "outline";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="h-5 w-5" />;
      case "moderate": return <TrendingUp className="h-5 w-5" />;
      case "high": return <AlertTriangle className="h-5 w-5" />;
      case "critical": return <AlertTriangle className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Risk Assessment */}
      <Card className="shadow-elevated border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-destructive" />
            Mortality Risk Assessment
          </CardTitle>
          <CardDescription>AI-powered prediction based on clinical parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={getRiskColor(prediction.riskLevel)}>
                  {getRiskIcon(prediction.riskLevel)}
                </span>
                <span className="text-2xl font-bold capitalize">
                  {prediction.riskLevel} Risk
                </span>
                <Badge variant={getRiskBadgeVariant(prediction.riskLevel)}>
                  {prediction.riskScore.toFixed(1)}% Risk Score
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Model Confidence: {prediction.confidence.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Score</span>
              <span>{prediction.riskScore.toFixed(1)}%</span>
            </div>
            <Progress value={prediction.riskScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors Analysis */}
      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Contributing Risk Factors</CardTitle>
          <CardDescription>
            Key clinical parameters influencing the mortality risk prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    factor.impact === "negative" ? "bg-destructive" : "bg-success"
                  }`} />
                  <span className="font-medium">{factor.factor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Weight: {factor.weight.toFixed(2)}
                  </span>
                  <Badge variant={factor.impact === "negative" ? "destructive" : "default"}>
                    {factor.impact === "negative" ? "Risk Factor" : "Protective"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Recommendations */}
      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle>Clinical Recommendations</CardTitle>
          <CardDescription>
            Evidence-based recommendations for patient management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/10">
                <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};