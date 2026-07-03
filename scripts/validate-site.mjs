import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "content/site.json",
  "content/books.json",
  "content/podcast.json",
  "content/photos.json",
  "content/videos.json",
  "content/services.json",
  "content/testimonials.json",
  "content/faqs.json",
  "EDITING_GUIDE.md",
  "MEDIA_UPLOAD_GUIDE.md",
  "CMS_SETUP_GUIDE.md",
  "DEPLOYMENT_GUIDE.md",
  "DOMAIN_SETUP.md",
  "README.md",
  ".env.local.example"
];

function readJson(file) {
  return JSON.parse(readFileSync(join(root, file), "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of requiredFiles) {
  assert(existsSync(join(root, file)), `Missing required file: ${file}`);
}

const site = readJson("content/site.json");
const books = readJson("content/books.json");
const podcast = readJson("content/podcast.json");
const photos = readJson("content/photos.json");
const videos = readJson("content/videos.json");
const services = readJson("content/services.json");
const forbiddenImagePathPattern = /(iclound|icloud|iCloud Drive|\/Users\/|Documents\/Codex|Screenshot 2026)/i;

assert(site.brandName === "Bighonda Studios", "site.brandName should be Bighonda Studios");
assert(site.ownerName === "Saul Loubassa Bighonda", "site.ownerName should be Saul Loubassa Bighonda");
assert(Array.isArray(books) && books.length >= 2, "content/books.json needs at least two books");
assert(Array.isArray(photos) && photos.length >= 1, "content/photos.json needs photo entries");
assert(Array.isArray(videos) && videos.length >= 1, "content/videos.json needs video entries");
assert(Array.isArray(services) && services.length >= 1, "content/services.json needs service entries");
assert(podcast.name === "Be Ye Transformed", "Podcast name should be Be Ye Transformed");

const slugs = new Set();
for (const book of books) {
  assert(!forbiddenImagePathPattern.test(book.coverImage), `Book uses a local or unsafe image path: ${book.coverImage}`);
  assert(book.coverImage.startsWith("/images/"), `Book cover must use a public /images path: ${book.coverImage}`);
  assert(book.slug && !slugs.has(book.slug), `Duplicate or missing book slug: ${book.slug}`);
  slugs.add(book.slug);
  assert(book.title && book.description && book.coverImage, `Book is missing required fields: ${book.slug}`);
  assert(existsSync(join(root, "public", book.coverImage.replace(/^\//, ""))), `Missing book cover image: ${book.coverImage}`);
}

for (const photo of photos) {
  assert(!forbiddenImagePathPattern.test(photo.image), `Photo uses a local or unsafe image path: ${photo.image}`);
  assert(photo.image.startsWith("/images/"), `Photo must use a public /images path: ${photo.image}`);
  assert(photo.slug && photo.title && photo.image && photo.alt, `Photo is missing required fields: ${photo.slug || photo.title}`);
  assert(existsSync(join(root, "public", photo.image.replace(/^\//, ""))), `Missing photo image: ${photo.image}`);
}

for (const video of videos) {
  assert(video.slug && video.title && video.videoUrl, `Video is missing required fields: ${video.slug || video.title}`);
  assert(!forbiddenImagePathPattern.test(video.videoUrl), `Video uses a local or unsafe path: ${video.videoUrl}`);
  if (video.videoUrl.startsWith("/")) {
    assert(video.videoUrl.startsWith("/videos/") || video.videoUrl.startsWith("/uploads/videos/"), `Local video must use /videos or /uploads/videos path: ${video.videoUrl}`);
    assert(existsSync(join(root, "public", video.videoUrl.replace(/^\//, ""))), `Missing local video: ${video.videoUrl}`);
  }
  if (video.thumbnailUrl) {
    assert(!forbiddenImagePathPattern.test(video.thumbnailUrl), `Video thumbnail uses a local or unsafe path: ${video.thumbnailUrl}`);
    assert(video.thumbnailUrl.startsWith("/images/") || video.thumbnailUrl.startsWith("/uploads/"), `Video thumbnail must use a public image path: ${video.thumbnailUrl}`);
    assert(existsSync(join(root, "public", video.thumbnailUrl.replace(/^\//, ""))), `Missing video thumbnail: ${video.thumbnailUrl}`);
  }
}

for (const [label, imagePath] of [
  ["hero image", site.heroImage],
  ["portrait image", site.portraitImage],
  ["podcast cover image", podcast.coverImage]
]) {
  assert(!forbiddenImagePathPattern.test(imagePath), `${label} uses a local or unsafe image path: ${imagePath}`);
  assert(imagePath.startsWith("/images/"), `${label} must use a public /images path: ${imagePath}`);
  assert(existsSync(join(root, "public", imagePath.replace(/^\//, ""))), `Missing ${label}: ${imagePath}`);
}

console.log("Site content validation passed.");
