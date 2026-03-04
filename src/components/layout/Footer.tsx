import { prisma } from "@/src/lib/db";
import FooterClient from "./FooterClient";

// Default content if DB is empty
const defaultFooterData = {
  brandDesc: "",
  phone: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
  twitter: "",
  newsletterTitle: "",
  newsletterDesc: "",
  copyrightText: "",
  footerLinks: []
};

const Footer = async () => {
  let content = null;
  let storeSettings = null;

  try {
    [content, storeSettings] = await Promise.all([
      prisma.footerContent.findFirst({ where: { id: "FOOTER" } }),
      prisma.storeSettings.findFirst()
    ]);
  } catch (error) {
    console.error("Error fetching footer data:", error);
  }

  const footerData = content ? {
    brandDesc: content.brandDesc,
    phone: content.phone,
    email: content.email,
    address: content.address,
    facebook: content.facebook,
    instagram: content.instagram,
    twitter: content.twitter,
    newsletterTitle: content.newsletterTitle,
    newsletterDesc: content.newsletterDesc,
    copyrightText: content.copyrightText,
    footerLinks: Array.isArray(content.footerLinks) ? content.footerLinks : defaultFooterData.footerLinks,
  } : defaultFooterData;

  const finalData = {
    ...footerData,
    logoUrl: storeSettings?.logoUrl,
    storeName: storeSettings?.storeName,
    footerLinks: (footerData.footerLinks as any[]).map(section => ({
      title: section.title || "",
      links: Array.isArray(section.links) ? section.links.map((l: any) => ({
        name: l.name || "",
        href: l.href || "#"
      })) : []
    }))
  };

  return <FooterClient data={finalData} />;
};

export default Footer;
