import type { Metadata } from "next";
import { LegalPolicyPage } from "@/components/LegalPolicyPage";
import { getLegalPolicy } from "@/lib/legal";

const policy = getLegalPolicy("ai-transparency");

export const metadata: Metadata = {
  title: policy.title,
  description: policy.description
};

export default function AiTransparencyPage() {
  return <LegalPolicyPage policyKey="ai-transparency" />;
}
