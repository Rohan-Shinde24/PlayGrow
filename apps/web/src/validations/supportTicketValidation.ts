import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createSupportTicketSchema = Joi.object<Prisma.SupportTicketUncheckedCreateInput>({
  userId: Joi.string().trim().min(1).max(128).required(),
  subject: Joi.string().trim().min(1).max(200).required(),
  message: Joi.string().trim().min(1).max(10_000).required(),
  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
}).unknown(false);

export const updateSupportTicketSchema = createSupportTicketSchema
  .fork(["userId", "subject", "message"], (field) => field.optional())
  .min(1);
