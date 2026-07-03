# CMS Setup Guide

## What Was Added

The site includes Decap CMS scaffolding at:

```text
/admin
```

Files:

```text
public/admin/index.html
public/admin/config.yml
```

Configured collections:

- Site Settings
- Teaching Videos
- Photography

The CMS is optional. The site still builds from local fallback files if CMS login is not configured.

## Recommended Setup

For this static Next.js site, the simplest practical admin path is Decap CMS with a GitHub backend.

This lets Saul log in from a phone, tablet, or computer and create or edit photo/video content. Changes are saved back to the repository as JSON files.

## What You Need To Do

1. Put the site in a GitHub repository.
2. Update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: your-github-username/your-repo-name
  branch: main
```

3. Deploy the site.
4. Configure a Decap-compatible login method.

Common options:

- Netlify Identity plus Git Gateway
- A GitHub OAuth app
- A hosting provider integration that supports Decap CMS auth

5. Visit:

```text
https://yourdomain.com/admin
```

6. Log in and create Teaching Videos or Photography entries.

## Photo Uploads

CMS photo entries are saved to:

```text
content/cms/photos/
```

Uploaded photo files are saved to:

```text
public/uploads/photos/
```

Photography fields include title, description, image, alt text, location, year, category, tags, availability, price, print sizes, purchase URL, license inquiry URL, and featured status.

## Teaching Video Uploads

CMS video entries are saved to:

```text
content/cms/videos/
```

Uploaded local videos are saved to:

```text
public/uploads/videos/
```

Thumbnails are saved to:

```text
public/uploads/thumbnails/
```

Video fields include title, description, video URL, external video URL, thumbnail, date, category, tags, duration, featured status, and visibility.

## Large Video Recommendation

Use Decap CMS for video metadata, but use YouTube, Vimeo, or Cloudinary for large video hosting.

Recommended workflow:

1. Upload the large video to YouTube, Vimeo, or Cloudinary.
2. Copy the public/unlisted video URL.
3. Paste it into the Teaching Video entry in `/admin`.
4. Publish the CMS entry.

This keeps the website repository fast and avoids storing very large video files in Git.

## Sanity Alternative

Sanity is a stronger hosted CMS if you want a dedicated media library and login without storing content in Git.

To use Sanity later:

1. Create a Sanity account.
2. Create a new Sanity project.
3. Copy the project ID.
4. Choose a dataset, usually `production`.
5. Add environment variables such as:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=optional-read-token
```

6. Create schemas for `teachingVideo`, `photo`, `book`, and `siteSettings`.
7. Update the Next.js content helpers to fetch from Sanity with a timeout and local fallback.

Sanity is not required for the current build.
