import { prisma } from "@/lib/db";
import { ApiError, route } from "@/lib/api";

type Context = { params: Promise<{ gameId: string }> };
export async function GET(_request: Request, { params }: Context) {
  return route(async () => {
    const { gameId } = await params;
    const game = await prisma.game.findFirst({
      where: { id: gameId, isActive: true },
      select: {
        id: true, title: true, slug: true, description: true, thumbnail: true,
        categoryId: true, isFeatured: true, createdAt: true, updatedAt: true,
        category: true, missions: { where: { status: "ACTIVE" } },
      },
    });
    if (!game) throw new ApiError(404, "Game not found");
    return { game };
  });
}
