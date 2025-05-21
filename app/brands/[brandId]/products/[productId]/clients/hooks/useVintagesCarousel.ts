import { useState, useEffect } from "react";
import { VintageType } from "@/lib/types";
import { type CarouselApi } from "@/components/ui/carousel";

interface UseVintagesCarouselProps {
  vintages: VintageType[];
  selectedVintageIndex: number;
  onVintageIndexChange?: (index: number) => void;
}

interface UseVintagesCarouselReturn {
  setApi: (api: CarouselApi | undefined) => void;
  currentIndex: number;
  currentVintage: VintageType | null;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
}

export function useVintagesCarousel({
  vintages,
  selectedVintageIndex,
  onVintageIndexChange,
}: UseVintagesCarouselProps): UseVintagesCarouselReturn {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVintage, setCurrentVintage] = useState<VintageType | null>(
    vintages.length > 0 ? vintages[0] : null,
  );

  // カルーセルAPIのイベントハンドリング
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setCurrentIndex(newIndex);

      // カルーセルの選択が変わったらスライダーの値も更新する
      if (vintages.length > 0 && newIndex >= 0 && newIndex < vintages.length) {
        // 親コンポーネントに選択したインデックスを通知
        if (onVintageIndexChange) {
          onVintageIndexChange(newIndex);
        }
      }
    };

    api.on("select", onSelect);
    // 初期化時に現在のインデックスを設定
    setCurrentIndex(api.selectedScrollSnap());

    return () => {
      api.off("select", onSelect);
    };
  }, [api, vintages, onVintageIndexChange]);

  // 現在の製品時代を更新
  useEffect(() => {
    if (
      vintages.length > 0 &&
      currentIndex >= 0 &&
      currentIndex < vintages.length
    ) {
      setCurrentVintage(vintages[currentIndex]);
    }
  }, [currentIndex, vintages]);

  // 選択したインデックスに基づいて適切なカードにスクロールする
  useEffect(() => {
    if (!api || vintages.length === 0) return;

    // 選択されたインデックスが現在のインデックスと異なる場合、スクロールする
    if (selectedVintageIndex !== currentIndex) {
      api.scrollTo(selectedVintageIndex, true);
    }
  }, [selectedVintageIndex, vintages, api, currentIndex]);

  // ナビゲーション関数
  const handlePrevSlide = () => api?.scrollPrev();
  const handleNextSlide = () => api?.scrollNext();

  return {
    setApi,
    currentIndex,
    currentVintage,
    handlePrevSlide,
    handleNextSlide,
  };
}
