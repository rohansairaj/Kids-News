import { Link } from "react-router-dom";
import { Article } from "@/hooks/useArticles";
import { categoryConfig, NewsCategory } from "@/data/newsTypes";

interface NewsCardProps {
  article: Article;
  featured?: boolean;
}

const NewsCard = ({ article, featured = false }: NewsCardProps) => {
  const config = categoryConfig[article.category as NewsCategory];
  const title = article.kid_title || article.original_title;
  const summary = article.kid_summary || article.original_summary || "";
  const emoji = article.emoji || "📰";

  return (
    <Link
      to={`/article/${article.id}`}
      className={`group relative overflow-hidden rounded-2xl bg-card border-2 border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Decorative top bar */}
      <div className={`h-2 ${config?.color || "bg-primary"}`} />

      <div className={`p-5 ${featured ? "md:p-8" : ""}`}>
        {/* Emoji + Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-3xl ${featured ? "text-5xl" : ""} animate-float`}>
            {emoji}
          </span>
          <span
            className={`${config?.color || "bg-primary"} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full capitalize`}
          >
            {config?.label || article.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-extrabold leading-tight mb-2 group-hover:text-primary transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {title}
        </h3>

        {/* Simplified badge */}
        {article.kid_title && (
          <span className="inline-block text-xs bg-fun-green/20 text-foreground font-semibold px-2 py-0.5 rounded-full mb-2">
            ✨ Simplified for kids
          </span>
        )}

        {/* Summary */}
        <p
          className={`text-muted-foreground leading-relaxed mb-4 ${
            featured ? "text-base" : "text-sm line-clamp-3"
          }`}
        >
          {summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold">{article.source_name}</span>
          <div className="flex items-center gap-3">
            {article.published_at && (
              <span>
                {new Date(article.published_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
