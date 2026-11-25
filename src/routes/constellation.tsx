import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { DroneFilmFrame } from "@/components/seker/DroneFilm";
import { Reveal } from "@/components/seker/primitives";
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
  ["One clock", "Every sensor on board will share one clock, so when two readings disagree, the difference comes from the ship and not from our instruments."],
  ["Independent position", "Our sensors will locate ships from the signals they give off, not only from the position they choose to broadcast."],
  ["A second opinion on every source", "HERA AI already learns from partner data. Our own sensors will let it check every partner source against our own measurements."],
];

const COLLECT: [string, string][] = [
  ["In orbit", "SEKER-1 and SEKER-2 will cover the open ocean, far beyond the reach of any coast, with two satellites for more frequent passes."],
  ["Over a chosen area", "A long-endurance drone will carry the same sensors and stay over one area for days, for cases that need a closer and longer look."],
  ["From the nearest port", "Partner drones based near the world's major ports will fly out on request to check a ship and send what they see straight into its HERA AI record."],
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

const CALLOUTS = [
  { n: "01", label: "THERMAL IR", pos: "left-0 top-[8%]" },
  { n: "02", label: "RADAR RX", pos: "right-0 top-[8%] text-right" },
  { n: "03", label: "AIS RX", pos: "left-0 bottom-[8%]" },
  { n: "04", label: "SEA STATE", pos: "right-0 bottom-[8%] text-right" },
];

function SensorSchematic() {
  const corner = "absolute h-6 w-6 border-gold";
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className={`${corner} left-[14%] top-[14%] border-l border-t`} />
      <div className={`${corner} right-[14%] top-[14%] border-r border-t`} />
      <div className={`${corner} bottom-[14%] left-[14%] border-b border-l`} />
      <div className={`${corner} bottom-[14%] right-[14%] border-b border-r`} />
      <div aria-hidden className="absolute inset-[22%] rounded-full border border-dashed border-cyan/30" />
      <img
        src={satellite}
        alt="SEKER satellite"
        className="absolute inset-[20%] h-[60%] w-[60%] object-contain drop-shadow-[0_0_30px_rgba(77,217,192,0.25)]"
      />
      {CALLOUTS.map((c) => (
        <div key={c.n} className={`absolute ${c.pos} font-mono text-[10px] tracking-[0.2em] sm:text-xs`}>
          <span className="text-gold">{c.n}</span>{" "}
          <span className="inline-flex items-center gap-1.5 border border-cyan/40 bg-navy/80 px-2 py-1 text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConstellationPage() {
  return (
    <div className="overflow-x-hidden bg-navy">
      <ScrollProgress />
      <Nav />
      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-cyan) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-eyebrow text-gold">SEKER-1 · SEKER-2</p>
              <h1 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                Our own sensors.
                <br />
                <span className="text-gold">Better data, better intelligence.</span>
              </h1>
              <p className="mt-5 font-mono text-xs tracking-[0.22em] text-gold">In-orbit demonstration: Q4 2028</p>
              <p className="mt-8 max-w-xl text-balance text-lg font-light text-foreground/80">
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
            <Reveal delay={0.1}>
              <SensorSchematic />
            </Reveal>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <Head eyebrow="On board" title="What each sensor adds." />
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
              {SENSORS.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.05}>
                  <div className="h-full bg-navy-deep p-6 sm:p-8">
                    <span className="font-mono text-xs tracking-[0.22em] text-gold">0{i + 1}</span>
                    <h3 className="mt-3 text-xl font-light text-foreground">{t}</h3>
                    <p className="mt-2 text-sm font-light text-muted-foreground">{d}</p>
                  </div>
                </Reveal>
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
            <Head eyebrow="How we collect" title="Four ways to get closer." />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {COLLECT.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.05}><Card t={t} d={d} /></Reveal>
              ))}
            </div>
            <Reveal delay={0.2} className="mt-12">
              <DroneFilmFrame />
            </Reveal>
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
