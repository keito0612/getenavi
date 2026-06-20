import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-6xl font-bold text-amber-600 mb-4">404</h2>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          ページが見つかりません
        </h3>
        <p className="text-gray-600 mb-6">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
