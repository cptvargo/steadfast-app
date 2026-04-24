import { getData, saveData } from "../utils/storage";
import { localDateStr } from "../utils/date";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

function getInsightKey() {
  return `verse_insight_${localDateStr()}`;
}

export async function getVerseInsight(verse) {
  if (!API_KEY || !verse) return null;

  // Return cached result for the day so we don't call the API on every visit
  const cached = getData(getInsightKey());
  if (cached) return cached;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 900,
        system:
          "You are a thoughtful, grounded guide who helps people sit with scripture — not to lecture or prescribe, but to open up space for personal reflection. You speak like a wise friend who has lived some life. You paint pictures, not rules.",
        messages: [
          {
            role: "user",
            content: `Help someone meditate on this Bible verse.

"${verse.text}" — ${verse.reference}

First, explain in plain, honest language what this verse is really saying — like you're unpacking it for a friend over coffee. No religious jargon.

Then share 3 real-life moments or scenarios where this truth shows up — not instructions on what to do, but pictures that help someone recognize this in their own life. Think: a parent, a late-night doubt, a moment of pride, a quiet morning. Make them feel real and relatable so the person can ponder and see themselves in them.

Finally, write 3 personal reflection questions that are specific to THIS verse — not generic journal prompts, but questions that arise naturally from the unique theme, imagery, or tension in this particular verse. Each question should help the reader sit with something they might not have considered about this specific text.

Respond with JSON only (no markdown, no explanation outside the JSON):
{
  "breakdown": "2–3 sentences in plain language — what is this verse actually saying to a real person?",
  "applications": [
    "A real-life moment or scenario where this truth becomes visible — something to sit with, not a to-do",
    "A second life scenario — grounded, honest, maybe a little uncomfortable in a good way",
    "A third scenario — could be quiet, could be a turning point, something worth pondering"
  ],
  "reflectionPrompts": [
    "A reflection question that comes directly from the specific theme or imagery of this verse",
    "A second question that surfaces a tension or invitation unique to this text",
    "A third question — personal, honest, something worth sitting with"
  ]
}`,
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    const raw = data.content?.[0]?.text ?? "";

    // Strip markdown code fences if Claude wrapped the JSON
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const insight = JSON.parse(cleaned);

    saveData(getInsightKey(), insight);
    return insight;
  } catch (err) {
    console.warn("Verse insight unavailable:", err.message);
    saveData("insight_last_error", `${new Date().toISOString()} — ${err.message}`);
    return null;
  }
}
