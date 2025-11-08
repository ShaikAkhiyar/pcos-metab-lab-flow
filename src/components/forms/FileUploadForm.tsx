import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, File } from "lucide-react";

interface FileUploadFormProps {
  participantId: string;
  fileType: "genetic" | "imaging";
}

const FileUploadForm = ({ participantId, fileType }: FileUploadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const bucketName = fileType === "genetic" ? "genetic-data" : "medical-imaging";
      const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Save metadata to database
      if (fileType === "genetic") {
        const { error: dbError } = await supabase
          .from("genetic_files")
          .insert({
            participant_id: participantId,
            file_name: selectedFile.name,
            file_path: filePath,
            file_size: selectedFile.size,
            genetic_test_type: formData.get("testType") as string,
          });

        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from("imaging_files")
          .insert({
            participant_id: participantId,
            file_name: selectedFile.name,
            file_path: filePath,
            file_size: selectedFile.size,
            imaging_type: formData.get("imagingType") as string,
            imaging_date: formData.get("imagingDate") as string || null,
            notes: formData.get("notes") as string || null,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: `${fileType === "genetic" ? "Genetic" : "Imaging"} file uploaded successfully!`,
      });

      (e.target as HTMLFormElement).reset();
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">
          {fileType === "genetic" ? "Genetic Data File" : "Medical Image"} *
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept={fileType === "genetic" ? ".vcf,.txt,.csv" : "image/*,.dcm"}
            required
            className="flex-1"
          />
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <File className="h-4 w-4" />
              <span>{selectedFile.name}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {fileType === "genetic" 
            ? "Supported formats: VCF, TXT, CSV" 
            : "Supported formats: JPG, PNG, DICOM, etc."}
        </p>
      </div>

      {fileType === "genetic" ? (
        <div className="space-y-2">
          <Label htmlFor="testType">Genetic Test Type *</Label>
          <Select name="testType" required>
            <SelectTrigger>
              <SelectValue placeholder="Select test type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SNP">SNP Panel</SelectItem>
              <SelectItem value="WES">Whole Exome Sequencing (WES)</SelectItem>
              <SelectItem value="WGS">Whole Genome Sequencing (WGS)</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="imagingType">Imaging Type *</Label>
            <Select name="imagingType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select imaging type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                <SelectItem value="MRI">MRI</SelectItem>
                <SelectItem value="CT">CT Scan</SelectItem>
                <SelectItem value="X-Ray">X-Ray</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagingDate">Imaging Date</Label>
            <Input
              id="imagingDate"
              name="imagingDate"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional notes about the imaging..."
              rows={3}
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={loading || !selectedFile}>
        <Upload className="h-4 w-4 mr-2" />
        {loading ? "Uploading..." : "Upload File"}
      </Button>
    </form>
  );
};

export default FileUploadForm;