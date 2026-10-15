import Joi from "joi";
import { prisma } from "@/lib/db";
import { readJson, requireUser, route } from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({
  avatarUrl: Joi.string().uri().max(2048).allow(null),
  bio: Joi.string().max(2000).allow(null),
  country: Joi.string().trim().max(100).allow(null),
}).min(1).unknown(false);

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    return { profile };
  });
}

export async function PATCH(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    const data = await validateInput(schema, await readJson(request));
    return {
      profile: await prisma.profile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, ...data },
        update: data,
      }),
    };
  });
}
