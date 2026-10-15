import { adminDelete, adminGet, adminUpdate } from "@/lib/adminApi";
import { achievementModule } from "@/modules/achievementModule";

type Context = { params: Promise<{ achievementId: string }> };
export async function GET(request: Request, { params }: Context) {
  return adminGet(request, achievementModule, (await params).achievementId);
}
export async function PATCH(request: Request, { params }: Context) {
  return adminUpdate(request, achievementModule, (await params).achievementId, "Achievement");
}
export async function DELETE(request: Request, { params }: Context) {
  return adminDelete(request, achievementModule, (await params).achievementId, "Achievement");
}
