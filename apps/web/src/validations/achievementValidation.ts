import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createAchievementSchema = Joi.object<Prisma.AchievementUncheckedCreateInput>({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().max(5000).allow(null),
  iconUrl: Joi.string().uri().max(2048).allow(null),
}).unknown(false);

export const updateAchievementSchema = createAchievementSchema
  .fork(["title"], (field) => field.optional())
  .min(1);
