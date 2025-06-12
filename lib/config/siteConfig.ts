// サイト全体の設定を一元管理するファイル
export const siteConfig = {
  // サイト基本情報
  name: "US古着★鑑定事務所",
  subtitle: "hoge",
  description:
    "アメカジ好き必見！US古着・ヴィンテージのタグ・仕様・年代別特徴を大量データ＆専門コメントの日本最大データベース(を目指す笑)。ビギナーでも簡単に見分け方が身につき、さらにアメカジへの愛が深まる情報サイト",
  url: "https://champion-vintage.example.com",

  // ソーシャルメディア
  social: {
    twitter: "@champion_vintage",
  },

  // SEO関連
  // TODO: 実装
  seo: {
    titleTemplate: "%s | hoge",
    defaultTitle: "moge | ビンテージアパレル",
  },

  // ロケール設定
  locale: "ja_JP",

  // 画像パス
  // TODO: 実装
  images: {
    homeBanner: "/images/home-banner.jpg",
    defaultOgImage: "/images/og-default.jpg",
    defaultProfileAvatar: "/images/default-avatar.webp",
  },

  // SVG関連
  svg: {
    xmlns: "http://www.w3.org/2000/svg",
    dicebear: {
      baseUrl: "https://api.dicebear.com/7.x/initials/svg",
      defaultSeed: "anonymous",
    },
  },

  // ページネーション設定
  pagination: {
    checkPoints: {
      itemsPerPage: 10,
    },
  },
};

// 各種URLを生成するヘルパー関数
export const siteUrls = {
  home: () => "/",
  brands: () => "/brands",
  newBrand: () => `/brands/new`,
  products: (brandId: number) => `/brands/${brandId}/products`,
  product: (brandId: number, productId: number) =>
    `/brands/${brandId}/products/${productId}`,
  era: (brandId: number, productId: number, eraId: number) =>
    `/brands/${brandId}/products/${productId}/eras/${eraId}`,
  checkpoints: "/checkpoints",
  checkpoint: (id: number) => `/checkpoints/${id}`,
  newCheckPoint: (vintageId: number) =>
    `/vintages/${vintageId}/checkpoints/new`,
  profile: (profileId: string) => `/profiles/${profileId}`,
  likes: () => "/likes",
};

// アバターURLを生成するヘルパー関数
export const getAvatarUrl = (
  seed: string = siteConfig.svg.dicebear.defaultSeed,
) => {
  return `${siteConfig.svg.dicebear.baseUrl}?seed=${seed}`;
};
