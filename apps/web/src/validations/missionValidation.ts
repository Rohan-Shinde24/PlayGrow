import Joi from "joi";
import type { Prisma } from "@prisma/client";

export const createMissionSchema = Joi.object<Prisma.MissionUncheckedCreateInput>({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().max(5000).allow(null),
  gameId: Joi.string().trim().min(1).max(128).allow(null),
  points: Joi.number().integer().min(0).required(),
  targetValue: Joi.number().integer().min(1),
  status: Joi.string().valid("DRAFT", "ACTIVE", "COMPLETED", "EXPIRED"),
  startsAt: Joi.date().iso().allow(null),
  endsAt: Joi.date().iso().allow(null),
}).unknown(false);

export const updateMissionSchema = createMissionSchema
  .fork(["title", "points"], (field) => field.optional())
  .min(1);
