import { prisma } from "@/lib/db";
import { pageParams, query, requireAdmin, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    await requireAdmin(request);
    const { skip, take } = pageParams(request);
    const search = query(request, "search")?.trim();
    const where = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { email: { contains: search, mode: "insensitive" as const } }] }
      : {};
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take, orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, role: true, status: true,
          pointsBalance: true, emailVerified: true, createdAt: true, updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
