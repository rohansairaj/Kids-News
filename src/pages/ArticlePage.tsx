import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/hooks/useArticles";
import { categoryConfig, NewsCategory } from "@/data/newsTypes";
import { ArrowLeft, ExternalLink } from "lucide-react";

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id!)
        .single();
      if (!error && data) setArticle(data as Article);
      setLoading(false);
    };
    if (id) fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-5xl animate-float">📰</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">😕</span>
        <p className="text-xl font-bold text-muted-foreground">Article not found</p>
        <Link to="/" className="text-primary font-bold hover:underline">← Back to news</Link>
      </div>
    );
  }

  const config = categoryConfig[article.category as NewsCategory];
  const title = article.kid_title || article.original_title;
  const summary = article.kid_summary || article.original_summary || "";
  const emoji = article.emoji || "📰";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className={`h-2 ${config?.color || "bg-primary"}`} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to news
        </Link>

        {/* Category badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl animate-float">{emoji}</span>
          <span
            className={`${config?.color || "bg-primary"} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full capitalize`}
          >
            {config?.label || article.category}
          </span>
          {article.kid_title && (
            <span className="text-xs bg-fun-green/20 text-foreground font-semibold px-2 py-0.5 rounded-full">
              ✨ Simplified for kids
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="font-semibold">{article.source_name}</span>
          {article.published_at && (
            <span>
              {new Date(article.published_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Summary */}
        <div className="prose prose-lg max-w-none">
          {summary.split("\n").map((paragraph, i) => (
            <p key={i} className="text-foreground leading-relaxed text-lg mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Original title if simplified */}
        {article.kid_title && (
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs font-bold text-muted-foreground mb-1">Original headline</p>
            <p className="text-sm text-foreground">{article.original_title}</p>
          </div>
        )}

        {/* Source link */}
        {article.source_url && (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition"
          >
            Read original article
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
