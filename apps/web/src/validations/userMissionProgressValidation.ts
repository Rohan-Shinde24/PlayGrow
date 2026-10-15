import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createUserMissionProgressSchema =
  Joi.object<Prisma.UserMissionProgressUncheckedCreateInput>({
    userId: Joi.string().trim().min(1).max(128).required(),
    missionId: Joi.string().trim().min(1).max(128).required(),
    currentValue: Joi.number().integer().min(0),
    status: Joi.string().valid("IN_PROGRESS", "COMPLETED", "CLAIMED"),
    startedAt: Joi.date().iso(),
    completedAt: Joi.date().iso().allow(null),
    claimedAt: Joi.date().iso().allow(null),
  }).unknown(false);

export const updateUserMissionProgressSchema = createUserMissionProgressSchema
  .fork(["userId", "missionId"], (field) => field.optional())
  .min(1);
