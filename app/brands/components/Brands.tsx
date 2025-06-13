"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config/siteConfig";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import { BrandType } from "@/lib/types";
import { brandsAPI } from "@/lib/api/supabase/brandsAPI";
import {
  InfiniteScrollProvider,
  useInfiniteData,
} from "@/contexts/InfiniteScrollContext";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import BrandFooter from "@/components/ui/brand/BrandFooter";

type BrandsProps = {
  initialBrands: BrandType[];
};

export default function Brands({ initialBrands }: BrandsProps) {
  const { data: brands, loadMoreData: loadMoreBrands } = useInfiniteData<
    BrandType,
    []
  >({
    initialData: initialBrands,
    fetchFunction: brandsAPI.getBrands,
    pageSize: 10,
    itemStatusChangeCount: 0,
  });

  return (
    <main>
      <div>
        <Header />
        <PageTitle title="ブランド一覧" />
        <Suspense fallback={<Spinner />}>
          <InfiniteScrollProvider>
            <InfiniteScroll onLoadMore={loadMoreBrands}>
              <div className="item-cards-container">
                {brands.map((brand) => (
                  <div key={brand.id} className="item-card">
                    <Link href={`/brands/${brand?.id}/products`}>
                      <div
                        className="item-card-image-container"
                        style={{ position: "relative" }}
                      >
                        <Image
                          src={brand.imageUrl}
                          alt={`${brand.name} | ${siteConfig.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className="item-card-image"
                          priority={brand.id <= 10} // 最初の10件のみpriorityをtrueに
                        />
                      </div>
                      <div className="item-card-text">
                        <h3>{brand.name}</h3>
                        <div className="description">{brand.description}</div>
                      </div>
                    </Link>
                    <BrandFooter brand={brand} />
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </InfiniteScrollProvider>
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
