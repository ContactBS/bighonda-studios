import { defaultLocale, type Locale } from "@/lib/i18n-config";
import { getLegalNotice, shouldShowPendingNotice } from "@/lib/legal";

type LegalNoticeProps = {
  locale?: Locale;
  variant?: "short" | "full";
};

export function LegalNotice({ locale = defaultLocale, variant = "short" }: LegalNoticeProps) {
  if (!shouldShowPendingNotice()) return null;

  const notice = getLegalNotice(locale);

  return (
    <aside className="border border-bronze/30 bg-bone px-5 py-4 text-sm leading-7 text-ink/72 shadow-soft">
      <p className="font-semibold text-ink">{notice.registrationLabel}</p>
      <p className="mt-2">{variant === "full" ? notice.full : notice.short}</p>
    </aside>
  );
}
