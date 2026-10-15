import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/validations/transactionValidation";

export const transactionModule = createCrudModule(
  { create: createTransactionSchema, update: updateTransactionSchema },
  {
    create: (data) => prisma.transaction.create({ data }),
    findById: (id) => prisma.transaction.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.transaction.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.transaction.update({ where: { id }, data }),
    delete: (id) => prisma.transaction.delete({ where: { id } }),
  },
);
