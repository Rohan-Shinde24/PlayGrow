import { prisma } from "@/lib/db";
import { ApiError, route } from "@/lib/api";

type Context = { params: Promise<{ rewardId: string }> };
export async function GET(_request: Request, { params }: Context) {
  return route(async () => {
    const { rewardId } = await params;
    const reward = await prisma.reward.findFirst({
      where: { id: rewardId, status: "ACTIVE", OR: [{ stock: null }, { stock: { gt: 0 } }] },
    });
    if (!reward) throw new ApiError(404, "Reward not found");
    return { reward };
  });
}
