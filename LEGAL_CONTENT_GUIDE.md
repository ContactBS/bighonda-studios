# Legal Content Guide

Legal and transparency content is editable in:

```text
content/legal.json
```

The four public legal pages are:

- `/terms`
- `/privacy`
- `/cookies`
- `/ai-transparency`

Localized versions are available at `/fr/...` and `/sv/...`.

## Registration Status

Registration details are stored once in `content/legal.json` under `settings`.

While registration is pending, keep:

```json
"registrationStatus": "pending",
"acceptsDirectPayments": false
```

Do not invent or publish:

- organisation number
- VAT number
- F-tax approval
- registered address
- registration date

When registration is complete, update the confirmed values in the same settings object.

## Organisation Number, VAT, Address, and F-Tax

Add these only after they are confirmed:

```json
"organisationNumber": "",
"vatNumber": "",
"fTaxApproved": true,
"businessAddress": ""
```

Empty fields are not displayed on the legal pages.

## Direct Payments

Direct payments are disabled while registration is pending. Keep:

```json
"acceptsDirectPayments": false
```

Only set this to `true` after Saul deliberately decides to activate commercial transactions and the policies have received qualified Swedish legal review.

## Effective Dates

Update:

```json
"effectiveDate": "YYYY-MM-DD",
"lastUpdated": "YYYY-MM-DD"
```

when policies materially change.

## Cookie Categories

Cookie labels and descriptions are in `content/legal.json` under `cookieConsent`.

The current implementation uses:

- necessary local storage for cookie choices
- optional media consent for YouTube, Spotify, and similar embeds

No analytics provider was found during this implementation. If analytics, CMS authentication, advertising, or marketing tools are added, update the Cookie Policy first.

## Embedded Services Audit

Currently referenced external services include:

- YouTube for teaching video embeds
- Spotify for artist embeds and music links
- Apple Music for music links
- Transistor for podcast links/RSS fallback
- Apple Books, Amazon, and Google Play Books for book retailer links
- Instagram and YouTube social links
- GitHub/source hosting and site hosting such as Vercel or another deployment provider

Optional media embeds should remain blocked until media consent is accepted.

## Translated Policies

English, French, and Swedish policy content lives in each policy object:

```text
policies.terms.en
policies.terms.fr
policies.terms.sv
```

Missing translations fall back to English. Avoid deleting important clauses from translated versions.

## Authoritative Language

The current authoritative language is configured as:

```json
"authoritativeLocale": "en"
```

The public notice says English is authoritative until final legal review. If Swedish should become authoritative later, update the setting and the notice text.

## Legal Review

These pages are implementation-ready drafting content, not final legal advice. Before enabling direct payments, deposits, paid bookings, or completed print orders through the website, the policies should receive final review from a qualified Swedish lawyer.
