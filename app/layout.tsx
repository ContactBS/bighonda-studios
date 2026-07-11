import type { Metadata } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { normalizeLocale } from "@/lib/i18n-config";
import { absoluteUrl, site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: `${site.brandName} | ${site.ownerName}`,
    template: `%s | ${site.brandName}`
  },
  description: site.seoDescription,
  openGraph: {
    title: `${site.brandName} | ${site.ownerName}`,
    description: site.seoDescription,
    url: absoluteUrl(),
    siteName: site.brandName,
    images: [
      {
        url: site.heroImage,
        width: 1200,
        height: 630,
        alt: `${site.brandName} editorial studio image`
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brandName} | ${site.ownerName}`,
    description: site.seoDescription,
    images: [site.heroImage]
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale?: string;
  }>;
}>;

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const locale = normalizeLocale((await params).locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${absoluteUrl()}/#person`,
        name: site.ownerName,
        url: absoluteUrl(),
        jobTitle: "Writer, podcaster, photographer, songwriter, music producer, teacher, and speaker",
        image: absoluteUrl(site.portraitImage),
        sameAs: site.socialLinks.map((link) => link.url)
      },
      {
        "@type": "Organization",
        "@id": `${absoluteUrl()}/#organization`,
        name: site.brandName,
        url: absoluteUrl(),
        founder: {
          "@id": `${absoluteUrl()}/#person`
        }
      }
    ]
  };

  return (
    <html lang={locale}>
      <body>
        <JsonLd data={structuredData} />
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
        <CookieConsent />
      </body>
    </html>
  );
}
