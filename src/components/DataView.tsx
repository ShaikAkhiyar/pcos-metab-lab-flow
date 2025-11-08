import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Activity, FileText, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataViewProps {
  participantId: string;
}

const DataView = ({ participantId }: DataViewProps) => {
  const [participant, setParticipant] = useState<any>(null);
  const [hormonalData, setHormonalData] = useState<any[]>([]);
  const [metabolicData, setMetabolicData] = useState<any[]>([]);
  const [geneticFiles, setGeneticFiles] = useState<any[]>([]);
  const [imagingFiles, setImagingFiles] = useState<any[]>([]);
  const [computedValues, setComputedValues] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [participantId]);

  const fetchData = async () => {
    try {
      const [
        { data: participantData },
        { data: hormonalResults },
        { data: metabolicResults },
        { data: geneticResults },
        { data: imagingResults },
        { data: computedResults },
      ] = await Promise.all([
        supabase.from("participants").select("*").eq("id", participantId).single(),
        supabase.from("hormonal_data").select("*").eq("participant_id", participantId),
        supabase.from("metabolic_data").select("*").eq("participant_id", participantId),
        supabase.from("genetic_files").select("*").eq("participant_id", participantId),
        supabase.from("imaging_files").select("*").eq("participant_id", participantId),
        supabase.from("computed_values").select("*").eq("participant_id", participantId).maybeSingle(),
      ]);

      setParticipant(participantData);
      setHormonalData(hormonalResults || []);
      setMetabolicData(metabolicResults || []);
      setGeneticFiles(geneticResults || []);
      setImagingFiles(imagingResults || []);
      setComputedValues(computedResults);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const exportData = {
      participant,
      hormonalData,
      metabolicData,
      geneticFiles: geneticFiles.map(f => ({ ...f, file_path: undefined })),
      imagingFiles: imagingFiles.map(f => ({ ...f, file_path: undefined })),
      computedValues,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `participant_${participant?.participant_id}_data.json`;
    link.click();

    toast({
      title: "Success",
      description: "Data exported successfully!",
    });
  };

  if (!participant) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clinical Data Summary</h2>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Participant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Participant ID</p>
            <p className="font-semibold">{participant.participant_id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="font-semibold">{participant.age} years</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sex</p>
            <p className="font-semibold">{participant.sex}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ethnicity</p>
            <p className="font-semibold">{participant.ethnicity}</p>
          </div>
          {computedValues && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">BMI</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{computedValues.bmi}</p>
                  <Badge variant="outline">{computedValues.bmi_category}</Badge>
                </div>
              </div>
              {computedValues.homa_ir_computed && (
                <div>
                  <p className="text-sm text-muted-foreground">HOMA-IR</p>
                  <p className="font-semibold">{computedValues.homa_ir_computed}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Hormonal Data ({hormonalData.length} records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hormonalData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample Date</TableHead>
                  <TableHead>Menstrual History</TableHead>
                  <TableHead>LH</TableHead>
                  <TableHead>FSH</TableHead>
                  <TableHead>LH:FSH Ratio</TableHead>
                  <TableHead>Testosterone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hormonalData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.sample_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={record.menstrual_history === "regular" ? "default" : "secondary"}>
                        {record.menstrual_history}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.lh || "—"}</TableCell>
                    <TableCell>{record.fsh || "—"}</TableCell>
                    <TableCell>{record.lh_to_fsh_ratio?.toFixed(2) || "—"}</TableCell>
                    <TableCell>{record.testosterone_total || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No hormonal data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Metabolic Data ({metabolicData.length} records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metabolicData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample Date</TableHead>
                  <TableHead>Glucose</TableHead>
                  <TableHead>HbA1c</TableHead>
                  <TableHead>Insulin</TableHead>
                  <TableHead>HOMA-IR</TableHead>
                  <TableHead>HDL</TableHead>
                  <TableHead>LDL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metabolicData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.sample_date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.fasting_glucose || "—"}</TableCell>
                    <TableCell>{record.hba1c || "—"}</TableCell>
                    <TableCell>{record.insulin_fasting || "—"}</TableCell>
                    <TableCell>{record.homa_ir?.toFixed(2) || "—"}</TableCell>
                    <TableCell>{record.hdl || "—"}</TableCell>
                    <TableCell>{record.ldl || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No metabolic data available</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Genetic Files ({geneticFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {geneticFiles.length > 0 ? (
              <div className="space-y-2">
                {geneticFiles.map((file) => (
                  <div key={file.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{file.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.genetic_test_type} • {(file.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge>{new Date(file.upload_date).toLocaleDateString()}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No genetic files uploaded</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Imaging Files ({imagingFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {imagingFiles.length > 0 ? (
              <div className="space-y-2">
                {imagingFiles.map((file) => (
                  <div key={file.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{file.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.imaging_type} • {(file.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge>{new Date(file.upload_date).toLocaleDateString()}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No imaging files uploaded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataView;