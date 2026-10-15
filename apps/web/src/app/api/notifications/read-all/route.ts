import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/api";

export async function PATCH(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const result = await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
    return { updated: result.count };
  });
}
