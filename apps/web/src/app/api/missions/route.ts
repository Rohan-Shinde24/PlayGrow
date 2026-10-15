import { prisma } from "@/lib/db";
import { pageParams, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const { skip, take } = pageParams(request);
    const now = new Date();
    const where = {
      status: "ACTIVE" as const,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    };
    const [data, total] = await Promise.all([
      prisma.mission.findMany({ where, skip, take, orderBy: { createdAt: "desc" }, include: { game: true } }),
      prisma.mission.count({ where }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
