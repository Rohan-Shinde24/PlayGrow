import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createAdminAuditLogSchema,
  updateAdminAuditLogSchema,
} from "@/validations/adminAuditLogValidation";

export const adminAuditLogModule = createCrudModule(
  { create: createAdminAuditLogSchema, update: updateAdminAuditLogSchema },
  {
    create: (data) => prisma.adminAuditLog.create({ data }),
    findById: (id) => prisma.adminAuditLog.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.adminAuditLog.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.adminAuditLog.update({ where: { id }, data }),
    delete: (id) => prisma.adminAuditLog.delete({ where: { id } }),
  },
);
