import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "@/validations/notificationValidation";

export const notificationModule = createCrudModule(
  { create: createNotificationSchema, update: updateNotificationSchema },
  {
    create: (data) => prisma.notification.create({ data }),
    findById: (id) => prisma.notification.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.notification.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.notification.update({ where: { id }, data }),
    delete: (id) => prisma.notification.delete({ where: { id } }),
  },
);
