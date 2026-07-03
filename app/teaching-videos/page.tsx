import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { teachingVideos } from "@/lib/content";
import type { TeachingVideo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Teaching Videos",
  description: "Teaching videos, sermons, lessons, reflections, and workshops from Saul Loubassa Bighonda."
};

export default function TeachingVideosPage() {
  const featuredVideos = teachingVideos.filter((video) => video.featured);
  const otherVideos = teachingVideos.filter((video) => !video.featured);

  return (
    <section className="section-pad">
      <div className="content-wrap">
        <SectionHeader
          eyebrow="Teaching Videos"
          title="Teaching, sermons, lessons, and reflections."
          description="A space for Saul Loubassa Bighonda to share teaching videos, sermons, lessons, reflections, workshops, and other video-based instruction."
        />
        <div className="mt-10 grid gap-7">
          {[...featuredVideos, ...otherVideos].map((video) => (
            <TeachingVideoCard key={video.slug} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeachingVideoCard({ video }: { video: TeachingVideo }) {
  return (
    <article className="grid gap-7 border border-ink/10 bg-bone p-5 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-7">
      <VideoEmbed video={video} />
      <div className="flex flex-col justify-center">
        <p className="eyebrow">{[video.category, video.date, video.duration].filter(Boolean).join(" / ")}</p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-5xl">{video.title}</h2>
        <p className="mt-5 leading-8 text-ink/72">{video.description}</p>
        {video.tags.length ? <p className="mt-6 text-sm font-semibold text-clay">{video.tags.join(" / ")}</p> : null}
      </div>
    </article>
  );
}

function VideoEmbed({ video }: { video: TeachingVideo }) {
  const embedUrl = getEmbedUrl(video.videoUrl);

  if (embedUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-sm bg-ink shadow-soft">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src={embedUrl}
          title={video.title}
        />
      </div>
    );
  }

  const videoType = getVideoType(video.videoUrl);

  return (
    <div className="overflow-hidden rounded-sm bg-ink shadow-soft">
      <video className="aspect-video w-full bg-ink" controls poster={video.thumbnailUrl || undefined} preload="metadata">
        <source src={video.videoUrl} type={videoType} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function getEmbedUrl(videoUrl: string) {
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch?.[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return "";
}

function getVideoType(videoUrl: string) {
  if (videoUrl.endsWith(".webm")) return "video/webm";
  if (videoUrl.endsWith(".mov")) return "video/quicktime";
  if (videoUrl.endsWith(".m4v")) return "video/x-m4v";
  return "video/mp4";
}
