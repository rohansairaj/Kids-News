import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple XML parser for RSS
function parseRSSItems(xml: string) {
  const items: Array<{
    title: string;
    description: string;
    link: string;
    pubDate: string;
    guid: string;
    imageUrl?: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const description = extractTag(itemXml, "description");
    const link = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");
    const guid = extractTag(itemXml, "guid") || link || title;

    // Try to find image
    let imageUrl =
      extractTag(itemXml, "media:content", "url") ||
      extractTag(itemXml, "enclosure", "url") ||
      extractImageFromDesc(description);

    if (title) {
      items.push({
        title: stripCDATA(title),
        description: stripCDATA(stripHtml(description || "")),
        link: stripCDATA(link || ""),
        pubDate: pubDate || new Date().toISOString(),
        guid: stripCDATA(guid),
        imageUrl,
      });
    }
  }
  return items;
}

function extractTag(xml: string, tag: string, attr?: string): string {
  if (attr) {
    const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`, "i");
    const m = regex.exec(xml);
    return m ? m[1] : "";
  }
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = regex.exec(xml);
  return m ? m[1].trim() : "";
}

function stripCDATA(str: string): string {
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function extractImageFromDesc(desc: string): string | undefined {
  const m = /<img[^>]+src=["']([^"']+)["']/i.exec(desc);
  return m ? m[1] : undefined;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get optional category filter
    const { category } = await req.json().catch(() => ({}));

    // Fetch sources
    let query = supabase.from("news_sources").select("*").eq("is_default", true);
    if (category) query = query.eq("category", category);
    const { data: sources, error: srcErr } = await query;
    if (srcErr) throw srcErr;

    let totalInserted = 0;

    for (const source of sources || []) {
      try {
        console.log(`Fetching RSS: ${source.rss_url}`);
        const resp = await fetch(source.rss_url, {
          headers: { "User-Agent": "KidNews/1.0" },
        });
        if (!resp.ok) {
          console.error(`Failed to fetch ${source.rss_url}: ${resp.status}`);
          continue;
        }
        const xml = await resp.text();
        const items = parseRSSItems(xml).slice(0, 5); // top 5 per source

        for (const item of items) {
          const { error: insertErr } = await supabase.from("articles").upsert(
            {
              source_id: source.id,
              original_title: item.title.slice(0, 500),
              original_summary: item.description.slice(0, 2000),
              category: source.category,
              state: source.state,
              source_name: source.name,
              source_url: item.link,
              image_url: item.imageUrl,
              published_at: safeDate(item.pubDate),
              guid: item.guid.slice(0, 500),
            },
            { onConflict: "guid" }
          );
          if (!insertErr) totalInserted++;
        }
      } catch (e) {
        console.error(`Error processing source ${source.name}:`, e);
      }
    }

    return new Response(
      JSON.stringify({ success: true, inserted: totalInserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("fetch-news error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
