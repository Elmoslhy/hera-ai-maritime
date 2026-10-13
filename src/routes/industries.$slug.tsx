import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { Reveal, SectionBackground } from "@/components/seker/primitives";
import { UseCasesSection } from "@/components/seker/UseCases";
import { getIndustry } from "@/content/industries";
import { closingCta } from "@/content/intelligence";

const gold = "border border-gold/60 bg-gold/90 px-6 py-3 font-mono text-xs tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold";
const outline = "border border-gold/60 px-6 py-3 font-mono text-xs tracking-[0.22em] text-gold transition-colors hover:bg-gold/10";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    if (params.slug === "maritime-security") {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: "/industries/$slug", params: { slug: "defense" }, replace: true });
    }
    const industry = getIndustry(params.slug);
    if (!industry) throw notFound();
    return { slug: industry.slug };
  },
  head: ({ loaderData }) => {
    const i = loaderData ? getIndustry(loaderData.slug) : undefined;
    if (!i) return { meta: [{ title: "Industry not found · SEKER" }, { name: "robots", content: "noindex" }] };
    const title = `${i.navName} | Seker Space Intelligence`;
    const url = `https://hera-sea-spy.lovable.app/industries/${i.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: i.body },
        { property: "og:title", content: title },
        { property: "og:description", content: i.body },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy px-6 text-center">
      <p className="text-eyebrow text-gold">Industries</p>
      <h1 className="text-3xl font-light text-foreground">This industry page is not available.</h1>
      <Link to="/" className={outline}>BACK TO HOME</Link>
    </div>
  ),
  component: IndustryPage,
});

function Pill() {
  return (
    <span className="inline-flex rounded-full border border-gold/60 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-gold">
      ON OUR ROADMAP
    </span>
  );
}

function IndustryPage() {
  const { slug } = Route.useLoaderData();
  const i = getIndustry(slug)!;
  return (
    <div className="overflow-x-hidden bg-navy">
      <ScrollProgress />
      <Nav />
      <main>
        <section className="relative flex min-h-screen items-center px-6 py-32">
          <SectionBackground src={i.heroImage} alt={i.eyebrow} overlay="bg-navy/70" />
          <div className="relative mx-auto w-full max-w-7xl">
            <Reveal>
              <p className="text-eyebrow text-gold">{i.eyebrow}</p>
              <h1 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl">
                {i.headline[0]}
                <br />
                <span className="text-gold">{i.headline[1]}</span>
              </h1>
              <p className="mt-8 max-w-2xl text-balance text-lg font-light text-foreground/80">{i.body}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/" hash="contact" className={gold}>DISCUSS YOUR USE CASE →</Link>
                <a href="#see-it-work" className={outline}>SEE IT WORK</a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-28 text-center">
          <Reveal>
            <h2 className="text-balance mx-auto max-w-4xl text-3xl font-light tracking-tight text-foreground sm:text-5xl">
              {i.statement.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg font-light text-foreground/75">{i.statement.body}</p>
            <Link to="/" hash="contact" className={`mt-10 inline-block ${gold}`}>CONTACT US</Link>
          </Reveal>
        </section>

        <section className="bg-navy px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <Reveal><p className="text-eyebrow text-gold">Core capabilities</p></Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {i.capabilities.map((c, n) => (
                <Reveal key={c.title} delay={n * 0.05}>
                  <div className="h-full rounded-lg border border-white/10 bg-navy/70 p-6 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
                      {c.roadmap && <Pill />}
                    </div>
                    <h3 className="mt-5 text-lg font-light text-foreground">{c.title}</h3>
                    <p className="mt-2 text-sm font-light text-foreground/70">{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-24">
          <div className="mx-auto max-w-7xl space-y-24">
            {i.blocks.map((b, n) => (
              <Reveal key={b.label}>
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <img
                    src={b.image}
                    alt={b.alt}
                    loading="lazy"
                    className={`aspect-[4/3] w-full rounded-lg border border-white/10 object-cover ${n % 2 ? "lg:order-2" : ""}`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 font-mono text-sm text-gold">
                        0{n + 1}
                      </span>
                      <span className="font-mono text-xs tracking-[0.2em] text-gold">{b.label}</span>
                    </div>
                    <h3 className="text-balance mt-6 text-2xl font-light text-foreground sm:text-3xl">{b.title}</h3>
                    <p className="mt-4 font-light text-foreground/75">{b.text}</p>
                    <ul className="mt-6 space-y-3">
                      {b.bullets.map((x) => (
                        <li key={x} className="flex gap-3 text-sm font-light text-foreground/85">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <UseCasesSection ids={i.useCaseIds} sectionId="see-it-work" eyebrow="See it work" headline={["Mission walkthroughs,", "step by step."]} />

        <section className="bg-navy-deep px-6 py-8">
          <Link
            to="/intelligence"
            hash="tasking"
            className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-navy/70 px-5 py-4 backdrop-blur transition-colors hover:border-gold/40"
          >
            <Pill />
            <span className="min-w-0 flex-1 text-sm font-light text-foreground/85">{i.roadmapNote}</span>
            <span className="font-mono text-xs tracking-[0.2em] text-gold">→</span>
          </Link>
        </section>

        <section className="bg-navy px-6 py-28 text-center">
          <Reveal>
            <h2 className="text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">
              {closingCta.headline[0]}
              <br />
              <span className="text-gold">{closingCta.headline[1]}</span>
            </h2>
            <Link to="/" hash="contact" className={`mt-10 inline-block ${gold}`}>{closingCta.button} →</Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
