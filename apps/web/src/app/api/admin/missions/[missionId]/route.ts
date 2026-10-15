import { adminDelete, adminGet, adminUpdate } from "@/lib/adminApi";
import { missionModule } from "@/modules/missionModule";

type Context = { params: Promise<{ missionId: string }> };
export async function GET(request: Request, { params }: Context) {
  return adminGet(request, missionModule, (await params).missionId);
}
export async function PATCH(request: Request, { params }: Context) {
  return adminUpdate(request, missionModule, (await params).missionId, "Mission");
}
export async function DELETE(request: Request, { params }: Context) {
  return adminDelete(request, missionModule, (await params).missionId, "Mission");
}
