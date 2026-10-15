import { requireUser, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const user = await requireUser(request);
    return { balance: user.pointsBalance };
  });
}
