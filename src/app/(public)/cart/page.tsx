"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { useCartStore } from "../../../store/cartStore";
import { useCoupon } from "../../../hooks/useCoupon";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { ShoppingBag, ArrowLeft, Gift, Truck, Shield } from "lucide-react";
import { formatPrice } from "../../../lib/utils";

// Lazy load CartItem
const CartItem = dynamic(() => import("../../../components/CartItem"), {
  ssr: false,
});

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  console.log("🚀 ~ CartPage ~ items:", items);

  const { validateCouponCode, isValidating } = useCoupon();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState("");
  const { data: user } = useAuth();
  const userId = user?.id;

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      removeItem(productId);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    const subtotal = getTotalPrice();
    const result = await validateCouponCode(couponCode, subtotal, userId ?? "");

    if (result.isValid && result.coupon) {
      applyCoupon(result.coupon);
      toast.success(`Coupon "${result.coupon.code}" applied successfully!`);
      setCouponCode("");
    } else {
      toast.error(result.error || "Invalid coupon code");
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 25;
  const tax = (subtotal - couponDiscount) * 0.05;
  const total = subtotal - couponDiscount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen sm:mt-16 mt-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="w-24 h-24 text-cream-300 mx-auto mb-6" />
            <h1 className="font-cormorant text-3xl font-bold text-foreground  mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover our exquisite collection of fresh flowers, luxury
              chocolates, beautiful cakes, and thoughtful gift sets.
            </p>
            <Link href="/products">
              <Button variant="luxury" size="lg">
                Explore Our Collections
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:mt-14 mt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="sm:flex items-center">
            <Link
              href="/products"
              className="flex items-center text-primary  hover:text-primary transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            <div className="sm:mt-0 mt-2">
              <h1 className="font-cormorant text-3xl font-bold text-foreground ">
                Shopping Cart ({getTotalItems()} items)
              </h1>
              <p className="text-muted-foreground mt-1">
                Review your luxury selections
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  removingItems={removingItems}
                  handleUpdateQuantity={handleUpdateQuantity}
                  handleRemoveItem={handleRemoveItem}
                />
              ))}
            </AnimatePresence>

            {/* Coupon Section */}
            {user ? (
              <motion.div
                className="bg-background rounded-2xl sm:p-6 sm:shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center sm:mb-4 mb-1">
                  <Gift className="w-5 h-5 text-primary  mr-2" />
                  <h3 className="font-cormorant text-lg font-semibold text-foreground ">
                    Promo Code
                  </h3>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium text-green-800">
                        {appliedCoupon.code} -{" "}
                        {appliedCoupon.discountType === "PERCENTAGE"
                          ? `${appliedCoupon.discountValue}% off`
                          : appliedCoupon.discountType === "FIXED_AMOUNT"
                          ? `${appliedCoupon.discountValue} AED off`
                          : "Free shipping"}{" "}
                        applied
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="sm:flex sm:space-x-3">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 px-4 mr-2 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                    <Button
                      className="sm:mt-0 mt-4 hover:bg-black"
                      onClick={handleApplyCoupon}
                      variant="outline"
                      disabled={!couponCode.trim() || isValidating}
                    >
                      {isValidating ? "Validating..." : "Apply"}
                    </Button>
                  </div>
                )}

                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Try: WELCOME10, LUXURY15, or FIRST20</p>
                </div>
              </motion.div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground italic">
                  Log in to apply promo codes and enjoy exclusive discounts!
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-background rounded-2xl sm:p-6 sm:shadow-lg sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-cormorant text-xl font-bold text-foreground  mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (5%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                {shipping === 0 && (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Truck className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800 font-medium">
                      Free shipping applied!
                    </span>
                  </div>
                )}

                <div className="border-t border-border  pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground ">
                      Total
                    </span>
                    <span className="text-lg font-bold text-foreground ">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button variant="luxury" size="lg" className="w-full mt-6">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border ">
                  <div className="grid sm:grid-cols-3 gap-4 text-center">
                    <div className="py-4 border border-border  rounded-md">
                      <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Secure Payment
                      </p>
                    </div>
                    <div className="py-4 border border-border  rounded-md">
                      <Truck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Fast Delivery
                      </p>
                    </div>
                    <div className="py-4 border border-border  rounded-md">
                      <Gift className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Gift Wrapping
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center mb-2">
                    <Truck className="w-4 h-4 text-primary mr-2" />
                    <span className="font-medium text-foreground text-sm">
                      Estimated Delivery
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      Date.now() + 1 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    Same-day delivery available in Dubai
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
