type Props = {
  href?: string;
};

export function SubmitLink({ href = "https://forms.google.com" }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
    >
      タレコミ
    </a>
  );
}
