import Link from "next/link";
import { site } from "@/lib/content";

const nav = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "Podcast", href: "/podcast" },
  { label: "Photography", href: "/photography" },
  { label: "Teaching Videos", href: "/teaching-videos" },
  { label: "Teaching & Events", href: "/teaching-events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <nav aria-label="Primary navigation" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link className="group inline-flex items-center gap-3" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-ink font-serif text-lg text-bone">B</span>
          <span>
            <span className="block font-serif text-lg leading-none text-ink">{site.brandName}</span>
            <span className="block text-xs uppercase tracking-[0.22em] text-ink/55">Saul Loubassa Bighonda</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-ink/70">
          {nav.map((item) => (
            <Link className="transition hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
