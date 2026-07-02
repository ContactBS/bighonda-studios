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
          description="Browse photographs by category, request prints, license images, or commission Saul for a creative session. Every image, price, size, and purchase link is editable in content/photos.json."
        />
        <div className="mt-10">
          <PhotoGallery photos={photos} />
        </div>
      </div>
    </section>
  );
}
