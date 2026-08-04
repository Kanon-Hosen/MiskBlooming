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
import { ChevronDown, Save, Loader2, AlertCircle } from "lucide-react";
import { Input } from "../../ui/input";
import Button from "../../ui/button";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ABOUTCONTENT,
  UPDATE_ABOUTCONTENT,
} from "@/src/modules/contentManagment/oparation";
import { toast } from "sonner";

// --- Types ---
type AboutContentFormData = {
  heroTitle: string;
  heroDesc: string;
  heroImage?: string;
  storyTitle: string;
  storyDesc1: string;
  storyDesc2: string;
  storyImage?: string;
  // We'll manage complex lists as simpler fields for now or just standard JSON
  stats: { number: string; label: string }[];
  values: { title: string; description: string; icon: string }[];
  team: { name: string; role: string; description: string; image: string }[];
};

interface AboutPageContentData {
  getAboutPageContent: AboutContentFormData;
}

const ContentSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="p-4 border border-primary/20 rounded-md space-y-3 bg-card">
    <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  </section>
);

export default function AboutSection() {
  const { data, loading, error } = useQuery<AboutPageContentData>(GET_ABOUTCONTENT, {
    fetchPolicy: "network-only",
  });

  const [updateAboutPageContent, { loading: saving }] = useMutation(UPDATE_ABOUTCONTENT);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AboutContentFormData>();

  useEffect(() => {
    if (data?.getAboutPageContent) {
      reset(data.getAboutPageContent);
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<AboutContentFormData> = async (formData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, __typename, ...cleanedData } = formData as any;

    const input = {
      ...cleanedData,
      // Ensure arrays are initialized if undefined
      stats: formData.stats || [],
      values: formData.values || [],
      team: formData.team || [],
    };

    const promise = updateAboutPageContent({
      variables: { input },
    });

    toast.promise(promise, {
      loading: "Saving about content...",
      success: (res) => {
        // reset(formData); // Avoid resetting to partial data
        return "About page updated!";
      },
      error: (err) => {
        console.error(err);
        return "Failed to save.";
      },
    });
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary/50 mx-auto" />;
  if (error) return <div className="text-red-500">Error loading about content</div>;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-card rounded-lg shadow-sm border border-border overflow-hidden"
    >
      <AccordionItem value="about" className="border-b-0">
        <AccordionHeader className="flex">
          <AccordionTrigger className="flex flex-1 items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors group">
            <span className="text-lg font-semibold text-primary">
              About Page Configuration
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
                      folder="misk-blooming/about"
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
              />
            </ContentSection>

            <ContentSection title="Our Story">
              <div className="col-span-1 border-r border-border pr-4">
                <Controller
                  control={control}
                  name="storyImage"
                  render={({ field }) => (
                    <ImageUploadField
                      label="Story Image"
                      value={field.value}
                      onChange={field.onChange}
                      folder="misk-blooming/about"
                    />
                  )}
                />
              </div>
              <div className="col-span-1 space-y-4">
                <Input
                  {...register("storyTitle")}
                  placeholder="Story Title"
                  disabled={saving}
                />
                <Input
                  {...register("storyDesc1")}
                  placeholder="Paragraph 1"
                  disabled={saving}
                />
                <Input
                  {...register("storyDesc2")}
                  placeholder="Paragraph 2"
                  disabled={saving}
                />
              </div>
            </ContentSection>

            <ContentSection title="Key Statistics">
              <div className="col-span-1 md:col-span-2">
                <Controller
                  control={control}
                  name="stats"
                  render={({ field }) => (
                    <ListManager
                      title="Statistics"
                      items={field.value || []}
                      onUpdate={field.onChange}
                      fields={[
                        { name: "number", label: "Number (e.g. 50k+)", type: "text" },
                        { name: "label", label: "Label", type: "text" },
                      ]}
                      description="Add key metrics to display on the about page."
                    />
                  )}
                />
              </div>
            </ContentSection>

            <ContentSection title="Core Values">
              <div className="col-span-1 md:col-span-2">
                <Controller
                  control={control}
                  name="values"
                  render={({ field }) => (
                    <ListManager
                      title="Values"
                      items={field.value || []}
                      onUpdate={field.onChange}
                      fields={[
                        { name: "icon", label: "Icon (Heart, Truck, Award, Leaf, Gift)", type: "text" },
                        { name: "title", label: "Title", type: "text" },
                        { name: "description", label: "Description", type: "textarea" },
                      ]}
                      description="Define the core values of the brand."
                    />
                  )}
                />
              </div>
            </ContentSection>

            <ContentSection title="Team Members">
              <div className="col-span-1 md:col-span-2">
                <Controller
                  control={control}
                  name="team"
                  render={({ field }) => (
                    <ListManager
                      title="Team"
                      items={field.value || []}
                      onUpdate={field.onChange}
                      fields={[
                        { name: "image", label: "Photo", type: "image" },
                        { name: "name", label: "Name", type: "text" },
                        { name: "role", label: "Role", type: "text" },
                        { name: "description", label: "Description", type: "textarea" },
                      ]}
                      description="Manage team members displayed on the about page."
                    />
                  )}
                />
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
