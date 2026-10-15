import { prisma } from "@/lib/db";
import { ApiError, requireUser, route } from "@/lib/api";

type Context = { params: Promise<{ redemptionId: string }> };
export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    const user = await requireUser(request);
    const { redemptionId } = await params;
    const redemption = await prisma.redemption.findFirst({
      where: { id: redemptionId, userId: user.id },
      include: { reward: true },
    });
    if (!redemption) throw new ApiError(404, "Redemption not found");
    return { redemption };
  });
}
