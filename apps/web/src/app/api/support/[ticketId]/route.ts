import { prisma } from "@/lib/db";
import { ApiError, requireUser, route } from "@/lib/api";

type Context = { params: Promise<{ ticketId: string }> };
export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    const user = await requireUser(request);
    const { ticketId } = await params;
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: ticketId, ...(user.role === "ADMIN" ? {} : { userId: user.id }) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!ticket) throw new ApiError(404, "Support ticket not found");
    return { ticket };
  });
}
