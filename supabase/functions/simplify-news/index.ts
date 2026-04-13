import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get articles that haven't been simplified yet
    const { data: articles, error } = await supabase
      .from("articles")
      .select("id, original_title, original_summary")
      .is("kid_title", null)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, simplified: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let simplified = 0;

    for (const article of articles) {
      try {
        const response = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                {
                  role: "system",
                  content: `You are a friendly news writer for children aged 8-14 in India. Rewrite news articles so kids can understand them easily.
Rules:
- Use simple words and short sentences
- Make it fun and engaging
- Keep the facts accurate
- The title should be catchy and under 80 characters
- The summary should be 2-3 short paragraphs
- Pick ONE emoji that best represents the story
Return ONLY valid JSON: {"kid_title":"...","kid_summary":"...","emoji":"..."}`,
                },
                {
                  role: "user",
                  content: `Title: ${article.original_title}\n\nSummary: ${article.original_summary || "No summary available."}`,
                },
              ],
            }),
          }
        );

        if (response.status === 429) {
          console.log("Rate limited, stopping simplification batch");
          break;
        }
        if (response.status === 402) {
          console.error("AI credits exhausted");
          break;
        }
        if (!response.ok) {
          console.error(`AI error: ${response.status}`);
          continue;
        }

        const aiData = await response.json();
        const content = aiData.choices?.[0]?.message?.content || "";

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("No JSON in AI response for article", article.id);
          continue;
        }

        const parsed = JSON.parse(jsonMatch[0]);

        await supabase
          .from("articles")
          .update({
            kid_title: parsed.kid_title,
            kid_summary: parsed.kid_summary,
            emoji: parsed.emoji || "📰",
          })
          .eq("id", article.id);

        simplified++;
      } catch (e) {
        console.error(`Error simplifying article ${article.id}:`, e);
      }
    }

    return new Response(
      JSON.stringify({ success: true, simplified }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("simplify-news error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
