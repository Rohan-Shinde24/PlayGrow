import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createAdminAuditLogSchema = Joi.object<Prisma.AdminAuditLogUncheckedCreateInput>({
  adminId: Joi.string().trim().min(1).max(128).required(),
  action: Joi.string().trim().min(1).max(200).required(),
  entityType: Joi.string().trim().min(1).max(120).required(),
  entityId: Joi.string().trim().max(128).allow(null),
  details: Joi.object().unknown(true).allow(null),
}).unknown(false);

export const updateAdminAuditLogSchema = createAdminAuditLogSchema
  .fork(["adminId", "action", "entityType"], (field) => field.optional())
  .min(1);
