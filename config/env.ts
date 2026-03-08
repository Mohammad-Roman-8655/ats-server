import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().default("5000"),
  MONGODB_URI: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
});

export const env = EnvSchema.parse(process.env);
