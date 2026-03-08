import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },

    aiResult: { type: Object, required: true }, // store validated JSON
  },
  { timestamps: true } // gives createdAt/updatedAt
);

export const TicketModel = mongoose.model("Ticket", TicketSchema);
