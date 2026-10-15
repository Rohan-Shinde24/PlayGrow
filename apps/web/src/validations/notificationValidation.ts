import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createNotificationSchema = Joi.object<Prisma.NotificationUncheckedCreateInput>({
  userId: Joi.string().trim().min(1).max(128).required(),
  title: Joi.string().trim().min(1).max(200).required(),
  message: Joi.string().trim().min(1).max(5000).required(),
  isRead: Joi.boolean(),
}).unknown(false);

export const updateNotificationSchema = createNotificationSchema
  .fork(["userId", "title", "message"], (field) => field.optional())
  .min(1);
