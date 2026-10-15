import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import { createProfileSchema, updateProfileSchema } from "@/validations/profileValidation";

export const profileModule = createCrudModule(
  { create: createProfileSchema, update: updateProfileSchema },
  {
    create: (data) => prisma.profile.create({ data }),
    findById: (id) => prisma.profile.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.profile.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.profile.update({ where: { id }, data }),
    delete: (id) => prisma.profile.delete({ where: { id } }),
  },
);
