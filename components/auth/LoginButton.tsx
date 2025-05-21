"use client";

import { useAuth } from "@/contexts/AuthContext";

const LoginButton = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    await signInWithGoogle();
    if (onSuccess) onSuccess();
  };

  return (
    <button onClick={handleLogin} className="flex w-full items-center">
      ログイン
    </button>
  );
};

export default LoginButton;
