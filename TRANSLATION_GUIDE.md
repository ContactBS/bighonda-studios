# Translation Guide

Bighonda Studios uses local, build-safe translation files. No external translation API is called at runtime or during `npm run build`.

## Locales

- English: `en`
- French: `fr`
- Swedish: `sv`

English is the default locale and keeps the original routes:

```text
/
/about
/books
/music-by-saul
```

French and Swedish use route prefixes:

```text
/fr
/fr/about
/fr/books
/fr/music-by-saul

/sv
/sv/about
/sv/books
/sv/music-by-saul
```

## Where Content Lives

English source content stays in:

```text
content/site.json
content/books.json
content/podcast.json
content/photos.json
content/services.json
content/videos.json
content/music.json
content/faqs.json
content/testimonials.json
```

French translations live in:

```text
content/locales/fr/content.json
```

Swedish translations live in:

```text
content/locales/sv/content.json
```

Shared interface labels, navigation, footer text, button labels, form labels, and page headings live in:

```text
lib/i18n-config.ts
```

## How Fallback Works

The helper in `lib/localized-content.ts` merges each translation overlay on top of the English source content.

If a French or Swedish field is missing, the English value is used automatically. This allows partial translation updates without breaking the site.

Slugs, image paths, purchase links, podcast links, music links, and other URLs remain shared unless explicitly overridden.

## Updating a Translation

To update a translated book description:

1. Open `content/locales/fr/content.json` or `content/locales/sv/content.json`.
2. Find the matching book by `slug`.
3. Edit the translated fields such as `title`, `subtitle`, `description`, `highlight`, or `topics`.
4. Run `npm run lint`.
5. Run `npm run build`.

To update navigation, buttons, forms, or reusable page copy, edit `lib/i18n-config.ts`.

## Adding Another Language

1. Add the locale code to `locales` in `lib/i18n-config.ts`.
2. Add labels for the new locale in `localeLabels`, `localeNames`, `localeOg`, and `ui`.
3. Create a new overlay file such as `content/locales/es/content.json`.
4. Import the overlay in `lib/localized-content.ts`.
5. Add the locale to the localized route generation and sitemap lists.
6. Run `npm run lint` and `npm run build`.

## Testing Locally

Start the site:

```bash
npm run dev
```

Check these routes:

```text
/
/about
/books
/books/what-if-you-were-wrong
/books/dear-son-welcome-to-life
/books/even-science-agrees
/podcast
/photography
/teaching-events
/teaching-videos
/music-by-saul
/contact

/fr
/fr/about
/fr/books
/fr/podcast
/fr/photography
/fr/teaching-events
/fr/teaching-videos
/fr/music-by-saul
/fr/contact

/sv
/sv/about
/sv/books
/sv/podcast
/sv/photography
/sv/teaching-events
/sv/teaching-videos
/sv/music-by-saul
/sv/contact
```

Use the header language switcher to confirm the same page is preserved when moving between English, French, and Swedish.
