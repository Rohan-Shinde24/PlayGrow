import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createRedemptionSchema,
  updateRedemptionSchema,
} from "@/validations/redemptionValidation";

export const redemptionModule = createCrudModule(
  { create: createRedemptionSchema, update: updateRedemptionSchema },
  {
    create: (data) => prisma.redemption.create({ data }),
    findById: (id) => prisma.redemption.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.redemption.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.redemption.update({ where: { id }, data }),
    delete: (id) => prisma.redemption.delete({ where: { id } }),
  },
);
