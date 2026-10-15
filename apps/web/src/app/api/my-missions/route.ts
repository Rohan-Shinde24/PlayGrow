import { prisma } from "@/lib/db";
import { pageParams, requireUser, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const { skip, take } = pageParams(request);
    const [data, total] = await Promise.all([
      prisma.userMissionProgress.findMany({
        where: { userId: user.id }, skip, take, orderBy: { startedAt: "desc" },
        include: { mission: { include: { game: true } } },
      }),
      prisma.userMissionProgress.count({ where: { userId: user.id } }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
