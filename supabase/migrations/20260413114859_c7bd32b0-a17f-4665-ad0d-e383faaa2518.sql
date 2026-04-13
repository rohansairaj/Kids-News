
CREATE TYPE public.news_category AS ENUM ('sports', 'entertainment', 'global', 'local');

CREATE TABLE public.news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  rss_url TEXT NOT NULL,
  category news_category NOT NULL,
  state TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  added_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read default sources" ON public.news_sources
  FOR SELECT USING (is_default = true);

CREATE POLICY "Users can read their own sources" ON public.news_sources
  FOR SELECT USING (auth.uid() = added_by);

CREATE POLICY "Users can add sources" ON public.news_sources
  FOR INSERT WITH CHECK (auth.uid() = added_by AND is_default = false);

CREATE POLICY "Users can delete own sources" ON public.news_sources
  FOR DELETE USING (auth.uid() = added_by AND is_default = false);

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.news_sources(id) ON DELETE CASCADE,
  original_title TEXT NOT NULL,
  original_summary TEXT,
  kid_title TEXT,
  kid_summary TEXT,
  emoji TEXT DEFAULT '📰',
  category news_category NOT NULL,
  state TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  guid TEXT UNIQUE
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read articles" ON public.articles
  FOR SELECT USING (true);

INSERT INTO public.news_sources (name, url, rss_url, category, is_default, state) VALUES
  ('NDTV Sports', 'https://sports.ndtv.com', 'https://feeds.feedburner.com/ndtvsports-latest', 'sports', true, null),
  ('ESPN India', 'https://www.espn.in', 'https://www.espn.com/espn/rss/news', 'sports', true, null),
  ('Times of India Entertainment', 'https://timesofindia.indiatimes.com/entertainment', 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms', 'entertainment', true, null),
  ('NDTV Entertainment', 'https://www.ndtv.com/entertainment', 'https://feeds.feedburner.com/ndtvmovies-latest', 'entertainment', true, null),
  ('The Hindu World', 'https://www.thehindu.com/news/international', 'https://www.thehindu.com/news/international/feeder/default.rss', 'global', true, null),
  ('NDTV World', 'https://www.ndtv.com/world-news', 'https://feeds.feedburner.com/ndtvnews-world-news', 'global', true, null),
  ('NDTV India', 'https://www.ndtv.com/india-news', 'https://feeds.feedburner.com/ndtvnews-india-news', 'local', true, null),
  ('Times of India Cities', 'https://timesofindia.indiatimes.com/city', 'https://timesofindia.indiatimes.com/rssfeeds/-2128932452.cms', 'local', true, null);
