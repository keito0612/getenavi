import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  className?: string;
};

const PADDING = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function ContentContainer({ children, padding = "md", className = "" }: Props) {
  return (
    <main className={`max-w-2xl mx-auto ${PADDING[padding]} ${className}`}>
      {children}
    </main>
  );
}
