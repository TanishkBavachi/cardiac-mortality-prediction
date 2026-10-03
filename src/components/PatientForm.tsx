import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";

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

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

export const PatientForm = ({ onSubmit, isLoading }: PatientFormProps) => {
  const [formData, setFormData] = useState<PatientData>({
    age: "",
    gender: "",
    ejectionFraction: "",
    serumCreatinine: "",
    serumSodium: "",
    cpk: "",
    platelets: "",
    smokingStatus: "",
    diabetes: "",
    hypertension: "",
    anaemia: "",
    medicines: "",
    notes: ""
  });

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Heart className="h-6 w-6 text-destructive" />
          Patient Information
        </CardTitle>
        <CardDescription>
          Enter patient data for heart failure mortality risk assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="65"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleInputChange("gender", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ejectionFraction">Ejection Fraction (%)</Label>
              <Input
                id="ejectionFraction"
                type="number"
                step="0.1"
                placeholder="45.5"
                value={formData.ejectionFraction}
                onChange={(e) => handleInputChange("ejectionFraction", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serumCreatinine">Serum Creatinine (mg/dL)</Label>
              <Input
                id="serumCreatinine"
                type="number"
                step="0.1"
                placeholder="1.2"
                value={formData.serumCreatinine}
                onChange={(e) => handleInputChange("serumCreatinine", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serumSodium">Serum Sodium (mEq/L)</Label>
              <Input
                id="serumSodium"
                type="number"
                placeholder="140"
                value={formData.serumSodium}
                onChange={(e) => handleInputChange("serumSodium", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpk">CPK Enzyme (mcg/L)</Label>
              <Input
                id="cpk"
                type="number"
                placeholder="250"
                value={formData.cpk}
                onChange={(e) => handleInputChange("cpk", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platelets">Platelets (kiloplatelets/mL)</Label>
              <Input
                id="platelets"
                type="number"
                placeholder="300"
                value={formData.platelets}
                onChange={(e) => handleInputChange("platelets", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smokingStatus">Smoking Status</Label>
              <Select onValueChange={(value) => handleInputChange("smokingStatus", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select smoking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never smoked</SelectItem>
                  <SelectItem value="former">Former smoker</SelectItem>
                  <SelectItem value="current">Current smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diabetes">Diabetes</Label>
              <Select onValueChange={(value) => handleInputChange("diabetes", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Diabetes status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hypertension">Hypertension</Label>
              <Select onValueChange={(value) => handleInputChange("hypertension", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Hypertension status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anaemia">Anaemia</Label>
              <Select onValueChange={(value) => handleInputChange("anaemia", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Anaemia status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicines">Current Medications Prescribed</Label>
            <Textarea
              id="medicines"
              placeholder="List all current medications (e.g., ACE inhibitors, Beta blockers, Diuretics, Statins...)"
              value={formData.medicines}
              onChange={(e) => handleInputChange("medicines", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional clinical observations or notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full transition-all duration-300 hover:shadow-lg hover:scale-105" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing...
              </span>
            ) : (
              "Predict Mortality Risk"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};