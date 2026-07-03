import Link from "next/link";
import { books, podcast, site } from "@/lib/content";

const footerNav = [
  { label: "Books", href: "/books" },
  { label: "Podcast", href: "/podcast" },
  { label: "Photography", href: "/photography" },
  { label: "Teaching Videos", href: "/teaching-videos" },
  { label: "Teaching & Events", href: "/teaching-events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_0.7fr_0.7fr] md:px-8">
        <div>
          <p className="font-serif text-3xl">{site.brandName}</p>
          <p className="mt-4 max-w-xl leading-7 text-bone/70">{site.tagline}</p>
          <p className="mt-8 text-sm text-bone/50">Copyright {new Date().getFullYear()} {site.ownerName}. All rights reserved.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze">Explore</p>
          <ul className="mt-4 space-y-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link className="text-bone/75 transition hover:text-bone" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze">Links</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a className="text-bone/75 transition hover:text-bone" href={podcast.url} rel="noreferrer" target="_blank">
                {podcast.name}
              </a>
            </li>
            {books.slice(0, 2).map((book) => (
              <li key={book.slug}>
                <Link className="text-bone/75 transition hover:text-bone" href={`/books/${book.slug}`}>
                  {book.title}
                </Link>
              </li>
            ))}
            {site.socialLinks.slice(3).map((link) => (
              <li key={link.label}>
                <a className="text-bone/75 transition hover:text-bone" href={link.url} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
