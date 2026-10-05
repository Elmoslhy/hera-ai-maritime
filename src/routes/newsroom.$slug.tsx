import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Footer, Nav } from "@/components/seker/Chrome";
import { formatNewsDate, newsroom, publishedNews, SITE_URL } from "@/content/newsroom";

export const Route = createFileRoute("/newsroom/$slug")({
  loader: ({ params }) => {
    const item = publishedNews().find((n) => n.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not available | Seker Space Intelligence" }, { name: "robots", content: "noindex" }] };
    const n = loaderData.item;
    const title = `${n.title} | Seker Space Intelligence`;
    const img = SITE_URL + n.image;
    const org = { "@type": "Organization", name: "Seker Space Intelligence" };
    const ld = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: n.title,
      description: n.summary,
      datePublished: n.date,
      image: [img],
      author: org,
      publisher: { ...org, logo: { "@type": "ImageObject", url: `${SITE_URL}/press/seker-logo-gold.png` } },
    };
    return {
      meta: [
        { title },
        { name: "description", content: n.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: n.summary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: img },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: img },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }],
    };
  },
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-navy">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-48 text-center">
        <h1 className="text-3xl font-light text-foreground">This article is not available</h1>
        <Link to="/newsroom" className={`mt-8 inline-block font-mono text-xs tracking-[0.2em] text-gold hover:underline ${focus}`}>← BACK TO NEWSROOM</Link>
      </main>
      <Footer />
    </div>
  );
}

function ArticlePage() {
  const { item: n } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const more = publishedNews().filter((m) => m.slug !== n.slug).slice(0, 3);
  const url = `${SITE_URL}/newsroom/${n.slug}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(n.title);
  const shares = [
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ["X", `https://x.com/intent/post?url=${u}&text=${t}`],
    ["Email", `mailto:?subject=${t}&body=${u}`],
  ];
  const mc = newsroom.mediaContact;

  return (
    <div className="min-h-screen bg-navy">
      <Nav />
      <header className="relative isolate flex min-h-[52vh] items-end overflow-hidden">
        <img src={n.image} alt={n.alt} width={2400} height={1029} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/80 to-navy/50" />
        <div className="mx-auto w-full max-w-3xl px-6 pb-10 pt-40">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-gold">{n.type.toUpperCase()}</span>
            <time dateTime={n.date} className="font-mono text-xs text-foreground/80">{formatNewsDate(n.date)}</time>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <h1 className="mt-6 text-balance text-3xl font-light leading-tight text-foreground sm:text-5xl">{n.title}</h1>
        <p className="mt-6 text-xl font-light leading-relaxed text-foreground/75 sm:text-2xl">{n.subtitle}</p>

        <div className="mt-12 max-w-[70ch] space-y-6 text-lg leading-relaxed text-foreground/90">
          {n.body.map((p, i) => (
            <div key={i}>
              <p>
                {i === 0 && <strong className="font-semibold [font-variant:small-caps]">{n.dateline}. </strong>}
                {p}
              </p>
              {i === 1 && n.quote && (
                <blockquote className="my-10 border-l-2 border-gold pl-6">
                  <p className="text-2xl font-light italic leading-relaxed text-foreground">“{n.quote.text}”</p>
                  <footer className="mt-4 text-sm text-foreground/70">
                    <span className="text-gold">{n.quote.author}</span>, {n.quote.role}
                  </footer>
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {n.cta && (
          n.cta.href.startsWith("/") ? (
            <a href={n.cta.href} className={`mt-10 inline-block bg-gold px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-navy-deep hover:opacity-90 ${focus}`}>{n.cta.label.toUpperCase()} →</a>
          ) : (
            <a href={n.cta.href} className={`mt-10 inline-block bg-gold px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-navy-deep hover:opacity-90 ${focus}`}>{n.cta.label.toUpperCase()} →</a>
          )
        )}

        <aside className="mt-16 rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-lg font-normal text-gold">About Seker Space Intelligence</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">{newsroom.boilerplate}</p>
          <p className="mt-5 text-sm text-foreground/80">
            Media contact: <a href={`mailto:${mc.email}?subject=${encodeURIComponent(mc.subject)}`} className={`text-gold hover:underline ${focus}`}>{mc.email}</a>
          </p>
        </aside>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground">SHARE</span>
          {shares.map(([label, href]) => (
            <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" className={`rounded-full border border-white/20 px-4 py-1.5 font-mono text-xs text-foreground/85 hover:border-gold hover:text-gold ${focus}`}>{label}</a>
          ))}
          <button
            onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className={`rounded-full border border-white/20 px-4 py-1.5 font-mono text-xs text-foreground/85 hover:border-gold hover:text-gold ${focus}`}
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        {more.length > 0 && (
          <section className="mt-16" aria-labelledby="more">
            <h2 id="more" className="text-2xl font-light text-foreground">More from the newsroom</h2>
            <ul className="mt-6 space-y-4">
              {more.map((m) => (
                <li key={m.slug}>
                  <Link to="/newsroom/$slug" params={{ slug: m.slug }} className={`text-gold hover:underline ${focus}`}>{m.title}</Link>
                  <p className="font-mono text-xs text-muted-foreground">{formatNewsDate(m.date)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link to="/newsroom" className={`mt-14 inline-block font-mono text-xs tracking-[0.2em] text-gold hover:underline ${focus}`}>← BACK TO NEWSROOM</Link>
      </main>
      <Footer />
    </div>
  );
}
