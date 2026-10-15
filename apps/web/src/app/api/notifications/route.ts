import { prisma } from "@/lib/db";
import { pageParams, requireUser, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const { skip, take } = pageParams(request);
    const where = { userId: user.id };
    const [data, total] = await Promise.all([
      prisma.notification.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
      prisma.notification.count({ where }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
