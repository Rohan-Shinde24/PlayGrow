import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createProfileSchema = Joi.object<Prisma.ProfileUncheckedCreateInput>({
  userId: Joi.string().trim().min(1).max(128).required(),
  avatarUrl: Joi.string().uri().max(2048).allow(null),
  bio: Joi.string().max(2000).allow(null),
  country: Joi.string().trim().max(100).allow(null),
}).unknown(false);

export const updateProfileSchema = createProfileSchema
  .fork(["userId"], (field) => field.optional())
  .min(1);
