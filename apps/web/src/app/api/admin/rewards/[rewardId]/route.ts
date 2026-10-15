import { adminDelete, adminGet, adminUpdate } from "@/lib/adminApi";
import { rewardModule } from "@/modules/rewardModule";

type Context = { params: Promise<{ rewardId: string }> };
export async function GET(request: Request, { params }: Context) {
  return adminGet(request, rewardModule, (await params).rewardId);
}
export async function PATCH(request: Request, { params }: Context) {
  return adminUpdate(request, rewardModule, (await params).rewardId, "Reward");
}
export async function DELETE(request: Request, { params }: Context) {
  return adminDelete(request, rewardModule, (await params).rewardId, "Reward");
}
