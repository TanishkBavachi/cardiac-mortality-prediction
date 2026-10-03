import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PatientData {
  patientName: string;
  age: number;
  sex: string;
  ejectionFraction: number;
  serumCreatinine: number;
  serumSodium: number;
  platelets: number;
  creatininePhosphokinase: number;
  highBloodPressure: boolean;
  diabetes: boolean;
  anaemia: boolean;
  smoking: boolean;
  medicines?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const patientData: PatientData = await req.json();

    // Check if external ML model is configured
    const mlModelEndpoint = Deno.env.get('ML_MODEL_ENDPOINT');
    const mlModelApiKey = Deno.env.get('ML_MODEL_API_KEY');
    
    let riskScore = 0;
    
    // If ML model is configured, use it
    if (mlModelEndpoint && mlModelApiKey) {
      try {
        console.log('Calling external ML model...');
        const mlResponse = await fetch(mlModelEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mlModelApiKey}`
          },
          body: JSON.stringify(patientData)
        });

        if (mlResponse.ok) {
          const mlResult = await mlResponse.json();
          riskScore = mlResult.mortalityRisk || mlResult.risk_score || 0;
          console.log('ML model prediction:', riskScore);
        } else {
          console.error('ML model error:', await mlResponse.text());
          throw new Error('ML model request failed');
        }
      } catch (mlError) {
        console.error('Error calling ML model:', mlError);
        // Fall back to built-in calculation
        console.log('Falling back to built-in risk calculation');
      }
    }
    
    // If no ML model or ML model failed, use built-in calculation
    if (riskScore === 0) {
      // Age factor (older = higher risk)
      riskScore += (patientData.age / 100) * 20;
    
    // Ejection fraction (lower = higher risk)
    riskScore += (100 - patientData.ejectionFraction) * 0.5;
    
    // Serum creatinine (higher = higher risk)
    riskScore += patientData.serumCreatinine * 10;
    
    // Serum sodium (abnormal = higher risk)
    const sodiumDiff = Math.abs(patientData.serumSodium - 137);
    riskScore += sodiumDiff * 2;
    
    // Platelets (abnormal = higher risk)
    if (patientData.platelets < 150 || patientData.platelets > 400) {
      riskScore += 10;
    }
    
    // CPK levels
    if (patientData.creatininePhosphokinase > 200) {
      riskScore += 5;
    }
    
    // Comorbidities
    if (patientData.highBloodPressure) riskScore += 8;
    if (patientData.diabetes) riskScore += 10;
    if (patientData.anaemia) riskScore += 7;
    if (patientData.smoking) riskScore += 12;
    
    // Protective medications
    if (patientData.medicines) {
      const meds = patientData.medicines.toLowerCase();
      if (meds.includes("ace inhibitor") || meds.includes("enalapril") || meds.includes("lisinopril")) riskScore -= 5;
      if (meds.includes("beta blocker") || meds.includes("metoprolol") || meds.includes("carvedilol")) riskScore -= 5;
      if (meds.includes("arb") || meds.includes("losartan") || meds.includes("valsartan")) riskScore -= 4;
      if (meds.includes("diuretic") || meds.includes("furosemide")) riskScore -= 3;
      if (meds.includes("statin") || meds.includes("atorvastatin")) riskScore -= 3;
    }
    }
    
    // Normalize to 0-100 range
    const mortalityRisk = Math.max(0, Math.min(100, riskScore));
    
    // Determine risk level
    let riskLevel: string;
    if (mortalityRisk < 30) riskLevel = "Low";
    else if (mortalityRisk < 60) riskLevel = "Moderate";
    else riskLevel = "High";

    // Generate recommendations using AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    let recommendations = "";
    
    if (LOVABLE_API_KEY) {
      const prompt = `Based on this heart failure patient data, provide specific recommendations:
      
Risk Level: ${riskLevel} (${mortalityRisk.toFixed(1)}%)
Age: ${patientData.age}, Sex: ${patientData.sex}
Ejection Fraction: ${patientData.ejectionFraction}%
Serum Creatinine: ${patientData.serumCreatinine}
High BP: ${patientData.highBloodPressure}, Diabetes: ${patientData.diabetes}
Smoking: ${patientData.smoking}, Anaemia: ${patientData.anaemia}
Current Medications: ${patientData.medicines || "None"}

Provide:
1. Specific exercises and physical activities (with duration and frequency)
2. Yoga poses beneficial for heart health
3. Medication recommendations (if current list is incomplete)
4. Detailed dietary recommendations
5. Healthy foods to include
6. When to consult a doctor urgently

Be specific and actionable.`;

      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a medical AI providing specific, actionable health recommendations." },
              { role: "user", content: prompt }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          recommendations = aiData.choices[0].message.content;
        }
      } catch (aiError) {
        console.error("AI recommendation error:", aiError);
      }
    }

    // Fallback recommendations if AI fails
    if (!recommendations) {
      recommendations = `General Recommendations for ${riskLevel} Risk:

EXERCISES:
- Walking: 20-30 minutes daily at moderate pace
- Light cardio: Swimming or cycling 3x per week
- Strength training: Light weights 2x per week
${riskLevel === "High" ? "⚠️ Consult doctor before starting exercise" : ""}

YOGA:
- Pranayama (breathing exercises)
- Shavasana (relaxation pose)
- Gentle stretches
- Avoid intense inversions

MEDICATIONS TO DISCUSS:
${!patientData.medicines?.toLowerCase().includes("ace inhibitor") ? "- ACE Inhibitors (e.g., Enalapril, Lisinopril)\n" : ""}
${!patientData.medicines?.toLowerCase().includes("beta blocker") ? "- Beta Blockers (e.g., Metoprolol, Carvedilol)\n" : ""}
- Diuretics if fluid retention present

DIET:
- Low sodium (< 2000mg daily)
- Heart-healthy fats (olive oil, fish)
- Whole grains and fiber
- Limit processed foods
- Control portion sizes

HEALTHY FOODS:
- Leafy greens (spinach, kale)
- Fatty fish (salmon, mackerel)
- Berries and fruits
- Nuts and seeds
- Legumes

⚠️ CONSULT DOCTOR IF:
- Chest pain or pressure
- Severe shortness of breath
- Rapid weight gain
- Swelling in legs/ankles
- Dizziness or fainting`;
    }

    // Save submission to database
    const { error: insertError } = await supabase
      .from("patient_submissions")
      .insert({
        user_id: user.id,
        patient_name: patientData.patientName,
        age: patientData.age,
        sex: patientData.sex,
        ejection_fraction: patientData.ejectionFraction,
        serum_creatinine: patientData.serumCreatinine,
        serum_sodium: patientData.serumSodium,
        platelets: patientData.platelets,
        creatinine_phosphokinase: patientData.creatininePhosphokinase,
        high_blood_pressure: patientData.highBloodPressure,
        diabetes: patientData.diabetes,
        anaemia: patientData.anaemia,
        smoking: patientData.smoking,
        medicines: patientData.medicines,
        mortality_risk: mortalityRisk,
        risk_level: riskLevel,
        recommendations: recommendations,
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
    }

    return new Response(
      JSON.stringify({
        mortalityRisk,
        riskLevel,
        recommendations,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});