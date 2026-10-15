import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    return { count: await prisma.notification.count({ where: { userId: user.id, isRead: false } }) };
  });
}
