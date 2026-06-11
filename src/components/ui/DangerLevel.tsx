type Props = {
  level: number;
  variant?: "stars" | "dot" | "card";
};

const COLORS = {
  text: [
    "text-green-500",
    "text-lime-500",
    "text-yellow-500",
    "text-orange-500",
    "text-red-500",
  ],
  bg: [
    "bg-green-500",
    "bg-lime-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
  ],
};

export function DangerLevel({ level, variant = "stars" }: Props) {
  const textColor = COLORS.text[level - 1] || COLORS.text[0];
  const bgColor = COLORS.bg[level - 1] || COLORS.bg[0];

  if (variant === "dot") {
    return (
      <div className="flex items-center gap-1">
        <span className={`w-2 h-2 rounded-full ${bgColor}`} />
        <span className="text-xs text-gray-500">Lv.{level}</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
        <span className="text-gray-600 font-medium">珍食レベル</span>
        <div className={`flex ${textColor}`}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-2xl">
              {i < level ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${textColor}`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-lg">
          {i < level ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
