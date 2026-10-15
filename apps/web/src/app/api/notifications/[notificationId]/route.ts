import { prisma } from "@/lib/db";
import { ApiError, requireUser, route } from "@/lib/api";

type Context = { params: Promise<{ notificationId: string }> };
export async function PATCH(request: Request, { params }: Context) {
  return route(async () => {
    const user = await requireUser(request);
    const { notificationId } = await params;
    const result = await prisma.notification.updateMany({
      where: { id: notificationId, userId: user.id },
      data: { isRead: true },
    });
    if (!result.count) throw new ApiError(404, "Notification not found");
    return { success: true };
  });
}

export async function DELETE(request: Request, { params }: Context) {
  return route(async () => {
    const user = await requireUser(request);
    const { notificationId } = await params;
    const result = await prisma.notification.deleteMany({ where: { id: notificationId, userId: user.id } });
    if (!result.count) throw new ApiError(404, "Notification not found");
    return { success: true };
  });
}
