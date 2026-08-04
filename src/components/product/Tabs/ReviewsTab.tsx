import { Product } from "@/src/types";
import { motion } from "framer-motion";
import { Star, CheckCircle, User, Lock } from "lucide-react";
import Link from "next/link";
import Button from "../../ui/button";
import { formatTimestamp } from "@/src/lib/utils";

interface ReviewsTabProps {
  product: Product;
  rating: number;
  setRating: (rating: number) => void;
  hover: number;
  setHover: (hover: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  user: any;
}

export default function ReviewsTab({
  product,
  rating,
  setRating,
  hover,
  setHover,
  comment,
  setComment,
  handleSubmit,
  user,
}: ReviewsTabProps) {
  const reviews = product.Review || [];
  const totalReviews = reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto"
    >
      {/* 1. Summary Section */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Big Score */}
          <div className="text-center md:text-left md:border-r border-border md:pr-10">
            <h3 className="font-cormorant text-2xl font-bold text-foreground mb-2">
              Customer Rating
            </h3>
            <div className="flex items-baseline justify-center md:justify-start gap-3 mb-2">
              <span className="text-6xl font-bold text-foreground font-cormorant">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-lg">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "text-primary fill-current"
                      : "text-foreground fill-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Right: Bars */}
          <div className="space-y-3">
            {ratingCounts.map(({ star, percentage, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-3">
                  {star}
                </span>
                <Star className="w-3 h-3 text-muted-foreground" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Review Content Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Reviews List (Takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="font-cormorant text-2xl font-bold text-foreground">
              Recent Reviews
            </h3>
            {/* Optional Sort Dropdown could go here */}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="group flex gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  {/* Avatar / Initials */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-muted text-foreground flex items-center justify-center text-lg font-cormorant font-bold uppercase">
                      {review.user?.firstName?.charAt(0) || (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Review Body */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
                        {review.user?.firstName} {review.user?.lastName}
                        {review.user?.emailVerified && (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-green-100">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
                        {formatTimestamp(review.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((starRating) => (
                        <Star
                          key={starRating}
                          className={`w-4 h-4 ${
                            starRating <= review.rating
                              ? "text-primary fill-current"
                              : "text-foreground fill-foreground"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-foreground leading-relaxed text-sm md:text-base">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
              <Star className="w-10 h-10 text-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground font-medium">
                No reviews yet. Be the first to share your experience.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Write Review Form (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="font-cormorant text-2xl font-bold text-foreground mb-6">
              Share Your Experience
            </h3>

            {user ? (
              <form
                onSubmit={handleSubmit}
                className="bg-card p-6 rounded-xl shadow-sm border border-border space-y-6"
              >
                {/* Rating Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-3">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            (hover || rating) >= star
                              ? "text-primary fill-current"
                              : "text-foreground fill-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="h-5 mt-1">
                    {rating > 0 && (
                      <span className="text-xs text-primary font-medium animate-in fade-in">
                        {rating === 5
                          ? "Excellent"
                          : rating === 4
                          ? "Good"
                          : rating === 3
                          ? "Average"
                          : "Poor"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    className="w-full bg-background border border-border rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                    placeholder="Tell us what you liked or what we can improve..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="luxury"
                  className="w-full"
                >
                  Submit Review
                </Button>
              </form>
            ) : (
              <div className="bg-card text-center p-8 rounded-xl shadow-lg border border-border relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/20"></div>

                <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-cormorant text-xl font-bold text-foreground mb-2">
                  Verified Reviews Only
                </h4>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  To ensure authenticity, please sign in to leave a review for
                  this product.
                </p>
                <Link href={`/auth/login?callbackUrl=${product.slug}`}>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Login to Write
                  </Button>
                </Link>
              </div>
            )}

            {/* Side Note */}
            <div className="mt-8 bg-card p-5 rounded-lg border border-border">
              <h4 className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
                Why Review?
              </h4>
              <ul className="space-y-2">
                {[
                  "Help others make choices",
                  "Improve our service",
                  "Get exclusive offers",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center text-xs text-muted-foreground"
                  >
                    <CheckCircle className="w-3 h-3 text-primary mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
