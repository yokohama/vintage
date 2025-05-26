"use client";

import {
  ArrowDownWideNarrow,
  Heart,
  User,
  UserCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import { siteConfig, siteUrls } from "@/lib/config/siteConfig";
import Image from "next/image";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    setOpen(false);
  };

  return (
    <header className="oldies-header">
      <div className="oldies-header-container">
        <Link href="/">
          <h1 className="cursor-pointer">{siteConfig.name}</h1>
        </Link>

        <div className="dropdown-profile-menu-container">
          <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="focus:outline-none">
                {user && user.user_metadata?.avatar_url ? (
                  <div className="dropdown-profile-menu-trigger-avatar">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="プロフィール写真"
                      width={80}
                      height={80}
                      className="object-cover sepia-[0.15]"
                      priority={true}
                    />
                  </div>
                ) : (
                  <div className="dropdown-profile-menu-trigger-icon">
                    <ArrowDownWideNarrow className="h-5 w-5 text-amber-700 cursor-pointer" />
                  </div>
                )}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="dropdown-profile-menu-content"
                sideOffset={5}
                align="end"
              >
                {!user ? (
                  <DropdownMenu.Item className="dropdown-profile-menu-item">
                    <LoginButton onSuccess={handleAuthSuccess} />
                  </DropdownMenu.Item>
                ) : (
                  <>
                    <DropdownMenu.Item className="dropdown-profile-menu-item dropdown-profile-menu-item-font-medium">
                      <Link
                        href={siteUrls.profile(user.id)}
                        className="dropdown-profile-menu-item-with-icon"
                      >
                        <User className="dropdown-profile-menu-item-icon" />
                        マイページ
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="dropdown-profile-menu-item dropdown-profile-menu-item-font-medium">
                      <Link
                        href={siteUrls.profile(user.id)}
                        className="dropdown-profile-menu-item-with-icon"
                      >
                        <UserCircle className="dropdown-profile-menu-item-icon" />
                        プロフィール
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="dropdown-profile-menu-item dropdown-profile-menu-item-font-medium">
                      <Link
                        href="/favorites"
                        className="dropdown-profile-menu-item-with-icon"
                      >
                        <Heart className="dropdown-profile-menu-item-icon" />
                        お気に入り
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="dropdown-profile-menu-item">
                      <div className="dropdown-profile-menu-item-with-icon">
                        <LogOut className="dropdown-profile-menu-item-icon" />
                        <LogoutButton onSuccess={handleAuthSuccess} />
                      </div>
                    </DropdownMenu.Item>
                  </>
                )}
                <DropdownMenu.Separator className="dropdown-profile-menu-separator" />
                <DropdownMenu.Item className="dropdown-profile-menu-footer-item">
                  プライバシーポリシー
                </DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-profile-menu-footer-item">
                  利用規約
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
};

export default Header;
