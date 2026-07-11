import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { absoluteUrl, books, getBookBySlug } from "@/lib/content";
import { getRetailerLabel } from "@/lib/legal";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.coverImage],
      type: "book"
    }
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
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
    url: absoluteUrl(`/books/${book.slug}`),
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
                  <ButtonLink href={link.url} key={link.label}>
                    {getRetailerLabel(link.label)}
                  </ButtonLink>
                ))
              ) : (
                <ButtonLink href="/contact">Request Updates</ButtonLink>
              )}
            </div>
            <dl className="mt-10 grid gap-4 border-y border-ink/10 py-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow">Author</dt>
                <dd className="mt-2 text-ink">{book.author}</dd>
              </div>
              <div>
                <dt className="eyebrow">Format</dt>
                <dd className="mt-2 text-ink">{book.format}</dd>
              </div>
              <div>
                <dt className="eyebrow">Topics</dt>
                <dd className="mt-2 text-ink">{book.topics.join(", ")}</dd>
              </div>
              <div>
                <dt className="eyebrow">Status</dt>
                <dd className="mt-2 text-ink">{book.status}</dd>
              </div>
            </dl>
            <blockquote className="mt-10 border-l-4 border-bronze bg-bone p-7 font-serif text-3xl leading-tight text-ink shadow-soft">
              {book.highlight}
            </blockquote>
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap grid gap-8 lg:grid-cols-3">
          <SectionHeader eyebrow="Invite Saul" title="Teach or speak from this subject matter." description="Book a sermon, workshop, interview, moderated conversation, or community gathering connected to this book." />
          <article className="border border-ink/10 bg-paper p-6">
            <h2 className="font-serif text-2xl text-ink">Related podcast</h2>
            <p className="mt-4 leading-7 text-ink/68">{book.related?.podcast}</p>
          </article>
          <article className="border border-ink/10 bg-paper p-6">
            <h2 className="font-serif text-2xl text-ink">Events</h2>
            <p className="mt-4 leading-7 text-ink/68">{book.related?.events}</p>
            <div className="mt-6">
              <ButtonLink href="/teaching-events">Book Saul</ButtonLink>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
