import Joi from "joi";
import { prisma } from "@/lib/db";
import { audit, publicUser, readJson, requireAdmin, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

type Context = { params: Promise<{ userId: string }> };
const schema = Joi.object({
  role: Joi.string().valid("USER", "ADMIN"),
  status: Joi.string().valid("ACTIVE", "SUSPENDED", "DELETED"),
}).min(1).unknown(false);

export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    await requireAdmin(request);
    const { userId } = await params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? { user: await publicUser(user) } : Response.json({ error: "User not found" }, { status: 404 });
  });
}

export async function PATCH(request: Request, { params }: Context) {
  return route(async () => {
    const admin = await requireAdmin(request);
    const { userId } = await params;
    const input = await validateInput(schema, await readJson(request));
    const user = await prisma.user.update({ where: { id: userId }, data: input });
    if (input.status && input.status !== "ACTIVE") {
      await prisma.session.deleteMany({ where: { userId } });
    }
    await audit(admin.id, "UPDATE", "User", userId, input);
    return { user: await publicUser(user) };
  });
}
