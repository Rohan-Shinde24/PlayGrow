import { prisma } from "@/lib/db";
import { pageParams, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const { skip, take } = pageParams(request);
    const [data, total] = await Promise.all([
      prisma.category.findMany({ skip, take, orderBy: { name: "asc" }, include: { _count: { select: { games: { where: { isActive: true } } } } } }),
      prisma.category.count(),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
