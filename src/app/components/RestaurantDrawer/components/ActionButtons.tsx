import Link from "next/link";

type Props = {
  url: string | null;
  detailHref: string;
  onDetailClick?: () => void;
};

export function ActionButtons({ url, detailHref, onDetailClick }: Props) {
  return (
    <div className="space-y-2">
      {url && <ExternalLinkButton href={url} />}
      <DetailLinkButton href={detailHref} onClick={onDetailClick} />
    </div>
  );
}

function ExternalLinkButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full py-3 bg-orange-500 text-white text-center rounded-lg font-medium hover:bg-orange-600 transition-colors"
    >
      お店の情報を詳しく見る
    </a>
  );
}

function DetailLinkButton({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      className="block w-full py-3 bg-white text-orange-500 text-center rounded-lg font-medium border-2 border-orange-500 hover:bg-orange-50 transition-colors"
      onClick={onClick}
    >
      詳細ページを見る
    </Link>
  );
}
