import { prisma } from "@/lib/db";
import { pageParams, requireUser, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const { skip, take } = pageParams(request);
    const where = { userId: user.id };
    const [data, total] = await Promise.all([
      prisma.userAchievement.findMany({
        where, skip, take, orderBy: { unlockedAt: "desc" },
        include: { achievement: true },
      }),
      prisma.userAchievement.count({ where }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
