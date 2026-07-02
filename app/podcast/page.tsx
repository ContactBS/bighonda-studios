import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { absoluteUrl, podcast } from "@/lib/content";
import { getPodcastEpisodes } from "@/lib/podcast-rss";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Listen to Be Ye Transformed, short sermons from Saul Loubassa Bighonda for the renewing of the mind."
};

export default async function PodcastPage() {
  const episodes = await getPodcastEpisodes();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: podcast.name,
    url: podcast.url,
    description: podcast.description,
    image: absoluteUrl(podcast.coverImage)
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-sm bg-ink/5 shadow-soft">
            <Image alt={`${podcast.name} podcast cover`} className="object-cover" fill priority sizes="(min-width: 1024px) 42vw, 90vw" src={podcast.coverImage} />
          </div>
          <div>
            <SectionHeader eyebrow="Podcast" title={podcast.name} description={podcast.description} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={podcast.url}>Listen to Be Ye Transformed</ButtonLink>
              <ButtonLink href="/teaching-events" variant="secondary">Invite Saul to Teach</ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {podcast.listenLinks.map((link) => (
                <ButtonLink href={link.url} key={link.label} variant="ghost">
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap">
          <SectionHeader eyebrow="Latest Episodes" title="Short sermons for renewal and resistance to conformity." description="Episodes are fetched from the Be Ye Transformed RSS feed during static generation, with local fallback content if the feed is unavailable." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {episodes.map((episode) => (
              <a className="border border-ink/10 bg-paper p-6 shadow-soft transition hover:-translate-y-1 hover:border-bronze" href={episode.url} key={episode.title} rel="noreferrer" target="_blank">
                <p className="eyebrow">{episode.date}</p>
                <h2 className="mt-3 font-serif text-3xl text-ink">{episode.title}</h2>
                <p className="mt-4 leading-7 text-ink/68">{episode.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="content-wrap grid gap-6 border-y border-ink/10 py-12 md:grid-cols-3">
          <ButtonLink href="/teaching-events">Book Saul for a Sermon or Workshop</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Suggest a Conversation Topic</ButtonLink>
          <ButtonLink href={podcast.url} variant="secondary">Open Transistor Page</ButtonLink>
        </div>
      </section>
    </>
  );
}
