import Joi from "joi";
import { readJson, route, requireEmailDelivery } from "@/lib/api";
import { validateInput } from "@/validations/common";

const schema = Joi.object({
  email: Joi.string().trim().email().max(254).lowercase().required(),
}).unknown(false);

export async function POST(request: Request) {
  return route(async () => {
    await validateInput(schema, await readJson(request));
    return requireEmailDelivery();
  });
}
