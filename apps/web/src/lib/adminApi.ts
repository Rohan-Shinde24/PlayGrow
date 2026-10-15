import "server-only";

import { audit, pageParams, readJson, requireAdmin, route, ApiError } from "@/lib/api";

type CrudModuleLike = {
  create(input: unknown): Promise<unknown>;
  findById(id: unknown): Promise<unknown>;
  list(input?: unknown): Promise<unknown[]>;
  update(id: unknown, input: unknown): Promise<unknown>;
  delete(id: unknown): Promise<unknown>;
};

function entityId(value: unknown) {
  return value && typeof value === "object" && "id" in value && typeof value.id === "string"
    ? value.id
    : undefined;
}

export function adminList(request: Request, resource: CrudModuleLike) {
  return route(async () => {
    await requireAdmin(request);
    const pagination = pageParams(request);
    return { data: await resource.list(pagination), pagination };
  });
}

export function adminCreate(request: Request, resource: CrudModuleLike, entityType: string) {
  return route(async () => {
    const admin = await requireAdmin(request);
    const result = await resource.create(await readJson(request));
    await audit(admin.id, "CREATE", entityType, entityId(result));
    return Response.json({ data: result }, { status: 201 });
  });
}

export function adminGet(request: Request, resource: CrudModuleLike, id: string) {
  return route(async () => {
    await requireAdmin(request);
    const data = await resource.findById(id);
    if (!data) throw new ApiError(404, "Resource not found");
    return { data };
  });
}

export function adminUpdate(
  request: Request,
  resource: CrudModuleLike,
  id: string,
  entityType: string,
) {
  return route(async () => {
    const admin = await requireAdmin(request);
    const data = await resource.update(id, await readJson(request));
    await audit(admin.id, "UPDATE", entityType, id);
    return { data };
  });
}

export function adminDelete(
  request: Request,
  resource: CrudModuleLike,
  id: string,
  entityType: string,
) {
  return route(async () => {
    const admin = await requireAdmin(request);
    const data = await resource.delete(id);
    await audit(admin.id, "DELETE", entityType, id);
    return { data };
  });
}
