import { IoSearchOutline } from "react-icons/io5";
import type { ReactNode } from "react";

type Props = {
  message: string;
  action?: ReactNode;
};

export function EmptyState({ message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <IoSearchOutline className="w-12 h-12 mb-4" />
      <p className="mb-4 text-2xl">{message}</p>
      {action}
    </div>
  );
}
