export interface UserProfileType {
  id: string;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  websiteUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  description: string | null;
  checkPointLikes: CheckPointType[];
}

//export type CheckPointsFilterType = "all" | "profile" | "vintage";

export interface BrandType {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  profileId?: string;
  profile?: UserProfileType | null;
  products: ProductType[];
}

export interface ProductType {
  id: number;
  brandId?: number;
  brand: BrandType;
  name: string;
  imageUrl: string;
  description: string;
  vintages: VintageType[];
}

export interface VintageType {
  id: number;
  product: ProductType;
  name: string;
  manufacturing_start_year: number;
  manufacturing_end_year: number;
  imageUrl: string;
  description: string;
  checkPoints: CheckPointType[];
}

export interface CheckPointType {
  id: number;
  vintage: VintageType;
  point: string;
  imageUrl: string;
  description: string;
  profile: UserProfileType | null;
  createdAt?: string | null;
  isLiked?: boolean;
  likeCount?: number;
}

export interface CheckPointLikeType {
  id: number;
  profileId: string;
  checkPointId: number;
  createdAt: string;
}

export interface LikedCheckPointType extends CheckPointType {
  vintage: VintageType;
}

export interface ApiErrorType {
  message: string;
  code?: string;
  details?: Record<string, unknown> | string[] | string | null;
}
