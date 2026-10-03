import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { History, Activity } from "lucide-react";

interface PatientSubmission {
  id: string;
  patient_name: string;
  age: number;
  sex: string;
  ejection_fraction: number;
  serum_creatinine: number;
  serum_sodium: number;
  mortality_risk: number;
  risk_level: string;
  recommendations: string;
  created_at: string;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<PatientSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      fetchHistory();
    } catch (error: any) {
      toast.error(error.message);
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("patient_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-16 w-16 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Neptune blue background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse-glow"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                <CardTitle>Your Health History</CardTitle>
              </div>
              <CardDescription>
                View your past health assessments and predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No history yet. Submit your first assessment!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <Card key={submission.id} className="border-l-4" style={{
                      borderLeftColor: submission.risk_level === "High" ? "#ef4444" : 
                                      submission.risk_level === "Moderate" ? "#f59e0b" : "#22c55e"
                    }}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{submission.patient_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(submission.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <Badge
                            variant={
                              submission.risk_level === "High"
                                ? "destructive"
                                : submission.risk_level === "Moderate"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {submission.risk_level} Risk ({submission.mortality_risk?.toFixed(1)}%)
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Age:</span>
                            <span className="ml-2 font-medium">{submission.age} years</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sex:</span>
                            <span className="ml-2 font-medium">{submission.sex}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">EF:</span>
                            <span className="ml-2 font-medium">{submission.ejection_fraction}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Creatinine:</span>
                            <span className="ml-2 font-medium">{submission.serum_creatinine}</span>
                          </div>
                        </div>

                        {submission.recommendations && (
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-sm">Recommendations:</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {submission.recommendations}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;