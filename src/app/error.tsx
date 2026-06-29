"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">500</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          サーバーエラーが発生しました
        </h2>
        <p className="text-gray-600 mb-6">
          申し訳ありません。しばらく時間をおいてから再度お試しください。
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            再試行
          </button>
          <Link
            href="/"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
