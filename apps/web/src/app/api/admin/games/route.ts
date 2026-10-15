import { adminCreate, adminList } from "@/lib/adminApi";
import { gameModule } from "@/modules/gameModule";

export async function GET(request: Request) {
  return adminList(request, gameModule);
}

export async function POST(request: Request) {
  return adminCreate(request, gameModule, "Game");
}
