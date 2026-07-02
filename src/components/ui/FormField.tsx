import type { Ref } from "react";

type Props = {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  ref?: Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type">;

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  error,
  disabled,
  className,
  ref,
  ...rest
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? "border-red-500" : "border-gray-300"
        } ${className ?? ""}`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
