import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createSessionSchema = Joi.object<Prisma.SessionUncheckedCreateInput>({
  userId: Joi.string().trim().min(1).max(128).required(),
  tokenHash: Joi.string().min(32).max(255).required(),
  expiresAt: Joi.date().iso().required(),
}).unknown(false);

export const updateSessionSchema = createSessionSchema
  .fork(["userId", "tokenHash", "expiresAt"], (field) => field.optional())
  .min(1);
