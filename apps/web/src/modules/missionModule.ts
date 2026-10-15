import "server-only";

import { prisma } from "@/lib/db";
import { createCrudModule } from "@/modules/crudModule";
import { createMissionSchema, updateMissionSchema } from "@/validations/missionValidation";

export const missionModule = createCrudModule(
  { create: createMissionSchema, update: updateMissionSchema },
  {
    create: (data) => prisma.mission.create({ data }),
    findById: (id) => prisma.mission.findUnique({ where: { id } }),
    list: ({ skip, take }) =>
      prisma.mission.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    update: (id, data) => prisma.mission.update({ where: { id }, data }),
    delete: (id) => prisma.mission.delete({ where: { id } }),
  },
);
