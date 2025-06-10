"use client";

import { useState, useEffect } from "react";
import { ApiErrorType, ProductType, VintageType } from "@/lib/types";
import { type CarouselApi } from "@/components/ui/carousel";
import { productsAPI } from "@/lib/api/supabase/productsAPI";

interface UseVintagesCarouselProps {
  productId: number;
}

interface UseVintagesCarouselReturn {
  product: ProductType | null;
  setApi: (api: CarouselApi | undefined) => void;
  currentIndex: number;
  currentVintage: VintageType | null;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
  error: string | null;
}

export function useVintagesCarousel({
  productId,
}: UseVintagesCarouselProps): UseVintagesCarouselReturn {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVintage, setCurrentVintage] = useState<VintageType | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // 初回マウント時
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await productsAPI.getProduct(productId);
        setProduct(product);
        setCurrentVintage(product.vintages[currentIndex]);
      } catch (err) {
        const apiError = err as Error | ApiErrorType;
        const error =
          "message" in apiError
            ? apiError.message
            : "プロダクトの取得中にエラーが発生しました";
        setError(error);
      }
    };

    fetchProduct();
  }, []);

  // カルーセルAPIのイベントハンドリング
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setCurrentIndex(newIndex);

      // カルーセルの選択が変わったらスライダーの値も更新する
      if (
        product &&
        product.vintages.length > 0 &&
        newIndex >= 0 &&
        newIndex < product.vintages.length
      ) {
        setCurrentVintage(product.vintages[newIndex]);
      }
    };

    api.on("select", onSelect);
    // 初期化時に現在のインデックスを設定
    setCurrentIndex(api.selectedScrollSnap());

    return () => {
      api.off("select", onSelect);
    };
  }, [api, product]);

  // ナビゲーション関数
  const handlePrevSlide = () => api?.scrollPrev();
  const handleNextSlide = () => api?.scrollNext();

  return {
    product,
    setApi,
    currentIndex,
    currentVintage,
    handlePrevSlide,
    handleNextSlide,
    error,
  };
}
