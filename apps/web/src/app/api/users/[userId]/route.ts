import Joi from "joi";
import { prisma } from "@/lib/db";
import { ApiError, audit, publicUser, readJson, requireAdmin, requireUser, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

type Context = { params: Promise<{ userId: string }> };
const schema = Joi.object({
  name: Joi.string().trim().min(1).max(120),
  email: Joi.string().trim().email().max(254).lowercase(),
  role: Joi.string().valid("USER", "ADMIN"),
  status: Joi.string().valid("ACTIVE", "SUSPENDED", "DELETED"),
}).min(1).unknown(false);

export async function GET(request: Request, { params }: Context) {
  return route(async () => {
    const actor = await requireUser(request);
    const { userId } = await params;
    if (actor.id !== userId && actor.role !== "ADMIN") throw new ApiError(403, "Not authorized");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");
    return { user: await publicUser(user) };
  });
}

export async function PATCH(request: Request, { params }: Context) {
  return route(async () => {
    const actor = await requireUser(request);
    const { userId } = await params;
    if (actor.id !== userId && actor.role !== "ADMIN") throw new ApiError(403, "Not authorized");
    const input = await validateInput(schema, await readJson(request));
    if (actor.role !== "ADMIN" && ("role" in input || "status" in input)) {
      throw new ApiError(403, "Only administrators can change account access");
    }
    const user = await prisma.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { id: userId } });
      if (!existing) throw new ApiError(404, "User not found");
      const emailChanged = input.email && input.email !== existing.email;
      const user = await tx.user.update({
        where: { id: userId },
        data: { ...input, ...(emailChanged ? { emailVerified: null } : {}) },
      });
      if (emailChanged) {
        await tx.authToken.deleteMany({ where: { userId, type: "VERIFY_EMAIL" } });
      }
      return user;
    });
    if (input.status && input.status !== "ACTIVE") {
      await prisma.session.deleteMany({ where: { userId } });
    }
    if (actor.role === "ADMIN") await audit(actor.id, "UPDATE", "User", userId, input);
    return { user: await publicUser(user) };
  });
}

export async function DELETE(request: Request, { params }: Context) {
  return route(async () => {
    const admin = await requireAdmin(request);
    const { userId } = await params;
    const user = await prisma.user.update({ where: { id: userId }, data: { status: "DELETED" } });
    await prisma.session.deleteMany({ where: { userId } });
    await audit(admin.id, "DELETE", "User", userId);
    return { user: await publicUser(user), deleted: true };
  });
}
