import type Joi from "joi";
import { validateId, validateInput, validatePagination } from "@/validations/common";

type Pagination = { skip: number; take: number };

type CrudOperations<CreateInput, UpdateInput, Model> = {
  create(data: CreateInput): Promise<Model>;
  findById(id: string): Promise<Model | null>;
  list(pagination: Pagination): Promise<Model[]>;
  update(id: string, data: UpdateInput): Promise<Model>;
  delete(id: string): Promise<Model>;
};

export function createCrudModule<CreateInput, UpdateInput, Model>(
  schemas: {
    create: Joi.Schema<CreateInput>;
    update: Joi.Schema<UpdateInput>;
  },
  operations: CrudOperations<CreateInput, UpdateInput, Model>,
) {
  return {
    create: async (input: unknown) =>
      operations.create(await validateInput(schemas.create, input)),
    findById: async (id: unknown) => operations.findById(await validateId(id)),
    list: async (input?: unknown) => operations.list(await validatePagination(input)),
    update: async (id: unknown, input: unknown) =>
      operations.update(
        await validateId(id),
        await validateInput(schemas.update, input),
      ),
    delete: async (id: unknown) => operations.delete(await validateId(id)),
  };
}
