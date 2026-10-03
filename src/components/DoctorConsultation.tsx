import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, Clock, Video, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DoctorConsultation = () => {
  const [selectedMode, setSelectedMode] = useState<"video" | "phone" | "message" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    symptoms: "",
    preferredDate: "",
    preferredTime: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMode) {
      toast({
        title: "Select Consultation Mode",
        description: "Please choose how you'd like to consult with the doctor.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Consultation Request Sent",
      description: "A cardiologist will contact you within 24 hours to confirm your appointment.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      symptoms: "",
      preferredDate: "",
      preferredTime: "",
    });
    setSelectedMode(null);
  };

  const consultationModes = [
    {
      id: "video" as const,
      icon: Video,
      label: "Video Call",
      description: "Face-to-face consultation via secure video",
      available: true,
    },
    {
      id: "phone" as const,
      icon: Phone,
      label: "Phone Call",
      description: "Direct phone consultation",
      available: true,
    },
    {
      id: "message" as const,
      icon: MessageSquare,
      label: "Message",
      description: "Text-based consultation and follow-up",
      available: true,
    },
  ];

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-primary/30 shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary animate-pulse" />
          <CardTitle className="text-foreground">Doctor Consultation</CardTitle>
        </div>
        <CardDescription>
          Book an appointment with our cardiology specialists
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultation Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Select Consultation Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {consultationModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    selectedMode === mode.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <mode.icon
                      className={`w-8 h-8 ${
                        selectedMode === mode.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm text-foreground">{mode.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {mode.description}
                      </p>
                    </div>
                    {mode.available && (
                      <Badge variant="secondary" className="text-xs">
                        Available
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-background/50 border-primary/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="bg-background/50 border-primary/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="bg-background/50 border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Symptoms / Reason for Consultation
              </label>
              <Textarea
                required
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="Describe your symptoms or reason for consultation..."
                className="bg-background/50 border-primary/30 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Preferred Date
                </label>
                <Input
                  required
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="bg-background/50 border-primary/30"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Preferred Time
                </label>
                <Input
                  required
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="bg-background/50 border-primary/30"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Request Consultation
          </Button>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> Our cardiology specialists are available Monday-Friday, 9 AM - 6 PM.
              Emergency cases will be prioritized. For immediate medical emergencies, please call 911.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
