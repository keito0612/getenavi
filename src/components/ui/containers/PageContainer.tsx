import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PageContainer({ children }: Props) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
