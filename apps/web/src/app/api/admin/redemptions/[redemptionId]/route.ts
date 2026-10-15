import Joi from "joi";
import { prisma } from "@/lib/db";
import { ApiError, audit, readJson, requireAdmin, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

type Context = { params: Promise<{ redemptionId: string }> };
const schema = Joi.object({ status: Joi.string().valid("APPROVED", "REJECTED", "FULFILLED").required() }).unknown(false);

export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    await requireAdmin(request);
    const { redemptionId } = await params;
    const redemption = await prisma.redemption.findUnique({
      where: { id: redemptionId },
      include: { reward: true, user: { select: { id: true, name: true, email: true } } },
    });
    if (!redemption) throw new ApiError(404, "Redemption not found");
    return { redemption };
  });
}

export async function PATCH(request: Request, { params }: Context) {
  return route(async () => {
    const admin = await requireAdmin(request);
    const { redemptionId } = await params;
    const { status } = await validateInput(schema, await readJson(request));
    const redemption = await prisma.$transaction(async (tx) => {
      const current = await tx.redemption.findUnique({ where: { id: redemptionId } });
      if (!current) throw new ApiError(404, "Redemption not found");
      const allowed =
        (current.status === "PENDING" && (status === "APPROVED" || status === "REJECTED")) ||
        (current.status === "APPROVED" && (status === "FULFILLED" || status === "REJECTED"));
      if (!allowed) throw new ApiError(409, "Invalid redemption status transition");
      const updated = await tx.redemption.update({
        where: { id: redemptionId }, data: { status }, include: { reward: true },
      });
      if (status === "REJECTED") {
        const user = await tx.user.update({
          where: { id: current.userId },
          data: { pointsBalance: { increment: current.pointsSpent } },
          select: { pointsBalance: true },
        });
        await tx.transaction.create({
          data: {
            userId: current.userId, type: "REFUND", points: current.pointsSpent,
            balanceAfter: user.pointsBalance,
            description: `Refund for rejected redemption: ${updated.reward.title}`,
            reference: `redemption-refund:${current.id}`,
          },
        });
        if (updated.reward.status === "OUT_OF_STOCK") {
          await tx.reward.update({
            where: { id: updated.rewardId },
            data: { status: "ACTIVE", stock: updated.reward.stock === null ? null : { increment: 1 } },
          });
        } else if (updated.reward.stock !== null) {
          await tx.reward.update({ where: { id: updated.rewardId }, data: { stock: { increment: 1 } } });
        }
      }
      return updated;
    }, { isolationLevel: "Serializable" });
    await audit(admin.id, "UPDATE", "Redemption", redemptionId, { status });
    return { redemption };
  });
}
