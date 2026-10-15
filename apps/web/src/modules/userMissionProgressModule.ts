import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createUserMissionProgressSchema,
  updateUserMissionProgressSchema,
} from "@/validations/userMissionProgressValidation";

export const userMissionProgressModule = createCrudModule(
  { create: createUserMissionProgressSchema, update: updateUserMissionProgressSchema },
  {
    create: (data) => prisma.userMissionProgress.create({ data }),
    findById: (id) => prisma.userMissionProgress.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.userMissionProgress.findMany({ skip, take, orderBy: { startedAt: "desc" } }),
    update: (id, data) => prisma.userMissionProgress.update({ where: { id }, data }),
    delete: (id) => prisma.userMissionProgress.delete({ where: { id } }),
  },
);
