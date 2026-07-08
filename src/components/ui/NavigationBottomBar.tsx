"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHome, IoHomeOutline, IoHeart, IoHeartOutline, IoPerson, IoPersonOutline } from "react-icons/io5";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "ホーム",
    icon: <IoHomeOutline className="w-6 h-6" />,
    activeIcon: <IoHome className="w-6 h-6" />,
  },
  {
    href: "/favorites",
    label: "お気に入り",
    icon: <IoHeartOutline className="w-6 h-6" />,
    activeIcon: <IoHeart className="w-6 h-6" />,
  },
  {
    href: "/profile",
    label: "プロフィール",
    icon: <IoPersonOutline className="w-6 h-6" />,
    activeIcon: <IoPerson className="w-6 h-6" />,
  },
];

export function NavigationBottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-1005 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16 px-4 pb-safe">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
                isActive ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isActive ? item.activeIcon : item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
