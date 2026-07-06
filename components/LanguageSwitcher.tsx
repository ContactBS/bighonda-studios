"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, localeLabels, locales, localizedPath, type Locale, ui } from "@/lib/i18n-config";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";
  const activeLocale = getLocaleFromPathname(pathname) || locale;
  const labels = ui[activeLocale].nav;

  return (
    <div aria-label={labels.language} className="flex items-center gap-1 border-l border-ink/10 pl-3 text-xs font-semibold" role="navigation">
      {locales.map((targetLocale) => {
        const active = targetLocale === activeLocale;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`rounded-sm px-2 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze ${
              active ? "bg-ink text-bone" : "text-ink/65 hover:bg-bone hover:text-clay"
            }`}
            href={localizedPath(pathname, targetLocale)}
            hrefLang={targetLocale}
            key={targetLocale}
          >
            {localeLabels[targetLocale]}
          </Link>
        );
      })}
    </div>
  );
}
