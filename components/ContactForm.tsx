"use client";

import { FormEvent, useMemo, useState } from "react";
import { defaultLocale, type Locale, ui } from "@/lib/i18n-config";

type ContactFormProps = {
  subject?: string;
  mode?: "contact" | "booking";
  contactEmail: string;
  bookingUrl?: string;
  locale?: Locale;
};

type FormState = {
  name: string;
  email: string;
  organization: string;
  eventType: string;
  preferredDate: string;
  location: string;
  audienceSize: string;
  budget: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  organization: "",
  eventType: "",
  preferredDate: "",
  location: "",
  audienceSize: "",
  budget: "",
  message: ""
};

export function ContactForm({
  subject = "Bighonda Studios inquiry",
  mode = "contact",
  contactEmail,
  bookingUrl,
  locale = defaultLocale
}: ContactFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const formLabels = ui[locale].form;
  const buttonLabels = ui[locale].buttons;

  const emailBody = useMemo(() => {
    const rows = [
      [formLabels.name, form.name],
      [formLabels.email, form.email],
      [formLabels.organization, form.organization],
      [formLabels.eventType, form.eventType],
      [formLabels.preferredDate, form.preferredDate],
      [formLabels.locationOnline, form.location],
      [formLabels.audienceSize, form.audienceSize],
      [formLabels.budgetRange, form.budget],
      [formLabels.message, form.message]
    ].filter(([, value]) => value.trim().length > 0);

    return rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  }, [form, formLabels]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  }

  return (
    <form className="grid gap-4 border border-ink/10 bg-bone p-5 shadow-soft md:p-7" data-netlify="true" name={mode} onSubmit={handleSubmit}>
      <input name="form-name" type="hidden" value={mode} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={formLabels.name} name="name" onChange={(value) => updateField("name", value)} required value={form.name} />
        <Field label={formLabels.email} name="email" onChange={(value) => updateField("email", value)} required type="email" value={form.email} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={formLabels.organization} name="organization" onChange={(value) => updateField("organization", value)} value={form.organization} />
        <Field label={mode === "booking" ? formLabels.eventType : formLabels.inquiryType} name="eventType" onChange={(value) => updateField("eventType", value)} value={form.eventType} />
      </div>
      {mode === "booking" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={formLabels.preferredDate} name="preferredDate" onChange={(value) => updateField("preferredDate", value)} type="date" value={form.preferredDate} />
            <Field label={formLabels.locationOnline} name="location" onChange={(value) => updateField("location", value)} value={form.location} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={formLabels.audienceSize} name="audienceSize" onChange={(value) => updateField("audienceSize", value)} value={form.audienceSize} />
            <Field label={formLabels.budgetRange} name="budget" onChange={(value) => updateField("budget", value)} value={form.budget} />
          </div>
        </>
      ) : null}
      <label className="grid gap-2 text-sm font-semibold text-ink">
        {formLabels.message}
        <textarea
          className="min-h-36 rounded-sm border border-ink/15 bg-white px-4 py-3 text-base font-normal leading-7 text-ink outline-none transition focus:border-bronze"
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          required
          value={form.message}
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button className="min-h-11 rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-bone transition hover:bg-clay" type="submit">
          {buttonLabels.composeEmail}
        </button>
        {bookingUrl ? (
          <a className="inline-flex min-h-11 items-center rounded-sm border border-ink/20 bg-bone px-5 py-3 text-sm font-semibold text-ink transition hover:border-bronze hover:text-clay" href={bookingUrl} rel="noreferrer" target="_blank">
            {buttonLabels.bookTime}
          </a>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  onChange,
  required = false,
  type = "text",
  value
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        className="min-h-11 rounded-sm border border-ink/15 bg-white px-4 py-3 text-base font-normal text-ink outline-none transition focus:border-bronze"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
