// Supabaseのエラー型定義
export interface SupabaseErrorType {
  message: string;
  code?: string;
  details?: Record<string, unknown> | string[] | string | null;
  hint?: string;
  status?: number;
}

export interface SupabaseCheckPointLikeType {
  id: number;
  profile_id: string;
  check_point_id: number;
  check_points: SupabaseCheckPointType;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
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
  description: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  check_point_likes?: SupabaseCheckPointLikeType[];
}

// Supabaseから返されるデータの型定義
export interface SupabaseBrandType {
  id: number;
  name: string;
  image_url: string;
  description: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface SupabaseProductType {
  id: number;
  brand_id?: number;
  brand?: SupabaseBrandType;
  name: string;
  image_url: string;
  description: string | null;
  vintages?: SupabaseVintageType[];
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface SupabaseVintageType {
  id: number;
  product_id?: number;
  product?: SupabaseProductType;
  name: string | null;
  manufacturing_start_year: number;
  manufacturing_end_year: number;
  image_url: string;
  description: string | null;
  checkpoints?: SupabaseCheckPointType[]; // オプショナルに変更
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface SupabaseCheckPointType {
  id: number;
  profile_id: string | null;
  vintage_id?: number;
  vintage?: SupabaseVintageType; // オプショナルに変更
  image_url: string;
  point: string;
  description: string | null;
  profiles?: SupabaseProfileType | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  check_point_likes?: { count: number }[];
  is_liked?: boolean;
}
