import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
  className?: string;
};

const GAPS = {
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
};

export function Stack({ children, gap = "md", className = "" }: Props) {
  return <div className={`${GAPS[gap]} ${className}`}>{children}</div>;
}
