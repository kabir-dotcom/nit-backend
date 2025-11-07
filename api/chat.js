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
Maintain an encouraging, educational tone grounded in Natural Immunotherapy principles.`,
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function readJsonBody(req) {
  if (req && typeof req === "object" && "body" in req) {
    const existingBody = req.body;

    if (existingBody && typeof existingBody === "object") {
      return existingBody;
    }

    if (typeof existingBody === "string") {
      if (!existingBody.trim()) {
        return {};
      }

      try {
        return JSON.parse(existingBody);
      } catch (error) {
        throw new Error("Failed to parse string body.");
      }
    }
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const role =
        typeof item.role === "string" && item.role.trim()
          ? item.role.trim()
          : "user";

      const content =
        typeof item.content === "string"
          ? item.content.trim()
          : String(item.content ?? "").trim();

      if (!content) {
        return null;
      }

      return { role, content };
    })
    .filter(Boolean);
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

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

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "Please ask me only health-related questions about your body, immunity, or recovery.";

    return sendJson(res, 200, { reply });
  } catch (error) {
    const detail =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Unknown error";

    console.error("OpenAI chat route failed:", detail);

    return sendJson(res, 500, {
      message: "Unable to process the chat request at this time.",
      detail,
    });
  }
}
export const config = {
  runtime: "nodejs",
};