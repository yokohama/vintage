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
import { productsParams } from "./utils/productsParams";

export default async function ProductsPage({
  params,
}: {
  params: { brandId: string };
}) {
  const { brand, products, error } = await productsParams(params);

  return (
    <main>
      <div>
        <Header />
        {!brand || error ? (
          <Error />
        ) : products.length === 0 ? (
          <NotFound msg="製品が見つかりませんでした。" />
        ) : (
          <>
            <PageTitle title={`${brand.name}の製品一覧`} />
            <Suspense fallback={<Spinner />}>
              <div className="item-cards-container">
                {products.map((product) => (
                  <div key={product.id} className="item-card">
                    <Link href={`/brands/${brand.id}/products/${product.id}`}>
                      <div
                        className="item-card-image-container"
                        style={{ position: "relative" }}
                      >
                        <Image
                          src={product.imageUrl}
                          alt={`${product.name} | ${siteConfig.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className="item-card-image"
                          priority={true}
                        />
                      </div>
                      <div className="item-card-text">
                        <h3>{product.name}</h3>
                        <div className="description">{product.description}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </Suspense>
          </>
        )}
        <Footer />
      </div>
    </main>
  );
}
