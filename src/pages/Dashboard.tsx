import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Activity, FileText, Upload, User, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import ParticipantForm from "@/components/forms/ParticipantForm";
import HormonalDataForm from "@/components/forms/HormonalDataForm";
import MetabolicDataForm from "@/components/forms/MetabolicDataForm";
import FileUploadForm from "@/components/forms/FileUploadForm";
import DataView from "@/components/DataView";

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user) {
      checkParticipant();
    }
  }, [session]);

  const checkParticipant = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("participants")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (data) {
      setParticipantId(data.id);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const handleParticipantCreated = (id: string) => {
    setParticipantId(id);
    toast({
      title: "Success",
      description: "Participant profile created successfully!",
    });
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PCOS Clinical Data System</h1>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!participantId ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Participant Enrollment
              </CardTitle>
              <CardDescription>
                Create your participant profile to begin data collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParticipantForm onSuccess={handleParticipantCreated} />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="hormonal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hormonal">Hormonal</TabsTrigger>
              <TabsTrigger value="metabolic">Metabolic</TabsTrigger>
              <TabsTrigger value="genetic">Genetic</TabsTrigger>
              <TabsTrigger value="imaging">Imaging</TabsTrigger>
              <TabsTrigger value="view">View Data</TabsTrigger>
            </TabsList>

            <TabsContent value="hormonal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Hormonal Panel Data
                  </CardTitle>
                  <CardDescription>
                    Record hormonal test results (LH, FSH, Testosterone, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HormonalDataForm participantId={participantId} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metabolic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Metabolic Panel Data
                  </CardTitle>
                  <CardDescription>
                    Record metabolic test results (Glucose, Insulin, Lipids, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MetabolicDataForm participantId={participantId} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="genetic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Genetic Data Upload
                  </CardTitle>
                  <CardDescription>
                    Upload genetic test files (VCF, SNP data)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploadForm participantId={participantId} fileType="genetic" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imaging">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Medical Imaging Upload
                  </CardTitle>
                  <CardDescription>
                    Upload medical images (Ultrasound, MRI, CT scans)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploadForm participantId={participantId} fileType="imaging" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="view">
              <DataView participantId={participantId} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Dashboard;