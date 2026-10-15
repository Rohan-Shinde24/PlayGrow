import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createCategorySchema = Joi.object<Prisma.CategoryUncheckedCreateInput>({
  name: Joi.string().trim().min(1).max(120).required(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(140)
    .required(),
}).unknown(false);

export const updateCategorySchema = createCategorySchema
  .fork(["name", "slug"], (field) => field.optional())
  .min(1);
