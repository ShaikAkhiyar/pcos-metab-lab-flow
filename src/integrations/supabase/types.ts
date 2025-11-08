export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      computed_values: {
        Row: {
          bmi: number | null
          bmi_category: string | null
          computed_at: string | null
          homa_ir_computed: number | null
          id: string
          metabolic_syndrome_risk: string | null
          participant_id: string | null
        }
        Insert: {
          bmi?: number | null
          bmi_category?: string | null
          computed_at?: string | null
          homa_ir_computed?: number | null
          id?: string
          metabolic_syndrome_risk?: string | null
          participant_id?: string | null
        }
        Update: {
          bmi?: number | null
          bmi_category?: string | null
          computed_at?: string | null
          homa_ir_computed?: number | null
          id?: string
          metabolic_syndrome_risk?: string | null
          participant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "computed_values_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      genetic_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          genetic_test_type: string | null
          id: string
          participant_id: string | null
          upload_date: string | null
          variant_summary: Json | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          genetic_test_type?: string | null
          id?: string
          participant_id?: string | null
          upload_date?: string | null
          variant_summary?: Json | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          genetic_test_type?: string | null
          id?: string
          participant_id?: string | null
          upload_date?: string | null
          variant_summary?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "genetic_files_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      hormonal_data: {
        Row: {
          amh: number | null
          created_at: string | null
          dhea_s: number | null
          fsh: number | null
          id: string
          lh: number | null
          lh_to_fsh_ratio: number | null
          menstrual_history: string | null
          participant_id: string | null
          prolactin: number | null
          sample_date: string
          shbg: number | null
          testosterone_free: number | null
          testosterone_total: number | null
          updated_at: string | null
        }
        Insert: {
          amh?: number | null
          created_at?: string | null
          dhea_s?: number | null
          fsh?: number | null
          id?: string
          lh?: number | null
          lh_to_fsh_ratio?: number | null
          menstrual_history?: string | null
          participant_id?: string | null
          prolactin?: number | null
          sample_date: string
          shbg?: number | null
          testosterone_free?: number | null
          testosterone_total?: number | null
          updated_at?: string | null
        }
        Update: {
          amh?: number | null
          created_at?: string | null
          dhea_s?: number | null
          fsh?: number | null
          id?: string
          lh?: number | null
          lh_to_fsh_ratio?: number | null
          menstrual_history?: string | null
          participant_id?: string | null
          prolactin?: number | null
          sample_date?: string
          shbg?: number | null
          testosterone_free?: number | null
          testosterone_total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hormonal_data_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      imaging_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          imaging_date: string | null
          imaging_type: string | null
          notes: string | null
          participant_id: string | null
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          imaging_date?: string | null
          imaging_type?: string | null
          notes?: string | null
          participant_id?: string | null
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          imaging_date?: string | null
          imaging_type?: string | null
          notes?: string | null
          participant_id?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imaging_files_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      metabolic_data: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          created_at: string | null
          fasting_glucose: number | null
          hba1c: number | null
          hdl: number | null
          homa_ir: number | null
          id: string
          insulin_fasting: number | null
          ldl: number | null
          participant_id: string | null
          sample_date: string
          total_cholesterol: number | null
          triglycerides: number | null
          updated_at: string | null
          waist_circumference_cm: number | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          fasting_glucose?: number | null
          hba1c?: number | null
          hdl?: number | null
          homa_ir?: number | null
          id?: string
          insulin_fasting?: number | null
          ldl?: number | null
          participant_id?: string | null
          sample_date: string
          total_cholesterol?: number | null
          triglycerides?: number | null
          updated_at?: string | null
          waist_circumference_cm?: number | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          fasting_glucose?: number | null
          hba1c?: number | null
          hdl?: number | null
          homa_ir?: number | null
          id?: string
          insulin_fasting?: number | null
          ldl?: number | null
          participant_id?: string | null
          sample_date?: string
          total_cholesterol?: number | null
          triglycerides?: number | null
          updated_at?: string | null
          waist_circumference_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metabolic_data_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          age: number
          consent_date: string
          consent_version: string
          created_at: string | null
          date_of_birth: string
          ethnicity: string
          height_cm: number | null
          id: string
          participant_id: string
          sex: string
          updated_at: string | null
          user_id: string | null
          weight_kg: number | null
        }
        Insert: {
          age: number
          consent_date: string
          consent_version: string
          created_at?: string | null
          date_of_birth: string
          ethnicity: string
          height_cm?: number | null
          id?: string
          participant_id: string
          sex: string
          updated_at?: string | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Update: {
          age?: number
          consent_date?: string
          consent_version?: string
          created_at?: string | null
          date_of_birth?: string
          ethnicity?: string
          height_cm?: number | null
          id?: string
          participant_id?: string
          sex?: string
          updated_at?: string | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
