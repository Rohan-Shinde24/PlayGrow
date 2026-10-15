import { prisma } from "@/lib/db";
import { pageParams, query, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const { skip, take } = pageParams(request);
    const period = query(request, "period");
    let createdAt;
    if (period) {
      const duration = period === "week" ? 7 : period === "month" ? 30 : null;
      if (!duration) return Response.json({ error: "period must be week or month" }, { status: 400 });
      createdAt = { gte: new Date(Date.now() - duration * 24 * 60 * 60 * 1000) };
    }
    const activity = createdAt
      ? await prisma.transaction.groupBy({
          by: ["userId"],
          where: { status: "COMPLETED", type: { in: ["EARN", "REFUND"] }, createdAt },
          _sum: { points: true },
          orderBy: { _sum: { points: "desc" } },
          skip,
          take,
        })
      : null;
    const ranked = activity
      ? await Promise.all(activity.map(async (entry, index) => {
          const user = await prisma.user.findFirst({
            where: { id: entry.userId, status: "ACTIVE" },
            select: { id: true, name: true },
          });
          return user ? { ...user, points: entry._sum.points ?? 0, rank: skip + index + 1 } : null;
        }))
      : await prisma.user.findMany({
          where: { status: "ACTIVE" }, skip, take,
          orderBy: [{ pointsBalance: "desc" }, { createdAt: "asc" }],
          select: { id: true, name: true, pointsBalance: true },
        }).then((users) => users.map((user, index) => ({
          id: user.id, name: user.name, points: user.pointsBalance, rank: skip + index + 1,
        })));
    return { data: ranked.filter((entry) => entry !== null), pagination: { skip, take } };
  });
}
