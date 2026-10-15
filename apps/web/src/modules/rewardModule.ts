import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import { createRewardSchema, updateRewardSchema } from "@/validations/rewardValidation";

export const rewardModule = createCrudModule(
  { create: createRewardSchema, update: updateRewardSchema },
  {
    create: (data) => prisma.reward.create({ data }),
    findById: (id) => prisma.reward.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.reward.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.reward.update({ where: { id }, data }),
    delete: (id) => prisma.reward.delete({ where: { id } }),
  },
);
