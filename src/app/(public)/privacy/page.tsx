import React from "react";
import { prisma } from "@/src/lib/db";
import LegalPageLayout from "@/src/components/LegalPageLayout";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Error fetching settings for privacy metadata:", error);
  }
  return {
    title: `Privacy Policy | ${settings?.storeName || 'Misk Blooming'}`,
    description: "Privacy policy detailing how we collect, use, and protect user data.",
  };
}

export default async function PrivacyPolicyPage() {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Error fetching settings for privacy page:", error);
  }

  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated={settings?.updatedAt ? new Date(settings.updatedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
      content={settings?.privacyPolicy || null}
      storeName={settings?.storeName}
      email={settings?.supportEmail}
      phone={settings?.phoneNumber}
      address={settings?.address}
    />
  );
}
