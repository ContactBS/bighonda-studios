"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { defaultLocale, type Locale, ui } from "@/lib/i18n-config";
import { acceptsDirectPayments } from "@/lib/legal";
import type { Photo } from "@/lib/types";

type PhotoGalleryProps = {
  photos: Photo[];
  locale?: Locale;
};

export function PhotoGallery({ photos, locale = defaultLocale }: PhotoGalleryProps) {
  const labels = ui[locale].photoGallery;
  const categories = useMemo(() => [labels.all, ...Array.from(new Set(photos.map((photo) => photo.category)))], [labels.all, photos]);
  const [activeCategory, setActiveCategory] = useState<string>(labels.all);
  const [selected, setSelected] = useState<Photo | null>(null);
  const visiblePhotos = activeCategory === labels.all ? photos : photos.filter((photo) => photo.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={labels.filterLabel}>
        {categories.map((category) => (
          <button
            aria-selected={activeCategory === category}
            className={`rounded-sm border px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? "border-ink bg-ink text-bone" : "border-ink/15 bg-bone text-ink hover:border-bronze"}`}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePhotos.map((photo, index) => (
          <article className={`group border border-ink/10 bg-bone shadow-soft ${index % 3 === 1 ? "lg:translate-y-8" : ""}`} key={photo.slug}>
            <button className="block w-full text-left" onClick={() => setSelected(photo)} type="button">
              <span className="relative block aspect-[4/5] overflow-hidden bg-ink/5">
                <Image alt={photo.alt} className="object-cover transition duration-500 group-hover:scale-105" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" src={photo.image} />
              </span>
              <span className="block p-5">
                <span className="eyebrow">{photo.category} / {photo.availability}</span>
                <span className="mt-3 block font-serif text-2xl text-ink">{photo.title}</span>
                <span className="mt-2 block text-sm text-ink/65">{photo.location} / {photo.year}</span>
              </span>
            </button>
          </article>
        ))}
      </div>
      {selected ? <PhotoModal locale={locale} photo={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}

function PhotoModal({ photo, onClose, locale }: { photo: Photo; onClose: () => void; locale: Locale }) {
  const labels = ui[locale].photoGallery;
  const canUseDirectPurchase = acceptsDirectPayments() && Boolean(photo.purchaseUrl);
  const purchaseLabel = canUseDirectPurchase ? labels.buyPrint : labels.requestPrint;
  const purchaseHref = canUseDirectPurchase ? photo.purchaseUrl : `mailto:hello@bighondastudios.com?subject=${encodeURIComponent(`Print enquiry: ${photo.title}`)}`;

  return (
    <div aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-ink/75 p-4" role="dialog">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto bg-paper shadow-soft">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[420px] bg-ink">
            <Image alt={photo.alt} className="object-cover" fill sizes="(min-width: 1024px) 55vw, 100vw" src={photo.image} />
          </div>
          <div className="p-6 md:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{photo.category}</p>
                <h3 className="mt-3 font-serif text-4xl text-ink">{photo.title}</h3>
              </div>
              <button aria-label={labels.closeDetails} className="rounded-sm border border-ink/20 px-3 py-2 text-sm font-semibold text-ink hover:border-bronze" onClick={onClose} type="button">
                {labels.close}
              </button>
            </div>
            <p className="mt-5 leading-8 text-ink/72">{photo.description}</p>
            <dl className="mt-7 grid gap-4 text-sm text-ink/72">
              <div><dt className="font-semibold text-ink">{labels.location}</dt><dd>{photo.location}</dd></div>
              <div><dt className="font-semibold text-ink">{labels.availability}</dt><dd>{photo.availability}</dd></div>
              <div><dt className="font-semibold text-ink">{labels.price}</dt><dd>{photo.price || labels.inquire}</dd></div>
              <div><dt className="font-semibold text-ink">{labels.printSizes}</dt><dd>{photo.printSizes.join(", ")}</dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex min-h-11 items-center rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-bone transition hover:bg-clay" href={purchaseHref}>
                {purchaseLabel}
              </a>
              <a className="inline-flex min-h-11 items-center rounded-sm border border-ink/20 bg-bone px-5 py-3 text-sm font-semibold text-ink transition hover:border-bronze hover:text-clay" href={photo.licenseInquiryUrl}>
                {labels.licensePhoto}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
