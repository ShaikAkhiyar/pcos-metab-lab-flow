import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const hormonalSchema = z.object({
  menstrualHistory: z.enum(["regular", "irregular"]),
  sampleDate: z.string().min(1, "Sample date is required"),
  lh: z.number().positive().optional(),
  fsh: z.number().positive().optional(),
  testosteroneTotal: z.number().positive().optional(),
  testosteroneFree: z.number().positive().optional(),
});

interface HormonalDataFormProps {
  participantId: string;
}

const HormonalDataForm = ({ participantId }: HormonalDataFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const lh = formData.get("lh") ? parseFloat(formData.get("lh") as string) : null;
      const fsh = formData.get("fsh") ? parseFloat(formData.get("fsh") as string) : null;
      const lhToFshRatio = lh && fsh && fsh > 0 ? lh / fsh : null;

      const data = {
        participant_id: participantId,
        menstrual_history: formData.get("menstrualHistory") as string,
        sample_date: formData.get("sampleDate") as string,
        lh,
        fsh,
        lh_to_fsh_ratio: lhToFshRatio,
        testosterone_total: formData.get("testosteroneTotal") ? parseFloat(formData.get("testosteroneTotal") as string) : null,
        testosterone_free: formData.get("testosteroneFree") ? parseFloat(formData.get("testosteroneFree") as string) : null,
        dhea_s: formData.get("dheaS") ? parseFloat(formData.get("dheaS") as string) : null,
        shbg: formData.get("shbg") ? parseFloat(formData.get("shbg") as string) : null,
        prolactin: formData.get("prolactin") ? parseFloat(formData.get("prolactin") as string) : null,
        amh: formData.get("amh") ? parseFloat(formData.get("amh") as string) : null,
      };

      setLoading(true);

      const { error } = await supabase
        .from("hormonal_data")
        .insert(data);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hormonal data saved successfully!",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save hormonal data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="menstrualHistory">Menstrual History *</Label>
          <Select name="menstrualHistory" required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="irregular">Irregular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sampleDate">Sample Date *</Label>
          <Input
            id="sampleDate"
            name="sampleDate"
            type="date"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lh">LH (mIU/mL)</Label>
          <Input
            id="lh"
            name="lh"
            type="number"
            step="0.01"
            min="0"
            placeholder="5.2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fsh">FSH (mIU/mL)</Label>
          <Input
            id="fsh"
            name="fsh"
            type="number"
            step="0.01"
            min="0"
            placeholder="4.1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="testosteroneTotal">Total Testosterone (ng/dL)</Label>
          <Input
            id="testosteroneTotal"
            name="testosteroneTotal"
            type="number"
            step="0.01"
            min="0"
            placeholder="48.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="testosteroneFree">Free Testosterone (pg/mL)</Label>
          <Input
            id="testosteroneFree"
            name="testosteroneFree"
            type="number"
            step="0.01"
            min="0"
            placeholder="2.3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dheaS">DHEA-S (μg/dL)</Label>
          <Input
            id="dheaS"
            name="dheaS"
            type="number"
            step="0.01"
            min="0"
            placeholder="245.6"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shbg">SHBG (nmol/L)</Label>
          <Input
            id="shbg"
            name="shbg"
            type="number"
            step="0.01"
            min="0"
            placeholder="35.2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prolactin">Prolactin (ng/mL)</Label>
          <Input
            id="prolactin"
            name="prolactin"
            type="number"
            step="0.01"
            min="0"
            placeholder="12.4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amh">AMH (ng/mL)</Label>
          <Input
            id="amh"
            name="amh"
            type="number"
            step="0.01"
            min="0"
            placeholder="6.8"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Hormonal Data"}
      </Button>
    </form>
  );
};

export default HormonalDataForm;