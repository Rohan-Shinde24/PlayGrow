import Joi from "joi";
import { prisma } from "@/lib/db";
import {
  ApiError,
  createSession,
  publicUser,
  readJson,
  route,
  sessionCookie,
  verifyPassword,
} from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({
  email: Joi.string().trim().email().max(254).lowercase().required(),
  password: Joi.string().min(1).max(128).required(),
}).unknown(false);

export async function POST(request: Request) {
  return route(async () => {
    const input = await validateInput(schema, await readJson(request));
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new ApiError(401, "Invalid email or password");
    }
    if (user.status !== "ACTIVE") throw new ApiError(403, "This account is not active");
    const session = await createSession(user.id);
    return Response.json({ user: await publicUser(user) }, {
      headers: { "Set-Cookie": sessionCookie(session.token, session.expiresAt) },
    });
  });
}
