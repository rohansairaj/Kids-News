import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NewsSource {
  id: string;
  name: string;
  url: string;
  rss_url: string;
  category: string;
  is_default: boolean;
}

export function useNewsSources() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("news_sources")
      .select("*")
      .order("name");

    if (!error) setSources(data as NewsSource[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const addSource = async (source: {
    name: string;
    url: string;
    rss_url: string;
    category: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to add sources");

    const { error } = await supabase.from("news_sources").insert({
      ...source,
      added_by: user.id,
      is_default: false,
      category: source.category as any,
    });
    if (error) throw error;
    await fetchSources();
  };

  const removeSource = async (id: string) => {
    const { error } = await supabase.from("news_sources").delete().eq("id", id);
    if (error) throw error;
    await fetchSources();
  };

  return { sources, loading, addSource, removeSource, refetch: fetchSources };
}
