"use client";

import { useEffect } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { Button } from "./Button";

type Props = {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "削除",
  cancelLabel = "キャンセル",
  onConfirm,
  onCancel,
  isLoading = false,
}: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={isLoading ? undefined : onCancel}
      />

      {/* モーダル本体 */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
        {/* アイコン */}
        <div className="flex justify-center mb-4">
          <div className="size-16 bg-orange-100 rounded-full flex items-center justify-center">
            <IoWarningOutline className="size-8 text-orange-500" />
          </div>
        </div>

        {/* タイトル */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h2>

        {/* メッセージ */}
        {message && (
          <p className="text-center text-gray-600 mb-6">{message}</p>
        )}

        {/* ボタン */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "削除中..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
