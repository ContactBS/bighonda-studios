"use client";

import { useEffect, useRef, useState } from "react";
import { defaultLocale, getLocaleFromPathname, type Locale } from "@/lib/i18n-config";
import { getCookieConsentLabels } from "@/lib/legal";

type CookieCategory = "necessary" | "embeddedMedia";

export type CookieConsentValue = {
  version: number;
  acceptedCategories: CookieCategory[];
  categories: {
    necessary: true;
    embeddedMedia: boolean;
  };
  updatedAt: string;
};

const storageKey = "bighonda-cookie-consent";
const eventName = "bighonda-cookie-settings";
const consentVersion = 1;
const retentionMs = 180 * 24 * 60 * 60 * 1000;

function makeConsent(embeddedMedia: boolean): CookieConsentValue {
  return {
    version: consentVersion,
    acceptedCategories: embeddedMedia ? ["necessary", "embeddedMedia"] : ["necessary"],
    categories: {
      necessary: true,
      embeddedMedia
    },
    updatedAt: new Date().toISOString()
  };
}

function normalizeConsent(value: unknown): CookieConsentValue | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<CookieConsentValue> & { media?: boolean };
  const updatedAt = typeof candidate.updatedAt === "string" ? candidate.updatedAt : "";
  const updatedTime = updatedAt ? new Date(updatedAt).getTime() : 0;
  if (!Number.isFinite(updatedTime) || Date.now() - updatedTime > retentionMs) return null;

  const embeddedMedia = typeof candidate.media === "boolean" ? candidate.media : Boolean(candidate.categories?.embeddedMedia);
  return {
    ...makeConsent(embeddedMedia),
    version: typeof candidate.version === "number" ? candidate.version : consentVersion,
    updatedAt
  };
}

function readConsent(): CookieConsentValue | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? normalizeConsent(JSON.parse(value)) : null;
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
    <button aria-haspopup="dialog" className="text-bone/75 transition hover:text-bone" onClick={openCookieSettings} type="button">
      {labels.settings}
    </button>
  );
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [embeddedMedia, setEmbeddedMedia] = useState(false);
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setLocale(getLocaleFromPathname(window.location.pathname));
    const existing = readConsent();
    if (existing) {
      setEmbeddedMedia(existing.categories.embeddedMedia);
      setOpen(false);
    } else {
      setOpen(true);
    }

    function handleOpen() {
      const current = readConsent();
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setEmbeddedMedia(Boolean(current?.categories.embeddedMedia));
      setManage(true);
      setOpen(true);
      setLocale(getLocaleFromPathname(window.location.pathname));
    }

    window.addEventListener(eventName, handleOpen);
    return () => window.removeEventListener(eventName, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
      return;
    }

    const firstControl = panelRef.current?.querySelector<HTMLElement>("button, input:not(:disabled)");
    firstControl?.focus();
  }, [open, manage]);

  if (!mounted || !open) return null;

  const labels = getCookieConsentLabels(locale);

  function save(nextEmbeddedMedia: boolean) {
    const value = makeConsent(nextEmbeddedMedia);
    setEmbeddedMedia(nextEmbeddedMedia);
    writeConsent(value);
    setOpen(false);
    setManage(false);
  }

  return (
    <section
      aria-label={labels.bannerTitle}
      aria-modal="false"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl border border-ink/15 bg-paper p-5 shadow-soft"
      ref={panelRef}
      role="dialog"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h2 className="font-serif text-2xl text-ink">{labels.bannerTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-ink/70">{labels.bannerText}</p>
          {manage ? (
            <div className="mt-4 grid gap-3">
              <label className="flex gap-3 rounded-sm border border-ink/10 bg-bone p-4 text-sm leading-6 text-ink/72">
                <input checked className="mt-1 h-4 w-4" disabled type="checkbox" />
                <span>
                  <span className="block font-semibold text-ink">{labels.necessaryLabel}</span>
                  {labels.necessaryDescription}
                </span>
              </label>
              <label className="flex gap-3 rounded-sm border border-ink/10 bg-bone p-4 text-sm leading-6 text-ink/72">
                <input
                  aria-describedby="embedded-media-cookie-description"
                  checked={embeddedMedia}
                  className="mt-1 h-4 w-4"
                  onChange={(event) => setEmbeddedMedia(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  <span className="block font-semibold text-ink">{labels.mediaLabel}</span>
                  <span id="embedded-media-cookie-description">{labels.mediaDescription}</span>
                </span>
              </label>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 md:max-w-48">
          {manage ? (
            <button className="min-h-11 rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-bone" onClick={() => save(embeddedMedia)} type="button">
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
