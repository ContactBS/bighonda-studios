import { podcast } from "./content";
import type { Episode } from "./types";

const RSS_FEED_URL = "https://feeds.transistor.fm/be-ye-transformed";
const RSS_TIMEOUT_MS = 7000;

let episodePromise: Promise<Episode[]> | null = null;

export function getPodcastEpisodes() {
  episodePromise ??= getPodcastEpisodesFromRss();
  return episodePromise;
}

async function getPodcastEpisodesFromRss() {
  try {
    const episodes = await fetchPodcastEpisodes();
    return episodes.length ? episodes : podcast.episodes;
  } catch (error) {
    console.warn(`Podcast RSS fetch failed; using local fallback episodes. ${getErrorMessage(error)}`);
    return podcast.episodes;
  }
}

async function fetchPodcastEpisodes() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RSS_TIMEOUT_MS);

  try {
    const response = await fetch(RSS_FEED_URL, {
      cache: "force-cache",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`);
    }

    return parsePodcastRss(await response.text());
  } finally {
    clearTimeout(timeout);
  }
}

function parsePodcastRss(xml: string): Episode[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return items
    .map((item) => {
      const title = cleanText(readTag(item, "title"));
      const url = cleanText(readTag(item, "link"));
      const date = formatEpisodeDate(cleanText(readTag(item, "pubDate")));
      const description = cleanText(readTag(item, "itunes:summary") || readTag(item, "description") || readTag(item, "content:encoded"));
      const audioUrl = readAttribute(item, "enclosure", "url");

      if (!title || !url) return null;

      return {
        title,
        date,
        description,
        url,
        ...(audioUrl ? { audioUrl } : {})
      };
    })
    .filter((episode): episode is Episode => Boolean(episode));
}

function readTag(xml: string, tagName: string) {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escapedTag}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, "i"));
  return match?.[1] ?? "";
}

function readAttribute(xml: string, tagName: string, attributeName: string) {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedAttribute = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escapedTag}\\b[^>]*\\s${escapedAttribute}=["']([^"']+)["'][^>]*>`, "i"));
  return match?.[1] ? decodeEntities(match[1]) : "";
}

function cleanText(value: string) {
  return decodeEntities(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function formatEpisodeDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
