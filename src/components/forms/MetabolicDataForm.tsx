import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MetabolicDataFormProps {
  participantId: string;
}

const MetabolicDataForm = ({ participantId }: MetabolicDataFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const fastingGlucose = formData.get("fastingGlucose") ? parseFloat(formData.get("fastingGlucose") as string) : null;
      const insulinFasting = formData.get("insulinFasting") ? parseFloat(formData.get("insulinFasting") as string) : null;
      
      // Calculate HOMA-IR: (Fasting Insulin × Fasting Glucose) / 405
      const homaIr = fastingGlucose && insulinFasting 
        ? (insulinFasting * fastingGlucose) / 405 
        : null;

      const data = {
        participant_id: participantId,
        sample_date: formData.get("sampleDate") as string,
        fasting_glucose: fastingGlucose,
        hba1c: formData.get("hba1c") ? parseFloat(formData.get("hba1c") as string) : null,
        insulin_fasting: insulinFasting,
        homa_ir: homaIr,
        hdl: formData.get("hdl") ? parseFloat(formData.get("hdl") as string) : null,
        ldl: formData.get("ldl") ? parseFloat(formData.get("ldl") as string) : null,
        triglycerides: formData.get("triglycerides") ? parseFloat(formData.get("triglycerides") as string) : null,
        total_cholesterol: formData.get("totalCholesterol") ? parseFloat(formData.get("totalCholesterol") as string) : null,
        blood_pressure_systolic: formData.get("bpSystolic") ? parseInt(formData.get("bpSystolic") as string) : null,
        blood_pressure_diastolic: formData.get("bpDiastolic") ? parseInt(formData.get("bpDiastolic") as string) : null,
        waist_circumference_cm: formData.get("waistCircumference") ? parseFloat(formData.get("waistCircumference") as string) : null,
      };

      setLoading(true);

      const { error } = await supabase
        .from("metabolic_data")
        .insert(data);

      if (error) throw error;

      // Update computed values with HOMA-IR
      if (homaIr) {
        await supabase
          .from("computed_values")
          .update({ homa_ir_computed: homaIr })
          .eq("participant_id", participantId);
      }

      toast({
        title: "Success",
        description: homaIr 
          ? `Metabolic data saved! HOMA-IR: ${homaIr.toFixed(2)}`
          : "Metabolic data saved successfully!",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save metabolic data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="sampleDate">Sample Date *</Label>
          <Input
            id="sampleDate"
            name="sampleDate"
            type="date"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fastingGlucose">Fasting Glucose (mg/dL)</Label>
          <Input
            id="fastingGlucose"
            name="fastingGlucose"
            type="number"
            step="0.1"
            min="0"
            placeholder="95.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hba1c">HbA1c (%)</Label>
          <Input
            id="hba1c"
            name="hba1c"
            type="number"
            step="0.1"
            min="0"
            placeholder="5.4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insulinFasting">Fasting Insulin (μU/mL)</Label>
          <Input
            id="insulinFasting"
            name="insulinFasting"
            type="number"
            step="0.1"
            min="0"
            placeholder="8.2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
          <Input
            id="hdl"
            name="hdl"
            type="number"
            step="0.1"
            min="0"
            placeholder="55.3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ldl">LDL Cholesterol (mg/dL)</Label>
          <Input
            id="ldl"
            name="ldl"
            type="number"
            step="0.1"
            min="0"
            placeholder="110.2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="triglycerides">Triglycerides (mg/dL)</Label>
          <Input
            id="triglycerides"
            name="triglycerides"
            type="number"
            step="0.1"
            min="0"
            placeholder="145.8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalCholesterol">Total Cholesterol (mg/dL)</Label>
          <Input
            id="totalCholesterol"
            name="totalCholesterol"
            type="number"
            step="0.1"
            min="0"
            placeholder="185.4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bpSystolic">Blood Pressure Systolic (mmHg)</Label>
          <Input
            id="bpSystolic"
            name="bpSystolic"
            type="number"
            min="0"
            placeholder="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bpDiastolic">Blood Pressure Diastolic (mmHg)</Label>
          <Input
            id="bpDiastolic"
            name="bpDiastolic"
            type="number"
            min="0"
            placeholder="80"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="waistCircumference">Waist Circumference (cm)</Label>
          <Input
            id="waistCircumference"
            name="waistCircumference"
            type="number"
            step="0.1"
            min="0"
            placeholder="85.5"
          />
        </div>
      </div>

      <div className="bg-accent/50 border border-accent p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> HOMA-IR will be automatically calculated from Fasting Glucose and Fasting Insulin if both are provided.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Metabolic Data"}
      </Button>
    </form>
  );
};

export default MetabolicDataForm;