import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createAchievementSchema,
  updateAchievementSchema,
} from "@/validations/achievementValidation";

export const achievementModule = createCrudModule(
  { create: createAchievementSchema, update: updateAchievementSchema },
  {
    create: (data) => prisma.achievement.create({ data }),
    findById: (id) => prisma.achievement.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.achievement.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.achievement.update({ where: { id }, data }),
    delete: (id) => prisma.achievement.delete({ where: { id } }),
  },
);
