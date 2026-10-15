import "server-only";

import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import type { Prisma, User } from "@prisma/client";
import Joi from "joi";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "playgrow_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const scryptAsync = promisify(scrypt);
const SAFE_USER = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  pointsBalance: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, { status, headers });
}

export async function route<T>(handler: () => Promise<T>) {
  try {
    const result = await handler();
    return result instanceof Response ? result : json(result);
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError) return json({ error: error.message }, error.status);
    if (error instanceof Joi.ValidationError) {
      return json(
        { error: "Invalid request", details: error.details.map((item) => item.message) },
        400,
      );
    }
    if (error && typeof error === "object" && "code" in error) {
      const code = error.code;
      if (code === "P2025") return json({ error: "Resource not found" }, 404);
      if (code === "P2002") return json({ error: "Resource already exists" }, 409);
      if (code === "P2003" || code === "P2034") {
        return json({ error: "The operation conflicted with the current resource state" }, 409);
      }
    }
    console.error("API route failed", error);
    return json({ error: "Internal server error" }, 500);
  }
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }
}

export function pagination(request: Request) {
  const url = new URL(request.url);
  const skip = Number(url.searchParams.get("skip") ?? "0");
  const take = Number(url.searchParams.get("take") ?? "20");
  if (!Number.isInteger(skip) || skip < 0 || skip > 100_000) {
    throw new ApiError(400, "skip must be an integer between 0 and 100000");
  }
  if (!Number.isInteger(take) || take < 1 || take > 100) {
    throw new ApiError(400, "take must be an integer between 1 and 100");
  }
  return { skip, take };
}

export function query(request: Request, key: string) {
  return new URL(request.url).searchParams.get(key);
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;
  const entry = cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createOpaqueToken() {
  return randomBytes(32).toString("base64url");
}

export async function issueAuthToken(userId: string, type: "VERIFY_EMAIL" | "RESET_PASSWORD") {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + (type === "VERIFY_EMAIL" ? 24 : 1) * 60 * 60 * 1000);
  await prisma.$transaction([
    prisma.authToken.deleteMany({ where: { userId, type } }),
    prisma.authToken.create({
      data: { userId, type, tokenHash: hashToken(token), expiresAt },
    }),
  ]);
  return { token, expiresAt };
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64) as Buffer;
  return `scrypt$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, saltValue, hashValue] = encoded.split("$");
  if (algorithm !== "scrypt" || !saltValue || !hashValue) return false;
  try {
    const salt = Buffer.from(saltValue, "base64url");
    const expected = Buffer.from(hashValue, "base64url");
    const actual = await scryptAsync(password, salt, expected.length) as Buffer;
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function currentUser(request: Request) {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  return { session, user: session.user };
}

export async function requireUser(request: Request) {
  const auth = await currentUser(request);
  if (!auth) throw new ApiError(401, "Authentication required");
  return auth.user;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (user.role !== "ADMIN") throw new ApiError(403, "Administrator access required");
  return user;
}

export async function createSession(userId: string) {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });
  return { token, expiresAt };
}

export function sessionCookie(token: string, expiresAt: Date) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function publicUser(user: User) {
  return Object.fromEntries(Object.keys(SAFE_USER).map((key) => [key, user[key as keyof User]]));
}

export async function audit(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Prisma.InputJsonObject,
) {
  await prisma.adminAuditLog.create({
    data: { adminId, action, entityType, entityId, details },
  });
}

export function pageParams(request: Request) {
  const { skip, take } = pagination(request);
  return { skip, take };
}

export async function requireEmailDelivery() {
  throw new ApiError(503, "Email delivery is not configured");
}
