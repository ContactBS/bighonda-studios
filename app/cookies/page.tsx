import type { Metadata } from "next";
import { LegalPolicyPage } from "@/components/LegalPolicyPage";
import { getLegalPolicy } from "@/lib/legal";

const policy = getLegalPolicy("cookies");

export const metadata: Metadata = {
  title: policy.title,
  description: policy.description
};

export default function CookiesPage() {
  return <LegalPolicyPage policyKey="cookies" />;
}
