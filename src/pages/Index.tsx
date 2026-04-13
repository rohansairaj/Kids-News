import { useState, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryTabs from "@/components/CategoryTabs";
import NewsCard from "@/components/NewsCard";
import { mockArticles, NewsCategory } from "@/data/mockNews";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return mockArticles;
    return mockArticles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Category Tabs */}
        <div className="mb-10">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <NewsCard key={article.id} article={article} featured={i === 0 && activeCategory === "all"} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl">🔍</span>
            <p className="text-xl font-bold text-muted-foreground mt-4">No stories here yet!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p className="font-bold">KidNews 📰 — News Made Fun for Kids!</p>
        <p className="mt-1">Made with ❤️ for curious minds everywhere</p>
      </footer>
    </div>
  );
};

export default Index;
