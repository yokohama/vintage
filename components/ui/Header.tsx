"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config/siteConfig";
import { DropDownMenuUI } from "./DropDownMenuUI";

const Header = () => {
  return (
    <header className="oldies-header">
      <div className="oldies-header-container">
        <Link href="/">
          <h1 className="cursor-pointer">{siteConfig.name}</h1>
        </Link>
      </div>
      <DropDownMenuUI isFixed={false} />
    </header>
  );
};

export default Header;
