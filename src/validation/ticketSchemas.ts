import { z } from "zod";

export const TicketCreateSchema = z.object({
  customerEmail: z.string().email(),
  subject: z.string().min(3),
  description: z.string().min(10),
});

export const TicketAIResultSchema = z.object({
  category: z.enum(["Technical", "Billing", "Account", "Feature Request", "Bug Report"]),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  recommendedDepartment: z.enum(["Engineering", "Finance", "Customer Success", "Product"]),
  keyIssues: z.array(z.string().min(2)).min(1),
  sentiment: z.enum(["Frustrated", "Neutral", "Satisfied"]),
  confidence: z.number().min(0).max(1).optional(),
});
