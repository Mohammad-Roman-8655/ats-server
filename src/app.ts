import express from "express";
import cors from "cors";
import { ticketsRouter } from "./routes/tickets.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/tickets", ticketsRouter);
