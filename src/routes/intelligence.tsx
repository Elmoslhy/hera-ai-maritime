import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { Reveal, SectionBackground } from "@/components/seker/primitives";
import { UseCasesSection } from "@/components/seker/UseCases";
import { WorkspaceSection } from "@/components/seker/Workspace";
import vessels from "@/assets/vessels.jpg";
import { intelligenceHero as h, intelligenceSteps } from "@/content/intelligence";

const TITLE = "Intelligence in Practice · HERA AI by SEKER";
const DESCRIPTION =
  "How HERA AI works real maritime cases: detect, cue, collect, fuse, assess and deliver a finding you can defend.";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntelligencePage,
});

function Reticle({
  className,
  tag,
  tone,
}: {
  className: string;
  tag: string;
  tone: "cyan" | "alert";
}) {
  const c = "absolute h-4 w-4 border-gold";
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      <div className="relative h-full w-full">
        <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
        <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
        <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
        <div
          className={`absolute left-0 top-full mt-2 flex items-center gap-2 whitespace-nowrap rounded-lg border border-white/10 bg-navy/70 px-2 py-1 font-mono text-[10px] tracking-[0.16em] backdrop-blur ${
            tone === "cyan" ? "text-cyan" : "text-alert"
          }`}
        >
          <span
            className={`blink-dot h-1.5 w-1.5 rounded-full ${tone === "cyan" ? "bg-cyan" : "bg-alert"}`}
          />
          {tag}
        </div>
      </div>
    </div>
  );
}

function IntelligencePage() {
  return (
    <div className="overflow-x-hidden bg-navy">
      <ScrollProgress />
      <Nav />
      <main>
        <section className="relative flex min-h-screen items-center px-6 py-32">
          <SectionBackground src={vessels} alt="Vessels at sea seen from orbit" overlay="bg-navy/65" />
          <Reticle className="left-[8%] top-[22%] h-16 w-20 sm:h-20 sm:w-28" tag={h.tags.matched} tone="cyan" />
          <Reticle className="right-[10%] bottom-[18%] h-16 w-20 sm:h-20 sm:w-28" tag={h.tags.dark} tone="alert" />
          <div className="relative mx-auto w-full max-w-7xl">
            <Reveal>
              <p className="text-eyebrow text-gold">{h.eyebrow}</p>
              <h1 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl">
                {h.headline[0]}
                <br />
                <span className="text-gold">{h.headline[1]}</span>
              </h1>
              <p className="mt-8 max-w-2xl text-balance text-lg font-light text-foreground/80">{h.body}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#use-cases"
                  className="border border-gold/60 bg-gold/90 px-6 py-3 font-mono text-xs tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold"
                >
                  {h.primaryCta} →
                </a>
                <Link
                  to="/"
                  hash="contact"
                  className="border border-gold/60 px-6 py-3 font-mono text-xs tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
                >
                  {h.secondaryCta}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {intelligenceSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <div className="h-full rounded-lg border border-white/10 bg-navy/70 p-5 backdrop-blur">
                  <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em]">
                    <span className="text-gold">{s.n}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  </div>
                  <h3 className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm font-light text-foreground/75">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <UseCasesSection />
        <WorkspaceSection />
      </main>
      <Footer />
    </div>
  );
}
