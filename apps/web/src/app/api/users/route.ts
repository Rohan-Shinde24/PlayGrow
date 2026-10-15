import { prisma } from "@/lib/db";
import { pageParams, requireAdmin, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    await requireAdmin(request);
    const { skip, take } = pageParams(request);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip, take, orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, role: true, status: true,
          pointsBalance: true, emailVerified: true, createdAt: true, updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);
    return { data: users, pagination: { skip, take, total } };
  });
}
