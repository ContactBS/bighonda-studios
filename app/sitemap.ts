import type { MetadataRoute } from "next";
import { absoluteUrl, books } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/books", "/podcast", "/music-by-saul", "/photography", "/teaching-videos", "/teaching-events", "/about", "/contact"];
  return [
    ...routes.map((route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: new Date()
    })),
    ...books.map((book) => ({
      url: absoluteUrl(`/books/${book.slug}`),
      lastModified: new Date()
    }))
  ];
}
