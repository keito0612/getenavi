import { Spinner } from "./Spinner";

type Props = {
  visible: boolean;
  text?: string;
};

export function LoadingOverlay({ visible, text }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[100]">
      <Spinner />
      {text && (
        <p className="mt-4 text-sm text-white">{text}</p>
      )}
    </div>
  );
}
