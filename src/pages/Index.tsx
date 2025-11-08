import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Shield, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">PCOS Clinical Data System</h1>
          </div>
          <Button onClick={() => navigate("/auth")}>
            Get Started
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Multimodal Clinical Data Collection Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Secure, comprehensive data management for PCOS and metabolic syndrome research
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="mr-4">
            Sign In
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Create Account
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Database className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multimodal Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Collect hormonal, metabolic, genetic, and imaging data in one secure platform
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>HIPAA Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enterprise-grade security with encrypted storage and role-based access control
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Automated Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatic calculation of BMI, HOMA-IR, and other computed clinical values
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>Data Export</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Export complete datasets in standardized formats for research analysis
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>Comprehensive clinical data management capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <strong>Participant Enrollment:</strong> Secure demographic data collection with informed consent management
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <strong>Hormonal Panels:</strong> Track LH, FSH, testosterone, AMH, and other endocrine markers
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <strong>Metabolic Data:</strong> Record glucose, insulin, lipid profiles, and blood pressure measurements
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <strong>Genetic Data:</strong> Secure upload and storage of VCF files and SNP panels
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <strong>Medical Imaging:</strong> Upload and manage ultrasound, MRI, and CT imaging files
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 PCOS Clinical Data System. Secure clinical research data management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
