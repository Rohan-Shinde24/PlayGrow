import { prisma } from "@/lib/db";
import { ApiError, requireUser, route } from "@/lib/api";

type Context = { params: Promise<{ missionId: string }> };
export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    const user = await requireUser(request);
    const { missionId } = await params;
    const progress = await prisma.userMissionProgress.findUnique({
      where: { userId_missionId: { userId: user.id, missionId } },
      include: { mission: { include: { game: true } } },
    });
    if (!progress) throw new ApiError(404, "Mission progress not found");
    return { progress };
  });
}
