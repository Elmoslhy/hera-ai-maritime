import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { Reveal, SectionBackground } from "@/components/seker/primitives";
import network from "@/assets/satellite-network.jpg";

const TITLE = "Company | SEKER";
const DESC =
  "SEKER Space Intelligence is a Luxembourg company building independent maritime intelligence for the people who act on the sea.";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyPage,
});

const BELIEFS: [string, string][] = [
  ["Accuracy over volume", "Every ship checked field by field, so each answer can be trusted."],
  ["Independent of what ships report", "We measure for ourselves instead of relying on what ships broadcast."],
  ["Built in Europe", "Designed and operated in Luxembourg, under European rules."],
];

const gold =
  "inline-block bg-gold px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-navy-deep transition-opacity hover:opacity-90";
const outline =
  "inline-block border border-gold/60 px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-gold transition-colors hover:bg-gold/10";

function CompanyPage() {
  return (
    <div className="min-h-screen bg-navy">
      <ScrollProgress />
      <Nav />
      <main>
        <section className="relative flex min-h-[80vh] items-center overflow-hidden px-6 pt-28 pb-20">
          <SectionBackground src={network} alt="Satellite network over Earth" overlay="bg-navy/70" />
          <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
            <Reveal><p className="text-eyebrow text-gold">Company</p></Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-balance mt-6 text-4xl font-light leading-[1.08] tracking-tight text-foreground sm:text-6xl">
                We deliver intelligence on every ship at sea.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-pretty mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">{DESC}</p>
            </Reveal>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="text-center">
              <p className="text-eyebrow text-gold">What we believe</p>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {BELIEFS.map(([t, b], i) => (
                <Reveal key={t} delay={i * 0.08}>
                  <div className="h-full rounded-sm border border-gold/25 bg-[#060d18]/70 p-6">
                    <span className="font-mono text-xs tracking-[0.22em] text-gold">0{i + 1}</span>
                    <h2 className="text-balance mt-3 text-xl font-light text-foreground">{t}</h2>
                    <p className="text-pretty mt-3 text-sm leading-relaxed text-muted-foreground">{b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-24 text-center">
          <Reveal><p className="text-eyebrow text-gold">Join us</p></Reveal>
          <Reveal delay={0.1}>
            <p className="text-balance mx-auto mt-6 max-w-2xl text-2xl font-light text-foreground sm:text-3xl">
              We are hiring engineers and analysts who want to see what others miss.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link to="/careers" className={`${outline} mt-10`}>SEE OPEN ROLES →</Link>
          </Reveal>
        </section>

        <section className="px-6 py-24 text-center">
          <Reveal><p className="text-eyebrow text-gold">News and contact</p></Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/newsroom" className={outline}>NEWSROOM →</Link>
              <a href="/#contact" className={gold}>DISCUSS YOUR USE CASE</a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
