import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${absoluteUrl()}/#person`,
        name: site.ownerName,
        url: absoluteUrl(),
        jobTitle: "Writer, podcaster, photographer, teacher, and speaker",
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
    <html lang="en">
      <body>
        <JsonLd data={structuredData} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
