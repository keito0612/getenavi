import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function CardContainer({ children, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
