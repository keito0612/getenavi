import Link from "next/link";

export function ListLink() {
  return (
    <Link
      href="/restaurants"
      className="text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
    >
      店舗一覧
    </Link>
  );
}
