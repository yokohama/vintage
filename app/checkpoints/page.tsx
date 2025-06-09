import { Suspense } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import List from "@/components/ui/checkpoint/List";

export default function CheckPointsPage() {
  return (
    <main>
      <div className="oldies-container">
        <Header />
        <PageTitle title={"鑑定ポイント一覧"} />
        <Suspense fallback={<Spinner />}>
          <List />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
