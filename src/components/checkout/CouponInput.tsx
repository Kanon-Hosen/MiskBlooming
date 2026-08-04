"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useCoupon } from "../../hooks/useCoupon";
import { useCartStore } from "../../store/cartStore";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export function CouponInput() {
  const [couponCode, setCouponCode] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: user } = useAuth();
  const { validateCouponCode, isValidating } = useCoupon();
  const {
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getTotalPrice,
  } = useCartStore();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const result = await validateCouponCode(
      couponCode.trim(),
      getTotalPrice(),
      user?.id
    );

    if (result.isValid && result.coupon) {
      applyCoupon(result.coupon);
      toast.success(`Coupon "${couponCode}" applied successfully!`);
      setCouponCode("");
      setIsExpanded(false);
    } else {
      toast.error(result.error || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success("Coupon removed");
  };

  return (
    <motion.div
      className="bg-background rounded-xl border border-border  p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Tag className="w-5 h-5 text-primary  mr-2" />
          <h3 className="font-medium text-foreground ">Promo Code</h3>
        </div>
        {!appliedCoupon && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:text-luxury-700 font-medium"
          >
            {isExpanded ? "Cancel" : "Have a code?"}
          </button>
        )}
      </div>

      {appliedCoupon ? (
        <motion.div
          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="font-medium text-green-800">
                {appliedCoupon.code} Applied
              </p>
              <p className="text-sm text-green-600">
                {appliedCoupon.discountType === "PERCENTAGE"
                  ? `${appliedCoupon.discountValue}% off`
                  : appliedCoupon.discountType === "FIXED_AMOUNT"
                    ? `AED ${appliedCoupon.discountValue} off`
                    : "Free shipping"}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="p-1 hover:bg-green-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-green-600" />
          </button>
        </motion.div>
      ) : isExpanded ? (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || isValidating}
              size="sm"
              variant="luxury"
            >
              {isValidating ? "..." : "Apply"}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Try: WELCOME10, LUXURY15, or FIRST20</p>
          </div>
        </motion.div>
      ) : null}

      {couponDiscount > 0 && (
        <motion.div
          className="mt-3 p-2 bg-muted rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className="flex justify-between items-center text-sm">
            <span className="text-luxury-700">Discount Applied:</span>
            <span className="font-medium text-luxury-800">
              -AED {couponDiscount.toFixed(2)}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
