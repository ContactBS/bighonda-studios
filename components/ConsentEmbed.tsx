"use client";

import { useEffect, useState } from "react";
import { getBrowserCookieConsent, openCookieSettings } from "@/components/CookieConsent";
import { defaultLocale, getLocaleFromPathname, type Locale } from "@/lib/i18n-config";
import { getCookieConsentLabels, getLegalNotice } from "@/lib/legal";

type ConsentEmbedProps = {
  src: string;
  title: string;
  className?: string;
  allow?: string;
  locale?: Locale;
};

export function ConsentEmbed({ allow, className = "h-full w-full", locale = defaultLocale, src, title }: ConsentEmbedProps) {
  const [canLoad, setCanLoad] = useState(false);
  const [activeLocale, setActiveLocale] = useState<Locale>(locale);

  useEffect(() => {
    setActiveLocale(getLocaleFromPathname(window.location.pathname));
    setCanLoad(Boolean(getBrowserCookieConsent()?.media));

    function handleChange(event: Event) {
      const detail = (event as CustomEvent<{ media: boolean }>).detail;
      setCanLoad(Boolean(detail?.media));
    }

    window.addEventListener("bighonda-cookie-consent-changed", handleChange);
    return () => window.removeEventListener("bighonda-cookie-consent-changed", handleChange);
  }, []);

  if (canLoad) {
    return <iframe allow={allow} allowFullScreen className={className} loading="lazy" src={src} title={title} />;
  }

  const labels = getCookieConsentLabels(activeLocale);
  const notice = getLegalNotice(activeLocale);

  return (
    <div className="grid min-h-64 place-items-center rounded-sm border border-ink/10 bg-bone p-6 text-center shadow-soft">
      <div className="max-w-xl">
        <p className="font-serif text-2xl text-ink">{title}</p>
        <p className="mt-3 text-sm leading-7 text-ink/68">{notice.cookieExternalMedia}</p>
        <button className="mt-5 min-h-11 rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-bone transition hover:bg-clay" onClick={openCookieSettings} type="button">
          {labels.loadMedia}
        </button>
      </div>
    </div>
  );
}
