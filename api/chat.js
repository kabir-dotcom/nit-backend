import OpenAI from "openai";

const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are a Natural Immunotherapy (NIT) expert assistant for Subhankar Sarkar.
Natural Immunotherapy is a holistic health system focused on restoring immune balance through nutrition, detoxification, cellular repair, and natural boosters; this topic is always health-related.

Always provide clear, practical guidance on how Natural Immunotherapy addresses the user’s concern.
You must answer any question related to diseases, immunity, recovery, vitamins, minerals, detoxification, enzymes, boosters, chronic conditions (such as cancer, thalassemia, CKD), nutrition, or health improvement.

Only refuse questions that are clearly outside health, wellness, or the human body (e.g., politics, technology, sports). When refusing, reply: "Please ask me only health-related questions about your body, immunity, or recovery."

Never refuse to discuss Natural Immunotherapy itself and always explain its natural protocols, nutrients, or detox strategies that apply to the situation.

Maintain an encouraging, educational tone grounded in Natural Immunotherapy principles.
  `,
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------------------- Helpers ---------------------- */
async function readJsonBody(req) {
  try {
    if (req.body && typeof req.body === "object") return req.body;
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (!chunks.length) return {};
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Invalid JSON body");
  }
}

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

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

/* ---------------------- Main Handler ---------------------- */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return sendJson(res, 405, { message: "Method Not Allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY environment variable.");
    return sendJson(res, 500, {
      message: "Server misconfiguration: missing OpenAI API key.",
    });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return sendJson(res, 400, { message: "Invalid JSON body." });
  }

  const sanitizedMessages = normalizeMessages(body?.messages);
  if (!sanitizedMessages.length) {
    return sendJson(res, 400, {
      message: "Invalid request body: expected messages array with content.",
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [SYSTEM_MESSAGE, ...sanitizedMessages],
    });

    let reply = completion?.choices?.[0]?.message?.content?.trim();

    // ✅ Always guarantee a valid NIT-based reply
    if (!reply) {
      reply =
        "Your question seems health-related. Here’s a general Natural Immunotherapy guideline: focus on detoxification, balanced vitamins and minerals, proper hydration, and cellular repair to restore your body’s immunity.";
    }

    return sendJson(res, 200, { reply });
  } catch (error) {
    const detail =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Unknown error";

    console.error("OpenAI chat route failed:", detail);

    // ✅ Fallback response even on API failure
    return sendJson(res, 200, {
      reply:
        "It seems there’s a temporary issue processing your query. But here’s general guidance: Natural Immunotherapy strengthens your immune system through nutrition, detox, and micronutrients. Focus on hydration, liver support, and balanced diet while we reconnect.",
      detail,
    });
  }
}

/* ---------------------- Vercel Config ---------------------- */
export const config = {
  runtime: "nodejs",
};

// Log unhandled promise rejections for debugging
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
