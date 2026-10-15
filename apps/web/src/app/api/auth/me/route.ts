import { publicUser, requireUser, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => ({ user: await publicUser(await requireUser(request)) }));
}
