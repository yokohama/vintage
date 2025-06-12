"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import List from "@/components/ui/checkpoint/List";
import { useVintagesCarousel } from "../hooks/useVintagesCarousel";
import { siteConfig } from "@/lib/config/siteConfig";

interface VintagesCarouselProps {
  productId: number;
}

const VintagesCarousel = ({ productId }: VintagesCarouselProps) => {
  const {
    product,
    setApi,
    currentIndex,
    currentVintage,
    handlePrevSlide,
    handleNextSlide,
  } = useVintagesCarousel({ productId });

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
        className="w-full relative transition-all duration-700"
      >
        {/* カルーセルのナビゲーションインジケーター */}
        <div className="flex justify-center mt-4 mb-2 gap-2 z-10 relative">
          <div className="flex items-center gap-1.5 mx-2">
            {product &&
              product.vintages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${index === currentIndex
                      ? "bg-red-700"
                      : "bg-amber-200 hover:bg-red-400"
                    }`}
                />
              ))}
          </div>
        </div>

        <CarouselContent className="-ml-2 -mr-2 mb-4">
          {product &&
            product.vintages.map((vintage) => (
              <CarouselItem
                key={vintage.id}
                className="basis-full pl-1.5 pr-1.5 pt-0 pb-0"
              >
                <Card className="overflow-hidden border-0 rounded-none bg-white rounded-lg">
                  <CardTitle className="w-full text-center font-bold text-xl py-0 !mb-0">
                    <div className="text-center w-full bg-red-700 py-2 text-white">
                      {currentVintage && currentVintage.name}&nbsp;[&nbsp;
                      {currentVintage &&
                        currentVintage.manufacturing_start_year}{" "}
                      -{currentVintage && currentVintage.manufacturing_end_year}
                      &nbsp;]
                    </div>
                  </CardTitle>
                  <CardContent className="p-0 !mt-0">
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
                      </div>
                    </div>
                    <p className="description text-center px-4 italic">
                      {currentVintage && currentVintage.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
      <div>{currentVintage && <List vintageId={currentVintage.id} />}</div>
    </div>
  );
};

export default VintagesCarousel;
