import { NewsArticle, topicColors } from "@/data/mockNews";
import { Clock } from "lucide-react";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const NewsCard = ({ article, featured = false }: NewsCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-card border-2 border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Decorative top bar */}
      <div className={`h-2 ${topicColors[article.topic]}`} />

      <div className={`p-5 ${featured ? "md:p-8" : ""}`}>
        {/* Emoji + Topic badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-3xl ${featured ? "text-5xl" : ""} animate-float`}>
            {article.emoji}
          </span>
          <span
            className={`${topicColors[article.topic]} text-accent-foreground text-xs font-bold px-3 py-1 rounded-full capitalize`}
          >
            {article.topic}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-extrabold leading-tight mb-2 group-hover:text-primary transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>

        {/* Summary */}
        <p
          className={`text-muted-foreground leading-relaxed mb-4 ${
            featured ? "text-base" : "text-sm line-clamp-3"
          }`}
        >
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold">{article.source}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime} min read
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
