"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CheckPoints from "./CheckPoints";
import { useVintagesCarousel } from "../hooks/useVintagesCarousel";
import { VintageType, ProductType } from "@/lib/types";
import { siteConfig } from "@/lib/config/siteConfig";

interface VintagesCarouselProps {
  product: ProductType;
}

const VintagesCarousel = ({ product }: VintagesCarouselProps) => {
  const [selectedVintageIndex, setSelectedVintageIndex] = useState(0);
  const [selectedVintage, setSelectedVintage] = useState<VintageType>(
    product.vintages[0],
  );

  const handleVintageIndexChange = (index: number) => {
    setSelectedVintageIndex(index);
    setSelectedVintage(product.vintages[index]);
  };

  const {
    setApi,
    currentIndex,
    currentVintage,
    handlePrevSlide,
    handleNextSlide,
  } = useVintagesCarousel({
    vintages: product.vintages,
    selectedVintageIndex,
    onVintageIndexChange: handleVintageIndexChange,
  });

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: false,
          containScroll: "trimSnaps",
          skipSnaps: false,
        }}
        className="w-full relative mb-0 transition-all duration-700"
      >
        {/* カルーセルのナビゲーションインジケーター */}
        <div className="flex justify-center mt-4 gap-2">
          <div className="flex items-center gap-1.5 mx-2">
            {product.vintages.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentIndex
                    ? "bg-[var(--oldies-accent-primary)]"
                    : "bg-[var(--oldies-border-primary)] hover:bg-[var(--oldies-border-secondary)]"
                  }`}
              />
            ))}
          </div>
        </div>

        <CarouselContent className="-ml-2 -mr-2">
          {product.vintages.map((vintage) => (
            <CarouselItem
              key={vintage.id}
              className="basis-full pl-1.5 pr-1.5 pt-3 pb-0"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="relative h-52 w-full oldies-bg-secondary"
                    style={{ position: "relative" }}
                  >
                    <div id="scrollArea">
                      {/* 左側（戻る）インジケーター */}
                      <div
                        className="absolute top-[104px] left-2 z-10 flex flex-col gap-1.5 items-center animate-pulse cursor-pointer"
                        onClick={handlePrevSlide}
                        role="button"
                        aria-label="前のスライドへ"
                      >
                        <svg
                          xmlns={siteConfig.svg.xmlns}
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="oldies-text-accent transform rotate-180"
                        >
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </div>

                      {/* 右側（次へ）インジケーター */}
                      <div
                        className="absolute top-[104px] right-2 z-10 flex flex-col gap-1.5 items-center animate-pulse cursor-pointer"
                        onClick={handleNextSlide}
                        role="button"
                        aria-label="次のスライドへ"
                      >
                        <svg
                          xmlns={siteConfig.svg.xmlns}
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="oldies-text-accent"
                        >
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </div>
                      <h3>{vintage.name}</h3>
                      <Image
                        src={vintage.imageUrl}
                        alt={` ${product.brand.name} - ${product.name} | ${vintage.manufacturing_start_year}年から${vintage.manufacturing_end_year}年のヴィンテージの特徴 | ${siteConfig.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover sepia-[0.15] brightness-[0.98]"
                        priority={currentIndex === 0}
                      />
                      <span className="absolute top-2 right-2 bg-[var(--oldies-bg-accent)] oldies-text-primary text-base px-3 py-1.5 rounded-full font-medium">
                        {vintage.manufacturing_start_year}-
                        {vintage.manufacturing_end_year}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm px-2 mt-2">
                    {currentVintage?.description}
                  </h3>
                </CardContent>
                <CardFooter className="p-3 flex justify-between items-center"></CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div>
        <CheckPoints vintage={selectedVintage} />
      </div>
    </div>
  );
};

export default VintagesCarousel;
