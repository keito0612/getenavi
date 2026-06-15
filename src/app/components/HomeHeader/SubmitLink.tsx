type Props = {
  href?: string;
};

export function SubmitLink({ href = "https://forms.google.com" }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
    >
      タレコミ
    </a>
  );
}
