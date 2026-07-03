# Editing Guide

This site is intentionally content-driven. Most wording, links, images, prices, and service details can be changed by editing JSON files in `content/`.

## Homepage copy

Edit `content/site.json`.

Important fields:

- `brandName`
- `ownerName`
- `tagline`
- `intro`
- `mission`
- `aboutBio`
- `home`
- `newsletter`
- `socialLinks`
- `portraitImage`
- `heroImage`

## Books

Edit `content/books.json`.

Each book supports:

- `slug`
- `title`
- `subtitle`
- `author`
- `status`
- `year`
- `featured`
- `displayOrder`
- `coverImage`
- `genre`
- `format`
- `description`
- `highlight`
- `topics`
- `purchaseLinks`
- `related`

To add a book, copy an existing object, update the values, and give it a unique `slug`. The detail page will automatically appear at `/books/your-slug`.

## Photos

Edit `content/photos.json`.

Future photo uploads can also be managed through `/admin` after Decap CMS is connected. The current build-safe source is `content/photos.json`; CMS-created photo entries should be reviewed and copied into that fallback file until the CMS backend workflow is fully connected and tested.

Place final photo files in:

```text
public/images/photos/
```

Then update the `image` path, for example:

```json
"image": "/images/photos/real-photo-name.jpg"
```

Each photo supports title, location, year, description, alt text, category, tags, availability, price, print sizes, purchase URL, license inquiry URL, and featured status.

If `purchaseUrl` is empty, the site shows a request/inquiry link instead of fake checkout.

## Teaching Videos

The Teaching Videos page is available at `/teaching-videos`.

Local fallback videos are listed in `content/videos.json`. CMS-created video entries can be saved in `content/cms/videos/` after admin setup; keep `content/videos.json` updated as the build-safe fallback source.

Local video files should live in:

```text
public/videos/
```

Use public paths in content:

```json
"/videos/example-teaching.mp4"
```

The page also supports external YouTube, YouTube Shorts, Vimeo, and direct hosted video URLs such as Cloudinary MP4 links. For large video files, prefer YouTube, Vimeo, Cloudinary, or another hosted video service instead of storing large files in the repository.

## Podcast

Edit `content/podcast.json`.

Update:

- podcast description
- Transistor URL
- Apple Podcasts, Spotify, YouTube, Amazon Music, Overcast, and Pocket Casts links
- latest episode entries

The site tries to fetch podcast episodes from the Transistor RSS feed at build time. If the RSS fetch fails or times out, it uses local fallback entries from `content/podcast.json`.

## Booking and event services

Edit `content/services.json`.

Each service supports:

- title
- short description
- ideal audience
- topics
- format
- duration
- booking CTA

The booking form lives on `/teaching-events`.

Optional environment variables:

```bash
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_BOOKING_URL=https://cal.com/your-name
```

If `NEXT_PUBLIC_BOOKING_URL` is set, the site shows a Book a Time button. If `NEXT_PUBLIC_CONTACT_EMAIL` is set, mailto forms use that email.

## How to Add or Replace Images

Main image folders:

- `public/images/brand/`
- `public/images/books/`
- `public/images/photos/`
- `public/images/podcast/`
- `public/images/portraits/`
- `public/images/site/`

After adding an image file, rename it with lowercase letters, no spaces, and no special characters. Then update the corresponding path in the content JSON.

Use public image paths only. The real file goes here:

```text
public/images/photos/example.jpg
```

The JSON should say:

```json
"/images/photos/example.jpg"
```

Do not use local Mac paths such as `/Users/...`, `Documents/Codex/...`, or iCloud Drive paths as image values.

### Replace Saul's Portrait

Real file location:

```text
public/images/portraits/saul-bighonda-portrait.jpg
```

JSON path in `content/site.json`:

```json
"/images/portraits/saul-bighonda-portrait.jpg"
```

Current Saul portrait:

```json
"/images/portraits/saul-bighonda-portrait.png"
```

### Replace Book Covers

Real file location:

```text
public/images/books/dear-son-welcome-to-life.jpg
```

JSON path in `content/books.json`:

```json
"/images/books/dear-son-welcome-to-life.jpg"
```

Current Dear Son cover:

```json
"/images/books/dear-son-welcome-to-life-cover.png"
```

## Podcast Episodes

The site tries to fetch episodes from:

```text
https://feeds.transistor.fm/be-ye-transformed
```

If the RSS fetch fails or times out, the site uses local fallback content from `content/podcast.json`. This prevents the production build from hanging or failing because of the RSS feed.

## Forms

The forms do not store submissions locally. They compose an email to the configured contact address.

To use Formspree, Netlify Forms, or another provider later, replace the submit behavior in `components/ContactForm.tsx` with the provider action.

For Netlify Forms, keep the `data-netlify="true"` form attribute and follow Netlify's form setup instructions after deployment.

## Optional Decap CMS

An optional Decap CMS entry is included at `/admin`.

Files:

- `public/admin/index.html`
- `public/admin/config.yml`

This is optional and does not affect the build. To make it fully functional, connect it to GitHub/Netlify Identity or another compatible Decap backend and update the backend settings in `public/admin/config.yml`.

Decap CMS is configured for:

- Site settings
- Teaching videos
- Photography entries

See `CMS_SETUP_GUIDE.md` and `MEDIA_UPLOAD_GUIDE.md`.

## Deploy

See `DEPLOYMENT_GUIDE.md`.

## Connect a domain

See `DOMAIN_SETUP.md`.
