import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/types";
import { ButtonLink } from "./ButtonLink";

type BookCardProps = {
  book: Book;
  featured?: boolean;
};

export function BookCard({ book, featured = false }: BookCardProps) {
  return (
    <article className={`grid gap-7 border border-ink/10 bg-bone p-5 shadow-soft md:grid-cols-[220px_1fr] md:p-7 ${featured ? "md:grid-cols-[300px_1fr]" : ""}`}>
      <Link className="relative block aspect-[2/3] overflow-hidden rounded-sm bg-ink/5" href={`/books/${book.slug}`}>
        <Image alt={`${book.title} book cover`} className="object-cover" fill sizes={featured ? "(min-width: 768px) 300px, 75vw" : "(min-width: 768px) 220px, 75vw"} src={book.coverImage} unoptimized />
      </Link>
      <div className="flex flex-col justify-center">
        <p className="eyebrow">{book.status} / {book.year}</p>
        <h3 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{book.title}</h3>
        <p className="mt-2 text-lg text-clay">{book.subtitle}</p>
        <p className="mt-5 leading-8 text-ink/72">{book.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/books/${book.slug}`}>View Book</ButtonLink>
          {book.purchaseLinks[0] ? (
            <ButtonLink href={book.purchaseLinks[0].url} variant="secondary">
              Buy Book
            </ButtonLink>
          ) : (
            <ButtonLink href="/contact" variant="secondary">
              Request Updates
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}
