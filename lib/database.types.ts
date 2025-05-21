export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      check_point_likes: {
        Row: {
          id: number;
          profile_id: string;
          check_point_id: number;
          created_at: string;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: number;
          profile_id: string;
          check_point_id: number;
          created_at?: string;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: number;
          profile_id?: string;
          check_point_id?: number;
          created_at?: string;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "check_point_likes_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "check_point_likes_check_point_id_fkey";
            columns: ["check_point_id"];
            referencedRelation: "check_points";
            referencedColumns: ["id"];
          },
        ];
      };
      brands: {
        Row: {
          id: number;
          name: string;
          image_url: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          image_url: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          image_url?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: number;
          brand_id: number;
          name: string;
          image_url: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: number;
          brand_id: number;
          name: string;
          image_url: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: number;
          brand_id?: number;
          name?: string;
          image_url?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_brand";
            columns: ["brand_id"];
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      vintages: {
        Row: {
          id: number;
          product_id: number;
          name: string;
          manufacturing_start_year: number;
          manufacturing_end_year: number;
          image_url: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: number;
          product_id: number;
          name: string;
          manufacturing_start_year: number;
          manufacturing_end_year: number;
          image_url: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: number;
          product_id?: number;
          name: string;
          manufacturing_start_year?: number;
          manufacturing_end_year?: number;
          image_url?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_product";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      check_points: {
        Row: {
          id: number;
          vintage_id: number;
          point: string;
          image_url: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
          profile_id: string | null;
        };
        Insert: {
          id?: number;
          vintage_id: number;
          point: string;
          image_url: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
          profile_id?: string | null;
        };
        Update: {
          id?: number;
          vintage_id?: number;
          point?: string;
          image_url?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
          profile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_vintage";
            columns: ["vintage_id"];
            referencedRelation: "vintages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_profile";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          email: string | null;
          website_url: string | null;
          twitter_url: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          linkedin_url: string | null;
          youtube_url: string | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          website_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          linkedin_url?: string | null;
          youtube_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          website_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          linkedin_url?: string | null;
          youtube_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
