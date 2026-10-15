import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createUserSchema = Joi.object<Prisma.UserUncheckedCreateInput>({
  name: Joi.string().trim().min(1).max(120).required(),
  email: Joi.string().trim().email().max(254).required(),
  passwordHash: Joi.string().min(20).max(255).required(),
  role: Joi.string().valid("USER", "ADMIN"),
  status: Joi.string().valid("ACTIVE", "SUSPENDED", "DELETED"),
  pointsBalance: Joi.number().integer().min(0),
  emailVerified: Joi.date().iso().allow(null),
}).unknown(false);

export const updateUserSchema = createUserSchema
  .fork(["name", "email", "passwordHash"], (field) => field.optional())
  .min(1);
