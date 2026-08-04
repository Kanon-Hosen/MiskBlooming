"use client";

import { useMemo, Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { useCheckout } from "@/src/hooks/useCheckout";
import { useCartStore } from "../../../store/cartStore";
import { useAuth } from "@/src/hooks/useAuth";
import {
  CheckoutHeader,
  CheckoutProgress,
  EmptyCart,
} from "@/src/components/checkout";
import { GiftCardCreator } from "@/src/components/checkout/GiftCardCreator";

// Lazy-load heavy components only
const ShippingInformationStep = dynamic(() =>
  import("@/src/components/checkout/ShippingInformationStep").then(
    (mod) => mod.ShippingInformationStep
  )
);
const PersonalInformationStep = dynamic(() =>
  import("@/src/components/checkout/PersonalInformationStep").then(
    (mod) => mod.PersonalInformationStep
  )
);
const PaymentStep = dynamic(
  () =>
    import("@/src/components/checkout/PaymentStep").then(
      (mod) => mod.PaymentStep
    ),
  { ssr: false } // Stripe needs client-side only
);
const OrderSummary = dynamic(
  () =>
    import("@/src/components/checkout/OrderSummary").then(
      (mod) => mod.OrderSummary
    ),
  { ssr: false }
);

// Skeleton loader
function SkeletonBox({ className }: { className: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

export default function CheckoutPage() {
  const [isGiftCardModalOpen, setGiftCardModalOpen] = useState(false);
  const { items } = useCartStore();
  const { data: user } = useAuth();
  const userId = user?.id;

  const {
    form,
    currentStep,
    isProcessing,
    orderId,
    clientSecret,
    calculateTotals,
    handleSubmit,
    nextStep,
    prevStep,
    settings, // <--- Destructure this
  } = useCheckout(userId || "");

  const calculations = useMemo(() => calculateTotals(), [calculateTotals]);

  if (isProcessing) {
    window.scrollTo(0, 0);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-cormorant font-bold text-foreground  mb-2">
            Processing Your Order
          </h2>
          <p className="text-foreground ">
            Please wait while we process your order...
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen sm:mt-14 mt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header & Progress */}
        <CheckoutHeader />
        <CheckoutProgress currentStep={currentStep} />

        <GiftCardCreator
          isOpen={isGiftCardModalOpen}
          onClose={() => setGiftCardModalOpen(false)}
          form={form}
          settings={settings}
        />

        {/* Guest Checkout Notice */}
        <div className="mb-6 p-4 bg-card border border-border rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-primary flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-foreground">
                Quick Checkout - No Account Required
              </h3>
              <div className="mt-1 text-sm text-muted-foreground">
                <p>
                  You can complete your purchase without creating an account.
                  You'll receive order updates via email and can track your
                  order using your order number.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2">
            <Suspense fallback={<SkeletonBox className="h-80 w-full mb-4" />}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 lg:space-y-8"
              >
                {currentStep >= 1 && (
                  <PersonalInformationStep form={form} onNext={nextStep} />
                )}
                {currentStep >= 2 && (
                  <ShippingInformationStep
                    form={form}
                    onNext={nextStep}
                    onBack={prevStep}
                    userId={userId || ""}
                    subtotal={calculations.subtotal}
                    isGiftCardEnabled={settings?.isGiftCardEnabled ?? false}
                    giftCardFeeAmount={Number(settings?.giftCardFee ?? 0)}
                    deliveryFlatRate={Number(settings?.deliveryFlatRate ?? 15)}
                    expressDeliveryFee={Number(settings?.expressDeliveryFee ?? 30)}
                    scheduledDeliveryFee={Number(settings?.scheduledDeliveryFee ?? 10)}
                    freeShippingThreshold={settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : null}
                  />
                )}
                {currentStep >= 3 && (
                  <PaymentStep
                    form={form}
                    onBack={prevStep}
                    onSubmit={() => form.handleSubmit(handleSubmit)()}
                    isProcessing={isProcessing}
                    total={calculations.total}
                    clientSecret={clientSecret}
                    orderId={orderId}
                    codFee={Number(settings?.codFee ?? 10)}
                  />
                )}
              </form>
            </Suspense>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <Suspense fallback={<SkeletonBox className="h-80 w-full" />}>
              <OrderSummary
                items={items}
                subtotal={calculations.subtotal}
                deliveryFee={calculations.deliveryFee}
                codFee={calculations.codFee}
                tax={calculations.tax}
                total={calculations.total}
                couponDiscount={calculations.couponDiscount}
                vatRate={Number(settings?.vatRate || 5)}

                // Gift Card Props
                hasGiftCard={form.watch("hasGiftCard")}
                onGiftCardChange={(checked) => {
                  form.setValue("hasGiftCard", checked);
                  if (checked) setGiftCardModalOpen(true);
                }}
                onCustomizeGiftCard={() => setGiftCardModalOpen(true)}
                isGiftCardEnabled={settings?.isGiftCardEnabled ?? false}
                giftCardFeeAmount={Number(settings?.giftCardFee ?? 0)}
                giftCardFee={calculations.giftCardFee}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
