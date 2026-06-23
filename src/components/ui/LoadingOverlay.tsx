import { Spinner } from "./Spinner";

type Props = {
  visible: boolean;
  text?: string;
};

export function LoadingOverlay({ visible, text }: Props) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center z-10">
      <Spinner />
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}
