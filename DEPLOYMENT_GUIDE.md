# Deployment Guide

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Check production build

```bash
npm run lint
npm run build
```

## Optional environment variables

Create `.env.local` for local development or add these in the host dashboard:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_BOOKING_URL=https://cal.com/your-name
CUSTOM_DOMAIN=yourdomain.com
WWW_DOMAIN=www.yourdomain.com
```

Only `NEXT_PUBLIC_SITE_URL` is recommended for accurate SEO URLs. The rest are optional.

## Deploy to Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Vercel, create a new project from the repo.
3. Framework should be detected as Next.js.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. Add optional environment variables in Project Settings.
7. Deploy.

## Deploy to Netlify

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Netlify, create a new site from the repo.
3. Build command: `npm run build`.
4. Publish directory: `.next`.
5. Install the official Netlify Next.js runtime if Netlify does not add it automatically.
6. Add optional environment variables in Site configuration.
7. Deploy.

## Replace placeholder images

Brand and portrait images:

```text
public/images/brand/
```

Book covers:

```text
public/images/books/
```

Photography:

```text
public/images/photos/
```

After replacing files, update the matching paths in `content/site.json`, `content/books.json`, or `content/photos.json`.

## Add real book covers and photos

Use optimized `.jpg`, `.png`, or `.webp` files. Keep filenames simple, lowercase, and hyphenated.

Example:

```json
"coverImage": "/images/books/what-if-you-were-wrong-cover.jpg"
```

For photos, also update `alt`, `price`, `printSizes`, `purchaseUrl`, and `licenseInquiryUrl`.
