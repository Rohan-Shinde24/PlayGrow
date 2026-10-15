import { prisma } from "@/lib/db";
import { ApiError, requireUser, route } from "@/lib/api";

type Context = { params: Promise<{ gameId: string }> };
export async function POST(request: Request, { params }: Context) {
  return route(async () => {
    await requireUser(request);
    const { gameId } = await params;
    const game = await prisma.game.findFirst({ where: { id: gameId, isActive: true } });
    if (!game) throw new ApiError(404, "Game not found");
    if (!game.launchUrl) throw new ApiError(409, "Game launch is not configured");
    return { launchUrl: game.launchUrl };
  });
}
