import booksData from "@/content/books.json";
import faqsData from "@/content/faqs.json";
import photosData from "@/content/photos.json";
import podcastData from "@/content/podcast.json";
import servicesData from "@/content/services.json";
import siteData from "@/content/site.json";
import testimonialsData from "@/content/testimonials.json";
import type { Book, Faq, Photo, Service, Testimonial } from "./types";

export const site = siteData;
export const podcast = podcastData;
export const books = (booksData as Book[]).sort((a, b) => a.displayOrder - b.displayOrder);
export const photos = photosData as Photo[];
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
