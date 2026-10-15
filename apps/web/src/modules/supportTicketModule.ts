import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import {
  createSupportTicketSchema,
  updateSupportTicketSchema,
} from "@/validations/supportTicketValidation";

export const supportTicketModule = createCrudModule(
  { create: createSupportTicketSchema, update: updateSupportTicketSchema },
  {
    create: (data) => prisma.supportTicket.create({ data }),
    findById: (id) => prisma.supportTicket.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.supportTicket.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.supportTicket.update({ where: { id }, data }),
    delete: (id) => prisma.supportTicket.delete({ where: { id } }),
  },
);
