import { adminDelete, adminGet, adminUpdate } from "@/lib/adminApi";
import { categoryModule } from "@/modules/categoryModule";

type Context = { params: Promise<{ categoryId: string }> };
export async function GET(request: Request, { params }: Context) {
  return adminGet(request, categoryModule, (await params).categoryId);
}
export async function PATCH(request: Request, { params }: Context) {
  return adminUpdate(request, categoryModule, (await params).categoryId, "Category");
}
export async function DELETE(request: Request, { params }: Context) {
  return adminDelete(request, categoryModule, (await params).categoryId, "Category");
}
