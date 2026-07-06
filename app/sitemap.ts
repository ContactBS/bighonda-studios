import type { MetadataRoute } from "next";
import { absoluteUrl, books } from "@/lib/content";
import { localizedPath, localizedRoutes, type Locale } from "@/lib/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = localizedRoutes.map((route) => (route === "/" ? "" : route));
  const translatedLocales: Locale[] = ["fr", "sv"];
  const bookRoutes = books.map((book) => `/books/${book.slug}`);

  return [
    ...routes.map((route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: new Date()
    })),
    ...books.map((book) => ({
      url: absoluteUrl(`/books/${book.slug}`),
      lastModified: new Date()
    })),
    ...translatedLocales.flatMap((locale) => [
      ...localizedRoutes.map((route) => ({
        url: absoluteUrl(localizedPath(route, locale)),
        lastModified: new Date()
      })),
      ...bookRoutes.map((route) => ({
        url: absoluteUrl(localizedPath(route, locale)),
        lastModified: new Date()
      }))
    ])
  ];
}
