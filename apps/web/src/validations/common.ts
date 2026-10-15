import Joi from "joi";

export const idSchema = Joi.string().trim().min(1).max(128).required();

export const paginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).max(100_000).default(0),
  take: Joi.number().integer().min(1).max(100).default(20),
})
  .unknown(false)
  .default({});

export async function validateInput<T>(schema: Joi.Schema<T>, input: unknown): Promise<T> {
  return schema.validateAsync(input, {
    abortEarly: false,
    convert: true,
  });
}

export async function validateId(input: unknown): Promise<string> {
  return validateInput(idSchema, input);
}

export async function validatePagination(
  input: unknown = {},
): Promise<{ skip: number; take: number }> {
  return validateInput(paginationSchema, input);
}
