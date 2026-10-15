import { prisma } from "@/lib/db";
import { ApiError, route } from "@/lib/api";

type Context = { params: Promise<{ missionId: string }> };
export async function GET(_request: Request, { params }: Context) {
  return route(async () => {
    const { missionId } = await params;
    const mission = await prisma.mission.findFirst({
      where: { id: missionId, status: "ACTIVE" },
      include: { game: true },
    });
    if (!mission) throw new ApiError(404, "Mission not found");
    return { mission };
  });
}
