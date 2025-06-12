import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="oldies-container">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="title mb-6">製品が見つかりません</h2>
          <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-8 border border-amber-100 max-w-md mx-auto">
            <p className="error-page-message mb-6">
              指定されたブランドの製品データが見つかりませんでした。
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/brands"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md shadow-sm"
              >
                ブランド一覧へ戻る
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
