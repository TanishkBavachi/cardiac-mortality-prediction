import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast } from "sonner";
import { Heart } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: true,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      setLinkSent(true);
      setResendDisabled(true);
      setCountdown(60);
      toast.success(`Magic link sent to ${email}! Check your inbox and spam folder.`, {
        duration: 6000,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      setLinkSent(true);
      setResendDisabled(true);
      setCountdown(60);
      toast.success(`Magic link sent to ${email}! Check your inbox and spam folder.`, {
        duration: 6000,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      setResendDisabled(true);
      setCountdown(60);
      toast.success("New magic link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Neptune blue background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse-glow"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <Card className="w-full max-w-md relative z-10 shadow-card animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary animate-pulse-glow" />
          </div>
          <CardTitle className="text-2xl">CardioPredict AI</CardTitle>
          <CardDescription>Sign in to access your health data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              {!linkSent ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Login Link"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We'll email you a magic link for instant access
                  </p>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">📧</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Check your email!
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          We've sent a magic link to <span className="font-medium text-foreground">{email}</span>
                        </p>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <p>✓ Click the link in your email to login instantly</p>
                          <p>✓ Check your spam/junk folder if you don't see it</p>
                          <p>✓ The link expires in 60 minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleResendLink}
                      disabled={resendDisabled || isLoading}
                    >
                      {resendDisabled ? `Resend in ${countdown}s` : "Resend Link"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => {
                        setLinkSent(false);
                        setEmail("");
                      }}
                    >
                      Change Email
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="signup">
              {!linkSent ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We'll email you a magic link to get started
                  </p>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">📧</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Check your email!
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          We've sent a magic link to <span className="font-medium text-foreground">{email}</span>
                        </p>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <p>✓ Click the link in your email to login instantly</p>
                          <p>✓ Check your spam/junk folder if you don't see it</p>
                          <p>✓ The link expires in 60 minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleResendLink}
                      disabled={resendDisabled || isLoading}
                    >
                      {resendDisabled ? `Resend in ${countdown}s` : "Resend Link"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => {
                        setLinkSent(false);
                        setEmail("");
                        setFullName("");
                      }}
                    >
                      Change Email
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;