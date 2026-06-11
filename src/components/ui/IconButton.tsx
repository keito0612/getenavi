import type { ReactNode } from "react";

type Props = {
  onClick?: () => void;
  children: ReactNode;
  variant?: "default" | "header";
  className?: string;
};

export function IconButton({ onClick, children, variant = "default", className = "" }: Props) {
  const baseStyles = "p-2 rounded-full transition-colors";
  const variantStyles = {
    default: "hover:bg-gray-100",
    header: "hover:bg-white/20",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
