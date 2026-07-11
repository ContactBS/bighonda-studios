import legalData from "@/content/legal.json";
import { defaultLocale, type Locale } from "./i18n-config";

export type LegalPolicyKey = "terms" | "privacy" | "cookies" | "ai-transparency";

export type LegalSection = {
  heading: string;
  body: string;
};

export type LegalPolicy = {
  title: string;
  description: string;
  sections: LegalSection[];
};

export const legal = legalData;
export const legalSettings = legalData.settings;

export const legalRoutes: Array<{ key: LegalPolicyKey; href: string; label: string }> = [
  { key: "terms", href: "/terms", label: "Terms of Use" },
  { key: "privacy", href: "/privacy", label: "Privacy Policy" },
  { key: "cookies", href: "/cookies", label: "Cookie Policy" },
  { key: "ai-transparency", href: "/ai-transparency", label: "AI-Assisted Content Policy" }
];

export function getLegalNotice(locale: Locale = defaultLocale) {
  return legalData.notices[locale] ?? legalData.notices[defaultLocale];
}

export function getCookieConsentLabels(locale: Locale = defaultLocale) {
  return legalData.cookieConsent[locale] ?? legalData.cookieConsent[defaultLocale];
}

export function getLegalPolicy(key: LegalPolicyKey, locale: Locale = defaultLocale): LegalPolicy {
  const policy = legalData.policies[key];
  return (policy[locale] ?? policy[defaultLocale]) as LegalPolicy;
}

export function getLegalSlug(key: LegalPolicyKey) {
  return legalData.policies[key].slug;
}

export function shouldShowPendingNotice() {
  return legalSettings.registrationStatus === "pending";
}

export function acceptsDirectPayments() {
  return legalSettings.acceptsDirectPayments && legalSettings.registrationStatus === "registered";
}

export function getRetailerLabel(label: string) {
  if (/apple/i.test(label)) return "Buy from Apple Books";
  if (/amazon/i.test(label)) return "Buy from Amazon";
  if (/google/i.test(label)) return "Buy from Google Play Books";
  return `Buy from ${label}`;
}
