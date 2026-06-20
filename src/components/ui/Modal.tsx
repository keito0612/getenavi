"use client";

import { useEffect } from "react";

type ModalType = "success" | "error";

type Props = {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message?: string;
  onClose: () => void;
};

export function Modal({ isOpen, type, title, message, onClose }: Props) {
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

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
        {/* アイコン */}
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="size-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="size-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="size-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
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
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isSuccess
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
