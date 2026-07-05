import booksData from "@/content/books.json";
import faqsData from "@/content/faqs.json";
import musicData from "@/content/music.json";
import photosData from "@/content/photos.json";
import podcastData from "@/content/podcast.json";
import servicesData from "@/content/services.json";
import siteData from "@/content/site.json";
import testimonialsData from "@/content/testimonials.json";
import videosData from "@/content/videos.json";
import type { Book, Faq, MusicContent, MusicRelease, Photo, Service, TeachingVideo, Testimonial } from "./types";

function normalizeTeachingVideo(video: TeachingVideo): TeachingVideo {
  return {
    ...video,
    videoUrl: video.externalVideoUrl || video.videoUrl,
    tags: video.tags || []
  };
}

export const site = siteData;
export const podcast = podcastData;
export const books = (booksData as Book[]).sort((a, b) => a.displayOrder - b.displayOrder);
export const music = musicData as MusicContent;
export const photos = photosData as Photo[];
export const teachingVideos = (videosData as TeachingVideo[]).map(normalizeTeachingVideo).filter((video) => video.visibility !== "hidden");
export const services = servicesData as Service[];
export const testimonials = testimonialsData as Testimonial[];
export const faqs = faqsData as Faq[];

export function getFeaturedBook() {
  return books.find((book) => book.featured) ?? books[0];
}

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function getFeaturedPhotos(limit = 3) {
  return photos.filter((photo) => photo.featured).slice(0, limit);
}

export function getRecentMusicReleases(limit = 5): MusicRelease[] {
  return [...music.releases]
    .sort((a, b) => {
      if (a.releaseDate && b.releaseDate && a.releaseDate !== b.releaseDate) {
        return b.releaseDate.localeCompare(a.releaseDate);
      }
      return a.order - b.order;
    })
    .slice(0, limit);
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://bighondastudios.com";
}

export function getContactEmail() {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;
}

export function getBookingUrl() {
  return process.env.NEXT_PUBLIC_BOOKING_URL || site.bookingUrl;
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMailto(subject: string) {
  const email = getContactEmail();
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
