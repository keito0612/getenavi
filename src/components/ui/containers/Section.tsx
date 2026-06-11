import type { ReactNode } from "react";

type Props = {
  label?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ label, children, className = "" }: Props) {
  return (
    <div className={className}>
      {label && (
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
          {label}
        </h3>
      )}
      {children}
    </div>
  );
}
