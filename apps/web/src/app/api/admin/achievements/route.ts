import { adminCreate, adminList } from "@/lib/adminApi";
import { achievementModule } from "@/modules/achievementModule";

export async function GET(request: Request) {
  return adminList(request, achievementModule);
}
export async function POST(request: Request) {
  return adminCreate(request, achievementModule, "Achievement");
}
