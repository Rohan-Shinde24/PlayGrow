import { adminCreate, adminList } from "@/lib/adminApi";
import { rewardModule } from "@/modules/rewardModule";

export async function GET(request: Request) {
  return adminList(request, rewardModule);
}
export async function POST(request: Request) {
  return adminCreate(request, rewardModule, "Reward");
}
