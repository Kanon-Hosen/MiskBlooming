import React from "react";
import { prisma } from "@/src/lib/db";
import LegalPageLayout from "@/src/components/LegalPageLayout";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Error fetching settings for delivery metadata:", error);
  }
  return {
    title: `Shipping & Delivery | ${settings?.storeName || 'Misk Blooming'}`,
    description: "Shipping and delivery information for our products.",
  };
}

export default async function DeliveryInfoPage() {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Error fetching settings for delivery page:", error);
  }

  return (
    <LegalPageLayout
      title="Shipping & Delivery Information"
      lastUpdated={settings?.updatedAt ? new Date(settings.updatedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
      content={settings?.shippingPolicy || null}
      storeName={settings?.storeName}
      email={settings?.supportEmail}
      phone={settings?.phoneNumber}
      address={settings?.address}
    />
  );
}
