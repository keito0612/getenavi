import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export function PageContainer({ children, className = "" }: Props) {
  return <div className={`min-h-screen bg-gray-50 ${className}`}>{children}</div>;
}
