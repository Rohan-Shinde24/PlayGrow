import { adminCreate, adminList } from "@/lib/adminApi";
import { missionModule } from "@/modules/missionModule";

export async function GET(request: Request) {
  return adminList(request, missionModule);
}
export async function POST(request: Request) {
  return adminCreate(request, missionModule, "Mission");
}
