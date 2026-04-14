import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NewsCategory } from "@/data/newsTypes";

export interface Article {
  id: string;
  original_title: string;
  original_summary: string | null;
  kid_title: string | null;
  kid_summary: string | null;
  emoji: string | null;
  category: NewsCategory;
  state: string | null;
  source_name: string;
  source_url: string | null;
  image_url: string | null;
  published_at: string | null;
}

export function useArticles(category: NewsCategory | "all", state?: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(30);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    // Filter local news by selected state
    if ((category === "local" || category === "all") && state) {
      if (category === "local") {
        query = query.eq("state", state);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching articles:", error);
    }
    setArticles((data as Article[]) || []);
    setLoading(false);
  }, [category, state]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, refetch: fetchArticles };
}

export function useRefreshNews() {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      // Step 1: Fetch RSS
      await supabase.functions.invoke("fetch-news", { body: {} });
      // Step 2: Simplify with AI
      await supabase.functions.invoke("simplify-news", { body: {} });
    } catch (e) {
      console.error("Error refreshing news:", e);
    }
    setRefreshing(false);
  };

  return { refresh, refreshing };
}
