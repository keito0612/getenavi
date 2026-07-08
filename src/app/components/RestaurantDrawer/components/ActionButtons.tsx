type Props = {
  url: string | null;
};

export function ActionButtons({ url }: Props) {
  if (!url) return null;

  return (
    <div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-3 bg-orange-500 text-white text-center rounded-lg font-medium hover:bg-orange-600 transition-colors"
      >
        お店の情報を詳しく見る
      </a>
    </div>
  );
}
