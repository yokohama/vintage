"use client";

import { useEffect, useRef } from "react";
import { usePageTitle } from "@/contexts/PageTitleContext";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  const { isFixed, setIsFixed } = usePageTitle();
  const titleRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

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
      </div>
    </>
  );
};

export default PageTitle;
