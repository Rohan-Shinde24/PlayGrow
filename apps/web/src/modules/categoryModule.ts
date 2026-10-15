import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import { createCategorySchema, updateCategorySchema } from "@/validations/categoryValidation";

export const categoryModule = createCrudModule(
  { create: createCategorySchema, update: updateCategorySchema },
  {
    create: (data) => prisma.category.create({ data }),
    findById: (id) => prisma.category.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.category.findMany({ skip, take, orderBy: { name: "asc" } }),
    update: (id, data) => prisma.category.update({ where: { id }, data }),
    delete: (id) => prisma.category.delete({ where: { id } }),
  },
);
