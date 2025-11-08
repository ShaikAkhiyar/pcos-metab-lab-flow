import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const participantSchema = z.object({
  participantId: z.string().min(1, "Participant ID is required"),
  age: z.number().min(1).max(150),
  sex: z.enum(["F", "M", "Other"]),
  ethnicity: z.string().min(1, "Ethnicity is required"),
  height: z.number().positive(),
  weight: z.number().positive(),
  dob: z.string().min(1, "Date of birth is required"),
  consent: z.boolean().refine(val => val === true, "Consent is required"),
});

interface ParticipantFormProps {
  onSuccess: (participantId: string) => void;
}

const ParticipantForm = ({ onSuccess }: ParticipantFormProps) => {
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        participantId: formData.get("participantId") as string,
        age: parseInt(formData.get("age") as string),
        sex: formData.get("sex") as string,
        ethnicity: formData.get("ethnicity") as string,
        height: parseFloat(formData.get("height") as string),
        weight: parseFloat(formData.get("weight") as string),
        dob: formData.get("dob") as string,
        consent,
      };

      participantSchema.parse(data);
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: participant, error } = await supabase
        .from("participants")
        .insert({
          user_id: user.id,
          participant_id: data.participantId,
          age: data.age,
          sex: data.sex,
          ethnicity: data.ethnicity,
          height_cm: data.height,
          weight_kg: data.weight,
          date_of_birth: data.dob,
          consent_version: "v1.0",
          consent_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Calculate and store BMI
      const bmi = data.weight / Math.pow(data.height / 100, 2);
      let bmiCategory = "Normal";
      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
      else if (bmi >= 30) bmiCategory = "Obese";

      await supabase.from("computed_values").insert([{
        participant_id: participant.id,
        bmi: parseFloat(bmi.toFixed(2)),
        bmi_category: bmiCategory,
      }]);

      toast({
        title: "Success",
        description: "Participant profile created successfully!",
      });

      onSuccess(participant.id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create participant",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="participantId">Participant ID *</Label>
          <Input
            id="participantId"
            name="participantId"
            placeholder="PCOS-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            name="age"
            type="number"
            min="1"
            max="150"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sex">Sex *</Label>
          <Select name="sex" required>
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="F">Female</SelectItem>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ethnicity">Ethnicity *</Label>
          <Input
            id="ethnicity"
            name="ethnicity"
            placeholder="e.g., Caucasian, Asian"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm) *</Label>
          <Input
            id="height"
            name="height"
            type="number"
            step="0.1"
            min="0"
            placeholder="170.5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="65.5"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            required
          />
        </div>
      </div>

      <div className="flex items-start space-x-3 rounded-md border p-4">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked as boolean)}
        />
        <div className="space-y-1 leading-none">
          <Label
            htmlFor="consent"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Research Consent *
          </Label>
          <p className="text-sm text-muted-foreground">
            I consent to the collection and use of my clinical data for research purposes. 
            I understand my data will be securely stored and used in accordance with privacy regulations.
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading || !consent}>
        {loading ? "Creating Profile..." : "Create Participant Profile"}
      </Button>
    </form>
  );
};

export default ParticipantForm;