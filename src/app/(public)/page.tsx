import { Suspense } from "react";
import { prisma } from "@/src/lib/db";
import { HomePageContent } from "@prisma/client";
import { LazyWrapper } from "../../components/ui/LazyWrapper";
import HeroSlider from "../../components/home/HeroSlider";
import PromotionBanner from "../../components/home/PromotionBanner";
import ShopByCategory from "../../components/home/ShopByCategory";
import { Metadata } from "next";

import InSeason from "../../components/home/InSeason";
import TestimonialSection from "../../components/home/TestimonialSection";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Newsletter from "@/src/components/home/Newsletter";

export const dynamic = "force-dynamic";

// --- Loader ---
const SectionLoader = ({ height = "h-96" }: { height?: string }) => (
  <div
    className={`w-full ${height} bg-cream-50/50 animate-pulse rounded-lg my-8`}
  />
);


export default async function HomePage() {
  // --- Data Fetching ---
  const [
    homePageContent,
    featuredProductsRaw,
    systemSettings,
    promotionsRaw,
    categoriesRaw,
    seasonalProductsRaw
  ] = await Promise.all([
    prisma.homePageContent.findFirst({
      where: { id: "HOME_PAGE" },
    }),
    prisma.product.findMany({
      where: {
        featured: true,
        status: "active",
      },
      take: 10,
      include: {
        images: true,
        Review: {
          select: {
            rating: true,
            id: true,
            comment: true,
            createdAt: true,
            user: true,
          },
        },
      },
    }),
    prisma.themeSetting.findFirst(),
    prisma.promotion.findMany({
      where: { status: "ACTIVE", isActive: true }
    }),
    prisma.category.findMany(),
    prisma.product.findMany({
      where: {
        category: "Seasonal",
        status: "active",
      },
      take: 8,
      include: {
        images: true,
      },
    })
  ]);

  // Fallbacks if data is missing
  const content = homePageContent || {} as HomePageContent;
  const layout = systemSettings?.layoutStyle || "full";

  // Transform data to be plain objects (serializing dates)
  const featuredProducts = JSON.parse(JSON.stringify(featuredProductsRaw));
  const promotions = JSON.parse(JSON.stringify(promotionsRaw));
  const categories = JSON.parse(JSON.stringify(categoriesRaw));
  const seasonalProducts = JSON.parse(JSON.stringify(seasonalProductsRaw));

  return (
    <div className="overflow-hidden bg-background">
      {/* Critical Path */}
      <HeroSlider
        slides={(content.heroSlides as any) ?? []}
        layout={layout}
      />

      <ShopByCategory
        caTitle={content.categoryTitle}
        caDesc={content.categoryDesc}
        categories={categories}
      />

      <PromotionBanner promotions={promotions} />

      {/* Deferred Sections */}
      <LazyWrapper>
        <Suspense fallback={<SectionLoader height="h-[800px]" />}>
          <FeaturedProducts
            faTitle={content.featureTitle}
            faSubtitle={content.featureSubtitle}
            faDesc={content.featureDesc}
            featuredProducts={featuredProducts}
            isLoading={false}
          />
        </Suspense>
      </LazyWrapper>

      {/* In Season */}
      <LazyWrapper>
        <InSeason
          title={content.seasonTitle}
          subtitle={content.seasonSubtitle}
          description={content.seasonDesc}
          products={seasonalProducts}
        />
      </LazyWrapper>

      {/* Stats Section */}
      <section
        className="py-24 luxury-gradient border-t border-charcoal-900/10"
        aria-labelledby="stats-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2
              id="stats-heading"
              className="font-cormorant flex flex-col items-center justify-center text-foreground"
            >
              <span className="block text-xl font-medium mb-3 opacity-80">
                {content.excellenceTitle}
              </span>
              <span className="text-display-md font-bold text-charcoal-900 leading-none">
                {content.excellenceSubtitle}
              </span>
            </h2>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {(content.stats as any)?.map((s: any, i: number) => (
              <div
                key={i}
                className={`
                  flex flex-col items-center justify-center text-center p-4
                  ${i !== ((content.stats as any)?.length || 0) - 1
                    ? "lg:border-r border-charcoal-900/10"
                    : ""
                  }
                  transition-transform duration-300 hover:-translate-y-1 will-change-transform
                `}
              >
                <dd className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-3 font-cormorant">
                  {s.number}
                </dd>
                <dt className="text-sm font-bold text-charcoal-900 uppercase tracking-widest opacity-90">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Testimonials */}
      <LazyWrapper>
        <TestimonialSection
          taTitle={content.testimonialTitle}
          taDesc={content.testimonialDesc}
          testimonials={(content.testimonials as any) ?? []}
        />
      </LazyWrapper>

      {/* Newsletter */}
      <Newsletter
        title={content.newsletterTitle}
        description={content.newsletterDesc}
      />
    </div>
  );
}
