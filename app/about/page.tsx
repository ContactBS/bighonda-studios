import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeader } from "@/components/SectionHeader";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "About Saul Loubassa Bighonda, founder of Bighonda Studios."
};

export default function AboutPage() {
  return (
    <>
      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink/5 shadow-soft">
            <Image alt={`Portrait of ${site.ownerName}`} className="object-cover" fill priority sizes="(min-width: 1024px) 42vw, 90vw" src={site.portraitImage} unoptimized />
          </div>
          <div>
            <SectionHeader eyebrow="About" title={site.ownerName} description={site.aboutBio} />
            <p className="mt-8 border-l-4 border-bronze pl-5 text-xl leading-9 text-ink/75">{site.mission}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Contact Saul</ButtonLink>
              <ButtonLink href="/teaching-events" variant="secondary">Book Saul</ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap">
          <SectionHeader eyebrow="Creative Pillars" title="One studio, several faithful forms." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {site.creativePillars.map((pillar) => (
              <article className="border border-ink/10 bg-paper p-5 shadow-soft" key={pillar.title}>
                <h2 className="font-serif text-3xl text-ink">{pillar.title}</h2>
                <p className="mt-4 leading-7 text-ink/68">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
