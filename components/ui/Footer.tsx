"use client";

import Link from "next/link";
import { Instagram, X, Facebook, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { siteConfig, siteUrls } from "@/lib/config/siteConfig";

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ブランド情報とソーシャルリンク */}
        <div className="footer-content">
          <Link href="/">
            <h2 className="cursor-pointer">
              <span>{siteConfig.name}</span>
            </h2>
          </Link>
          <p className="description">{siteConfig.description}</p>
          <div className="flex space-x-6">
            <a href="#" className="sns" aria-label="Instagram">
              <Instagram size={30} />
            </a>
            <a href="#" className="sns" aria-label="Twitter">
              <X size={30} />
            </a>
            <a href="#" className="sns" aria-label="Facebook">
              <Facebook size={30} />
            </a>
          </div>
        </div>

        {/* ナビゲーションリンク */}
        <div className="nav-grid">
          <Link href={siteUrls.brands()} className="nav-link">
            ブランド一覧
          </Link>
          <Link href={siteUrls.brands()} className="nav-link">
            プロダクト一覧
          </Link>
          <Link href={siteUrls.checkpoints} className="nav-link">
            鑑定ポイント一覧
          </Link>
          {user && (
            <Link href="/profile" className="nav-link">
              マイページ
            </Link>
          )}
          <Link href="/contact" className="nav-link">
            お問い合わせ
          </Link>
          <Link href="/faq" className="nav-link">
            よくある質問
          </Link>
          <Link href="/privacy" className="nav-link">
            プライバシー
          </Link>
          <Link href="/terms" className="nav-link">
            利用規約
          </Link>
        </div>
        <div className="copyright">
          <p>
            © {currentYear} {siteConfig.name}. Made with{" "}
            <Heart size={12} className="mx-1 text-amber-700" /> in Japan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
