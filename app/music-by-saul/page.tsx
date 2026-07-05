import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeader } from "@/components/SectionHeader";
import { getRecentMusicReleases, music } from "@/lib/content";
import type { MusicRelease } from "@/lib/types";

export const metadata: Metadata = {
  title: "Music by Saul",
  description: "Songs written and produced by Saul Loubassa Bighonda, blending faith, reflection, transformation, and AI-assisted musical production.",
  keywords: [
    "Saul Loubassa Bighonda music",
    "Music by Saul",
    "Bighonda Studios music",
    "Be Ye Transformed music",
    "faith-based music",
    "AI-assisted music",
    "songwriter",
    "music producer"
  ]
};

export default function MusicBySaulPage() {
  const releases = getRecentMusicReleases(5);
  const spotifyEmbedUrl = getSpotifyArtistEmbedUrl(music.spotifyArtistUrl);

  return (
    <>
      <section className="section-pad bg-ink text-bone">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="eyebrow text-bronze">{music.artistName}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">{music.pageTitle}</h1>
          </div>
          <div>
            <p className="text-lg leading-8 text-bone/78">{music.intro}</p>
            <p className="mt-5 border-l-4 border-bronze pl-5 leading-8 text-bone/70">{music.aiDisclosure}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={music.spotifyArtistUrl} variant="secondary">Listen on Spotify</ButtonLink>
              <ButtonLink href={music.appleMusicArtistUrl} variant="secondary">Listen on Apple Music</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="content-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Artist page"
              title="Faith, reflection, and experimental production."
              description="Listen through Saul's artist profiles, then update the local release list as new songs are published."
            />
            <div className="mt-8">
              <ButtonLink href="/contact">Discuss music or creative work</ButtonLink>
            </div>
          </div>
          {spotifyEmbedUrl ? (
            <div className="overflow-hidden rounded-sm border border-ink/10 bg-bone shadow-soft">
              <iframe
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="h-[352px] w-full"
                loading="lazy"
                src={spotifyEmbedUrl}
                title={`${music.artistName} on Spotify`}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-pad bg-bone">
        <div className="content-wrap">
          <SectionHeader
            eyebrow="Recent Releases"
            title="Recent Releases"
            description="Explore recent songs written and produced by Saul Loubassa Bighonda."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {releases.map((release) => (
              <MusicReleaseCard key={`${release.order}-${release.title}`} release={release} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MusicReleaseCard({ release }: { release: MusicRelease }) {
  return (
    <article className="flex min-h-full flex-col border border-ink/10 bg-paper p-4 shadow-soft">
      {release.coverImage ? (
        <div className="relative aspect-square overflow-hidden bg-ink/5">
          <Image alt={`${release.title} cover art`} className="object-cover" fill sizes="(min-width: 1024px) 20vw, (min-width: 768px) 50vw, 100vw" src={release.coverImage} />
        </div>
      ) : (
        <div className="grid aspect-square place-items-center bg-ink text-center font-serif text-4xl text-bone">MS</div>
      )}
      <p className="eyebrow mt-5">{[release.releaseType, release.releaseDate].filter(Boolean).join(" / ")}</p>
      <h2 className="mt-3 font-serif text-2xl leading-tight text-ink">{release.title}</h2>
      <p className="mt-4 flex-1 text-sm leading-7 text-ink/68">{release.description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
        {release.spotifyUrl ? <a className="text-clay underline decoration-bronze/50 underline-offset-4" href={release.spotifyUrl} rel="noreferrer" target="_blank">Spotify</a> : null}
        {release.appleMusicUrl ? <a className="text-clay underline decoration-bronze/50 underline-offset-4" href={release.appleMusicUrl} rel="noreferrer" target="_blank">Apple Music</a> : null}
      </div>
    </article>
  );
}

function getSpotifyArtistEmbedUrl(artistUrl: string) {
  try {
    const url = new URL(artistUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const artistIndex = parts.indexOf("artist");
    const artistId = artistIndex >= 0 ? parts[artistIndex + 1] : "";
    return artistId ? `https://open.spotify.com/embed/artist/${artistId}` : "";
  } catch {
    return "";
  }
}
