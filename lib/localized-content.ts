import booksData from "@/content/books.json";
import faqsData from "@/content/faqs.json";
import frData from "@/content/locales/fr/content.json";
import svData from "@/content/locales/sv/content.json";
import musicData from "@/content/music.json";
import photosData from "@/content/photos.json";
import podcastData from "@/content/podcast.json";
import servicesData from "@/content/services.json";
import siteData from "@/content/site.json";
import testimonialsData from "@/content/testimonials.json";
import videosData from "@/content/videos.json";
import { defaultLocale, type Locale } from "./i18n-config";
import type { Book, Faq, MusicContent, MusicRelease, Photo, Service, TeachingVideo, Testimonial } from "./types";

type SiteContent = typeof siteData;
type PodcastContent = typeof podcastData;
type LocaleOverlay = Partial<{
  site: Partial<SiteContent>;
  books: Partial<Book>[];
  podcast: Partial<PodcastContent>;
  music: Partial<MusicContent> & { releases?: Partial<MusicRelease>[] };
  photos: Partial<Photo>[];
  services: Partial<Service>[];
  videos: Partial<TeachingVideo>[];
  faqs: Partial<Faq>[];
  testimonials: Partial<Testimonial>[];
}>;

const localeOverlays: Record<Exclude<Locale, "en">, LocaleOverlay> = {
  fr: frData as LocaleOverlay,
  sv: svData as LocaleOverlay
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeObject<T>(base: T, overlay: unknown): T {
  if (!isRecord(base) || !isRecord(overlay)) return (overlay ?? base) as T;

  const merged: Record<string, unknown> = { ...base };
  Object.entries(overlay).forEach(([key, value]) => {
    const baseValue = (base as Record<string, unknown>)[key];
    if (Array.isArray(baseValue) && Array.isArray(value)) {
      merged[key] = value;
    } else if (isRecord(baseValue) && isRecord(value)) {
      merged[key] = mergeObject(baseValue, value);
    } else if (value !== undefined) {
      merged[key] = value;
    }
  });
  return merged as T;
}

function mergeByKey<T extends Record<string, unknown>>(base: T[], overlay: Partial<T>[] | undefined, key: keyof T): T[] {
  if (!overlay?.length) return base;
  return base.map((item, index) => {
    const match = overlay.find((entry) => entry[key] === item[key]) ?? overlay[index];
    return match ? mergeObject(item, match) : item;
  });
}

function normalizeTeachingVideo(video: TeachingVideo): TeachingVideo {
  return {
    ...video,
    videoUrl: video.externalVideoUrl || video.videoUrl,
    tags: video.tags || []
  };
}

export function getLocalizedContent(locale: Locale = defaultLocale) {
  const overlay: LocaleOverlay = locale === defaultLocale ? {} : localeOverlays[locale as Exclude<Locale, "en">];
  const site = mergeObject(siteData, overlay.site);
  const podcast = mergeObject(podcastData, overlay.podcast);
  const books = mergeByKey(booksData as Book[], overlay.books, "slug").sort((a, b) => a.displayOrder - b.displayOrder);
  const musicBase = mergeObject(musicData as MusicContent, overlay.music);
  const music = {
    ...musicBase,
    releases: mergeByKey(musicData.releases as MusicRelease[], overlay.music?.releases, "title")
  };
  const photos = mergeByKey(photosData as Photo[], overlay.photos, "slug");
  const teachingVideos = mergeByKey(videosData as TeachingVideo[], overlay.videos, "slug")
    .map(normalizeTeachingVideo)
    .filter((video) => video.visibility !== "hidden");
  const services = mergeByKey(servicesData as Service[], overlay.services, "title");
  const testimonials = mergeByKey(testimonialsData as Testimonial[], overlay.testimonials, "quote");
  const faqs = mergeByKey(faqsData as Faq[], overlay.faqs, "question");

  return {
    site,
    podcast,
    books,
    music,
    photos,
    teachingVideos,
    services,
    testimonials,
    faqs
  };
}

export function getLocalizedFeaturedBook(locale: Locale) {
  const { books } = getLocalizedContent(locale);
  return books.find((book) => book.featured) ?? books[0];
}

export function getLocalizedBookBySlug(locale: Locale, slug: string) {
  return getLocalizedContent(locale).books.find((book) => book.slug === slug);
}

export function getLocalizedFeaturedPhotos(locale: Locale, limit = 3) {
  return getLocalizedContent(locale).photos.filter((photo) => photo.featured).slice(0, limit);
}

export function getLocalizedRecentMusicReleases(locale: Locale, limit = 5): MusicRelease[] {
  return [...getLocalizedContent(locale).music.releases]
    .sort((a, b) => {
      const aTime = Date.parse(a.releaseDate);
      const bTime = Date.parse(b.releaseDate);
      if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
        return bTime - aTime;
      }
      return a.order - b.order;
    })
    .slice(0, limit);
}
