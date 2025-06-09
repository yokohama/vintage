"use client";

import { useState } from "react";
import { toast } from "sonner";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";

export function useDelete() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (checkPointId: number) => {
    if (!confirm("このチェックポイントを削除してもよろしいですか？")) {
      return false;
    }

    setIsLoading(true);

    try {
      await checkPointsAPI.deleteCheckPoint(checkPointId);
      toast.success("チェックポイントを削除しました");
      return true;
    } catch (error) {
      console.error("チェックポイントの削除に失敗しました:", error);
      toast.error("チェックポイントの削除に失敗しました");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDelete,
    isLoading,
  };
}
