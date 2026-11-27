import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Footer, Nav } from "@/components/seker/Chrome";
import { formatNewsDate, newsroom, publishedNews, type NewsItem, type NewsType } from "@/content/newsroom";

const TITLE = "Newsroom | Seker Space Intelligence";
const DESC = newsroom.hero.subheading;

export const Route = createFileRoute("/newsroom/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500&family=Schibsted+Grotesk:wght@700&display=swap" }, { rel: "alternate", type: "application/rss+xml", title: "Seker Newsroom", href: "/newsroom/rss.xml" }],
  }),
  component: NewsroomPage,
});

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
const badge = "rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-gold";
const CHIPS: { label: string; type: NewsType | "All" }[] = [
  { label: "All", type: "All" },
  { label: "Press releases", type: "Press release" },
  { label: "News", type: "News" },
  { label: "Events", type: "Event" },
];
const LOGOS = [
  ["White (for dark backgrounds)", "seker-logo-white", "#061428"],
  ["Gold", "seker-logo-gold", "#061428"],
  ["Dark (for light backgrounds)", "seker-logo-dark", "#FFFFFF"],
] as const;
const HEAD_FONT = "'Schibsted Grotesk', sans-serif";
const BODY_FONT = "'Public Sans', sans-serif";
const IMAGES = [
  ["Team and payload integration", "/careers/hero.webp"],
  ["Payload", "/careers/payload.webp"],
  ["Platform", "/careers/platform.webp"],
] as const;

function Track() {
  return (
    <svg className="news-tracks pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-30" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden>
      <path d="M-20 320 C 300 260, 600 340, 1220 180" fill="none" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="4 10" />
      <path d="M-20 220 C 400 140, 800 260, 1220 90" fill="none" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="4 10" />
      <style>{`.news-tracks path{animation:newsdash 30s linear infinite}@keyframes newsdash{to{stroke-dashoffset:-280}}@media (prefers-reduced-motion: reduce){.news-tracks path{animation:none}}`}</style>
    </svg>
  );
}

function Card({ n }: { n: NewsItem }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-gold/40">
      <Link to="/newsroom/$slug" params={{ slug: n.slug }} className={`block ${focus}`}>
        <div className="aspect-[16/10] overflow-hidden">
          <img src={n.image} alt={n.alt} width={1600} height={1000} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={badge}>{n.type.toUpperCase()}</span>
            <time dateTime={n.date} className="font-mono text-xs text-muted-foreground">{formatNewsDate(n.date)}</time>
          </div>
          <h3 className="mt-4 text-lg font-normal text-foreground">{n.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/75">{n.summary}</p>
        </div>
      </Link>
    </article>
  );
}

function NewsroomPage() {
  const items = publishedNews();
  const [filter, setFilter] = useState<NewsType | "All">("All");
  const [copied, setCopied] = useState(false);
  const featured = items[0];
  const chips = CHIPS.filter((c) => c.type === "All" || items.some((i) => i.type === c.type));
  const shown = items.filter((i) => filter === "All" || i.type === filter);
  const mc = newsroom.mediaContact;
  const mail = `mailto:${mc.email}?subject=${encodeURIComponent(mc.subject)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(newsroom.boilerplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-navy">
      <Nav />
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-deep to-navy px-6 pb-20 pt-40">
        <Track />
        <div className="mx-auto max-w-6xl">
          <p className="text-eyebrow text-gold">SEKER SPACE INTELLIGENCE</p>
          <h1 className="mt-4 text-5xl font-light text-foreground sm:text-6xl">{newsroom.hero.heading}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/85">{newsroom.hero.subheading}</p>
        </div>
      </section>

      <main>
        {featured && (
          <section className="mx-auto max-w-6xl px-6 py-16" aria-labelledby="featured">
            <h2 id="featured" className="sr-only">Featured story</h2>
            <article className="grid overflow-hidden rounded-xl border border-gold/25 bg-white/[0.03] md:grid-cols-2">
              <img src={featured.image} alt={featured.alt} width={1600} height={1000} loading="lazy" className="h-full min-h-64 w-full object-cover" />
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={badge}>{featured.type.toUpperCase()}</span>
                  <time dateTime={featured.date} className="font-mono text-xs text-muted-foreground">{formatNewsDate(featured.date)}</time>
                </div>
                <h3 className="mt-5 text-2xl font-light text-foreground sm:text-3xl">{featured.title}</h3>
                <p className="mt-4 leading-relaxed text-foreground/80">{featured.subtitle}</p>
                <Link to="/newsroom/$slug" params={{ slug: featured.slug }} className={`mt-8 font-mono text-xs tracking-[0.2em] text-gold hover:underline ${focus}`}>
                  READ MORE →
                </Link>
              </div>
            </article>
          </section>
        )}

        {items.length > 1 && (
          <section className="mx-auto max-w-6xl px-6 pb-16" aria-labelledby="all">
            <h2 id="all" className="text-3xl font-light text-foreground">All stories</h2>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter stories">
              {chips.map((c) => (
                <button
                  key={c.type}
                  onClick={() => setFilter(c.type)}
                  aria-pressed={filter === c.type}
                  className={`rounded-full border px-4 py-2 font-mono text-xs tracking-[0.12em] transition ${focus} ${filter === c.type ? "border-gold bg-gold text-navy-deep" : "border-white/20 text-foreground/80 hover:border-gold hover:text-gold"}`}
                >
                  {c.label.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((n) => <Card key={n.slug} n={n} />)}
            </div>
          </section>
        )}

        <section className="bg-[#061428]" aria-labelledby="kit" style={{ fontFamily: BODY_FONT }}>
          <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 id="kit" className="text-3xl font-bold tracking-[-0.03em] text-[#FFFFFF]" style={{ fontFamily: HEAD_FONT }}>Media kit</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-[#FFFFFF]" style={{ fontFamily: HEAD_FONT }}>About Seker</h3>
              <p className="mt-4 leading-relaxed text-[#FFFFFF]">{newsroom.boilerplate}</p>
              <div className="mt-5 flex items-center gap-4">
                <button onClick={copy} className={`rounded-full border border-[#C0972B] px-5 py-2.5 text-sm text-[#FFFFFF] hover:bg-[#C0972B]/15 ${focus}`}>
                  Copy text
                </button>
                <span role="status" className="text-sm text-[#A9B8CC]">{copied ? "Copied" : ""}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-[#FFFFFF]" style={{ fontFamily: HEAD_FONT }}>Fact sheet</h3>
              <dl className="mt-4 divide-y divide-[#C0972B]/40 border-y border-[#C0972B]/40">
                {newsroom.factSheet.map((f) => (
                  <div key={f.label} className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                    <dt className="text-sm text-[#A9B8CC]">{f.label}</dt>
                    <dd className="text-sm text-[#FFFFFF]">
                      {"href" in f && f.href ? <a href={f.href} className={`hover:underline ${focus}`}>{f.value}</a> : f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-xl font-bold tracking-[-0.03em] text-[#FFFFFF]" style={{ fontFamily: HEAD_FONT }}>Logos and images</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LOGOS.map(([label, file, bg]) => (
                <li key={file} className="rounded-lg bg-[#132B4F] p-4">
                  <div className="mb-3 flex aspect-[16/9] items-center justify-center rounded-md p-6" style={{ background: bg }}>
                    <img src={`/press/${file}.svg`} alt={`Seker logo, ${label.toLowerCase()}`} className="max-h-full max-w-[70%] object-contain" loading="lazy" />
                  </div>
                  <p className="text-sm text-[#FFFFFF]">Logo · {label}</p>
                  <p className="mt-2 flex gap-4 text-xs">
                    <a href={`/press/${file}.svg`} download className={`text-[#C0972B] hover:underline ${focus}`}>SVG</a>
                    <a href={`/press/${file}.png`} download className={`text-[#C0972B] hover:underline ${focus}`}>PNG</a>
                  </p>
                </li>
              ))}
              {IMAGES.map(([label, src]) => (
                <li key={src} className="rounded-lg bg-[#132B4F] p-4">
                  <img src={src} alt={label} className="mb-3 aspect-[16/9] w-full rounded-md object-cover" loading="lazy" />
                  <p className="text-sm text-[#FFFFFF]">Image · {label}</p>
                  <a href={src} download className={`mt-2 inline-block text-xs text-[#C0972B] hover:underline ${focus}`}>WEBP</a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-20" aria-labelledby="media">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="media" className="text-3xl font-light text-foreground">{mc.label}</h2>
            <p className="mt-4 text-foreground/80">{mc.text}</p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <a href={mail} className={`inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-navy-deep shadow-[0_10px_30px_-12px_rgba(215,178,74,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#F2CF68] ${focus}`}>
                Email the press team <span aria-hidden="true">→</span>
              </a>
              <a href={mail} className={`text-base text-foreground/80 underline-offset-4 hover:text-gold hover:underline ${focus}`}>
                {mc.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
