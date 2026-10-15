import { adminCreate, adminList } from "@/lib/adminApi";
import { categoryModule } from "@/modules/categoryModule";

export async function GET(request: Request) {
  return adminList(request, categoryModule);
}
export async function POST(request: Request) {
  return adminCreate(request, categoryModule, "Category");
}
