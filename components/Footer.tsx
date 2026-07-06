"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, getLocaleFromPathname, localizedInternalHref, type Locale, ui } from "@/lib/i18n-config";
import { getLocalizedContent } from "@/lib/localized-content";

const footerNav = [
  { labelKey: "books", href: "/books" },
  { labelKey: "podcast", href: "/podcast" },
  { labelKey: "music", href: "/music-by-saul" },
  { labelKey: "photography", href: "/photography" },
  { labelKey: "videos", href: "/teaching-videos" },
  { labelKey: "events", href: "/teaching-events" },
  { labelKey: "about", href: "/about" },
  { labelKey: "contact", href: "/contact" }
] as const;

type FooterProps = {
  locale?: Locale;
};

export function Footer({ locale = defaultLocale }: FooterProps) {
  const pathname = usePathname() || "/";
  const activeLocale = getLocaleFromPathname(pathname) || locale;
  const labels = ui[activeLocale];
  const { books, podcast, site } = getLocalizedContent(activeLocale);

  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_0.7fr_0.7fr] md:px-8">
        <div>
          <p className="font-serif text-3xl">{site.brandName}</p>
          <p className="mt-4 max-w-xl leading-7 text-bone/70">{site.tagline}</p>
          <p className="mt-8 text-sm text-bone/50">Copyright {new Date().getFullYear()} {site.ownerName}. {labels.footer.copyright}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze">{labels.footer.explore}</p>
          <ul className="mt-4 space-y-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link className="text-bone/75 transition hover:text-bone" href={localizedInternalHref(item.href, activeLocale)}>
                  {labels.nav[item.labelKey]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze">{labels.footer.links}</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a className="text-bone/75 transition hover:text-bone" href={podcast.url} rel="noreferrer" target="_blank">
                {podcast.name}
              </a>
            </li>
            {books.slice(0, 2).map((book) => (
              <li key={book.slug}>
                <Link className="text-bone/75 transition hover:text-bone" href={localizedInternalHref(`/books/${book.slug}`, activeLocale)}>
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
