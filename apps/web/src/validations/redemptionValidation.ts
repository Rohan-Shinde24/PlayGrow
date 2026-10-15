import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createRedemptionSchema = Joi.object<Prisma.RedemptionUncheckedCreateInput>({
  userId: Joi.string().trim().min(1).max(128).required(),
  rewardId: Joi.string().trim().min(1).max(128).required(),
  pointsSpent: Joi.number().integer().min(0).required(),
  status: Joi.string().valid("PENDING", "APPROVED", "REJECTED", "FULFILLED", "CANCELLED"),
  reference: Joi.string().trim().max(255).allow(null),
}).unknown(false);

export const updateRedemptionSchema = createRedemptionSchema
  .fork(["userId", "rewardId", "pointsSpent"], (field) => field.optional())
  .min(1);
