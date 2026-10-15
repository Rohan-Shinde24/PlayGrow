import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createRewardSchema = Joi.object<Prisma.RewardUncheckedCreateInput>({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().max(5000).allow(null),
  imageUrl: Joi.string().uri().max(2048).allow(null),
  pointsCost: Joi.number().integer().min(0).required(),
  stock: Joi.number().integer().min(0).allow(null),
  status: Joi.string().valid("ACTIVE", "INACTIVE", "OUT_OF_STOCK"),
}).unknown(false);

export const updateRewardSchema = createRewardSchema
  .fork(["title", "pointsCost"], (field) => field.optional())
  .min(1);
