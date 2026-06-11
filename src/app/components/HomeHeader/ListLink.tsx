import Link from "next/link";
import { MenuIcon } from "@/components/ui";

export function ListLink() {
  return (
    <Link
      href="/restaurants"
      className="p-2 hover:bg-white/20 rounded-full transition-colors"
    >
      <MenuIcon />
    </Link>
  );
}
