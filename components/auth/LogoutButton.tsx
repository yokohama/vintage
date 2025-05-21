"use client";

import { useAuth } from "@/contexts/AuthContext";

const LogoutButton = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    if (onSuccess) onSuccess();
  };

  return (
    <button onClick={handleLogout} className="flex w-full items-center">
      ログアウト
    </button>
  );
};

export default LogoutButton;
