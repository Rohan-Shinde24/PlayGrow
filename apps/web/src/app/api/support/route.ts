import Joi from "joi";
import { prisma } from "@/lib/db";
import { pageParams, readJson, requireUser, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({
  subject: Joi.string().trim().min(1).max(200).required(),
  message: Joi.string().trim().min(1).max(10_000).required(),
}).unknown(false);

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const { skip, take } = pageParams(request);
    const where = { userId: user.id };
    const [data, total] = await Promise.all([
      prisma.supportTicket.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
      prisma.supportTicket.count({ where }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}

export async function POST(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const input = await validateInput(schema, await readJson(request));
    const ticket = await prisma.supportTicket.create({ data: { ...input, userId: user.id } });
    return Response.json({ ticket }, { status: 201 });
  });
}
