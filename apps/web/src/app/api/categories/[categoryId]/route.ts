import { prisma } from "@/lib/db";
import { ApiError, route } from "@/lib/api";

type Context = { params: Promise<{ categoryId: string }> };
export async function GET(_request: Request, { params }: Context) {
  return route(async () => {
    const { categoryId } = await params;
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { games: { where: { isActive: true }, orderBy: { title: "asc" } } },
    });
    if (!category) throw new ApiError(404, "Category not found");
    return { category };
  });
}
