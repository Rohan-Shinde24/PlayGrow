import Joi from "joi";
import { prisma } from "@/lib/db";
import { ApiError, hashPassword, hashToken, readJson, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({
  token: Joi.string().min(32).max(256).required(),
  password: Joi.string().min(12).max(128).required(),
}).unknown(false);

export async function POST(request: Request) {
  return route(async () => {
    const input = await validateInput(schema, await readJson(request));
    const authToken = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(input.token) } });
    if (!authToken || authToken.type !== "RESET_PASSWORD" || authToken.expiresAt <= new Date()) {
      throw new ApiError(400, "Reset token is invalid or expired");
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: authToken.userId },
        data: { passwordHash: await hashPassword(input.password) },
      }),
      prisma.authToken.deleteMany({ where: { userId: authToken.userId, type: "RESET_PASSWORD" } }),
      prisma.session.deleteMany({ where: { userId: authToken.userId } }),
    ]);
    return { success: true };
  });
}
