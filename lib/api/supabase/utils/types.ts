// Supabaseのエラー型定義
export interface SupabaseErrorType {
  message: string;
  code?: string;
  details?: Record<string, unknown> | string[] | string | null;
  hint?: string;
  status?: number;
}

// Supabaseから返されるデータの型定義
export interface SupabaseBrandType {
  id: number;
  name: string;
  image_url: string;
  description: string | null;
  deleted_at?: string | null;
  updated_at?: string;
}

export interface SupabaseProductType {
  id: number;
  brand_id?: number;
  brands: SupabaseBrandType;
  name: string;
  image_url: string;
  description: string | null;
  vintages: SupabaseVintageType[];
}

export interface SupabaseVintageType {
  id: number;
  name: string | null;
  manufacturing_start_year: number;
  manufacturing_end_year: number;
  image_url: string;
  description: string | null;
  checkpoints: SupabaseCheckPointType[];
}

export interface SupabaseCheckPointType {
  id: number;
  profile_id: string | null;
  image_url: string;
  point: string;
  description: string | null;
  created_at?: string | null;
}

export interface SupabaseProfileType {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  website_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  deleted_at: string | null;
}
