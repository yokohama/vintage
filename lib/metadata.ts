import { Metadata } from "next";
import {
  BrandType,
  CheckPointType,
  ProductType,
  UserProfileType,
} from "./types";
import { siteConfig, siteUrls } from "./config/siteConfig";

const getImages = (imageUrl: string, alt: string) => {
  return [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: alt,
    },
  ];
};

const openGraph = (
  title: string,
  description: string,
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>,
) => {
  return {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.seo.defaultTitle,
    title: title,
    description: description,
    images: images,
  };
};

// サイト全体のベースとなるメタデータ
export const baseMetadata: Metadata = {
  title: {
    template: siteConfig.seo.titleTemplate,
    default: siteConfig.seo.defaultTitle,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: openGraph(
    "",
    siteConfig.description,
    getImages(siteConfig.images.defaultOgImage, siteConfig.name),
  ),
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: siteUrls.home(),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateBrandsMetadata(): Metadata {
  const title = `ブランド一覧 | ${siteConfig.name}`;
  const description = "今でも多くの人に愛されるブランドコレクション";
  const images = getImages(siteConfig.images.defaultOgImage, title);

  return {
    title: title,
    description: description,
    openGraph: openGraph(title, description, images),
    alternates: {
      canonical: siteUrls.home(),
    },
  };
}

export function generateProductsMetadata(brand: BrandType): Metadata {
  const title = `${brand.name}の名作一覧 | ${siteConfig.name}`;
  const description = `${brand.name}の今でも多くの人に愛されるアパレルコレクション`;
  const images = getImages(brand.imageUrl, title);

  return {
    title: title,
    description: description,
    openGraph: openGraph(title, description, images),
    alternates: {
      canonical: siteUrls.products(brand.id),
    },
  };
}

// 商品ページのメタデータ生成
export function generateProductMetadata(product: ProductType): Metadata {
  const title = `${product.name} - ${product.brand.name} | ${siteConfig.name}`;
  const description = `${product.brand.name}の${product.name}ヴィンテージアパレル`;
  const images = getImages(product.imageUrl, product.name);

  return {
    title: title,
    description: description,
    openGraph: openGraph(title, description, images),
    twitter: {
      images: images,
    },
    alternates: {
      canonical: siteUrls.product(product.brand.id, product.id),
    },
  };
}

export function generateCheckpointsMetadata() {
  const title = `US古着鑑定ポイント一覧 | ${siteConfig.name}`;
  const description = "みんなでシェアするUS古着鑑定ポイント一覧";
  const images = getImages(
    siteConfig.images.homeBanner,
    `${title} | ${siteConfig.name}`,
  );

  return {
    title: title,
    description: description,
    openGraph: openGraph(title, description, images),
    alternates: {
      canonical: siteUrls.checkpoints,
    },
  };
}

export function generateCheckPointMetadata(
  checkPoint: CheckPointType,
): Metadata {
  const title = `${checkPoint.point} | ${checkPoint.vintage.product}の鑑定ポイント | ${siteConfig.name}`;
  const description = `${checkPoint.description}`;
  const images = getImages(
    checkPoint.vintage.product.imageUrl,
    checkPoint.vintage.product.name,
  );

  return {
    title: title,
    description: description,
    openGraph: openGraph(title, description, images),
    twitter: {
      images: getImages(
        checkPoint.vintage.product.imageUrl,
        checkPoint.vintage.product.name,
      ),
    },
    alternates: {
      canonical: siteUrls.product(
        checkPoint.vintage.product.brand.id,
        checkPoint.vintage.product.id,
      ),
    },
  };
}

// プロフィールページのメタデータ生成
export function generateProfileMetadata(profile: UserProfileType): Metadata {
  const title = `${profile.displayName || "ユーザー"}のプロフィール | ${siteConfig.name}`;
  const description = `${profile.displayName || "ユーザー"}のプロフィール | ${siteConfig.name}`;
  const images = profile.avatarUrl
    ? getImages(profile.avatarUrl, "ユーザーのプロフィール画像")
    : [];
  return {
    title: title,
    description: description,
    openGraph: openGraph(title, description, images),
    alternates: {
      canonical: siteUrls.profile(profile.id),
    },
  };
}

// お気に入りページのメタデータ
export const favoritesMetadata: Metadata = {
  title: "お気に入り",
  description: `あなたがお気に入りに登録した${siteConfig.name}の鑑定ポイント`,
  alternates: {
    canonical: siteUrls.favorites(),
  },
};
