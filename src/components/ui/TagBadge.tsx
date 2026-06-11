type Props = {
  emoji?: string | null;
  name: string;
  variant?: "default" | "small";
};

export function TagBadge({ emoji, name, variant = "default" }: Props) {
  if (variant === "small") {
    return (
      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
        {emoji} {name}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
      <span>{emoji}</span>
      <span>{name}</span>
    </span>
  );
}
