import { useState } from "react";
import { useNewsSources } from "@/hooks/useNewsSources";
import { categoryConfig, NewsCategory } from "@/data/newsTypes";
import { Plus, Trash2, X, Rss } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageSources = () => {
  const { sources, addSource, removeSource } = useNewsSources();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [rssUrl, setRssUrl] = useState("");
  const [category, setCategory] = useState<NewsCategory>("sports");
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!name.trim() || !rssUrl.trim()) {
      toast({ title: "Please fill in name and RSS URL", variant: "destructive" });
      return;
    }
    try {
      await addSource({ name: name.trim(), url: url.trim() || rssUrl.trim(), rss_url: rssUrl.trim(), category });
      toast({ title: "Source added! 🎉" });
      setName("");
      setUrl("");
      setRssUrl("");
      setShowForm(false);
    } catch (e: any) {
      toast({ title: e.message || "Failed to add source", variant: "destructive" });
    }
  };

  const userSources = sources.filter((s) => !s.is_default);
  const defaultSources = sources.filter((s) => s.is_default);

  return (
    <div className="bg-card border-2 border-border/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold flex items-center gap-2">
          <Rss className="w-5 h-5 text-primary" /> News Sources
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:opacity-90 transition"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Source"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-muted rounded-xl space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Source name (e.g. Times of India)"
            className="w-full px-4 py-2 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-sm focus:border-primary outline-none"
          />
          <input
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            placeholder="RSS feed URL"
            className="w-full px-4 py-2 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-sm focus:border-primary outline-none"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Website URL (optional)"
            className="w-full px-4 py-2 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-sm focus:border-primary outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as NewsCategory)}
            className="w-full px-4 py-2 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-sm focus:border-primary outline-none"
          >
            {Object.entries(categoryConfig).map(([key, val]) => (
              <option key={key} value={key}>
                {val.emoji} {val.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="w-full py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm"
          >
            Add Source ✨
          </button>
        </div>
      )}

      {/* Default sources */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-muted-foreground mb-2">Default Sources</h3>
        <div className="flex flex-wrap gap-2">
          {defaultSources.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs font-semibold text-foreground"
            >
              {categoryConfig[s.category as NewsCategory]?.emoji} {s.name}
            </span>
          ))}
        </div>
      </div>

      {/* User sources */}
      {userSources.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-2">Your Sources</h3>
          <div className="flex flex-wrap gap-2">
            {userSources.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-fun-purple/20 rounded-full text-xs font-semibold text-foreground"
              >
                {categoryConfig[s.category as NewsCategory]?.emoji} {s.name}
                <button onClick={() => removeSource(s.id)} className="ml-1 text-destructive hover:opacity-70">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSources;
