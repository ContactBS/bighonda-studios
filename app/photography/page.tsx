import type { Metadata } from "next";
import { PhotoGallery } from "@/components/PhotoGallery";
import { SectionHeader } from "@/components/SectionHeader";
import { photos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photography",
  description: "A purchasable photography gallery by Saul Loubassa Bighonda with print, license, and commission inquiry paths."
};

export default function PhotographyPage() {
  return (
    <section className="section-pad">
      <div className="content-wrap">
        <SectionHeader
          eyebrow="Photography"
          title="Fine-art, editorial, and commissioned images."
          description="Browse photographs by category, request prints, license images, or commission Saul for a creative session. Images can use local fallback content now and CMS-managed entries after admin setup."
        />
        <div className="mt-10">
          <PhotoGallery photos={photos} />
        </div>
      </div>
    </section>
  );
}
