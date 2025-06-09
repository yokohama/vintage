"use client";

import { Trash2 } from "lucide-react";
import { useDelete } from "@/hooks/useDelete";

interface DeleteButtonProps {
  checkPointId: number;
  onSuccess?: () => void;
  className?: string;
  disabled?: boolean;
}

export function DeleteButton({
  checkPointId,
  onSuccess,
  className = "",
  disabled = false,
}: DeleteButtonProps) {
  const { handleDelete, isLoading } = useDelete();

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // イベントの伝播を停止

    if (isLoading || disabled) return;

    const success = await handleDelete(checkPointId);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={isLoading || disabled}
      aria-label="削除"
      className={`p-1 hover:bg-amber-100 rounded-full transition-colors ${
        isLoading ? "opacity-50 cursor-wait" : ""
      } ${className}`}
    >
      <Trash2 size={18} className="text-stone-500 hover:text-amber-800" />
    </button>
  );
}

export default DeleteButton;
