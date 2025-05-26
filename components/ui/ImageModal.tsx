"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, alt, isOpen, onClose }: ImageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      // スクロールを無効化
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      // スクロールを有効化
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        ref={modalRef}
        className="relative max-w-4xl w-full h-auto max-h-[90vh] bg-white rounded-lg overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
          aria-label="閉じる"
        >
          <X size={18} />
        </button>
        <div className="relative w-full h-full aspect-square md:aspect-auto md:h-[80vh]">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
