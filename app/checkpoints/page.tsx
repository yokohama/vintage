import { Suspense } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import CheckPoints from "./clients/components/CheckPoints";

export default function CheckPointsPage() {
  return (
    <main>
      <div className="oldies-container">
        <Header />
        <PageTitle title={"鑑定ポイント一覧"} />
        <Suspense fallback={<Spinner />}>
          <CheckPoints />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
