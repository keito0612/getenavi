import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  className?: string;
};

const GAPS = {
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-3",
};

const ALIGNS = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

export function FlexRow({ children, gap = "md", align = "start", wrap = false, className = "" }: Props) {
  return (
    <div className={`flex items-center ${GAPS[gap]} ${ALIGNS[align]} ${wrap ? "flex-wrap" : ""} ${className}`}>
      {children}
    </div>
  );
}
