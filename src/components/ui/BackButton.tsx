import Link from "next/link";
import { ChevronLeftIcon } from "./Icons";

type Props = {
  href?: string;
  onClick?: () => void;
};

export function BackButton({ href = "/", onClick }: Props) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="p-2 hover:bg-white/20 rounded-full transition-colors"
      >
        <ChevronLeftIcon />
      </button>
    );
  }

  return (
    <Link href={href} className="p-2 hover:bg-white/20 rounded-full transition-colors">
      <ChevronLeftIcon />
    </Link>
  );
}
