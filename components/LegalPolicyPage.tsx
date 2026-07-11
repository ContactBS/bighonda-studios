import Link from "next/link";
import { LegalNotice } from "@/components/LegalNotice";
import { defaultLocale, localizedInternalHref, type Locale } from "@/lib/i18n-config";
import { getLegalNotice, getLegalPolicy, legalSettings, type LegalPolicyKey } from "@/lib/legal";

type LegalPolicyPageProps = {
  policyKey: LegalPolicyKey;
  locale?: Locale;
};

function anchorFor(heading: string) {
  return heading
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LegalPolicyPage({ policyKey, locale = defaultLocale }: LegalPolicyPageProps) {
  const policy = getLegalPolicy(policyKey, locale);
  const notice = getLegalNotice(locale);

  return (
    <section className="section-pad">
      <div className="content-wrap grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <aside className="lg:sticky lg:top-28">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">{policy.title}</h1>
          <dl className="mt-6 grid gap-3 border-y border-ink/10 py-5 text-sm text-ink/70">
            <div>
              <dt className="font-semibold text-ink">Effective date</dt>
              <dd>{legalSettings.effectiveDate || "To be added"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Last updated</dt>
              <dd>{legalSettings.lastUpdated || "To be added"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Operator</dt>
              <dd>{legalSettings.operatorName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Country</dt>
              <dd>{legalSettings.country}</dd>
            </div>
            {legalSettings.organisationNumber ? (
              <div>
                <dt className="font-semibold text-ink">Organisation number</dt>
                <dd>{legalSettings.organisationNumber}</dd>
              </div>
            ) : null}
            {legalSettings.vatNumber ? (
              <div>
                <dt className="font-semibold text-ink">VAT number</dt>
                <dd>{legalSettings.vatNumber}</dd>
              </div>
            ) : null}
            {legalSettings.businessAddress ? (
              <div>
                <dt className="font-semibold text-ink">Business address</dt>
                <dd>{legalSettings.businessAddress}</dd>
              </div>
            ) : null}
          </dl>
          <nav aria-label={`${policy.title} table of contents`} className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">Contents</p>
            <ol className="mt-4 grid gap-2 text-sm leading-6 text-ink/72">
              {policy.sections.map((section) => (
                <li key={section.heading}>
                  <a className="underline decoration-bronze/50 underline-offset-4 hover:text-clay" href={`#${anchorFor(section.heading)}`}>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <article className="max-w-3xl">
          <LegalNotice locale={locale} variant="full" />
          <p className="mt-6 border-l-4 border-bronze bg-bone p-5 text-sm leading-7 text-ink/72">{notice.authoritative}</p>
          <div className="mt-10 grid gap-9">
            {policy.sections.map((section) => (
              <section id={anchorFor(section.heading)} key={section.heading}>
                <h2 className="font-serif text-3xl leading-tight text-ink">{section.heading}</h2>
                <p className="mt-4 leading-8 text-ink/72">{section.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-12 border-t border-ink/10 pt-6 text-sm text-ink/65">
            <Link className="font-semibold text-clay underline decoration-bronze/50 underline-offset-4" href={localizedInternalHref("/contact", locale)}>
              Contact Bighonda Studios
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
