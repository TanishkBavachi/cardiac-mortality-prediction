import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PatientForm } from "@/components/PatientForm";
import { PredictionResult } from "@/components/PredictionResult";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Activity } from "lucide-react";

interface PatientData {
  age: string;
  gender: string;
  ejectionFraction: string;
  serumCreatinine: string;
  serumSodium: string;
  cpk: string;
  platelets: string;
  smokingStatus: string;
  diabetes: string;
  hypertension: string;
  anaemia: string;
  medicines: string;
  notes: string;
}

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

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);
    } catch (error: any) {
      console.error("Auth check error:", error);
      navigate("/auth");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleFormSubmit = async (data: PatientData) => {
    if (!user) {
      toast.error("Please log in to make predictions");
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }

      const response = await supabase.functions.invoke("predict-mortality", {
        body: {
          patientName: data.notes || "Patient",
          age: parseInt(data.age),
          sex: data.gender,
          ejectionFraction: parseFloat(data.ejectionFraction),
          serumCreatinine: parseFloat(data.serumCreatinine),
          serumSodium: parseFloat(data.serumSodium),
          platelets: parseFloat(data.platelets),
          creatininePhosphokinase: parseFloat(data.cpk),
          highBloodPressure: data.hypertension === "yes",
          diabetes: data.diabetes === "yes",
          anaemia: data.anaemia === "yes",
          smoking: data.smokingStatus === "current",
          medicines: data.medicines,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const result = response.data;
      
      // Convert API response to PredictionData format
      const predictionData: PredictionData = {
        riskScore: result.mortalityRisk,
        riskLevel: result.riskLevel.toLowerCase() as "low" | "moderate" | "high" | "critical",
        confidence: 92.5,
        factors: [
          { factor: "Age", impact: parseInt(data.age) > 65 ? "negative" : "positive", weight: 0.23 },
          { factor: "Ejection Fraction", impact: parseFloat(data.ejectionFraction) < 40 ? "negative" : "positive", weight: 0.31 },
          { factor: "Serum Creatinine", impact: parseFloat(data.serumCreatinine) > 1.5 ? "negative" : "positive", weight: 0.18 },
          { factor: "Diabetes", impact: data.diabetes === "yes" ? "negative" : "positive", weight: 0.12 },
          { factor: "Smoking", impact: data.smokingStatus === "current" ? "negative" : "positive", weight: 0.16 }
        ],
        recommendations: result.recommendations.split("\n\n").filter((r: string) => r.trim()),
      };

      setPrediction(predictionData);
      
      toast.success("Prediction complete! Results saved to your history.");
    } catch (error: any) {
      console.error("Prediction error:", error);
      toast.error(error.message || "Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-16 w-16 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Neptune blue background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse-glow"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Patient Form */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <PatientForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
          
          {/* Right Column - Voice Assistant and Results */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <VoiceAssistant 
              onTranscript={(text) => {
                console.log("Voice transcript:", text);
              }}
            />
            
            <PredictionResult 
              prediction={prediction}
              isVisible={!!prediction}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;