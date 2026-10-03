import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield } from "lucide-react";

interface PatientSubmission {
  id: string;
  patient_name: string;
  age: number;
  sex: string;
  mortality_risk: number;
  risk_level: string;
  created_at: string;
  user_id: string;
}

interface Profile {
  full_name: string;
  email: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<PatientSubmission[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.message);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("patient_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch user profiles separately
      const userIds = submissionsData?.map(s => s.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      const combined = submissionsData?.map(sub => ({
        ...sub,
        profile: profilesMap.get(sub.user_id)
      })) || [];

      setSubmissions(combined as any);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
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
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Admin Dashboard</CardTitle>
            </div>
            <CardDescription>
              View all patient submissions and risk assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Risk %</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.patient_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{(submission as any).profile?.full_name || "N/A"}</span>
                          <span className="text-xs text-muted-foreground">
                            {(submission as any).profile?.email || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{submission.age}</TableCell>
                      <TableCell>{submission.sex}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.risk_level === "High"
                              ? "destructive"
                              : submission.risk_level === "Moderate"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {submission.risk_level}
                        </Badge>
                      </TableCell>
                      <TableCell>{submission.mortality_risk?.toFixed(1)}%</TableCell>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPage;