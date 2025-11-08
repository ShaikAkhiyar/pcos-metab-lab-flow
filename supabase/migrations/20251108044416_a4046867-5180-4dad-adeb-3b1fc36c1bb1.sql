-- Create participants table linked to auth users
CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  participant_id TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  sex TEXT NOT NULL CHECK (sex IN ('F', 'M', 'Other')),
  ethnicity TEXT NOT NULL,
  height_cm NUMERIC(5,2) CHECK (height_cm > 0),
  weight_kg NUMERIC(5,2) CHECK (weight_kg > 0),
  date_of_birth DATE NOT NULL,
  consent_version TEXT NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hormonal data table
CREATE TABLE public.hormonal_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  menstrual_history TEXT CHECK (menstrual_history IN ('regular', 'irregular')),
  lh NUMERIC(10,2),
  fsh NUMERIC(10,2),
  lh_to_fsh_ratio NUMERIC(10,2),
  testosterone_total NUMERIC(10,2),
  testosterone_free NUMERIC(10,2),
  dhea_s NUMERIC(10,2),
  shbg NUMERIC(10,2),
  prolactin NUMERIC(10,2),
  amh NUMERIC(10,2),
  sample_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create metabolic data table
CREATE TABLE public.metabolic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  fasting_glucose NUMERIC(10,2),
  hba1c NUMERIC(5,2),
  insulin_fasting NUMERIC(10,2),
  homa_ir NUMERIC(10,4),
  hdl NUMERIC(10,2),
  ldl NUMERIC(10,2),
  triglycerides NUMERIC(10,2),
  total_cholesterol NUMERIC(10,2),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  waist_circumference_cm NUMERIC(5,2),
  sample_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create genetic files metadata table
CREATE TABLE public.genetic_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  genetic_test_type TEXT CHECK (genetic_test_type IN ('SNP', 'WES', 'WGS', 'Other')),
  variant_summary JSONB,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create imaging files metadata table
CREATE TABLE public.imaging_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  imaging_type TEXT CHECK (imaging_type IN ('Ultrasound', 'MRI', 'CT', 'X-Ray', 'Other')),
  imaging_date DATE,
  notes TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create computed values table
CREATE TABLE public.computed_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  bmi NUMERIC(5,2),
  bmi_category TEXT,
  homa_ir_computed NUMERIC(10,4),
  metabolic_syndrome_risk TEXT,
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hormonal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metabolic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genetic_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imaging_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.computed_values ENABLE ROW LEVEL SECURITY;

-- RLS Policies for participants
CREATE POLICY "Users can view their own participant data"
  ON public.participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participant data"
  ON public.participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant data"
  ON public.participants FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for hormonal_data
CREATE POLICY "Users can view their own hormonal data"
  ON public.hormonal_data FOR SELECT
  USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own hormonal data"
  ON public.hormonal_data FOR INSERT
  WITH CHECK (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

-- RLS Policies for metabolic_data
CREATE POLICY "Users can view their own metabolic data"
  ON public.metabolic_data FOR SELECT
  USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own metabolic data"
  ON public.metabolic_data FOR INSERT
  WITH CHECK (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

-- RLS Policies for genetic_files
CREATE POLICY "Users can view their own genetic files"
  ON public.genetic_files FOR SELECT
  USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own genetic files"
  ON public.genetic_files FOR INSERT
  WITH CHECK (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

-- RLS Policies for imaging_files
CREATE POLICY "Users can view their own imaging files"
  ON public.imaging_files FOR SELECT
  USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own imaging files"
  ON public.imaging_files FOR INSERT
  WITH CHECK (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

-- RLS Policies for computed_values
CREATE POLICY "Users can view their own computed values"
  ON public.computed_values FOR SELECT
  USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own computed values"
  ON public.computed_values FOR INSERT
  WITH CHECK (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('genetic-data', 'genetic-data', false);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-imaging', 'medical-imaging', false);

-- Storage policies for genetic data
CREATE POLICY "Users can upload their own genetic data"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'genetic-data' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own genetic data"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'genetic-data' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for medical imaging
CREATE POLICY "Users can upload their own imaging data"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'medical-imaging' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own imaging data"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'medical-imaging' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON public.participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hormonal_data_updated_at
  BEFORE UPDATE ON public.hormonal_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metabolic_data_updated_at
  BEFORE UPDATE ON public.metabolic_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();