import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config/siteConfig";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import Spinner from "@/components/ui/Spinner";
import { brandsAPI } from "@/lib/api/supabase/brandsAPI";
import { BrandType } from "@/lib/types";

export default async function BrandsPage() {
  let brands: BrandType[] = [];
  let error = null;

  try {
    brands = await brandsAPI.getBrands();
  } catch (err) {
    error = err;
  }

  return (
    <main>
      <div>
        <Header />
        <PageTitle title="ブランド一覧" />
        <Suspense fallback={<Spinner />}>
          {error ? (
            <Error />
          ) : brands.length === 0 ? (
            <NotFound msg="ブランドが見つかりませんでした。" />
          ) : (
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
                        className="item-card-image"
                        priority={true}
                      />
                    </div>
                    <div className="item-card-text">
                      <h3>{brand.name}</h3>
                      <div className="description">{brand.description}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
