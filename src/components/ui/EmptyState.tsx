import type { ReactNode } from "react";

type Props = {
  emoji: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ emoji, message, action }: Props) {
  return (
    <div className="text-center py-12 text-gray-500">
      <span className="text-4xl block mb-2">{emoji}</span>
      <p className="mb-4">{message}</p>
      {action}
    </div>
  );
}
