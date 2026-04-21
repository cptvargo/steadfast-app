const FALLBACK_VERSE = {
  text: "I can do all things through Christ who strengthens me.",
  reference: "Philippians 4:13",
};

export async function getDailyScripture() {
  try {
    const response = await fetch(
      "https://bible-api.com/philippians+4:13?translation=kjv"
    );
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    return {
      text: data.text?.trim(),
      reference: data.reference,
    };
  } catch {
    return FALLBACK_VERSE;
  }
}
