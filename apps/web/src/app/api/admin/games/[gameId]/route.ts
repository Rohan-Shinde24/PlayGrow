import { adminDelete, adminGet, adminUpdate } from "@/lib/adminApi";
import { gameModule } from "@/modules/gameModule";

type Context = { params: Promise<{ gameId: string }> };
export async function GET(request: Request, { params }: Context) {
  return adminGet(request, gameModule, (await params).gameId);
}
export async function PATCH(request: Request, { params }: Context) {
  return adminUpdate(request, gameModule, (await params).gameId, "Game");
}
export async function DELETE(request: Request, { params }: Context) {
  return adminDelete(request, gameModule, (await params).gameId, "Game");
}
