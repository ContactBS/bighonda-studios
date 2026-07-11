import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { LegalNotice } from "@/components/LegalNotice";
import { SectionHeader } from "@/components/SectionHeader";
import { faqs, getBookingUrl, getContactEmail, services, testimonials } from "@/lib/content";
import { acceptsDirectPayments } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Teaching & Events",
  description: "Book Saul Loubassa Bighonda for teaching, sermons, workshops, book talks, interviews, and community events."
};

export default function TeachingEventsPage() {
  const contactEmail = getContactEmail();
  const bookingUrl = acceptsDirectPayments() ? getBookingUrl() : "";

  return (
    <>
      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader
              eyebrow="Teaching & Events"
              title="Invite Saul into rooms built for thought, faith, and transformation."
              description="Available for teaching, speaking, sermons, workshops, book talks, podcast interviews, church and community events, photography exhibitions, and custom gatherings."
            />
            <div className="mt-6">
              <LegalNotice />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {bookingUrl ? <ButtonLink href={bookingUrl}>Submit a Booking Enquiry</ButtonLink> : null}
              <ButtonLink href={`mailto:${contactEmail}?subject=Booking%20inquiry`}>Submit a Booking Enquiry</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <article className="border border-ink/10 bg-bone p-5 shadow-soft" key={service.title}>
                <p className="eyebrow">{service.format}</p>
                <h2 className="mt-3 font-serif text-2xl text-ink">{service.title}</h2>
                <p className="mt-3 leading-7 text-ink/68">{service.shortDescription}</p>
                <p className="mt-4 text-sm font-semibold text-ink">Ideal for: {service.idealAudience}</p>
                <p className="mt-2 text-sm text-ink/65">Duration: {service.duration}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.topics.slice(0, 4).map((topic) => (
                    <span className="rounded-sm bg-paper px-3 py-1 text-xs font-semibold text-ink/70" key={topic}>{topic}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-bone">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader eyebrow="Booking Form" title="Start the conversation." description="The form opens an email with the event details so the enquiry can be reviewed without creating a confirmed booking." />
            <div className="mt-8 grid gap-5">
              {testimonials.map((item) => (
                <blockquote className="border-l-4 border-bronze pl-5 leading-7 text-ink/72" key={item.quote}>
                  "{item.quote}"
                  <footer className="mt-2 text-sm font-semibold text-ink">{item.name}, {item.role}</footer>
                </blockquote>
              ))}
            </div>
          </div>
          <ContactForm bookingUrl={bookingUrl} contactEmail={contactEmail} mode="booking" subject="Booking inquiry for Saul Loubassa Bighonda" />
        </div>
      </section>
      <section className="section-pad">
        <div className="content-wrap">
          <SectionHeader eyebrow="FAQ" title="Practical notes before booking." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article className="border border-ink/10 bg-bone p-5" key={faq.question}>
                <h2 className="font-serif text-2xl text-ink">{faq.question}</h2>
                <p className="mt-3 leading-7 text-ink/68">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
