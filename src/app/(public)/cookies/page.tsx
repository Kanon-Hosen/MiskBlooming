import React from "react";
import { prisma } from "@/src/lib/db";
import LegalPageLayout from "@/src/components/LegalPageLayout";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Error fetching settings for cookies metadata:", error);
  }
  return {
    title: `Cookie Policy | ${settings?.storeName || 'Misk Blooming'}`,
    description: "Learn how we use cookies and similar tracking technologies on our website.",
  };
}

export default async function CookiePolicyPage() {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Error fetching settings for cookies page:", error);
  }

  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated={settings?.updatedAt ? new Date(settings.updatedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
      content={settings?.cookiePolicy || null}
      storeName={settings?.storeName}
      email={settings?.supportEmail}
      phone={settings?.phoneNumber}
      address={settings?.address}
    />
  );
}
