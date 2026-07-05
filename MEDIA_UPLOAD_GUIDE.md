# Media Upload Guide

## Current Teaching Video

The current Teaching Videos entry uses an external YouTube Shorts embed:

```text
https://youtube.com/shorts/BLuYqPFmHpM?si=i932Co5zqYbUC6Zf
```

It appears on:

```text
/teaching-videos
```

The local fallback entry is in:

```text
content/videos.json
```

## Add a Video Locally

Local videos are still supported for small files, but external hosting is preferred.

1. Put a small video file in `public/videos/`.
2. Rename it with lowercase letters, no spaces, and hyphens.
3. Add an entry to `content/videos.json`.

Example:

```json
{
  "slug": "example-teaching",
  "title": "Example Teaching",
  "description": "A short teaching video.",
  "videoUrl": "/videos/example-teaching.mp4",
  "thumbnailUrl": "/images/site/bs.jpg",
  "date": "2026-07-03",
  "category": "Teaching",
  "tags": ["Teaching"],
  "duration": "",
  "featured": false,
  "visibility": "public"
}
```

## Add a Photo Locally

1. Put the image file in `public/images/photos/`.
2. Rename it with lowercase letters, no spaces, and hyphens.
3. Add an entry to `content/photos.json`.

## Add Music Release Cover Art Locally

1. Put the image file in `public/images/music/`.
2. Rename it with lowercase letters, no spaces, and hyphens.
3. Add or update the release entry in `content/music.json`.

Example cover path:

```json
"/images/music/example-release-cover.jpg"
```

Add Spotify and Apple Music release links in the matching `spotifyUrl` and `appleMusicUrl` fields. The artist-level links live in `spotifyArtistUrl` and `appleMusicArtistUrl`.

## Future Uploads From Any Device

The site now includes Decap CMS scaffolding at:

```text
/admin
```

After CMS setup, Saul can log in from a phone, tablet, or computer to create Teaching Videos, Photography entries, and Music Releases.

CMS-created draft content can be saved in:

```text
content/cms/videos/
content/cms/photos/
content/cms/music/
```

Uploaded media is saved in:

```text
public/uploads/videos/
public/uploads/photos/
public/uploads/thumbnails/
public/uploads/music/
```

The current live site uses the local fallback JSON files so the build works without CMS credentials. After the Decap backend is connected, review CMS-created entries and copy approved items into `content/videos.json`, `content/photos.json`, or `content/music.json`, or add a tested CMS sync step.

## Strong Recommendation For Future Videos

The current video is embedded from YouTube. Large videos should not be stored directly in the GitHub repository because they can make the repo slow and expensive to clone/deploy.

For future videos, prefer:

- YouTube public or unlisted embeds
- Vimeo embeds
- Cloudinary video hosting
- Sanity asset hosting

The Teaching Videos page supports local `/videos/...` files, YouTube/YouTube Shorts, Vimeo URLs, and direct hosted video URLs such as Cloudinary MP4 links.
