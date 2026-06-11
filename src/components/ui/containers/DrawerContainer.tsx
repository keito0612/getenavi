import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClose: () => void;
};

export function DrawerContainer({ children, onClose }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto">
        <DrawerHandle />
        <div className="px-5 pb-8">{children}</div>
      </div>
      <Backdrop onClick={onClose} />
    </div>
  );
}

function DrawerHandle() {
  return (
    <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center">
      <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
    </div>
  );
}

function Backdrop({ onClick }: { onClick: () => void }) {
  return <div className="fixed inset-0 bg-black/30 -z-10" onClick={onClick} />;
}
