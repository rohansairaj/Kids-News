import { NewsCategory, categoryLabels } from "@/data/mockNews";

interface CategoryTabsProps {
  active: NewsCategory | "all";
  onChange: (cat: NewsCategory | "all") => void;
}

const CategoryTabs = ({ active, onChange }: CategoryTabsProps) => {
  const tabs: { key: NewsCategory | "all"; label: string; emoji: string }[] = [
    { key: "all", label: "All News", emoji: "📰" },
    ...Object.entries(categoryLabels).map(([key, val]) => ({
      key: key as NewsCategory,
      label: val.label,
      emoji: val.emoji,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 border-2 ${
            active === tab.key
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
              : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
          }`}
        >
          <span className="text-lg">{tab.emoji}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
