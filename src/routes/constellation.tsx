import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { Reveal, SectionBackground } from "@/components/seker/primitives";
import { DescentSection } from "@/components/seker/Descent";
import earth from "@/assets/earth-texture.jpg";
import satellite from "@/assets/satellite-real.png";

const TITLE = "SEKER-1 and SEKER-2 | Seker Space Intelligence";
const DESCRIPTION =
  "Our own sensors in orbit, over chosen areas and at ports, built to check what every ship really does.";

const SENSORS: [string, string][] = [
  ["Thermal infrared", "Sees the heat of a ship's engines, day and night, even when its transponder is off."],
  ["Radar signal receiver", "Picks up a ship's own navigation radar through cloud and darkness, and locates the ship independently of what it broadcasts. It only listens and never transmits."],
  ["Ship broadcast receiver (AIS)", "Hears what every ship says about itself, so HERA AI can test each claim against what the other sensors measure."],
  ["Sea state", "Reads wave conditions from reflected navigation satellite signals, for safer pilot boarding and work at sea."],
];

const WHY: [string, string][] = [
  ["One clock", "Every sensor on board shares one clock, so when two readings disagree, the difference comes from the ship and not from our instruments."],
  ["Independent position", "We locate ships from the signals they give off, not only from the position they choose to broadcast."],
  ["A second opinion on every source", "HERA AI already learns from partner data. Our own sensors will let it check every partner source against our own measurements."],
];

const COLLECT: [string, string][] = [
  ["In orbit", "SEKER-1 and SEKER-2 will cover the open ocean, far beyond the reach of any coast, with two satellites for more frequent passes."],
  ["Over a chosen area", "A long-endurance drone will carry the same sensors and stay over one area for days, for cases that need a closer and longer look."],
  ["At the port", "Our own receivers at ports will hear every arrival and departure first-hand."],
];

export const Route = createFileRoute("/constellation")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://seker-space.com/constellation" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://seker-space.com/constellation" }],
  }),
  component: ConstellationPage,
});

function Card({ t, d }: { t: string; d: string }) {
  return (
    <div className="h-full rounded-lg border border-white/10 bg-navy/70 p-6">
      <span className="block h-1.5 w-1.5 rounded-full bg-cyan" />
      <h3 className="mt-4 text-lg font-light text-foreground">{t}</h3>
      <p className="mt-2 text-sm font-light text-muted-foreground">{d}</p>
    </div>
  );
}

function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="text-eyebrow text-gold">{eyebrow}</p>
      <h2 className="text-balance mt-6 text-3xl font-light tracking-tight text-foreground sm:text-5xl">{title}</h2>
    </Reveal>
  );
}

function ConstellationPage() {
  return (
    <div className="overflow-x-hidden bg-navy">
      <ScrollProgress />
      <Nav />
      <main>
        <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-32">
          <SectionBackground src={earth} alt="Earth seen from orbit" overlay="bg-navy/70" />
          <img
            src={satellite}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-1/2 w-[70%] max-w-[640px] -translate-y-1/2 opacity-60 drop-shadow-[0_0_40px_rgba(77,217,192,0.25)] sm:right-[4%] sm:w-[42%] sm:opacity-90"
          />
          <div className="relative mx-auto w-full max-w-7xl">
            <Reveal>
              <p className="text-eyebrow text-gold">SEKER-1 · SEKER-2</p>
              <h1 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl">
                Our own sensors.
                <br />
                <span className="text-gold">Better data, better intelligence.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-balance text-lg font-light text-foreground/80">
                SEKER-1 and SEKER-2 will carry sensors built for one job: checking what every ship really does, not only what it says.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/"
                  hash="contact"
                  className="border border-gold/60 px-6 py-3 font-mono text-xs tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
                >
                  DISCUSS YOUR USE CASE →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <DescentSection />

        <section className="bg-navy-deep px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <Head eyebrow="On board" title="What each sensor adds." />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SENSORS.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.05}><Card t={t} d={d} /></Reveal>
              ))}
            </div>
            <Reveal>
              <p className="mt-8 text-sm font-light text-muted-foreground">
                When a case needs a picture, HERA AI also orders radar and optical images from partner satellites.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-navy px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <Head eyebrow="Why it is more accurate" title="Measured, not reported." />
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {WHY.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.05}>
                  <span className="block h-1.5 w-1.5 rounded-full bg-cyan" />
                  <h3 className="mt-4 text-lg font-light text-foreground">{t}</h3>
                  <p className="mt-2 text-sm font-light text-muted-foreground">{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <Head eyebrow="How we collect" title="Three ways to get closer." />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {COLLECT.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.05}><Card t={t} d={d} /></Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy px-6 py-28 text-center">
          <Reveal>
            <h2 className="text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">
              Better data in.
              <br />
              <span className="text-gold">Better intelligence out.</span>
            </h2>
            <Link
              to="/"
              hash="contact"
              className="mt-10 inline-block border border-gold/60 bg-gold/90 px-6 py-3 font-mono text-xs tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold"
            >
              DISCUSS YOUR USE CASE →
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
