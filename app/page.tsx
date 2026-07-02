import Image from "next/image";
import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeader } from "@/components/SectionHeader";
import { books, getFeaturedBook, getFeaturedPhotos, podcast, services, site } from "@/lib/content";
import { getPodcastEpisodes } from "@/lib/podcast-rss";

export default async function HomePage() {
  const featuredBook = getFeaturedBook();
  const secondaryBook = books.find((book) => book.slug === "dear-son-welcome-to-life");
  const featuredPhotos = getFeaturedPhotos(3);
  const podcastEpisodes = await getPodcastEpisodes();

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0">
          <Image alt={`${site.brandName} visual atmosphere`} className="object-cover opacity-42 mix-blend-screen" fill priority sizes="100vw" src={site.heroImage} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/86 to-ink/42" />
        </div>
        <div className="content-wrap relative grid min-h-[82vh] items-end px-5 pb-16 pt-24 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-4xl">
            <p className="eyebrow text-bronze">{site.brandName}</p>
            <p className="mt-5 text-bone/72">{site.ownerName} / Writer, podcaster, photographer, teacher, speaker</p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] md:text-7xl lg:text-8xl">{site.tagline}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-bone/78">{site.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/books" variant="secondary">Explore Books</ButtonLink>
              <ButtonLink href="/podcast" variant="secondary">Listen to Podcast</ButtonLink>
              <ButtonLink href="/teaching-events">Book Saul</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="content-wrap">
          <SectionHeader eyebrow={site.home.featuredBookEyebrow} title={featuredBook.title} description={featuredBook.subtitle} />
          <div className="mt-10">
            <BookCard book={featuredBook} featured />
          </div>
        </div>
      </section>

      {secondaryBook ? (
        <section className="section-pad bg-bone">
          <div className="content-wrap">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <SectionHeader eyebrow="Also published" title={secondaryBook.title} description={secondaryBook.description} />
              <BookCard book={secondaryBook} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionHeader eyebrow="Podcast" title={podcast.name} description={podcast.description} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={podcast.url}>Listen to {podcast.name}</ButtonLink>
              <ButtonLink href="/podcast" variant="secondary">View Episodes</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {podcastEpisodes.slice(0, 3).map((episode) => (
              <a className="border border-ink/10 bg-bone p-5 shadow-soft transition hover:-translate-y-1 hover:border-bronze" href={episode.url} key={episode.title} rel="noreferrer" target="_blank">
                <p className="eyebrow">{episode.date}</p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{episode.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/68">{episode.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-ink text-bone">
        <div className="content-wrap">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-bronze">Photography</p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">A purchasable gallery for quiet, attentive images.</h2>
              <p className="mt-5 max-w-2xl leading-8 text-bone/72">{site.home.photographyIntro}</p>
            </div>
            <ButtonLink href="/photography" variant="secondary">View Gallery</ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredPhotos.map((photo) => (
              <Link className="group" href="/photography" key={photo.slug}>
                <span className="relative block aspect-[4/5] overflow-hidden bg-bone/5">
                  <Image alt={photo.alt} className="object-cover transition duration-500 group-hover:scale-105" fill sizes="(min-width: 768px) 33vw, 100vw" src={photo.image} />
                </span>
                <span className="mt-4 block font-serif text-2xl">{photo.title}</span>
                <span className="mt-1 block text-sm text-bone/60">{photo.availability} / {photo.price || "Inquire"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeader eyebrow="Teaching & Events" title="Book Saul for thoughtful rooms." description={site.home.eventsIntro} />
            <div className="mt-8">
              <ButtonLink href="/teaching-events">Book Saul</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.slice(0, 4).map((service) => (
              <article className="border border-ink/10 bg-bone p-5 shadow-soft" key={service.title}>
                <h3 className="font-serif text-2xl text-ink">{service.title}</h3>
                <p className="mt-3 leading-7 text-ink/68">{service.shortDescription}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-bone">
        <div className="content-wrap border-y border-ink/10 py-12 text-center">
          <p className="eyebrow">Newsletter / Contact</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{site.newsletter.headline}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-ink/70">{site.newsletter.description}</p>
          <div className="mt-8">
            <ButtonLink href={site.newsletter.url}>{site.newsletter.buttonLabel}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
