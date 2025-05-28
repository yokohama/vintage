"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { AddButton } from "./OriginalButton";
import { siteUrls } from "@/lib/config/siteConfig";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  const { isFixed, setIsFixed } = usePageTitle();
  const titleRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (!titleRef.current || !placeholderRef.current) return;

      const titleRect = placeholderRef.current.getBoundingClientRect();

      if (titleRect.top <= 0) {
        if (!isFixed) {
          setIsFixed(true);
        }
      } else {
        if (isFixed) {
          setIsFixed(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixed, setIsFixed]);

  return (
    <>
      {/* プレースホルダー - 元の位置を保持するための要素 */}
      <div
        ref={placeholderRef}
        style={{
          height: isFixed ? titleRef.current?.offsetHeight + "px" : "auto",
        }}
        className="mb-4"
      >
        {/* 実際のタイトル要素 - 固定時はfixedになる */}
        <div
          ref={titleRef}
          className={`page-title-container ${isFixed ? "page-title-fixed" : ""}`}
        >
          <div className="flex items-center w-full min-h-[60px] py-2">
            <div className="w-full text-center">
              <h2
                className={`title ${isFixed ? "cursor-pointer" : ""}`}
                onClick={
                  isFixed
                    ? () => window.scrollTo({ top: 0, behavior: "smooth" })
                    : undefined
                }
              >
                {title}
              </h2>
            </div>
            {!isFixed &&
              (pathname.startsWith(siteUrls.home() || siteUrls.brands()) ||
                pathname.includes("/products/")) && (
                <div className="absolute right-2 z-10">
                  <AddButton
                    label=""
                    className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-md shadow-sm mb-4"
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageTitle;
