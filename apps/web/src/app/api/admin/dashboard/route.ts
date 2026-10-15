import { prisma } from "@/lib/db";
import { requireAdmin, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    await requireAdmin(request);
    const [
      users, activeUsers, games, missions, rewards,
      pendingRedemptions, openTickets, pointsIssued,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.game.count({ where: { isActive: true } }),
      prisma.mission.count({ where: { status: "ACTIVE" } }),
      prisma.reward.count({ where: { status: "ACTIVE" } }),
      prisma.redemption.count({ where: { status: "PENDING" } }),
      prisma.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.transaction.aggregate({
        where: { type: "EARN", status: "COMPLETED" }, _sum: { points: true },
      }),
    ]);
    return {
      users, activeUsers, games, missions, rewards, pendingRedemptions, openTickets,
      pointsIssued: pointsIssued._sum.points ?? 0,
    };
  });
}
