import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Layers, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { Footer, Nav } from "@/components/seker/Chrome";
import { careersIntro, careersPage, jobFamilies, jobs, speculative } from "@/content/careers";

const TITLE = "Careers | Seker Space Intelligence";
const DESC = careersIntro.slice(0, 155);
const ICONS: Record<string, LucideIcon> = { ShieldCheck, Users, Layers, Globe };
const famImg = careersPage.familyImages as Record<string, string>;

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: careersPage.hero.image }],
  }),
  component: CareersPage,
});

const btn =
  "inline-block px-7 py-3.5 font-mono text-xs tracking-[0.2em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function CareersPage() {
  const open = jobs.filter((j) => j.status === "open");
  const families = jobFamilies
    .map((f) => ({ ...f, roles: open.filter((j) => j.family === f.key) }))
    .filter((f) => f.roles.length > 0);
  const subject = encodeURIComponent(`${speculative.id} - ${speculative.title}`);
  const { hero, whatWeBuild, values, process } = careersPage;

  return (
    <div className="min-h-screen bg-navy">
      <Nav />

      {/* Hero */}
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden">
        <img
          src={hero.image}
          alt={hero.alt}
          width={2400}
          height={1029}
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/85 to-navy/40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/90 via-navy/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-40">
          <p className="text-eyebrow text-gold">Careers</p>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-light tracking-tight text-foreground sm:text-6xl">
            {hero.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/85">{hero.subheading}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#open-roles" className={`${btn} bg-gold text-navy-deep hover:opacity-90`}>
              {hero.primaryCta.toUpperCase()} →
            </a>
            <a href="#speculative" className={`${btn} border border-foreground/30 text-foreground hover:border-gold hover:text-gold`}>
              {hero.secondaryCta.toUpperCase()}
            </a>
          </div>
        </div>
      </section>

      <main>
        {/* What we build */}
        <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="build">
          <h2 id="build" className="text-3xl font-light text-foreground sm:text-4xl">{whatWeBuild.heading}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whatWeBuild.items.map((it) => (
              <article
                key={it.key}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-gold/40"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={it.image}
                    alt={it.alt}
                    width={1600}
                    height={1200}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-normal text-gold">{it.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* How we work */}
        <section className="border-y border-white/5 bg-gold/[0.035]" aria-labelledby="work">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 id="work" className="text-3xl font-light text-foreground sm:text-4xl">{values.heading}</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {values.items.map((v) => {
                const Icon = ICONS[v.icon] ?? ShieldCheck;
                return (
                  <div key={v.title}>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg font-normal text-foreground">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section id="open-roles" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24" aria-labelledby="roles">
          <h2 id="roles" className="text-3xl font-light text-foreground sm:text-4xl">Open roles</h2>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">{careersIntro}</p>
          {families.map((f) => (
            <div key={f.key} className="mt-16" aria-labelledby={`fam-${f.key}`}>
              <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                {famImg[f.key] && (
                  <img src={famImg[f.key]} alt="" width={64} height={48} loading="lazy" className="h-12 w-16 rounded-md object-cover" />
                )}
                <div>
                  <h3 id={`fam-${f.key}`} className="text-2xl font-light text-foreground">{f.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {f.roles.map((j) => (
                  <article
                    key={j.id}
                    className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-gold/40"
                  >
                    <span className="self-start rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-gold">
                      {j.id}
                    </span>
                    <h4 className="mt-4 text-xl font-normal text-foreground">{j.title}</h4>
                    <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-muted-foreground">
                      {j.location} · {j.workArrangement} · {j.employmentType}
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{j.summary}</p>
                    <Link
                      to="/careers/$slug"
                      params={{ slug: j.slug }}
                      className="mt-6 self-start font-mono text-xs tracking-[0.2em] text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      VIEW ROLE →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* How we hire */}
        <section className="mx-auto max-w-6xl px-6 pb-24" aria-labelledby="hire">
          <h2 id="hire" className="text-3xl font-light text-foreground sm:text-4xl">{process.heading}</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
            {process.steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 md:block">
                {i < process.steps.length - 1 && (
                  <span aria-hidden className="absolute left-5 top-11 h-[calc(100%-1rem)] w-px bg-gold/25 md:left-12 md:top-5 md:h-px md:w-[calc(100%-1.5rem)]" />
                )}
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold bg-navy font-mono text-sm text-gold">
                  {i + 1}
                </span>
                <div className="md:mt-5">
                  <h3 className="text-lg font-normal text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Speculative */}
        <section id="speculative" className="scroll-mt-24 border-t border-gold/20 bg-navy-deep" aria-labelledby="spec">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-gold">
              {speculative.id}
            </span>
            <h2 id="spec" className="mt-5 text-3xl font-light text-foreground">{speculative.title}</h2>
            <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{speculative.text}</p>
            <a href={`mailto:info@seker-space.com?subject=${subject}`} className={`${btn} mt-8 bg-gold text-navy-deep hover:opacity-90`}>
              APPLY →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
