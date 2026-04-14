import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryTabs from "@/components/CategoryTabs";
import NewsCard from "@/components/NewsCard";
import StateSelector from "@/components/StateSelector";
import ManageSources from "@/components/ManageSources";
import { useArticles, useRefreshNews } from "@/hooks/useArticles";
import { NewsCategory } from "@/data/newsTypes";
import { RefreshCw, Settings, Clock } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">("all");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [showSources, setShowSources] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { articles, loading, refetch } = useArticles(activeCategory, selectedState);
  const { refresh, refreshing } = useRefreshNews();

  // Auto-detect state via geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`,
              { headers: { "User-Agent": "KidNews/1.0" } }
            );
            const data = await resp.json();
            const state = data?.address?.state;
            if (state) setSelectedState(state);
          } catch {
            // fallback to default
          }
        },
        () => {
          // permission denied, use default
        }
      );
    }
  }, []);

  const handleRefresh = async () => {
    await refresh();
    await refetch();
    setLastUpdated(new Date());
  };

  // Set last updated from most recent article on load
  useEffect(() => {
    if (articles.length > 0 && !lastUpdated) {
      const latest = articles[0]?.published_at;
      if (latest) setLastUpdated(new Date(latest));
    }
  }, [articles, lastUpdated]);

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <StateSelector selected={selectedState} onChange={setSelectedState} />
            {lastUpdated && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Clock className="w-3.5 h-3.5" />
                Updated {formatLastUpdated(lastUpdated)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border-2 border-border font-bold text-sm hover:border-primary/50 transition-all"
            >
              <Settings className="w-4 h-4" />
              Sources
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Fetching..." : "Refresh News"}
            </button>
          </div>
        </div>

        {/* Sources panel */}
        {showSources && (
          <div className="mb-8">
            <ManageSources />
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-10">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <span className="text-5xl animate-float inline-block">📰</span>
            <p className="text-xl font-bold text-muted-foreground mt-4">Loading news...</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <NewsCard key={article.id} article={article} featured={i === 0 && activeCategory === "all"} />
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl">🔍</span>
            <p className="text-xl font-bold text-muted-foreground mt-4">No stories yet!</p>
            <p className="text-muted-foreground mt-2">
              Click <strong>"Refresh News"</strong> to fetch the latest stories ✨
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p className="font-bold">KidNews 📰 — News Made Fun for Kids!</p>
        <p className="mt-1">Made with ❤️ for curious minds everywhere 🇮🇳</p>
      </footer>
    </div>
  );
};

export default Index;
