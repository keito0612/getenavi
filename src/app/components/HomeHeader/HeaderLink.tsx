"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderLinkProps = {
    name: string;
    href: string;
};

const HeaderLink = ({ name, href }: HeaderLinkProps) => {
    const pathname = usePathname();
    const isCurrent = pathname === href;
    return (
        <Link
            href={href}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isCurrent
                ? "bg-white text-amber-600"
                : "text-gray-300 hover:bg-white hover:text-amber-600"
                }`}
        >
            {name}
        </Link>
    );
};

export default HeaderLink;
