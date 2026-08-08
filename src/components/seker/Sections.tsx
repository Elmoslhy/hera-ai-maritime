import satelliteNetwork from "@/assets/satellite-network.jpg";
import ocean from "@/assets/ocean.jpg";
import vessels from "@/assets/vessels.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import { SekerLogo } from "./Logo";
import { HeroHud, HeroScene } from "./HeroScene";
import { CountUp, Reveal, SectionBackground } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-navy-deep" />
      <HeroScene />
      <HeroHud />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Reveal>
          <SekerLogo className="mx-auto w-[min(72vw,460px)] text-foreground" />
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className="text-balance mt-8 text-3xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
            We track every ship.
            <br />
            <span className="font-normal">Even when it hides.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="text-pretty mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            AIS off? Spoofed? Our satellites still see the ship. Five sensors, fused by{" "}
            <span className="text-gold">HERA AI</span> into one verified position per vessel.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <a
            href="#contact"
            className="mt-10 inline-block bg-gold px-8 py-4 font-mono text-[11px] tracking-[0.22em] text-navy-deep transition-opacity hover:opacity-90"
          >
            REQUEST API ACCESS →
          </a>
        </Reveal>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/70">
          SCROLL TO EXPLORE
        </span>
        <svg
          width="20"
          height="46"
          viewBox="0 0 22 52"
          fill="none"
          aria-hidden
          className="animate-bounce text-foreground/50"
        >
          <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1" />
          <circle cx="11" cy="10" r="2" fill="currentColor" />
          <path d="M5 40l6 5 6-5" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M5 46l6 5 6-5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}

export function LaunchSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* full-screen video background */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          src="/hero-video.mp4"
          poster={vessels}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_0%,rgba(9,18,31,0.85)_80%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <Reveal>
          <p className="text-eyebrow text-gold/80">EU Sovereign · Real Time</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Launching with
            <br />
            <span className="text-gold">HERA AI</span>
          </h2>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="text-pretty mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            The verified maritime intelligence layer Europe has been waiting for.
          </p>
        </Reveal>
        <Reveal delay={0.36}>
          <div className="mt-14 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-cyan">
            <span className="h-px w-10 bg-cyan/40" />
            LAUNCHING 2026
            <span className="h-px w-10 bg-cyan/40" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const CHIPS = ["AIS-T", "AIS-S", "SAR", "RF", "OPT", "TIR", "PROPRIETARY SENSORS"];

export function ConstellationSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6">
      <SectionBackground src={satelliteNetwork} alt="Satellite constellation" overlay="bg-navy/70" />
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <p className="text-eyebrow text-gold">The Constellation</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="mt-6 text-balance text-3xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            Every vessel signal fused in orbit
            <span className="mt-2 block">Delivered in real time.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-cyan"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const ALERTS = [
  {
    head: "AIS Spoofing ×3 YoY",
    body: "AIS tampering and GPS jamming are used to evade sanctions. Current platforms detect it slowly and incompletely.",
  },
  {
    head: "$100B+ annual sanctions evasion",
    body: "Enforcement agencies have unlimited appetite for verified maritime intelligence. No adequate tool exists.",
  },
  {
    head: "Zero EU sovereign providers",
    body: "At any scale, in any jurisdiction, today.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep px-6 py-28">
      <SectionBackground src={ocean} alt="Moonlit dark sea" overlay="bg-navy-deep/92" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="text-eyebrow text-gold">The Problem</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-balance mt-6 text-3xl font-light tracking-tight text-foreground sm:text-5xl">
              Maritime intelligence is broken.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <blockquote className="mt-8 border-l border-gold/40 pl-6">
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                76% of all EU trade by weight moves by sea — yet a growing shadow fleet of over
                3,300 vessels operates outside the system, moving billions in sanctioned cargo
                through AIS manipulation, GPS jamming, and identity fraud. The intelligence layer
                meant to stop this is fragmented, foreign-controlled, and failing.
              </p>
              <cite className="mt-4 block font-mono text-[10px] not-italic tracking-[0.18em] text-muted-foreground/70">
                EUROSTAT 2024 · ANU/CEPR 2025 · WINDWARD Q3 2025
              </cite>
            </blockquote>
          </Reveal>
          <div className="mt-10 space-y-5">
            {ALERTS.map((a, i) => (
              <Reveal key={a.head} delay={0.3 + i * 0.08}>
                <div className="flex gap-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-alert" />
                  <p className="font-mono text-[11px] leading-relaxed tracking-[0.06em] text-muted-foreground">
                    <span className="text-foreground">{a.head}</span> — {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <StatBlock value={<CountUp to={54} prefix="$" suffix="B" className="font-mono text-4xl text-gold" />} label="Global MDA market by 2030" />
          <StatBlock value={<CountUp to={18} suffix="%" className="font-mono text-4xl text-cyan" />} label="Sector CAGR 2024–2030" />
          <StatBlock value={<CountUp to={3} prefix="×" className="font-mono text-4xl text-alert" />} label="YoY growth in AIS spoofing" />
          <StatBlock value={<span className="font-mono text-4xl text-foreground">Zero</span>} label="EU sovereign providers today" />
        </div>
      </div>
    </section>
  );
}

function StatBlock({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="bg-navy px-6 py-10">
      <Reveal>
        {value}
        <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.18em] text-muted-foreground">
          {label.toUpperCase()}
        </p>
      </Reveal>
    </div>
  );
}

export function ContactSection() {
  return (
    <section className="bg-navy px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">
            Get in touch.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href="mailto:info@seker-space.com"
            className="mt-6 inline-block font-mono text-sm tracking-[0.14em] text-cyan hover:underline"
          >
            info@seker-space.com
          </a>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10">
            <a
              href="mailto:info@seker-space.com"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] text-navy transition-opacity hover:opacity-90"
            >
              REQUEST INTELLIGENCE BRIEF →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}