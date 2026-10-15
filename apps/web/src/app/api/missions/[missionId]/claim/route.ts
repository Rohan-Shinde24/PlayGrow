import { prisma } from "@/lib/db";
import { ApiError, requireUser, route } from "@/lib/api";

type Context = { params: Promise<{ missionId: string }> };
export async function POST(request: Request, { params }: Context) {
  return route(async () => {
    const user = await requireUser(request);
    const { missionId } = await params;
    const result = await prisma.$transaction(async (tx) => {
      const progress = await tx.userMissionProgress.findUnique({
        where: { userId_missionId: { userId: user.id, missionId } },
        include: { mission: true },
      });
      if (!progress || progress.status !== "COMPLETED") throw new ApiError(409, "Mission is not claimable");
      const now = new Date();
      const updated = await tx.userMissionProgress.updateMany({
        where: { id: progress.id, status: "COMPLETED" },
        data: { status: "CLAIMED", claimedAt: now },
      });
      if (updated.count !== 1) throw new ApiError(409, "Mission was already claimed");
      const balance = await tx.user.update({
        where: { id: user.id },
        data: { pointsBalance: { increment: progress.mission.points } },
        select: { pointsBalance: true },
      });
      await tx.transaction.create({
        data: {
          userId: user.id, type: "EARN", points: progress.mission.points,
          balanceAfter: balance.pointsBalance, description: `Mission reward: ${progress.mission.title}`,
          reference: `mission:${progress.id}`,
        },
      });
      return { points: progress.mission.points, balance: balance.pointsBalance };
    });
    return { success: true, ...result };
  });
}
