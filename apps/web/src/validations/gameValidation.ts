import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createGameSchema = Joi.object<Prisma.GameUncheckedCreateInput>({
  title: Joi.string().trim().min(1).max(200).required(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(220)
    .required(),
  description: Joi.string().max(5000).allow(null),
  thumbnail: Joi.string().uri().max(2048).allow(null),
  launchUrl: Joi.string().uri({ scheme: ["https"] }).max(2048).allow(null),
  categoryId: Joi.string().trim().min(1).max(128).allow(null),
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
}).unknown(false);

export const updateGameSchema = createGameSchema
  .fork(["title", "slug"], (field) => field.optional())
  .min(1);
