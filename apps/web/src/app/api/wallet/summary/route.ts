import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const [earned, spent, totals] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: user.id, type: { in: ["EARN", "REFUND"] }, status: "COMPLETED" },
        _sum: { points: true },
      }),
      prisma.transaction.aggregate({
        where: { userId: user.id, type: "REDEEM", status: "COMPLETED" },
        _sum: { points: true },
      }),
      prisma.transaction.groupBy({
        by: ["type"], where: { userId: user.id, status: "COMPLETED" },
        _count: { _all: true },
      }),
    ]);
    return {
      balance: user.pointsBalance,
      totalEarned: earned._sum.points ?? 0,
      totalRedeemed: spent._sum.points ?? 0,
      transactionCounts: Object.fromEntries(totals.map((item) => [item.type, item._count._all])),
    };
  });
}
