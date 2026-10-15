import { prisma } from "@/lib/db";
import { currentUser, createOpaqueToken, hashToken, route, sessionCookie } from "@/lib/api";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  return route(async () => {
    const auth = await currentUser(request);
    if (!auth) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }
    const token = createOpaqueToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await prisma.session.update({
      where: { id: auth.session.id },
      data: { tokenHash: hashToken(token), expiresAt },
    });
    return Response.json({ success: true }, {
      headers: { "Set-Cookie": sessionCookie(token, expiresAt) },
    });
  });
}
