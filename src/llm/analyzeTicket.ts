import OpenAI from "openai";
import { env } from "../config/env.js";
import { buildPrompt } from "./prompt.js";
import { TicketAIResultSchema } from "../validation/ticketSchemas.js";

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY,   baseURL: "https://api.groq.com/openai/v1",
 });

export async function analyzeTicketWithLLM(input: { subject: string; description: string }) {
  const prompt = buildPrompt(input);

  const resp = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: "system", content: "You output strict JSON only." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const text = resp.choices[0]?.message?.content ?? "";
  // Parse JSON safely
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // If model returned extra text, try to extract JSON block quickly
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end >= 0 && end > start) {
      parsed = JSON.parse(text.slice(start, end + 1));
    } else {
      throw new Error("LLM did not return valid JSON");
    }
  }

  return TicketAIResultSchema.parse(parsed);
}
