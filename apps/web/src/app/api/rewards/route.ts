import { prisma } from "@/lib/db";
import { pageParams, query, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const { skip, take } = pageParams(request);
    const search = query(request, "search")?.trim();
    const where = {
      status: "ACTIVE" as const,
      OR: [{ stock: null }, { stock: { gt: 0 } }],
      ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
    };
    const [data, total] = await Promise.all([
      prisma.reward.findMany({ where, skip, take, orderBy: { pointsCost: "asc" } }),
      prisma.reward.count({ where }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
