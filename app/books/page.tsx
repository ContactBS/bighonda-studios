import type { Metadata } from "next";
import { BookCard } from "@/components/BookCard";
import { SectionHeader } from "@/components/SectionHeader";
import { books } from "@/lib/content";

export const metadata: Metadata = {
  title: "Books",
  description: "Published and upcoming books by Saul Loubassa Bighonda, including WHAT IF YOU WERE WRONG? and Dear Son, Welcome to Life."
};

export default function BooksPage() {
  const published = books.filter((book) => book.status === "Published");
  const upcoming = books.filter((book) => book.status !== "Published");

  return (
    <section className="section-pad">
      <div className="content-wrap">
        <SectionHeader
          eyebrow="Books"
          title="Published and upcoming work from Saul Loubassa Bighonda."
          description="Books on belief, doubt, fatherhood, purpose, faith, identity, and spiritual transformation."
        />
        <div className="mt-12 grid gap-7">
          {published.map((book) => (
            <BookCard book={book} featured={book.featured} key={book.slug} />
          ))}
        </div>
        <div className="mt-20">
          <SectionHeader eyebrow="Upcoming Books" title="Future titles can be added without changing component code." description="Edit content/books.json to add draft, upcoming, or coming-soon books." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {upcoming.map((book) => (
              <BookCard book={book} key={book.slug} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
