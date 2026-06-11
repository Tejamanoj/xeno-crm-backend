import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY not found",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert CRM marketing assistant.

Return ONLY valid JSON in this format:

{
  "audience": number,
  "channel": "WhatsApp" | "Email" | "SMS",
  "score": number,
  "message": "campaign message"
}
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const result = JSON.parse(
      completion.choices[0].message.content
    );

    res.json(result);
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      error: "AI generation failed",
      details: error.message,
    });
  }
});

export default router;