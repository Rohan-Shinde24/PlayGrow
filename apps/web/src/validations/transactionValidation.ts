import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createTransactionSchema = Joi.object<Prisma.TransactionUncheckedCreateInput>({
  userId: Joi.string().trim().min(1).max(128).required(),
  type: Joi.string().valid("EARN", "REDEEM", "REFUND", "ADJUSTMENT").required(),
  status: Joi.string().valid("PENDING", "COMPLETED", "FAILED", "REVERSED"),
  points: Joi.number().integer().min(0).required(),
  balanceAfter: Joi.number().integer().min(0).required(),
  description: Joi.string().max(2000).allow(null),
  reference: Joi.string().trim().max(255).allow(null),
}).unknown(false);

export const updateTransactionSchema = createTransactionSchema
  .fork(["userId", "type", "points", "balanceAfter"], (field) => field.optional())
  .min(1);
