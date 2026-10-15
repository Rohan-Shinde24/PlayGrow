import Joi from "joi";
import { prisma } from "@/lib/db";
import { ApiError, hashToken, readJson, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({ token: Joi.string().min(32).max(256).required() }).unknown(false);

export async function POST(request: Request) {
  return route(async () => {
    const { token } = await validateInput(schema, await readJson(request));
    const authToken = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!authToken || authToken.type !== "VERIFY_EMAIL" || authToken.expiresAt <= new Date()) {
      throw new ApiError(400, "Verification token is invalid or expired");
    }
    await prisma.$transaction([
      prisma.user.update({ where: { id: authToken.userId }, data: { emailVerified: new Date() } }),
      prisma.authToken.deleteMany({ where: { userId: authToken.userId, type: "VERIFY_EMAIL" } }),
    ]);
    return { success: true };
  });
}
