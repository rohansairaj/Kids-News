CREATE TABLE IF NOT EXISTS public.internal_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.internal_config TO service_role;
ALTER TABLE public.internal_config ENABLE ROW LEVEL SECURITY;

INSERT INTO public.internal_config (key, value)
VALUES ('cron_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

DO $$
DECLARE s text;
BEGIN
  SELECT value INTO s FROM public.internal_config WHERE key = 'cron_secret';

  PERFORM cron.unschedule('fetch-news-every-30min');
  PERFORM cron.unschedule('simplify-news-every-30min');

  PERFORM cron.schedule('fetch-news-every-30min', '*/30 * * * *', format($f$
    SELECT net.http_post(
      url:='https://uxbvvfhfecxyfawxqido.supabase.co/functions/v1/fetch-news',
      headers:=%L::jsonb,
      body:='{}'::jsonb
    ) AS request_id;
  $f$, json_build_object('Content-Type','application/json','x-internal-secret', s)::text));

  PERFORM cron.schedule('simplify-news-every-30min', '5,35 * * * *', format($f$
    SELECT net.http_post(
      url:='https://uxbvvfhfecxyfawxqido.supabase.co/functions/v1/simplify-news',
      headers:=%L::jsonb,
      body:='{}'::jsonb
    ) AS request_id;
  $f$, json_build_object('Content-Type','application/json','x-internal-secret', s)::text));
END $$;