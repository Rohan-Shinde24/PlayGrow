import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import { createGameSchema, updateGameSchema } from "@/validations/gameValidation";

export const gameModule = createCrudModule(
  { create: createGameSchema, update: updateGameSchema },
  {
    create: (data) => prisma.game.create({ data }),
    findById: (id) => prisma.game.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.game.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.game.update({ where: { id }, data }),
    delete: (id) => prisma.game.delete({ where: { id } }),
  },
);
