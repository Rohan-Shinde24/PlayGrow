import { prisma } from "@/lib/db";
import { pageParams, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const { skip, take } = pageParams(request);
    const [data, total] = await Promise.all([
      prisma.achievement.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
      prisma.achievement.count(),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
