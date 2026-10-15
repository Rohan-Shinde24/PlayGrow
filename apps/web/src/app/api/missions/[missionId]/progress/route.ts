import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/api";

type Context = { params: Promise<{ missionId: string }> };
export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    const user = await requireUser(request);
    const { missionId } = await params;
    const progress = await prisma.userMissionProgress.findUnique({
      where: { userId_missionId: { userId: user.id, missionId } },
      include: { mission: true },
    });
    return { progress };
  });
}
