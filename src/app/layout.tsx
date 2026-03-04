import type React from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";
import { prisma } from "../lib/db";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["Arial", "system-ui", "sans-serif"],
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Error fetching store settings for metadata:", error);
  }

  // Strict "No Demo Data" policy:
  // If settings exist, use them.
  // If not, fallback to empty strings.
  const title = settings?.storeName || "";
  const description = settings?.description || "";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.APP_URL ? process.env.APP_URL : "https://demo.app");

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    alternates: {
      canonical: "/",
      languages: {
        "en-AE": "/en-ae",
        "ar-AE": "/ar",
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: baseUrl,
      siteName: title,
      locale: "en_AE",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#d4af37",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${playfair.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body
        suppressHydrationWarning={true}
        className="min-h-screen bg-background text-foreground overflow-x-hidden  antialiased"
      >
        <Toaster position="top-center" richColors />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
