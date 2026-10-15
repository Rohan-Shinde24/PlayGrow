import Joi from "joi";
import { prisma } from "@/lib/db";
import { ApiError, pageParams, readJson, requireUser, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({ rewardId: Joi.string().trim().min(1).max(128).required() }).unknown(false);

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const { skip, take } = pageParams(request);
    const [data, total] = await Promise.all([
      prisma.redemption.findMany({
        where: { userId: user.id }, skip, take, orderBy: { createdAt: "desc" },
        include: { reward: true },
      }),
      prisma.redemption.count({ where: { userId: user.id } }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}

export async function POST(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const { rewardId } = await validateInput(schema, await readJson(request));
    const redemption = await prisma.$transaction(async (tx) => {
      const reward = await tx.reward.findUnique({ where: { id: rewardId } });
      if (!reward || reward.status !== "ACTIVE") throw new ApiError(404, "Reward is unavailable");
      if (reward.stock !== null && reward.stock < 1) throw new ApiError(409, "Reward is out of stock");
      const charged = await tx.user.updateMany({
        where: { id: user.id, pointsBalance: { gte: reward.pointsCost }, status: "ACTIVE" },
        data: { pointsBalance: { decrement: reward.pointsCost } },
      });
      if (charged.count !== 1) throw new ApiError(409, "Insufficient points or inactive account");
      if (reward.stock !== null) {
        const reserved = await tx.reward.updateMany({
          where: { id: reward.id, status: "ACTIVE", stock: { gt: 0 } },
          data: {
            stock: { decrement: 1 },
            ...(reward.stock === 1 ? { status: "OUT_OF_STOCK" as const } : {}),
          },
        });
        if (reserved.count !== 1) throw new ApiError(409, "Reward is out of stock");
      }
      const account = await tx.user.findUniqueOrThrow({
        where: { id: user.id }, select: { pointsBalance: true },
      });
      const item = await tx.redemption.create({
        data: { userId: user.id, rewardId: reward.id, pointsSpent: reward.pointsCost },
      });
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "REDEEM",
          points: reward.pointsCost,
          balanceAfter: account.pointsBalance,
          description: `Reward redemption: ${reward.title}`,
          reference: `redemption:${item.id}`,
        },
      });
      return item;
    }, { isolationLevel: "Serializable" });
    return Response.json({ redemption }, { status: 201 });
  });
}
