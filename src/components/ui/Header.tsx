import type { ReactNode } from "react";

type Props = {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function Header({ title, left, right }: Props) {
  return (
    <header className="bg-orange-500 text-white px-4 py-3 shadow-md sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        {left && <div className="shrink-0">{left}</div>}
        <h1 className="text-lg font-bold flex-1 truncate">{title}</h1>
        {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
      </div>
    </header>
  );
}
