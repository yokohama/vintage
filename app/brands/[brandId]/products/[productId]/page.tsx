import { Suspense } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import Spinner from "@/components/ui/Spinner";
import { productParams } from "./utils/productParams";
import VintagesCarousel from "./clients/components/VintagesCarousel";

export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const { product, error } = await productParams(params);

  return (
    <main>
      <div>
        <Header />
        {error ? (
          <Error />
        ) : !product ? (
          <NotFound msg="プロダクトが見つかりませんでした。" />
        ) : (
          <>
            <PageTitle title={product.name} />
            <Suspense fallback={<Spinner />}>
              <VintagesCarousel product={product} />
            </Suspense>
          </>
        )}
        <Footer />
      </div>
    </main>
  );
}
