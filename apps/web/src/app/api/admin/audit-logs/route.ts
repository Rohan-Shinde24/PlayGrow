import { prisma } from "@/lib/db";
import { pageParams, requireAdmin, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    await requireAdmin(request);
    const { skip, take } = pageParams(request);
    const [data, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        skip, take, orderBy: { createdAt: "desc" },
        include: { admin: { select: { id: true, name: true, email: true } } },
      }),
      prisma.adminAuditLog.count(),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
