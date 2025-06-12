import { Suspense } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";

import Spinner from "@/components/ui/Spinner";
import { productParams } from "./utils/productParams";
import VintagesCarousel from "./clients/components/VintagesCarousel";

export default async function ProductPage({
  params,
}: {
  params: {
    brandId: string;
    productId: string;
  };
}) {
  // productParamsがnotFound()をスローするか、エラーをスローする
  const product = await productParams(params);
  const brandId = parseInt(params.brandId, 10);
  const productId = parseInt(params.productId, 10);

  return (
    <main>
      <div>
        <Header />
        <PageTitle
          title={product.name}
          brandId={brandId}
          productId={productId}
        />
        <Suspense fallback={<Spinner />}>
          <VintagesCarousel productId={product.id} />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
