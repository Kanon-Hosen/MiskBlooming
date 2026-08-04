"use client";

import Image from "next/image";
import { Shield, Truck, Phone, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "../../lib/utils";
import type { CartItem } from "../../types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  codFee: number;
  tax: number;
  total: number;
  couponDiscount?: number;
  vatRate?: number;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  codFee,
  tax,
  total,
  couponDiscount = 0,
  giftCardFee = 0,
  hasGiftCard = false,
  onGiftCardChange,
  isGiftCardEnabled = false,
  giftCardFeeAmount = 0,
  vatRate = 5,
  onCustomizeGiftCard,
}: OrderSummaryProps & {
  giftCardFee?: number;
  hasGiftCard?: boolean;
  onGiftCardChange?: (checked: boolean) => void;
  isGiftCardEnabled?: boolean;
  giftCardFeeAmount?: number;
  onCustomizeGiftCard?: () => void;
}) {
  return (
    <motion.div
      className="bg-background rounded-2xl p-6 shadow-lg sticky top-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="font-cormorant text-xl font-bold text-foreground  mb-6">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center space-x-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.product?.images[0].url || "/placeholder.svg"}
                alt={item.product?.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground  sm:text-sm text-xs line-clamp-2">
                {item.product.name}
              </h4>
              <p className="text-muted-foreground text-sm">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground ">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-border  pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>

        {codFee > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">COD Fee</span>
            <span className="font-medium">{formatPrice(codFee)}</span>
          </div>
        )}

        {/* Gift Card Option */}
        {isGiftCardEnabled && onGiftCardChange && (
          <div className="py-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasGiftCard}
                onChange={(e) => onGiftCardChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Include Gift Card (+{formatPrice(giftCardFeeAmount)})</span>
            </label>
            {hasGiftCard && onCustomizeGiftCard && (
              <button
                type="button"
                onClick={onCustomizeGiftCard}
                className="text-xs text-primary font-medium underline hover:text-primary/80 transition-colors ml-6 mt-1 block"
              >
                Customize Card
              </button>
            )}
          </div>
        )}

        {giftCardFee > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gift Card</span>
            <span className="font-medium">{formatPrice(giftCardFee)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">VAT ({vatRate}%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-border  pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-foreground ">
              Total
            </span>
            <span className="text-lg font-bold text-foreground ">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-border ">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
          <div>
            <Truck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Fast Delivery</p>
          </div>
          <div>
            <Phone className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">24/7 Support</p>
          </div>
        </div>
      </div>

      {/* Satisfaction Guarantee */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm font-medium text-luxury-800">
            100% Satisfaction Guarantee
          </span>
        </div>
        <p className="text-xs text-luxury-700 mt-1">
          Fresh flowers or your money back
        </p>
      </div>
    </motion.div>
  );
}
