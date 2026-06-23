import { Spinner } from "./Spinner";

type Props = {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};

export function Loading({ text = "読み込み中", size = "lg", fullScreen = true }: Props) {
  const containerClass = fullScreen
    ? "min-h-screen flex flex-col items-center justify-center bg-gray-50"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <Spinner size={size} />
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}
