import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import { createUserSchema, updateUserSchema } from "@/validations/userValidation";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  pointsBalance: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userModule = createCrudModule(
  { create: createUserSchema, update: updateUserSchema },
  {
    create: (data) => prisma.user.create({ data, select: userSelect }),
    findById: (id) => prisma.user.findUnique({ where: { id }, select: userSelect }),
    list: ({ skip, take }) =>
      prisma.user.findMany({ skip, take, orderBy: { createdAt: "desc" }, select: userSelect }),
    update: (id, data) => prisma.user.update({ where: { id }, data, select: userSelect }),
    delete: (id) => prisma.user.delete({ where: { id }, select: userSelect }),
  },
);
