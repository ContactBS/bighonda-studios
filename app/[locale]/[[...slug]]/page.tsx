import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { ButtonLink } from "@/components/ButtonLink";
import { ConsentEmbed } from "@/components/ConsentEmbed";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { LegalNotice } from "@/components/LegalNotice";
import { LegalPolicyPage } from "@/components/LegalPolicyPage";
import { PhotoGallery } from "@/components/PhotoGallery";
import { SectionHeader } from "@/components/SectionHeader";
import { absoluteUrl, getBookingUrl, getContactEmail } from "@/lib/content";
import { defaultLocale, isLocale, localeOg, localizedInternalHref, localizedPath, localizedRoutes, type Locale, ui } from "@/lib/i18n-config";
import { acceptsDirectPayments, getLegalPolicy, getRetailerLabel, type LegalPolicyKey } from "@/lib/legal";
import { getLocalizedBookBySlug, getLocalizedContent, getLocalizedFeaturedBook, getLocalizedFeaturedPhotos, getLocalizedRecentMusicReleases } from "@/lib/localized-content";
import type { MusicRelease, TeachingVideo } from "@/lib/types";

type LocalizedPageProps = {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
};

const localizedBaseRoutes = localizedRoutes.filter((route) => route !== "/");

export function generateStaticParams() {
  const locales: Locale[] = ["fr", "sv"];
  const englishBooks = getLocalizedContent(defaultLocale).books;

  return locales.flatMap((locale) => [
    { locale, slug: [] },
    ...localizedBaseRoutes.map((route) => ({ locale, slug: route.split("/").filter(Boolean) })),
    ...englishBooks.map((book) => ({ locale, slug: ["books", book.slug] }))
  ]);
}

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  if (!isLocalizedLocale(locale)) return {};

  const path = `/${slug.join("/")}`.replace(/\/$/, "") || "/";
  const content = getLocalizedContent(locale);
  const labels = ui[locale];
  const alternates = {
    canonical: absoluteUrl(localizedPath(path, locale)),
    languages: {
      en: absoluteUrl(path),
      fr: absoluteUrl(localizedPath(path, "fr")),
      sv: absoluteUrl(localizedPath(path, "sv"))
    }
  };

  if (slug[0] === "books" && slug[1]) {
    const book = getLocalizedBookBySlug(locale, slug[1]);
    if (!book) return {};
    return {
      title: book.title,
      description: book.description,
      alternates,
      openGraph: {
        title: book.title,
        description: book.description,
        images: [book.coverImage],
        locale: localeOg[locale],
        type: "book"
      }
    };
  }

  if (isLegalRoute(path)) {
    const policy = getLegalPolicy(path.slice(1) as LegalPolicyKey, locale);
    return {
      title: policy.title,
      description: policy.description,
      alternates,
      openGraph: {
        title: policy.title,
        description: policy.description,
        images: [content.site.heroImage],
        locale: localeOg[locale],
        type: "website"
      }
    };
  }

  const metadataByRoute: Record<string, Metadata> = {
    "/": {
      title: `${content.site.brandName} | ${content.site.ownerName}`,
      description: content.site.seoDescription
    },
    "/about": {
      title: labels.nav.about,
      description: content.site.aboutBio
    },
    "/books": {
      title: labels.nav.books,
      description: labels.pages.booksDescription
    },
    "/podcast": {
      title: labels.nav.podcast,
      description: content.podcast.description
    },
    "/photography": {
      title: labels.nav.photography,
      description: labels.pages.photographyDescription
    },
    "/teaching-events": {
      title: labels.nav.events,
      description: labels.pages.teachingEventsDescription
    },
    "/teaching-videos": {
      title: labels.nav.videos,
      description: labels.pages.teachingVideosDescription
    },
    "/music-by-saul": {
      title: labels.nav.music,
      description: content.music.intro
    },
    "/contact": {
      title: labels.nav.contact,
      description: labels.pages.contactDescription
    }
  };

  const metadata = metadataByRoute[path] ?? metadataByRoute["/"];
  return {
    ...metadata,
    alternates,
    openGraph: {
      title: String(metadata.title ?? content.site.brandName),
      description: metadata.description ?? content.site.seoDescription,
      images: [content.site.heroImage],
      locale: localeOg[locale],
      type: "website"
    }
  };
}

export default async function LocalizedPage({ params }: LocalizedPageProps) {
  const { locale: rawLocale, slug = [] } = await params;
  if (rawLocale === defaultLocale) redirect(`/${slug.join("/")}`);
  if (!isLocalizedLocale(rawLocale)) notFound();

  const locale = rawLocale;
  if (slug.length === 0) return <HomePage locale={locale} />;
  if (slug.length === 1 && slug[0] === "about") return <AboutPage locale={locale} />;
  if (slug.length === 1 && slug[0] === "books") return <BooksPage locale={locale} />;
  if (slug.length === 2 && slug[0] === "books") return <BookDetailPage locale={locale} slug={slug[1]} />;
  if (slug.length === 1 && slug[0] === "podcast") return <PodcastPage locale={locale} />;
  if (slug.length === 1 && slug[0] === "photography") return <PhotographyPage locale={locale} />;
  if (slug.length === 1 && slug[0] === "teaching-events") return <TeachingEventsPage locale={locale} />;
  if (slug.length === 1 && slug[0] === "teaching-videos") return <TeachingVideosPage locale={locale} />;
  if (slug.length === 1 && slug[0] === "music-by-saul") return <MusicBySaulPage locale={locale} />;
  if (slug.length === 1 && slug[0] === "contact") return <ContactPage locale={locale} />;
  if (slug.length === 1 && isLegalKey(slug[0])) return <LegalPolicyPage locale={locale} policyKey={slug[0]} />;
  notFound();
}

function isLocalizedLocale(locale: string): locale is Exclude<Locale, "en"> {
  return isLocale(locale) && locale !== defaultLocale;
}

function isLegalKey(value: string): value is LegalPolicyKey {
  return value === "terms" || value === "privacy" || value === "cookies" || value === "ai-transparency";
}

function isLegalRoute(path: string): boolean {
  return isLegalKey(path.replace(/^\//, ""));
}

function HomePage({ locale }: { locale: Locale }) {
  const content = getLocalizedContent(locale);
  const featuredBook = getLocalizedFeaturedBook(locale);
  const secondaryBook = content.books.find((book) => book.slug === "dear-son-welcome-to-life");
  const featuredPhotos = getLocalizedFeaturedPhotos(locale, 3);
  const labels = ui[locale];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0">
          <Image alt={`${content.site.brandName} visual atmosphere`} className="object-cover opacity-42 mix-blend-screen" fill priority sizes="100vw" src={content.site.heroImage} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/86 to-ink/42" />
        </div>
        <div className="content-wrap relative grid min-h-[82vh] items-end px-5 pb-16 pt-24 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-4xl">
            <p className="eyebrow text-bronze">{content.site.brandName}</p>
            <p className="mt-5 text-bone/72">{content.site.ownerName} / {labels.pages.homeRole}</p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] md:text-7xl lg:text-8xl">{content.site.tagline}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-bone/78">{content.site.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/books" locale={locale} variant="secondary">{labels.buttons.exploreBooks}</ButtonLink>
              <ButtonLink href="/podcast" locale={locale} variant="secondary">{labels.buttons.listenPodcast}</ButtonLink>
              <ButtonLink href="/music-by-saul" locale={locale} variant="secondary">{labels.buttons.musicBySaul}</ButtonLink>
              <ButtonLink href="/teaching-events" locale={locale}>{labels.buttons.bookSaul}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="content-wrap">
          <SectionHeader eyebrow={content.site.home.featuredBookEyebrow} title={featuredBook.title} description={featuredBook.subtitle} />
          <div className="mt-10">
            <BookCard book={featuredBook} featured locale={locale} />
          </div>
        </div>
      </section>

      {secondaryBook ? (
        <section className="section-pad bg-bone">
          <div className="content-wrap">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <SectionHeader eyebrow={labels.common.alsoPublished} title={secondaryBook.title} description={secondaryBook.description} />
              <BookCard book={secondaryBook} locale={locale} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionHeader eyebrow={labels.common.podcast} title={content.podcast.name} description={content.podcast.description} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={content.podcast.url} locale={locale}>{labels.buttons.listenPodcast}</ButtonLink>
              <ButtonLink href="/podcast" locale={locale} variant="secondary">{labels.buttons.viewEpisodes}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {content.podcast.episodes.slice(0, 3).map((episode) => (
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
        <div className="content-wrap border-b border-bone/10 pb-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-bronze">{labels.nav.music}</p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">{labels.pages.musicTitle}</h2>
              <p className="mt-5 max-w-2xl leading-8 text-bone/72">{content.site.home.musicIntro}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/music-by-saul" locale={locale} variant="secondary">{labels.buttons.exploreMusic}</ButtonLink>
              <ButtonLink href={content.music.spotifyArtistUrl} locale={locale} variant="secondary">Spotify</ButtonLink>
            </div>
          </div>
        </div>
        <div className="content-wrap">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-bronze">{labels.nav.photography}</p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">{labels.pages.photoTitle}</h2>
              <p className="mt-5 max-w-2xl leading-8 text-bone/72">{content.site.home.photographyIntro}</p>
            </div>
            <ButtonLink href="/photography" locale={locale} variant="secondary">{labels.buttons.viewGallery}</ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredPhotos.map((photo) => (
              <Link className="group" href={localizedInternalHref("/photography", locale)} key={photo.slug}>
                <span className="relative block aspect-[4/5] overflow-hidden bg-bone/5">
                  <Image alt={photo.alt} className="object-cover transition duration-500 group-hover:scale-105" fill sizes="(min-width: 768px) 33vw, 100vw" src={photo.image} />
                </span>
                <span className="mt-4 block font-serif text-2xl">{photo.title}</span>
                <span className="mt-1 block text-sm text-bone/60">{photo.availability} / {photo.price || labels.photoGallery.inquire}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeader eyebrow={labels.common.events} title={labels.pages.eventsTitle} description={content.site.home.eventsIntro} />
            <div className="mt-8">
              <ButtonLink href="/teaching-events" locale={locale}>{labels.buttons.bookSaul}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.services.slice(0, 4).map((service) => (
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
          <p className="eyebrow">{labels.common.newsletter}</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{content.site.newsletter.headline}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-ink/70">{content.site.newsletter.description}</p>
          <div className="mt-8">
            <ButtonLink href={content.site.newsletter.url} locale={locale}>{content.site.newsletter.buttonLabel}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage({ locale }: { locale: Locale }) {
  const { site } = getLocalizedContent(locale);
  const labels = ui[locale];

  return (
    <>
      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink/5 shadow-soft">
            <Image alt={`Portrait of ${site.ownerName}`} className="object-cover" fill priority sizes="(min-width: 1024px) 42vw, 90vw" src={site.portraitImage} unoptimized />
          </div>
          <div>
            <SectionHeader eyebrow={labels.nav.about} title={site.ownerName} description={site.aboutBio} />
            <p className="mt-8 border-l-4 border-bronze pl-5 text-xl leading-9 text-ink/75">{site.mission}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" locale={locale}>{labels.buttons.contactSaul}</ButtonLink>
              <ButtonLink href="/teaching-events" locale={locale} variant="secondary">{labels.buttons.bookSaul}</ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap">
          <SectionHeader eyebrow={labels.common.creativePillars} title={labels.pages.aboutPillarsTitle} />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {site.creativePillars.map((pillar) => (
              <article className="border border-ink/10 bg-paper p-5 shadow-soft" key={pillar.title}>
                <h2 className="font-serif text-3xl text-ink">{pillar.title}</h2>
                <p className="mt-4 leading-7 text-ink/68">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function BooksPage({ locale }: { locale: Locale }) {
  const { books } = getLocalizedContent(locale);
  const labels = ui[locale];
  const published = books.filter((book) => book.status === "Published" || book.status === "Publié" || book.status === "Publicerad");
  const upcoming = books.filter((book) => !published.includes(book));

  return (
    <section className="section-pad">
      <div className="content-wrap">
        <SectionHeader eyebrow={labels.nav.books} title={labels.pages.booksTitle} description={labels.pages.booksDescription} />
        <div className="mt-12 grid gap-7">
          {published.map((book) => (
            <BookCard book={book} featured={book.featured} key={book.slug} locale={locale} />
          ))}
        </div>
        <div className="mt-20">
          <SectionHeader eyebrow={labels.common.upcomingBooks} title={labels.pages.upcomingBooksTitle} description={labels.pages.upcomingBooksDescription} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {upcoming.map((book) => (
              <BookCard book={book} key={book.slug} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BookDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const labels = ui[locale];
  const book = getLocalizedBookBySlug(locale, slug);
  if (!book) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author
    },
    datePublished: book.year,
    image: absoluteUrl(book.coverImage),
    description: book.description,
    url: absoluteUrl(localizedInternalHref(`/books/${book.slug}`, locale)),
    offers: book.purchaseLinks.map((link) => ({
      "@type": "Offer",
      url: link.url,
      availability: "https://schema.org/InStock"
    }))
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="sticky top-28">
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-ink/5 shadow-soft">
              <Image alt={`${book.title} book cover`} className="object-cover" fill priority sizes="(min-width: 1024px) 38vw, 90vw" src={book.coverImage} unoptimized />
            </div>
          </div>
          <div>
            <p className="eyebrow">{book.status} / {book.year} / {book.genre}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-ink md:text-7xl">{book.title}</h1>
            <p className="mt-4 text-2xl leading-9 text-clay">{book.subtitle}</p>
            <p className="mt-8 text-lg leading-9 text-ink/72">{book.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {book.purchaseLinks.length ? (
                book.purchaseLinks.map((link) => (
                  <ButtonLink href={link.url} key={link.label} locale={locale}>
                    {getRetailerLabel(link.label)}
                  </ButtonLink>
                ))
              ) : (
                <ButtonLink href="/contact" locale={locale}>{labels.buttons.requestUpdates}</ButtonLink>
              )}
            </div>
            <dl className="mt-10 grid gap-4 border-y border-ink/10 py-8 sm:grid-cols-2">
              <div><dt className="eyebrow">{labels.common.author}</dt><dd className="mt-2 text-ink">{book.author}</dd></div>
              <div><dt className="eyebrow">{labels.common.format}</dt><dd className="mt-2 text-ink">{book.format}</dd></div>
              <div><dt className="eyebrow">{labels.common.topics}</dt><dd className="mt-2 text-ink">{book.topics.join(", ")}</dd></div>
              <div><dt className="eyebrow">{labels.common.status}</dt><dd className="mt-2 text-ink">{book.status}</dd></div>
            </dl>
            <blockquote className="mt-10 border-l-4 border-bronze bg-bone p-7 font-serif text-3xl leading-tight text-ink shadow-soft">
              {book.highlight}
            </blockquote>
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap grid gap-8 lg:grid-cols-3">
          <SectionHeader eyebrow={labels.common.inviteSaul} title={labels.pages.bookInviteTitle} description={labels.pages.bookInviteDescription} />
          <article className="border border-ink/10 bg-paper p-6">
            <h2 className="font-serif text-2xl text-ink">{labels.common.relatedPodcast}</h2>
            <p className="mt-4 leading-7 text-ink/68">{book.related?.podcast}</p>
          </article>
          <article className="border border-ink/10 bg-paper p-6">
            <h2 className="font-serif text-2xl text-ink">{labels.common.bookDetailsEvents}</h2>
            <p className="mt-4 leading-7 text-ink/68">{book.related?.events}</p>
            <div className="mt-6">
              <ButtonLink href="/teaching-events" locale={locale}>{labels.buttons.bookSaul}</ButtonLink>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function PodcastPage({ locale }: { locale: Locale }) {
  const { podcast } = getLocalizedContent(locale);
  const labels = ui[locale];
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
            <SectionHeader eyebrow={labels.nav.podcast} title={podcast.name} description={podcast.description} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={podcast.url} locale={locale}>{labels.buttons.listenPodcast}</ButtonLink>
              <ButtonLink href="/teaching-events" locale={locale} variant="secondary">{labels.buttons.inviteTeach}</ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {podcast.listenLinks.map((link) => (
                <ButtonLink href={link.url} key={link.label} locale={locale} variant="ghost">
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap">
          <SectionHeader eyebrow={labels.common.latestEpisodes} title={labels.pages.podcastEpisodesTitle} description={labels.pages.podcastEpisodesDescription} />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {podcast.episodes.map((episode) => (
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
          <ButtonLink href="/teaching-events" locale={locale}>{labels.buttons.bookSermon}</ButtonLink>
          <ButtonLink href="/contact" locale={locale} variant="secondary">{labels.buttons.suggestTopic}</ButtonLink>
          <ButtonLink href={podcast.url} locale={locale} variant="secondary">{labels.buttons.openTransistor}</ButtonLink>
        </div>
      </section>
    </>
  );
}

function PhotographyPage({ locale }: { locale: Locale }) {
  const { photos } = getLocalizedContent(locale);
  const labels = ui[locale];

  return (
    <section className="section-pad">
      <div className="content-wrap">
        <SectionHeader eyebrow={labels.nav.photography} title={labels.pages.photographyTitle} description={labels.pages.photographyDescription} />
        <div className="mt-6">
          <LegalNotice locale={locale} />
        </div>
        <div className="mt-10">
          <PhotoGallery locale={locale} photos={photos} />
        </div>
      </div>
    </section>
  );
}

function TeachingEventsPage({ locale }: { locale: Locale }) {
  const { faqs, services, testimonials } = getLocalizedContent(locale);
  const labels = ui[locale];
  const contactEmail = getContactEmail();
  const bookingUrl = acceptsDirectPayments() ? getBookingUrl() : "";

  return (
    <>
      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader eyebrow={labels.nav.events} title={labels.pages.teachingEventsTitle} description={labels.pages.teachingEventsDescription} />
            <div className="mt-6">
              <LegalNotice locale={locale} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {bookingUrl ? <ButtonLink href={bookingUrl} locale={locale}>{labels.buttons.bookTime}</ButtonLink> : null}
              <ButtonLink href={`mailto:${contactEmail}?subject=Booking%20inquiry`} locale={locale}>{labels.buttons.emailSaul}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <article className="border border-ink/10 bg-bone p-5 shadow-soft" key={service.title}>
                <p className="eyebrow">{service.format}</p>
                <h2 className="mt-3 font-serif text-2xl text-ink">{service.title}</h2>
                <p className="mt-3 leading-7 text-ink/68">{service.shortDescription}</p>
                <p className="mt-4 text-sm font-semibold text-ink">{labels.common.idealFor} {service.idealAudience}</p>
                <p className="mt-2 text-sm text-ink/65">{labels.common.duration} {service.duration}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.topics.slice(0, 4).map((topic) => (
                    <span className="rounded-sm bg-paper px-3 py-1 text-xs font-semibold text-ink/70" key={topic}>{topic}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader eyebrow={labels.common.bookingForm} title={labels.pages.bookingTitle} description={labels.pages.bookingDescription} />
            <div className="mt-8 grid gap-5">
              {testimonials.map((item) => (
                <blockquote className="border-l-4 border-bronze pl-5 leading-7 text-ink/72" key={item.quote}>
                  "{item.quote}"
                  <footer className="mt-2 text-sm font-semibold text-ink">{item.name}, {item.role}</footer>
                </blockquote>
              ))}
            </div>
          </div>
          <ContactForm bookingUrl={bookingUrl} contactEmail={contactEmail} locale={locale} mode="booking" subject="Booking inquiry for Saul Loubassa Bighonda" />
        </div>
      </section>
      <section className="section-pad">
        <div className="content-wrap">
          <SectionHeader eyebrow={labels.common.faq} title={labels.pages.faqTitle} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article className="border border-ink/10 bg-bone p-5" key={faq.question}>
                <h2 className="font-serif text-2xl text-ink">{faq.question}</h2>
                <p className="mt-3 leading-7 text-ink/68">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TeachingVideosPage({ locale }: { locale: Locale }) {
  const { teachingVideos } = getLocalizedContent(locale);
  const labels = ui[locale];
  const featuredVideos = teachingVideos.filter((video) => video.featured);
  const otherVideos = teachingVideos.filter((video) => !video.featured);

  return (
    <section className="section-pad">
      <div className="content-wrap">
        <SectionHeader eyebrow={labels.nav.videos} title={labels.pages.teachingVideosTitle} description={labels.pages.teachingVideosDescription} />
        <div className="mt-10 grid gap-7">
          {[...featuredVideos, ...otherVideos].map((video) => (
            <TeachingVideoCard key={video.slug} locale={locale} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeachingVideoCard({ locale, video }: { locale: Locale; video: TeachingVideo }) {
  return (
    <article className="grid gap-7 border border-ink/10 bg-bone p-5 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-7">
      <VideoEmbed locale={locale} video={video} />
      <div className="flex flex-col justify-center">
        <p className="eyebrow">{[video.category, video.date, video.duration].filter(Boolean).join(" / ")}</p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-5xl">{video.title}</h2>
        <p className="mt-5 leading-8 text-ink/72">{video.description}</p>
        {video.tags.length ? <p className="mt-6 text-sm font-semibold text-clay">{video.tags.join(" / ")}</p> : null}
      </div>
    </article>
  );
}

function VideoEmbed({ locale, video }: { locale: Locale; video: TeachingVideo }) {
  const embedUrl = getEmbedUrl(video.videoUrl);

  if (embedUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-sm bg-ink shadow-soft">
        <ConsentEmbed
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="h-full w-full"
          locale={locale}
          src={embedUrl}
          title={video.title}
        />
      </div>
    );
  }

  const videoType = getVideoType(video.videoUrl);

  return (
    <div className="overflow-hidden rounded-sm bg-ink shadow-soft">
      <video className="aspect-video w-full bg-ink" controls poster={video.thumbnailUrl || undefined} preload="metadata">
        <source src={video.videoUrl} type={videoType} />
        {ui[locale].pages.videoUnsupported}
      </video>
    </div>
  );
}

function MusicBySaulPage({ locale }: { locale: Locale }) {
  const { music } = getLocalizedContent(locale);
  const labels = ui[locale];
  const releases = getLocalizedRecentMusicReleases(locale, 5);
  const spotifyEmbedUrl = getSpotifyArtistEmbedUrl(music.spotifyArtistUrl);

  return (
    <>
      <section className="section-pad bg-ink text-bone">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="eyebrow text-bronze">{music.artistName}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">{music.pageTitle}</h1>
          </div>
          <div>
            <p className="text-lg leading-8 text-bone/78">{music.intro}</p>
            <p className="mt-5 border-l-4 border-bronze pl-5 leading-8 text-bone/70">{music.aiDisclosure}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={music.spotifyArtistUrl} locale={locale} variant="secondary">{labels.buttons.listenSpotify}</ButtonLink>
              <ButtonLink href={music.appleMusicArtistUrl} locale={locale} variant="secondary">{labels.buttons.listenAppleMusic}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeader eyebrow={labels.common.artistPage} title={labels.pages.musicArtistTitle} description={labels.pages.musicArtistDescription} />
            <div className="mt-8">
              <ButtonLink href="/contact" locale={locale}>{labels.buttons.discussMusic}</ButtonLink>
            </div>
          </div>
          {spotifyEmbedUrl ? (
            <div className="overflow-hidden rounded-sm border border-ink/10 bg-bone shadow-soft">
              <ConsentEmbed
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="h-[352px] w-full"
                locale={locale}
                src={spotifyEmbedUrl}
                title={`${music.artistName} on Spotify`}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-pad bg-bone">
        <div className="content-wrap">
          <SectionHeader eyebrow={labels.common.recentReleases} title={labels.common.recentReleases} description={labels.pages.musicReleasesDescription} />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {releases.map((release) => (
              <MusicReleaseCard key={`${release.order}-${release.title}`} release={release} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MusicReleaseCard({ release }: { release: MusicRelease }) {
  return (
    <article className="flex min-h-full flex-col border border-ink/10 bg-paper p-4 shadow-soft">
      {release.coverImage ? (
        <div className="relative aspect-square overflow-hidden bg-ink/5">
          <Image alt={`${release.title} cover art`} className="object-cover" fill sizes="(min-width: 1024px) 20vw, (min-width: 768px) 50vw, 100vw" src={release.coverImage} />
        </div>
      ) : (
        <div className="grid aspect-square place-items-center bg-ink text-center font-serif text-4xl text-bone">MS</div>
      )}
      <p className="eyebrow mt-5">{[release.releaseType, release.releaseDate].filter(Boolean).join(" / ")}</p>
      <h2 className="mt-3 font-serif text-2xl leading-tight text-ink">{release.title}</h2>
      <p className="mt-4 flex-1 text-sm leading-7 text-ink/68">{release.description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
        {release.spotifyUrl ? <a className="text-clay underline decoration-bronze/50 underline-offset-4" href={release.spotifyUrl} rel="noreferrer" target="_blank">Spotify</a> : null}
        {release.appleMusicUrl ? <a className="text-clay underline decoration-bronze/50 underline-offset-4" href={release.appleMusicUrl} rel="noreferrer" target="_blank">Apple Music</a> : null}
      </div>
    </article>
  );
}

function ContactPage({ locale }: { locale: Locale }) {
  const { books, podcast, site } = getLocalizedContent(locale);
  const labels = ui[locale];
  const contactEmail = getContactEmail();
  const bookingUrl = acceptsDirectPayments() ? getBookingUrl() : "";

  return (
    <section className="section-pad">
      <div className="content-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow={labels.nav.contact} title={labels.pages.contactTitle} description={labels.pages.contactDescription} />
          <div className="mt-6">
            <LegalNotice locale={locale} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${contactEmail}`} locale={locale}>{labels.buttons.emailSaul} {contactEmail}</ButtonLink>
            {bookingUrl ? <ButtonLink href={bookingUrl} locale={locale} variant="secondary">{labels.buttons.bookTime}</ButtonLink> : null}
          </div>
          <div className="mt-10 grid gap-4">
            <article className="border border-ink/10 bg-bone p-5">
              <h2 className="font-serif text-2xl text-ink">{labels.common.podcast}</h2>
              <p className="mt-2 text-ink/68">{podcast.name}</p>
              <a className="mt-3 inline-block text-sm font-semibold text-clay" href={podcast.url} rel="noreferrer" target="_blank">{labels.pages.contactPodcastLink}</a>
            </article>
            <article className="border border-ink/10 bg-bone p-5">
              <h2 className="font-serif text-2xl text-ink">{labels.common.books}</h2>
              <p className="mt-2 text-ink/68">{books.slice(0, 2).map((book) => book.title).join(" / ")}</p>
            </article>
            <article className="border border-ink/10 bg-bone p-5">
              <h2 className="font-serif text-2xl text-ink">{labels.common.socialLinks}</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {site.socialLinks.map((link) => (
                  <a className="text-sm font-semibold text-clay" href={link.url} key={link.label} rel="noreferrer" target="_blank">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          </div>
        </div>
        <ContactForm bookingUrl={bookingUrl} contactEmail={contactEmail} locale={locale} subject="Bighonda Studios inquiry" />
      </div>
    </section>
  );
}

function getEmbedUrl(videoUrl: string) {
  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
      const videoId = getYouTubeId(url);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean).pop();
      if (videoId && /^\d+$/.test(videoId)) return `https://player.vimeo.com/video/${videoId}`;
    }
  } catch {
    return "";
  }

  return "";
}

function getYouTubeId(url: URL) {
  if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
  if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/").filter(Boolean)[1] || "";
  if (url.pathname.startsWith("/embed/")) return url.pathname.split("/").filter(Boolean)[1] || "";
  return url.searchParams.get("v") || "";
}

function getVideoType(videoUrl: string) {
  if (videoUrl.endsWith(".webm")) return "video/webm";
  if (videoUrl.endsWith(".mov")) return "video/quicktime";
  if (videoUrl.endsWith(".m4v")) return "video/x-m4v";
  return "video/mp4";
}

function getSpotifyArtistEmbedUrl(artistUrl: string) {
  try {
    const url = new URL(artistUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const artistIndex = parts.indexOf("artist");
    const artistId = artistIndex >= 0 ? parts[artistIndex + 1] : "";
    return artistId ? `https://open.spotify.com/embed/artist/${artistId}` : "";
  } catch {
    return "";
  }
}
