"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { site } from "@/lib/content";
import { defaultLocale, getLocaleFromPathname, localizedInternalHref, type Locale, ui } from "@/lib/i18n-config";

const nav = [
  { labelKey: "home", href: "/" },
  { labelKey: "books", href: "/books" },
  { labelKey: "podcast", href: "/podcast" },
  { labelKey: "music", href: "/music-by-saul" },
  { labelKey: "photography", href: "/photography" },
  { labelKey: "videos", href: "/teaching-videos" },
  { labelKey: "events", href: "/teaching-events" },
  { labelKey: "about", href: "/about" },
  { labelKey: "contact", href: "/contact" }
] as const;

type HeaderProps = {
  locale?: Locale;
};

export function Header({ locale = defaultLocale }: HeaderProps) {
  const pathname = usePathname() || "/";
  const activeLocale = getLocaleFromPathname(pathname) || locale;
  const labels = ui[activeLocale].nav;

  useEffect(() => {
    document.documentElement.lang = activeLocale;
  }, [activeLocale]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <nav aria-label={labels.primary} className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link className="group inline-flex items-center gap-3" href={localizedInternalHref("/", activeLocale)}>
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-ink font-serif text-lg text-bone">B</span>
          <span>
            <span className="block font-serif text-lg leading-none text-ink">{site.brandName}</span>
            <span className="block text-xs uppercase tracking-[0.22em] text-ink/55">Saul Loubassa Bighonda</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-ink/70">
          {nav.map((item) => (
            <Link className="transition hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze" href={localizedInternalHref(item.href, activeLocale)} key={item.href}>
              {labels[item.labelKey]}
            </Link>
          ))}
          <LanguageSwitcher locale={activeLocale} />
        </div>
      </nav>
    </header>
  );
}
