import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeader } from "@/components/SectionHeader";
import { books, getBookingUrl, getContactEmail, podcast, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Bighonda Studios for booking, books, podcast conversations, photography prints, licensing, and general inquiries."
};

export default function ContactPage() {
  const contactEmail = getContactEmail();
  const bookingUrl = getBookingUrl();

  return (
    <section className="section-pad">
      <div className="content-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader
            eyebrow="Contact"
            title="For books, sermons, interviews, photos, and thoughtful gatherings."
            description="Send a general note, request a booking, inquire about photography prints or licensing, or invite Saul into a conversation."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${contactEmail}`}>Email {contactEmail}</ButtonLink>
            {bookingUrl ? <ButtonLink href={bookingUrl} variant="secondary">Book a Time</ButtonLink> : null}
          </div>
          <div className="mt-10 grid gap-4">
            <article className="border border-ink/10 bg-bone p-5">
              <h2 className="font-serif text-2xl text-ink">Podcast</h2>
              <p className="mt-2 text-ink/68">{podcast.name}</p>
              <a className="mt-3 inline-block text-sm font-semibold text-clay" href={podcast.url} rel="noreferrer" target="_blank">Listen or share the podcast</a>
            </article>
            <article className="border border-ink/10 bg-bone p-5">
              <h2 className="font-serif text-2xl text-ink">Books</h2>
              <p className="mt-2 text-ink/68">{books.slice(0, 2).map((book) => book.title).join(" / ")}</p>
            </article>
            <article className="border border-ink/10 bg-bone p-5">
              <h2 className="font-serif text-2xl text-ink">Social Links</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {site.socialLinks.map((link) => (
                  <a className="text-sm font-semibold text-clay" href={link.url} key={link.label} rel="noreferrer" target="_blank">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          </div>
        </div>
        <ContactForm bookingUrl={bookingUrl} contactEmail={contactEmail} subject="Bighonda Studios inquiry" />
      </div>
    </section>
  );
}
