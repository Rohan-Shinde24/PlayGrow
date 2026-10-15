import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createUserAchievementSchema =
  Joi.object<Prisma.UserAchievementUncheckedCreateInput>({
    userId: Joi.string().trim().min(1).max(128).required(),
    achievementId: Joi.string().trim().min(1).max(128).required(),
    unlockedAt: Joi.date().iso(),
  }).unknown(false);

export const updateUserAchievementSchema = createUserAchievementSchema
  .fork(["userId", "achievementId"], (field) => field.optional())
  .min(1);
