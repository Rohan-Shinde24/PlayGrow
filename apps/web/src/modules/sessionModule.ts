import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import { createSessionSchema, updateSessionSchema } from "@/validations/sessionValidation";

const sessionSelect = {
  id: true,
  userId: true,
  expiresAt: true,
  createdAt: true,
} as const;

export const sessionModule = createCrudModule(
  { create: createSessionSchema, update: updateSessionSchema },
  {
    create: (data) => prisma.session.create({ data, select: sessionSelect }),
    findById: (id) => prisma.session.findUnique({ where: { id }, select: sessionSelect }),
    list: ({ skip, take }) =>
      prisma.session.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: sessionSelect,
      }),
    update: (id, data) => prisma.session.update({ where: { id }, data, select: sessionSelect }),
    delete: (id) => prisma.session.delete({ where: { id }, select: sessionSelect }),
  },
);
