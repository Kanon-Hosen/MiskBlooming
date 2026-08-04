import { Input } from "@/src/components/ui/input";
import { DollarSign } from "lucide-react";
import React from "react";
import { TabProps } from "../types";

function PricingTab({ formData, handleInputChange, errors }: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-cormorant font-bold text-foreground  mb-4">
          Pricing Information
        </h2>
        <p className="text-foreground ">
          Set competitive pricing for your product
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Regular Price (AED) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ""}
              onChange={(e) =>
                handleInputChange(
                  "price",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              placeholder="0.00"
              className={`pl-10 ${errors?.price ? "border-red-300" : ""}`}
            />
          </div>
          {errors?.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="compareAtPrice"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Compare at Price (AED)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.compareAtPrice || ""}
              onChange={(e) =>
                handleInputChange(
                  "compareAtPrice",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              placeholder="0.00"
              className={`pl-10 ${
                errors?.compareAtPrice ? "border-red-300" : ""
              }`}
            />
          </div>
          {errors?.compareAtPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.compareAtPrice}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Original price for showing discounts
          </p>
        </div>

        <div>
          <label
            htmlFor="costPerItem"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Cost per Item (AED)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="costPerItem"
              type="number"
              step="0.01"
              min="0"
              value={formData.costPerItem || ""}
              onChange={(e) =>
                handleInputChange(
                  "costPerItem",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              placeholder="0.00"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Your cost for profit calculations
          </p>
        </div>
      </div>

      {/* Pricing Summary */}
      {formData.price > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Pricing Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Regular Price:</span>
              <p className="font-medium text-foreground">
                AED {formData.price.toFixed(2)}
              </p>
            </div>
            {formData.compareAtPrice > 0 && (
              <div>
                <span className="text-foreground ">Discount:</span>
                <p className="font-medium text-green-600">
                  {Math.round(
                    ((formData.compareAtPrice - formData.price) /
                      formData.compareAtPrice) *
                      100
                  )}
                  % OFF
                </p>
              </div>
            )}
            {formData.costPerItem > 0 && (
              <div>
                <span className="text-foreground ">Profit Margin:</span>
                <p className="font-medium text-blue-600">
                  {Math.round(
                    ((formData.price - formData.costPerItem) / formData.price) *
                      100
                  )}
                  %
                </p>
              </div>
            )}
            {formData.costPerItem > 0 && (
              <div>
                <span className="text-foreground ">Profit per Sale:</span>
                <p className="font-medium text-green-600">
                  AED {(formData.price - formData.costPerItem).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PricingTab;
