import { Spinner } from "./Spinner";

type Props = {
  visible: boolean;
};

export function LoadingOverlay({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
      <Spinner />
    </div>
  );
}
