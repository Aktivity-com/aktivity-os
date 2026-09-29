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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      b2b_leads: {
        Row: {
          admin_notes: string | null
          admin_status: string
          campaign: string | null
          contact_area: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          contact_role: string | null
          content: string | null
          conversion_page: string | null
          created_at: string
          crm_contact_id: string | null
          crm_organization_id: string | null
          details: Json
          first_touch: Json | null
          id: string
          landing_page: string | null
          last_touch: Json | null
          lead_type: string
          marketing_consent: boolean
          medium: string | null
          organization_name: string
          privacy_acknowledged: boolean
          referral_code: string | null
          referrer: string | null
          source: string | null
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          contact_area?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          contact_role?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          crm_contact_id?: string | null
          crm_organization_id?: string | null
          details?: Json
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          lead_type: string
          marketing_consent?: boolean
          medium?: string | null
          organization_name: string
          privacy_acknowledged?: boolean
          referral_code?: string | null
          referrer?: string | null
          source?: string | null
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          contact_area?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          contact_role?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          crm_contact_id?: string | null
          crm_organization_id?: string | null
          details?: Json
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          lead_type?: string
          marketing_consent?: boolean
          medium?: string | null
          organization_name?: string
          privacy_acknowledged?: boolean
          referral_code?: string | null
          referrer?: string | null
          source?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_leads_crm_contact_id_fkey"
            columns: ["crm_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_leads_crm_organization_id_fkey"
            columns: ["crm_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_products: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          default_value: number | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          default_value?: number | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          default_value?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          admin_notes: string | null
          admin_status: string
          campaign: string | null
          content: string | null
          conversion_page: string | null
          created_at: string
          email: string
          first_touch: Json | null
          id: string
          landing_page: string | null
          last_touch: Json | null
          marketing_consent: boolean
          medium: string | null
          message: string
          name: string
          organization: string
          phone: string | null
          privacy_acknowledged: boolean
          reason: string
          referral_code: string | null
          referrer: string | null
          role: string | null
          source: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          email: string
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          marketing_consent?: boolean
          medium?: string | null
          message: string
          name: string
          organization: string
          phone?: string | null
          privacy_acknowledged?: boolean
          reason: string
          referral_code?: string | null
          referrer?: string | null
          role?: string | null
          source?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          email?: string
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          marketing_consent?: boolean
          medium?: string | null
          message?: string
          name?: string
          organization?: string
          phone?: string | null
          privacy_acknowledged?: boolean
          reason?: string
          referral_code?: string | null
          referrer?: string | null
          role?: string | null
          source?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          linkedin_url: string | null
          notes: string | null
          owner_id: string
          phone: string | null
          source: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          activity_date: string
          activity_type: string
          contact_id: string | null
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          opportunity_id: string | null
          organization_id: string | null
          owner_id: string
          result: string | null
          summary: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          organization_id?: string | null
          owner_id?: string
          result?: string | null
          summary: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          organization_id?: string | null
          owner_id?: string
          result?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_opportunities: {
        Row: {
          closed_at: string | null
          created_at: string
          created_by: string | null
          currency: string
          expected_close_date: string | null
          id: string
          loss_reason: string | null
          name: string
          notes: string | null
          organization_id: string
          owner_id: string
          pipeline_id: string
          primary_contact_id: string | null
          product_id: string | null
          source: string | null
          stage_id: string
          status: string
          updated_at: string
          updated_by: string | null
          value: number | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          name: string
          notes?: string | null
          organization_id: string
          owner_id?: string
          pipeline_id: string
          primary_contact_id?: string | null
          product_id?: string | null
          source?: string | null
          stage_id: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          value?: number | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          name?: string
          notes?: string | null
          organization_id?: string
          owner_id?: string
          pipeline_id?: string
          primary_contact_id?: string | null
          product_id?: string | null
          source?: string | null
          stage_id?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "commercial_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipeline_stages: {
        Row: {
          id: string
          is_closed: boolean
          is_lost: boolean
          is_won: boolean
          name: string
          pipeline_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_closed?: boolean
          is_lost?: boolean
          is_won?: boolean
          name: string
          pipeline_id: string
          sort_order: number
        }
        Update: {
          id?: string
          is_closed?: boolean
          is_lost?: boolean
          is_won?: boolean
          name?: string
          pipeline_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_pipeline_stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipelines: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      organization_contacts: {
        Row: {
          contact_id: string
          created_at: string
          department: string | null
          end_date: string | null
          id: string
          is_primary: boolean
          job_title: string | null
          organization_id: string
          start_date: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          department?: string | null
          end_date?: string | null
          id?: string
          is_primary?: boolean
          job_title?: string | null
          organization_id: string
          start_date?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          department?: string | null
          end_date?: string | null
          id?: string
          is_primary?: boolean
          job_title?: string | null
          organization_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role_type: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          domain: string | null
          id: string
          legal_name: string | null
          name: string
          notes: string | null
          organization_type: string
          owner_id: string
          region: string | null
          sector: string | null
          size: string | null
          source: string | null
          status: string
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          domain?: string | null
          id?: string
          legal_name?: string | null
          name: string
          notes?: string | null
          organization_type?: string
          owner_id?: string
          region?: string | null
          sector?: string | null
          size?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          domain?: string | null
          id?: string
          legal_name?: string | null
          name?: string
          notes?: string | null
          organization_type?: string
          owner_id?: string
          region?: string | null
          sector?: string | null
          size?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_value: Json | null
          old_value: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "os_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_areas: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      os_goals: {
        Row: {
          area_id: string | null
          auto_calculate: boolean
          created_at: string
          current_value: number
          end_date: string
          id: string
          metric_type: string
          name: string
          notes: string | null
          owner_id: string
          start_date: string
          status: string
          target_value: number
          unit: string | null
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          auto_calculate?: boolean
          created_at?: string
          current_value?: number
          end_date: string
          id?: string
          metric_type: string
          name: string
          notes?: string | null
          owner_id?: string
          start_date: string
          status?: string
          target_value: number
          unit?: string | null
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          auto_calculate?: boolean
          created_at?: string
          current_value?: number
          end_date?: string
          id?: string
          metric_type?: string
          name?: string
          notes?: string | null
          owner_id?: string
          start_date?: string
          status?: string
          target_value?: number
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_goals_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "os_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_goals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_inbox_items: {
        Row: {
          content: string
          converted_to_id: string | null
          converted_to_type: string | null
          created_at: string
          id: string
          owner_id: string
          processed_at: string | null
          source: string
          status: string
          type: string
        }
        Insert: {
          content: string
          converted_to_id?: string | null
          converted_to_type?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          processed_at?: string | null
          source?: string
          status?: string
          type?: string
        }
        Update: {
          content?: string
          converted_to_id?: string | null
          converted_to_type?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          processed_at?: string | null
          source?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_inbox_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          project_id: string | null
          status: string
          target_date: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id?: string
          project_id?: string | null
          status?: string
          target_date: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          project_id?: string | null
          status?: string
          target_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_milestones_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "os_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      os_projects: {
        Row: {
          area_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          parent_project_id: string | null
          priority: string
          progress: number
          start_date: string | null
          status: string
          target_date: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          area_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id?: string
          parent_project_id?: string | null
          priority?: string
          progress?: number
          start_date?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          area_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          parent_project_id?: string | null
          priority?: string
          progress?: number
          start_date?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "os_projects_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "os_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "os_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_resource_links: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          resource_type: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          resource_type?: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          resource_type?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_resource_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "os_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_task_dependencies: {
        Row: {
          created_at: string
          depends_on_task_id: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string
          depends_on_task_id: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string
          depends_on_task_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "os_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "os_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      os_tasks: {
        Row: {
          blocked_reason: string | null
          calendar_event_id: string | null
          calendar_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          deadline: string | null
          description: string | null
          estimated_minutes: number | null
          id: string
          notes: string | null
          owner_id: string
          priority: string
          project_id: string | null
          scheduled_date: string | null
          source_id: string | null
          source_type: string | null
          started_at: string | null
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          blocked_reason?: string | null
          calendar_event_id?: string | null
          calendar_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          notes?: string | null
          owner_id?: string
          priority?: string
          project_id?: string | null
          scheduled_date?: string | null
          source_id?: string | null
          source_type?: string | null
          started_at?: string | null
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          blocked_reason?: string | null
          calendar_event_id?: string | null
          calendar_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          notes?: string | null
          owner_id?: string
          priority?: string
          project_id?: string | null
          scheduled_date?: string | null
          source_id?: string | null
          source_type?: string | null
          started_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "os_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_tasks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "os_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_tasks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "os_users"
            referencedColumns: ["id"]
          },
        ]
      }
      os_users: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_default: boolean
          name: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          name: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          name?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      pre_registrations: {
        Row: {
          admin_notes: string | null
          admin_status: string
          campaign: string | null
          content: string | null
          conversion_page: string | null
          created_at: string
          email: string
          email_normalized: string | null
          first_touch: Json | null
          id: string
          landing_page: string | null
          last_touch: Json | null
          marketing_consent: boolean
          medium: string | null
          privacy_acknowledged: boolean
          ranking: string | null
          referral_code: string | null
          referrer: string | null
          source: string | null
          sport: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          email: string
          email_normalized?: string | null
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          marketing_consent?: boolean
          medium?: string | null
          privacy_acknowledged?: boolean
          ranking?: string | null
          referral_code?: string | null
          referrer?: string | null
          source?: string | null
          sport?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          email?: string
          email_normalized?: string | null
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          marketing_consent?: boolean
          medium?: string | null
          privacy_acknowledged?: boolean
          ranking?: string | null
          referral_code?: string | null
          referrer?: string | null
          source?: string | null
          sport?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          admin_notes: string | null
          admin_status: string
          campaign: string | null
          content: string | null
          conversion_page: string | null
          created_at: string
          first_touch: Json | null
          id: string
          landing_page: string | null
          last_touch: Json | null
          medium: string | null
          organization_name: string
          privacy_acknowledged: boolean
          recommended_email: string | null
          recommended_name: string
          recommended_phone: string | null
          recommended_role: string | null
          referral_code: string | null
          referral_type: string
          referrer_details: Json
          referrer_email: string
          referrer_name: string
          referrer_url: string | null
          source: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          medium?: string | null
          organization_name: string
          privacy_acknowledged?: boolean
          recommended_email?: string | null
          recommended_name: string
          recommended_phone?: string | null
          recommended_role?: string | null
          referral_code?: string | null
          referral_type: string
          referrer_details?: Json
          referrer_email: string
          referrer_name: string
          referrer_url?: string | null
          source?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_status?: string
          campaign?: string | null
          content?: string | null
          conversion_page?: string | null
          created_at?: string
          first_touch?: Json | null
          id?: string
          landing_page?: string | null
          last_touch?: Json | null
          medium?: string | null
          organization_name?: string
          privacy_acknowledged?: boolean
          recommended_email?: string | null
          recommended_name?: string
          recommended_phone?: string | null
          recommended_role?: string | null
          referral_code?: string | null
          referral_type?: string
          referrer_details?: Json
          referrer_email?: string
          referrer_name?: string
          referrer_url?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_default_os_owner_id: { Args: never; Returns: string }
      is_active_os_user: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
