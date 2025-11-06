const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

let client;

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map(message => {
      if (!message || typeof message !== 'object') {
        return null;
      }

      const role =
        typeof message.role === 'string' && message.role.trim()
          ? message.role.trim()
          : 'user';

      const content =
        typeof message.content === 'string'
          ? message.content.trim()
          : String(message.content ?? '').trim();

      if (!content) {
        return null;
      }

      return { role, content };
    })
    .filter(Boolean);
}

router.post('/chat', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY environment variable.');
    return res.status(500).json({
      message: 'Server misconfiguration: missing OpenAI API key.',
    });
  }

  const sanitizedMessages = normalizeMessages(req.body?.messages);

  if (!sanitizedMessages.length) {
    return res.status(400).json({
      message: 'Invalid request body: expected messages array with content.',
    });
  }

  try {
    const completion = await getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a Natural Immunotherapy (NIT) expert assistant for Subhankar Sarkar. Natural Immunotherapy is a holistic health system focused on restoring immune balance through nutrition, detoxification, cellular repair, and natural boosters; this topic is always health-related. Always provide clear, practical guidance on how Natural Immunotherapy addresses the user’s concern. You must answer any question related to diseases, immunity, recovery, vitamins, minerals, detoxification, enzymes, boosters, chronic conditions (such as cancer, thalassemia, CKD), nutrition, or health improvement. Only refuse questions that are clearly outside health, wellness, or the human body (e.g., politics, technology, sports). When refusing, reply: "Please ask me only health-related questions about your body, immunity, or recovery." Never refuse to discuss Natural Immunotherapy itself and always explain its natural protocols, nutrients, or detox strategies that apply to the situation. Maintain an encouraging, educational tone grounded in Natural Immunotherapy principles.',
        },
        ...sanitizedMessages,
      ],
    });

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      'Please ask me only health-related questions about your body, immunity, or recovery.';

    return res.status(200).json({ reply });
  } catch (error) {
    const detail =
      error?.response?.data?.error?.message ||
      error?.message ||
      'Unknown error';

    console.error('OpenAI chat route failed:', detail);

    return res.status(500).json({
      message: 'Unable to process the chat request at this time.',
      detail,
    });
  }
});

module.exports = router;
