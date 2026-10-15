import { prisma } from "@/lib/db";
import { pageParams, query, route } from "@/lib/api";

export async function GET(request: Request) {
  return route(async () => {
    const { skip, take } = pageParams(request);
    const search = query(request, "search")?.trim();
    const categoryId = query(request, "categoryId");
    const where = {
      isActive: true,
      ...(categoryId ? { categoryId } : {}),
      ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }, { description: { contains: search, mode: "insensitive" as const } }] } : {}),
    };
    const [data, total] = await Promise.all([
      prisma.game.findMany({
        where, skip, take, orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
        select: {
          id: true, title: true, slug: true, description: true, thumbnail: true,
          categoryId: true, isFeatured: true, createdAt: true, updatedAt: true,
          category: true,
        },
      }),
      prisma.game.count({ where }),
    ]);
    return { data, pagination: { skip, take, total } };
  });
}
