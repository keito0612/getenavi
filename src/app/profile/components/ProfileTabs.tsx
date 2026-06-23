type Props = {
  activeTab: "posts" | "likes";
  onTabChange: (tab: "posts" | "likes") => void;
};

export function ProfileTabs({ activeTab, onTabChange }: Props) {
  const tabs = [
    { id: "posts" as const, label: "投稿" },
    { id: "likes" as const, label: "いいね" },
  ];

  return (
    <div className="border-b border-gray-700 bg-gray-900">
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
