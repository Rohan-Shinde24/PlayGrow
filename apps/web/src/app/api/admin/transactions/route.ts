import { prisma } from "@/lib/db";
import { pageParams, requireAdmin, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    await requireAdmin(request);
    const { skip, take } = pageParams(request);
    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        skip, take, orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.transaction.count(),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
