import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkType = "inline" | "centered" | "block";

const wrapperStyles: Record<TextLinkType, string> = {
  inline: "",
  centered: "mt-6 text-center text-sm text-gray-600",
  block: "text-sm text-gray-600",
};

type Props = {
  href: string;
  children: ReactNode;
  type?: TextLinkType;
};

export function TextLinkButton({ href, children, type = "inline" }: Props) {
  const link = (
    <Link href={href} className="text-orange-500 hover:underline">
      {children}
    </Link>
  );

  if (type === "inline") {
    return link;
  }

  return <div className={wrapperStyles[type]}>{link}</div>;
}
