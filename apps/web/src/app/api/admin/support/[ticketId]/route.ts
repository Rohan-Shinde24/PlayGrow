import Joi from "joi";
import { prisma } from "@/lib/db";
import { ApiError, audit, readJson, requireAdmin, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

type Context = { params: Promise<{ ticketId: string }> };
const schema = Joi.object({
  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
}).min(1).unknown(false);

export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    await requireAdmin(request);
    const { ticketId } = await params;
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!ticket) throw new ApiError(404, "Support ticket not found");
    return { ticket };
  });
}

export async function PATCH(request: Request, { params }: Context) {
  return route(async () => {
    const admin = await requireAdmin(request);
    const { ticketId } = await params;
    const input = await validateInput(schema, await readJson(request));
    const ticket = await prisma.supportTicket.update({ where: { id: ticketId }, data: input });
    await audit(admin.id, "UPDATE", "SupportTicket", ticketId, input);
    return { ticket };
  });
}
