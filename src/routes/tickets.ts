import { Router } from "express";
import { TicketCreateSchema } from "../validation/ticketSchemas.js";
import {analyzeTicketWithLLM} from "../llm/analyzeTicket.js";
import { TicketModel } from "../models/Ticket.js";

export const ticketsRouter = Router();

// POST /api/tickets/analyze
ticketsRouter.post("/analyze", async (req, res) => {
  try {
    const input = TicketCreateSchema.parse(req.body);

    const aiResult = await analyzeTicketWithLLM({
      subject: input.subject,
      description: input.description,
    });

    const doc = await TicketModel.create({
      customerEmail: input.customerEmail,
      subject: input.subject,
      description: input.description,
      aiResult,
    });

    return res.status(201).json(doc);
  } catch (err: any) {
    return res.status(400).json({
      message: err?.message ?? "Failed to analyze ticket",
    });
  }
});

// GET /api/tickets?page=1&limit=10
ticketsRouter.get("/", async (req, res) => {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50); // limit 1..50

  const skip = (page - 1) * limit;

  const [totalItems, items] = await Promise.all([
    TicketModel.countDocuments(),
    TicketModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);

  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  res.json({
    items,
    page,
    limit,
    totalItems,
    totalPages,
  });
});


// GET /api/tickets/:id
ticketsRouter.get("/:id", async (req, res) => {
  const ticket = await TicketModel.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  res.json(ticket);
});


