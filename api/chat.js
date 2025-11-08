const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

// ✅ System message to keep consistent NIT tone
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are a Natural Immunotherapy (NIT) expert assistant for Subhankar Sarkar.
Natural Immunotherapy focuses on restoring immune balance through nutrition, detoxification, cellular repair, and natural boosters.
Always answer clearly and practically about how NIT addresses the user's concern.
Only refuse questions that are *not* health-related (politics, sports, etc.) by saying:
"Please ask me only health-related questions about your body, immunity, or recovery."
Keep responses positive, educational, and rooted in NIT principles.
  `,
};

// ✅ Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Helper: normalize messages
function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const role = item.role?.trim() || "user";
      const content =
        typeof item.content === "string"
          ? item.content.trim()
          : String(item.content ?? "").trim();
      return content ? { role, content } : null;
    })
    .filter(Boolean);
}

// ✅ POST /api/chat
router.post("/chat", async (req, res) => {
  try {
    console.log("🧠 NIT Chat API hit");

    const messages = normalizeMessages(req.body?.messages);
    if (!messages.length) {
      console.warn("⚠️ Invalid messages array in request");
      return res.status(400).json({ reply: "Invalid request format." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [SYSTEM_MESSAGE, ...messages],
    });

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "Your question seems health-related. Focus on detoxification, hydration, balanced vitamins, and proper cellular nutrition through Natural Immunotherapy.";

    console.log("✅ NIT reply generated successfully");
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Chat route error:", error.message);

    // Graceful fallback
    return res.status(200).json({
      reply:
        "There seems to be a temporary issue processing your query. But here’s a general NIT guideline: detoxify, hydrate, and restore immune balance with vitamins and minerals.",
    });
  }
});

module.exports = router;
