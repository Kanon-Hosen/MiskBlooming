import { MetadataRoute } from "next";
import { prisma } from "../lib/db";

export const revalidate = 3600; // 1 hour

const safeDate = (date?: string | Date | null) => {
  if (!date) return new Date().toISOString();
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL =
    process.env.NEXT_PUBLIC_URL || "https://misk-blooming.vercel.app";

  const staticRoutes = [
    { url: "", priority: 1, changeFrequency: "daily" as const },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/cookies", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/delivery", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/track-order", priority: 0.6, changeFrequency: "yearly" as const },
    { url: "/products", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/occasions", priority: 0.9, changeFrequency: "daily" as const },
  ];

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "active" },
        select: { slug: true, updatedAt: true },
      }).catch((err) => {
        console.error("Failed to query products for sitemap", err);
        return [];
      }),
      prisma.category.findMany({
        select: { name: true, updatedAt: true },
      }).catch((err) => {
        console.error("Failed to query categories for sitemap", err);
        return [];
      }),
    ]);

    const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.url}`,
      lastModified: safeDate(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

    categories.forEach((c) => {
      if (!c?.name) return;
      routes.push({
        url: `${BASE_URL}/categories/${encodeURIComponent(c.name)}`,
        lastModified: safeDate(c.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    products.forEach((p) => {
      if (!p?.slug) return;
      routes.push({
        url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`,
        lastModified: safeDate(p.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    return routes;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return at least the static routes if dynamic fetching fails completely
    return staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.url}`,
      lastModified: safeDate(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
  }
}
