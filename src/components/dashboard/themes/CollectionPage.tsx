"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import * as AccordionPrimitive from "@radix-ui/react-accordion"; // best practice to namespace primitives or use a UI library wrapper
import { ChevronDown, Loader2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx"; // Assuming you have clsx or classnames, otherwise use template literals

// Component Imports
import { Input } from "../../ui/input";
import Button from "../../ui/button";

// GraphQL Imports
import {
  GET_COLLECTIONCONTENT,
  UPDATE_COLLECTIONCONTENT,
} from "@/src/modules/contentManagment/oparation";

// --- Types ---
type CollectionContentFormData = {
  collectionTitle: string;
  collectionDesc: string;
};

// --- Components (Accordion Wrappers for cleaner JSX) ---
const Accordion = AccordionPrimitive.Root;
const AccordionItem = AccordionPrimitive.Item;
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={clsx(
        "flex flex-1 items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors group",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="w-5 h-5 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={clsx(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="px-6 pb-6 pt-2">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

// --- Main Page Component ---
export default function CollectionPage() {
  // 1. Fetch Data
  const { data, loading, error } = useQuery(GET_COLLECTIONCONTENT, {
    fetchPolicy: "cache-and-network", // Ensure data is fresh
  });

  const collectionData = data?.getCollectionContent;

  // 2. Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CollectionContentFormData>({
    mode: "onChange", // Better UX: validate as they type
  });

  // 3. Sync Data to Form
  useEffect(() => {
    if (collectionData) {
      reset({
        collectionTitle: collectionData.collectionTitle || "",
        collectionDesc: collectionData.collectionDesc || "",
      });
    }
  }, [collectionData, reset]);

  // 4. Mutation Setup
  const [updateCollectionContent] = useMutation(UPDATE_COLLECTIONCONTENT);

  // 5. Submit Handler
  const onSubmit = async (formData: CollectionContentFormData) => {
    const toastId = toast.loading("Saving changes...");

    try {
      await updateCollectionContent({
        variables: {
          input: {
            collectionTitle: formData.collectionTitle,
            collectionDesc: formData.collectionDesc,
          },
        },
      });

      // Update the form state with the new values so 'isDirty' resets correctly
      reset(formData);
      toast.success("Collection content updated successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error("Error updating collection content:", err);
      toast.error("Failed to update content. Please try again.", {
        id: toastId,
      });
    }
  };

  // 6. Loading State (Skeleton)
  if (loading) {
    return <PageSkeleton />;
  }

  // 7. Error State
  if (error) {
    return (
      <div className="p-6 text-destructive bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>Error loading content: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          Collection Page Content
        </h1>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="collection"
        className="w-full bg-card rounded-lg shadow-sm border border-border overflow-hidden"
      >
        <AccordionItem value="collection" className="border-b-0">
          <AccordionTrigger>
            <span className="text-lg font-semibold text-primary">
              Content Configuration
            </span>
          </AccordionTrigger>

          <AccordionContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label
                  htmlFor="collectionTitle"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Collection Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="collectionTitle"
                  {...register("collectionTitle", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                  })}
                  placeholder="e.g., Summer Collection 2024"
                  disabled={isSubmitting}
                  className={clsx(
                    "w-full",
                    errors.collectionTitle &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.collectionTitle && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.collectionTitle.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label
                  htmlFor="collectionDesc"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description <span className="text-destructive">*</span>
                </label>
                <Input
                  id="collectionDesc"
                  {...register("collectionDesc", {
                    required: "Description is required",
                    maxLength: {
                      value: 160,
                      message: "Description too long (max 160 chars)",
                    },
                  })}
                  placeholder="Short description for SEO and display"
                  disabled={isSubmitting}
                  className={clsx(
                    "w-full",
                    errors.collectionDesc &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.collectionDesc && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.collectionDesc.message}
                  </p>
                )}
              </div>

              {/* Action Area */}
              <div className="pt-4 border-t border-primary/10 flex justify-end">
                <Button
                  variant="luxury"
                  type="submit"
                  className="flex items-center gap-2 px-8 min-w-[140px]"
                  disabled={isSubmitting || !isDirty}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Helper: Skeleton Loader Component
function PageSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="w-full h-64 bg-muted rounded-lg border border-border" />
    </div>
  );
}
