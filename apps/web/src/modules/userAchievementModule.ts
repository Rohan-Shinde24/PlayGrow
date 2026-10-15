import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createUserAchievementSchema,
  updateUserAchievementSchema,
} from "@/validations/userAchievementValidation";

export const userAchievementModule = createCrudModule(
  { create: createUserAchievementSchema, update: updateUserAchievementSchema },
  {
    create: (data) => prisma.userAchievement.create({ data }),
    findById: (id) => prisma.userAchievement.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.userAchievement.findMany({ skip, take, orderBy: { unlockedAt: "desc" } }),
    update: (id, data) => prisma.userAchievement.update({ where: { id }, data }),
    delete: (id) => prisma.userAchievement.delete({ where: { id } }),
  },
);
