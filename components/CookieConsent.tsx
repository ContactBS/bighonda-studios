"use client";

import { useEffect, useState } from "react";
import { defaultLocale, getLocaleFromPathname, type Locale } from "@/lib/i18n-config";
import { getCookieConsentLabels } from "@/lib/legal";

export type CookieConsentValue = {
  media: boolean;
  updatedAt: string;
};

const storageKey = "bighonda-cookie-consent";
const eventName = "bighonda-cookie-settings";

function readConsent(): CookieConsentValue | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? (JSON.parse(value) as CookieConsentValue) : null;
  } catch {
    return null;
  }
}

function writeConsent(value: CookieConsentValue) {
  window.localStorage.setItem(storageKey, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("bighonda-cookie-consent-changed", { detail: value }));
}

export function getBrowserCookieConsent() {
  if (typeof window === "undefined") return null;
  return readConsent();
}

export function openCookieSettings() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(eventName));
}

export function CookieSettingsButton({ locale = defaultLocale }: { locale?: Locale }) {
  const labels = getCookieConsentLabels(locale);

  return (
    <button className="text-bone/75 transition hover:text-bone" onClick={openCookieSettings} type="button">
      {labels.settings}
    </button>
  );
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [media, setMedia] = useState(false);
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setMounted(true);
    setLocale(getLocaleFromPathname(window.location.pathname));
    const existing = readConsent();
    if (existing) {
      setMedia(existing.media);
      setOpen(false);
    } else {
      setOpen(true);
    }

    function handleOpen() {
      const current = readConsent();
      setMedia(Boolean(current?.media));
      setManage(true);
      setOpen(true);
      setLocale(getLocaleFromPathname(window.location.pathname));
    }

    window.addEventListener(eventName, handleOpen);
    return () => window.removeEventListener(eventName, handleOpen);
  }, []);

  if (!mounted || !open) return null;

  const labels = getCookieConsentLabels(locale);

  function save(nextMedia: boolean) {
    const value = { media: nextMedia, updatedAt: new Date().toISOString() };
    setMedia(nextMedia);
    writeConsent(value);
    setOpen(false);
    setManage(false);
  }

  return (
    <section aria-label={labels.bannerTitle} className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl border border-ink/15 bg-paper p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h2 className="font-serif text-2xl text-ink">{labels.bannerTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-ink/70">{labels.bannerText}</p>
          {manage ? (
            <label className="mt-4 flex gap-3 rounded-sm border border-ink/10 bg-bone p-4 text-sm leading-6 text-ink/72">
              <input checked={media} className="mt-1 h-4 w-4" onChange={(event) => setMedia(event.target.checked)} type="checkbox" />
              <span>
                <span className="block font-semibold text-ink">{labels.mediaLabel}</span>
                {labels.mediaDescription}
              </span>
            </label>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 md:max-w-48">
          {manage ? (
            <button className="min-h-11 rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-bone" onClick={() => save(media)} type="button">
              {labels.save}
            </button>
          ) : (
            <>
              <button className="min-h-11 rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-bone" onClick={() => save(true)} type="button">
                {labels.acceptAll}
              </button>
              <button className="min-h-11 rounded-sm border border-ink/20 bg-bone px-4 py-2 text-sm font-semibold text-ink" onClick={() => save(false)} type="button">
                {labels.reject}
              </button>
              <button className="min-h-11 rounded-sm border border-ink/20 bg-paper px-4 py-2 text-sm font-semibold text-ink" onClick={() => setManage(true)} type="button">
                {labels.manage}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
