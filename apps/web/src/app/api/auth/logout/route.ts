import { prisma } from "@/lib/db";
import { clearSessionCookie, hashToken, route } from "@/lib/api";

export async function POST(request: Request) {
  return route(async () => {
    const token = request.headers.get("cookie")
      ?.split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith("playgrow_session="))
      ?.slice("playgrow_session=".length);
    if (token) {
      await prisma.session.deleteMany({ where: { tokenHash: hashToken(decodeURIComponent(token)) } });
    }
    return Response.json({ success: true }, { headers: { "Set-Cookie": clearSessionCookie() } });
  });
}
