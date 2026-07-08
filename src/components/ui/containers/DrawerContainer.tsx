import type { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  children: ReactNode;
  title?: string;
  onClose: () => void;
};

export function DrawerContainer({ children, title, onClose }: Props) {
  return (
    <>
      {/* モバイル: 下からスライドアップ（ナビゲーションバーの上に配置） */}
      <div className="fixed inset-x-0 bottom-16 z-50 animate-slide-up md:hidden">
        <div className="bg-white rounded-t-2xl shadow-2xl h-[85vh] flex flex-col">
          <MobileHeader title={title} onClose={onClose} />
          <div className="flex-1 overflow-y-auto px-5 pb-20">{children}</div>
        </div>
        <Backdrop onClick={onClose} />
      </div>

      {/* デスクトップ: 飲食店一覧の右隣（マップエリア内） */}
      <div className="hidden md:block absolute left-80 top-0 bottom-0 w-96 z-20 animate-slide-right pointer-events-auto">
        <div className="h-full bg-white shadow-xl overflow-y-auto border-l border-gray-200">
          <DesktopHeader title={title} onClose={onClose} />
          <div className="px-5 pb-8">{children}</div>
        </div>
      </div>
    </>
  );
}

function MobileHeader({ title, onClose }: { title?: string; onClose: () => void }) {
  return (
    <div className="sticky top-0 bg-white z-10 rounded-t-xl border-b border-gray-100">
      {/* ドラッグハンドル */}
      <div className="flex justify-center py-2">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        {/* 左側のスペース（バランス用） */}
        <div className="w-8" />

        {/* 中央: タイトル */}
        {title && (
          <h2 className="flex-1 text-center font-bold text-gray-900 truncate px-2">
            {title}
          </h2>
        )}

        {/* 右側: 閉じるボタン */}
        <CloseButton onClose={onClose} />
      </div>
    </div>
  );
}

function DesktopHeader({ title, onClose }: { title?: string; onClose: () => void }) {
  return (
    <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 左側のスペース（バランス用） */}
        <div className="w-8" />

        {/* 中央: タイトル */}
        {title && (
          <h2 className="flex-1 text-center font-bold text-gray-900 truncate px-2">
            {title}
          </h2>
        )}

        {/* 右側: 閉じるボタン */}
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="閉じる"
        >
          <IoClose className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      aria-label="閉じる"
    >
      <IoClose className="w-5 h-5 text-gray-500" />
    </button>
  );
}

function Backdrop({ onClick }: { onClick: () => void }) {
  return <div className="fixed inset-0 bg-black/30 -z-10" onClick={onClick} />;
}
