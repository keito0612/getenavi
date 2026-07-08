import type { Ref } from "react";

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

export function FormTextarea({
  id,
  label,
  placeholder,
  error,
  disabled,
  rows = 4,
  maxLength,
  showCount = false,
  className,
  ref,
  value,
  ...rest
}: Props) {
  const currentLength = typeof value === "string" ? value.length : 0;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        value={value}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? "border-red-500" : "border-gray-300"
        } ${className ?? ""}`}
        {...rest}
      />
      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <span />
        )}
        {showCount && maxLength && (
          <span className={`text-xs ${isOverLimit ? "text-red-600" : "text-gray-500"}`}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
