import type { TagData } from "@/lib/types";

type Props = {
  tags: TagData[];
  selectedTags: number[];
  onTagToggle: (tagId: number) => void;
};

export function TagFilterBar({ tags, selectedTags, onTagToggle }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              whitespace-nowrap transition-all duration-200
              ${isSelected
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <span className="text-base">{tag.emoji}</span>
            <span>{tag.name}</span>
          </button>
        );
      })}
    </div>
  );
}
