import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config/siteConfig";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import { productsParams } from "./utils/productsParams";

export default async function ProductsPage({
  params,
}: {
  params: { brandId: string };
}) {
  const { brand, products } = await productsParams(params);
  const brandId = parseInt(params.brandId, 10);

  // 製品が見つからない場合はnotFound()を呼び出す
  if (products.length === 0) {
    notFound();
  }

  return (
    <main>
      <div>
        <Header />
        <PageTitle title={brand!.name} brandId={brandId} />
        <Suspense fallback={<Spinner />}>
          <div className="item-cards-container">
            {products.map((product) => (
              <div key={product.id} className="item-card">
                <Link href={`/brands/${brand!.id}/products/${product.id}`}>
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
        <Footer />
      </div>
    </main>
  );
}
