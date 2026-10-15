import Joi from "joi";
import { prisma } from "@/lib/db";
import { hashPassword, publicUser, readJson, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({
  name: Joi.string().trim().min(1).max(120).required(),
  email: Joi.string().trim().email().max(254).lowercase().required(),
  password: Joi.string().min(12).max(128).required(),
}).unknown(false);

export async function POST(request: Request) {
  return route(async () => {
    const input = await validateInput(schema, await readJson(request));
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash: await hashPassword(input.password) },
    });
    return Response.json({
      user: publicUser(user),
      emailVerification: { status: "pending_email_provider_configuration" },
    }, { status: 201 });
  });
}
