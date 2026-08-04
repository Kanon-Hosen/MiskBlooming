"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ImageUploadField } from "./ImageUploadField";
import { ListManager } from "./ListManager";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronDown, Save, Loader2 } from "lucide-react";
import { Input } from "../../ui/input";
import Button from "../../ui/button";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CONTACTCONTENT,
  UPDATE_CONTACTCONTENT,
} from "@/src/modules/contentManagment/oparation";
import { toast } from "sonner";

type ContactContentFormData = {
  heroTitle: string;
  heroDesc: string;
  heroImage?: string;
  mapEmbedUrl?: string; // Google Maps Embed URL
  contactInfo: { title: string; details: string[] | string; description: string }[];
};

interface ContactPageContentData {
  getContactPageContent: ContactContentFormData;
}

const ContentSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="p-4 border border-primary/20 rounded-md space-y-3 bg-card">
    <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  </section>
);

export default function ContactSection() {
  const { data, loading, error } = useQuery<ContactPageContentData>(GET_CONTACTCONTENT, {
    fetchPolicy: "network-only",
  });

  const [updateContactPageContent, { loading: saving }] = useMutation(UPDATE_CONTACTCONTENT);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ContactContentFormData>();

  useEffect(() => {
    if (data?.getContactPageContent) {
      reset(data.getContactPageContent);
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<ContactContentFormData> = async (formData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, __typename, ...cleanedData } = formData as any;

    const input = {
      ...cleanedData,
      contactInfo: formData.contactInfo || [],
    };

    const promise = updateContactPageContent({
      variables: { input },
    });

    toast.promise(promise, {
      loading: "Saving contact content...",
      success: (res) => {
        // reset(formData);
        return "Contact page updated!";
      },
      error: (err) => {
        console.error(err);
        return "Failed to save.";
      },
    });
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary/50 mx-auto" />;
  if (error) return <div className="text-red-500">Error loading contact content</div>;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-card rounded-lg shadow-sm border border-border overflow-hidden"
    >
      <AccordionItem value="contact" className="border-b-0">
        <AccordionHeader className="flex">
          <AccordionTrigger className="flex flex-1 items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors group">
            <span className="text-lg font-semibold text-primary">
              Contact Page Configuration
            </span>
            <ChevronDown className="w-5 h-5 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </AccordionTrigger>
        </AccordionHeader>

        <AccordionContent className="px-6 pb-6 pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <ContentSection title="Hero Section">
              <div className="col-span-1 md:col-span-2 space-y-4">
                <Controller
                  control={control}
                  name="heroImage"
                  render={({ field }) => (
                    <ImageUploadField
                      label="Hero Banner Image"
                      value={field.value}
                      onChange={field.onChange}
                      folder="misk-blooming/contact"
                    />
                  )}
                />
              </div>
              <Input
                {...register("heroTitle")}
                placeholder="Hero Title"
                disabled={saving}
              />
              <Input
                {...register("heroDesc")}
                placeholder="Hero Description"
                disabled={saving}
                className="col-span-2"
              />
            </ContentSection>

            <ContentSection title="Contact Information">
              <div className="col-span-1 md:col-span-2">
                <Controller
                  control={control}
                  name="contactInfo"
                  render={({ field }) => (
                    <ListManager
                      title="Contact Details"
                      // Transform array details to string for editing
                      items={
                        field.value?.map((item) => ({
                          ...item,
                          details: Array.isArray(item.details)
                            ? item.details.join("\n")
                            : item.details,
                        })) || []
                      }
                      // Transform string back to array on update
                      onUpdate={(newItems) =>
                        field.onChange(
                          newItems.map((item) => ({
                            ...item,
                            details:
                              typeof item.details === "string"
                                ? item.details.split("\n").filter(Boolean)
                                : item.details,
                          }))
                        )
                      }
                      fields={[
                        { name: "title", label: "Title (Phone, Email, etc.)", type: "text" },
                        { name: "details", label: "Details (One per line)", type: "textarea" },
                        { name: "description", label: "Description", type: "text" },
                      ]}
                      description="Manage contact methods and details."
                    />
                  )}
                />
              </div>
              <div className="col-span-1 md:col-span-2 mt-4">
                <Input
                  {...register("mapEmbedUrl")}
                  label="Google Maps Embed URL (src attribute only)"
                  placeholder="https://www.google.com/maps/embed?..."
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the "src" URL from the Google Maps "Embed a map" code.
                </p>
              </div>
            </ContentSection>

            <div className="sticky bottom-0 bg-card/95 backdrop-blur py-4 border-t border-border flex justify-end z-10">
              <Button
                variant="luxury"
                type="submit"
                disabled={saving || !isDirty}
                className="flex items-center gap-2 px-8"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
