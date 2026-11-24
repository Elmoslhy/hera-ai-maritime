import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import satelliteNetwork from "@/assets/seker-europe-night.jpg";
import ocean from "@/assets/seker-earth-limb.jpg";
import vessels from "@/assets/seker-sar-port.jpg";
import { SekerLogo } from "./Logo";
import { industries } from "@/content/industries";
import { HeroScene, HeroShipCard, SampleRecord } from "./HeroScene";
import { Reveal, SectionBackground } from "./primitives";

export function HeroSection() {
  return (
    <section data-keep-center className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20 pb-24">
      
      <div className="absolute inset-0 bg-navy-deep" />
      <HeroScene />
      <HeroShipCard />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Reveal>
          <SekerLogo className="mx-auto w-[min(72vw,460px)] text-foreground" />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-eyebrow mt-8 text-gold">Independent maritime intelligence</p>
          <h1 className="text-balance mx-auto mt-4 max-w-4xl text-3xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
            Know what a ship really is, and what it is really doing.
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="relative mx-auto mt-7 max-w-2xl lg:max-w-[560px]">
            {/* soft navy scrim so the copy stays readable over the bright side of the Earth */}
            <div className="pointer-events-none absolute -inset-x-12 -inset-y-9 bg-[radial-gradient(ellipse_at_center,rgba(6,12,21,0.9)_0%,rgba(6,12,21,0.6)_45%,transparent_76%)] blur-2xl" />
            <p className="hero-lead relative text-pretty text-[15px] font-normal leading-[1.75] text-foreground/90 sm:text-lg">
              HERA AI checks each vessel's identity, position and activity against
              independent sources, screens it against official sanctions lists, and
              gives you one verified record with a confidence score. Delivered through
              our platform, our API or written briefings.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <Link
            to="/"
            hash="contact"
            className="mt-10 inline-block bg-gold px-9 py-4 font-mono text-sm font-bold tracking-[0.22em] text-navy-deep transition-opacity hover:opacity-90"
          >
            Request a sample report
          </Link>
          <a href="#hera-ai" className="mt-5 block font-mono text-sm tracking-[0.14em] text-foreground underline-offset-4 hover:underline">
            See how it works →
          </a>
        </Reveal>
      </div>
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
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
          poster={vessels}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/hero-video.webm" type='video/webm; codecs="vp9"' />
        </video>
        <div className="absolute inset-0 bg-[rgba(6,20,40,0.45)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl py-24 text-center">
        <Reveal>
          <p className="text-eyebrow text-gold">Vessel Intelligence</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-gold sm:text-7xl">
            Know every vessel.
          </h2>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="text-pretty mx-auto mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            One intelligence profile per vessel, updated continuously.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {PROFILE.map(([t, b], i) => (
            <Reveal key={t} delay={0.3 + i * 0.06}>
              <div className="h-full rounded-sm border border-gold/25 bg-[#060d18]/70 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-gold/15 px-4 py-3">
                  <span className="font-mono text-xs tracking-[0.22em] text-foreground">0{i + 1}</span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">{t}</span>
                </div>
                <p className="text-pretty px-4 py-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROFILE: [string, string][] = [
  ["Identity and ownership", "Who the vessel is, who owns it, and every name, flag and identity it has used."],
  ["Voyages and port calls", "Where it has been, where it is going and how it got there."],
  ["Cargo and draught", "How loaded it is and how much it is likely carrying."],
  ["Encounters at sea", "Which vessels it met, for how long, and whether either stopped broadcasting."],
  ["Flag and compliance", "Whether its flag is genuine and its certificates and inspections are in order."],
  ["Risk indicators", "Sanctions exposure, identity changes and behaviour that does not add up."],
];

const SERVE = [
  { slug: "commodity-trading", name: "Commodity and energy analysts", d: "Tanker arrivals, departures and activity at loading terminals, including periods when a ship stops transmitting. Daily files or API." },
  { slug: "banks", name: "Compliance, banks and traders", d: "Vessel due diligence in minutes: identity history, flag and name changes, and sanctions screening with an audit trail." },
  { slug: "ports", name: "Ports, logistics and data platforms", d: "Verified vessel particulars for every arrival, delivered by API straight into your systems." },
  { slug: "defense", name: "Government, defence and coast guard", d: "An independent picture of who is really at sea, built to European sovereignty standards." },
];

const ALSO = [
  { slug: "insurance", name: "insurance and P&I" },
  { slug: "fisheries", name: "fisheries and environment" },
  { slug: "shipping-security", name: "shipping security" },
  { slug: "search-and-rescue", name: "search and rescue" },
];

const GET_IT: {
  title: string;
  line: string;
  label: string;
  kind: "access" | "contact";
}[] = [
  {
    title: "HERA AI Platform",
    line: "See every ship, alert and briefing in one place.",
    label: "PLATFORM LOGIN →",
    kind: "access",
  },
  {
    title: "HERA AI API",
    line: "Plug checked vessel data straight into your own systems.",
    label: "ASK FOR API ACCESS →",
    kind: "contact",
  },
  {
    title: "Seker Briefings",
    line: "Written briefs on the ships and waters you care about, with the evidence behind each finding.",
    label: "ASK FOR A BRIEFING →",
    kind: "contact",
  },
];

const getItLink =
  "mt-auto inline-block self-start pt-6 font-mono text-[11px] tracking-[0.2em] text-foreground transition-colors hover:text-foreground";

export function GetItSection() {
  return (
    <section id="get-it" className="scroll-mt-24 bg-navy-deep px-6 py-28">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="text-center">
          <p className="text-eyebrow text-gold">How you get it</p>
          <h2 className="text-balance mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gold sm:text-6xl lg:text-7xl">
            Three ways to use HERA AI.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {GET_IT.map((x, i) => (
            <Reveal key={x.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-lg border border-white/10 bg-card p-6">
                <span className="block h-1.5 w-1.5 rounded-full bg-cyan" />
                <h3 className="mt-4 text-lg font-light text-foreground">{x.title}</h3>
                <p className="text-pretty mt-2 text-sm font-light text-muted-foreground">{x.line}</p>
                {x.kind === "access" ? (
                  <Link to="/access" className={getItLink}>
                    {x.label}
                  </Link>
                ) : (
                  <Link to="/" hash="contact" className={getItLink}>
                    {x.label}
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section id="solutions" className="scroll-mt-24 bg-navy px-6 py-28">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="text-center">
          <p id="industries" className="text-eyebrow scroll-mt-24 text-gold">Solutions</p>
          <h2 className="text-balance mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gold sm:text-6xl lg:text-7xl">
            Built for the maritime industry.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SERVE.map((x, i) => {
            const img = industries.find((n) => n.slug === x.slug)?.heroImage;
            return (
              <Reveal key={x.slug} delay={i * 0.06}>
                <Link
                  to="/industries/$slug"
                  params={{ slug: x.slug }}
                  className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-lg border border-white/10 p-6"
                >
                  {img && <img src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
                  <div className="relative">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">{x.name}</p>
                    <p className="mt-4 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">What you get</p>
                    <p className="text-pretty mt-2 text-base font-light leading-snug text-foreground">{x.d}</p>
                    <span className="mt-6 inline-block font-mono text-[11px] tracking-[0.2em] text-foreground group-hover:text-foreground">Learn more →</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Also used for:{" "}
            {ALSO.map((x, i) => (
              <span key={x.slug}>
                <Link to="/industries/$slug" params={{ slug: x.slug }} className="text-foreground underline-offset-4 hover:underline">{x.name}</Link>
                {i < ALSO.length - 2 ? ", " : i === ALSO.length - 2 ? " and " : "."}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const WHY: [string, string][] = [
  ["INDEPENDENT OBSERVATION", "Built on independent sources, not only on what ships choose to report."],
  ["GROUND TRUTH FROM PORTS", "Port sources worldwide confirm what ships actually did alongside."],
  ["A SECOND LOOK ON DEMAND", "When an answer is in doubt, HERA AI will send a satellite or a partner drone from the nearest port to look."],
  ["SOVEREIGN BY DESIGN", "An EU-developed maritime intelligence platform with EU-owned intellectual property, EU-based operations, and sensitive data stored, analysed and accessed exclusively within the EU."],
];

const CHIPS = ["AIS-T", "AIS-S", "SAR", "RF", "OPT", "TIR", "FUSED IN HERA AI"];

export function ConstellationSection() {
  return (
    <section data-keep-center className="relative overflow-hidden px-6 py-28">
      <SectionBackground src={satelliteNetwork} alt="Satellite constellation" overlay="bg-card" />
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <p className="text-eyebrow text-gold">Why SEKER</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-gold sm:text-6xl lg:text-7xl">
            Our own sensors are next
          </h2>
          <p className="text-pretty mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            HERA AI works today with independent sources. From 2028, our own sensors add a further, sovereign layer.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(([t, b], i) => (
            <Reveal key={t} delay={0.18 + i * 0.06}>
              <div className="h-full rounded-sm border border-gold/25 bg-card p-6">
                <p className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-gold">{t}</p>
                <p className="text-pretty mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-foreground"
              >
                {c}
              </span>
            ))}
          </div>
          <Link to="/constellation" className="mt-8 inline-block font-mono text-[11px] tracking-[0.2em] text-foreground hover:text-foreground">Our sensors →</Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep px-6 py-24">
      <SectionBackground src={ocean} alt="Moonlit dark sea" overlay="bg-navy-deep/92" />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-eyebrow text-gold">WHY ACCURACY MATTERS</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-balance mt-6 text-4xl font-semibold tracking-tight text-gold sm:text-6xl lg:text-7xl">
            A wrong answer at sea is expensive.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-pretty mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every ship reports its own name and position from a transponder. Signals are self-declared and can be switched off or faked.&nbsp;
            <br />Any decision built on self-reported data inherits its blind spots.&nbsp;
            <br />Europe cannot enforce sanctions, protect seabed infrastructure, or police its waters on a ship’s own reported data.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm sm:grid-cols-3">
          {[
            ["INSURING THE WRONG SHIP", "You pay the claim."],
            ["TRADING WITH THE WRONG SHIP", "You pay the fine. Sanctions penalties now reach hundreds of millions."],
            ["MISSING THE WRONG SHIP", "The drugs, the illegal catches or the threats get through."],
          ].map(([t, d]) => (
            <div key={t} className="bg-navy px-6 py-8">
              <p className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-gold">{t}</p>
              <p className="text-pretty mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <Reveal>
          <p className="text-pretty mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-foreground">
            Every HERA AI answer comes with a confidence score.&nbsp;
            <br />You know how sure we are before you act.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm sm:grid-cols-3">
          <StatBlock value={<span className="font-mono text-5xl text-gold">978</span>} label="Shadow fleet tankers, 18.5% of the world's tanker fleet" />
          <StatBlock value={<span className="font-mono text-5xl text-gold">80%+</span>} label="Of world trade by volume moves by sea" />
          <StatBlock value={<span className="font-mono text-5xl text-alert">22</span>} label="GPS spoofing hotspots on the busiest sea lanes" />
        </div>
        <Reveal>
          <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-foreground">THE COST OF HIDDEN SHIPS AND HOW HERA AI HELPS</p>
        </Reveal>
        <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm sm:grid-cols-3">
          <StatBlock value={<span className="font-mono text-5xl text-gold">$426–652bn</span>} label={"Annual global illegal drug trade\nMajority moves by sea"} hera="Flags ships that go dark, meet at sea or change identity before they reach port." />
          <StatBlock value={<span className="font-mono text-5xl text-gold">$26–50bn</span>} label="Lost to illegal fishing every year, worldwide" hera="Shows which fishing ships switched off or worked where they should not be." />
          <StatBlock value={<span className="font-mono text-5xl text-alert">$275M</span>} label="One US sanctions penalty for ships with spoofed AIS" hera="Screens every ship and its owners on five official lists, with a full audit trail." />
        </div>
        <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-[0.18em] text-muted-foreground/70">
          UNCTAD · S&amp;P GLOBAL 2025 · GEORGIA TECH 2026 · GFI 2017 · UNODC 2026 · SUMAILA ET AL. 2020 · OFAC 2026
        </p>
      </div>
    </section>
  );
}

const WHY_NOW: [string, string, string][] = [
  ["138 → <10", "Cargo ships crossing a day, 2025 vs October 2026", "text-alert"],
  ["0.25% → 10%", "War-risk premium as a share of a ship's value", "text-gold"],
];

const FLASHPOINTS: [string, string][] = [
  ["Strait of Hormuz", "Traffic collapses, ships go dark and positions are jammed."],
  ["Red Sea", "Attacks on shipping have pushed trade around Africa."],
  ["Black Sea", "War-risk zones, grain corridors and sanctions evasion."],
  ["Baltic Sea", "Shadow tankers and damage to undersea cables."],
  ["South China Sea", "Disputed waters on one of the busiest trade routes."],
];

const HORMUZ_DOES: [string, string][] = [
  ["See what is really happening", "Which ships really pass a chokepoint, which wait at anchor and which positions are jammed or fake."],
  ["Keep ships clear of danger", "Alerts on jamming, dark ships and seizures in the waters you sail."],
  ["Price the real risk", "Where a ship really was and who it really is, before you set the war-risk premium."],
  ["Read supply early", "Real transits, waiting tankers and dark convoys, for oil, gas and freight markets."],
  ["Know who is arriving", "Identity and sanctions status before a ship reaches your berth."],
];

export function WhyNowSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep px-6 py-24">
      <SectionBackground src={ocean} alt="Moonlit dark sea" overlay="bg-navy-deep/92" />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-eyebrow text-gold">Why now</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-balance mt-6 text-4xl font-semibold tracking-tight text-gold sm:text-6xl lg:text-7xl">
            Tension at sea keeps rising.
            <span className="mt-2 block text-foreground">Every flashpoint makes a ship's own signal less reliable.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-pretty mx-auto mt-8 max-w-2xl text-base leading-relaxed text-foreground/85">
            Conflict, sanctions and signal jamming now reach every major sea lane, from the Gulf and the Red Sea to the Black Sea, the Baltic and the waters of Asia. Each flashpoint pushes more ships to go dark or fake their position, and more insurers, traders, ports and navies to look for answers that do not depend on what a ship reports.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-5">
          {FLASHPOINTS.map(([t, l]) => (
            <div key={t} className="bg-navy px-5 py-6">
              <p className="text-base text-foreground">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-foreground">One example · Strait of Hormuz, 2026</p>
        <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm sm:grid-cols-2">
          {WHY_NOW.map(([v, l, t]) => (
            <StatBlock key={l} value={<span className={`font-mono text-4xl sm:text-5xl ${t}`}>{v}</span>} label={l} />
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="text-pretty mx-auto mt-10 max-w-2xl text-base leading-relaxed text-foreground/85">
            Hormuz will not be the last flashpoint. The need for independent answers grows with each one.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-foreground">What HERA AI does when tension rises</p>
        </Reveal>
        <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left backdrop-blur-sm">
          {HORMUZ_DOES.map(([t, l], i) => (
            <div key={t} className={`grid grid-cols-1 gap-2 bg-navy px-6 py-5 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-8 ${i ? "border-t border-white/10" : ""}`}>
              <p className="text-base text-foreground">{t}</p>
              <p className="text-base leading-relaxed text-foreground">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">On the HERA AI platform, by API or as written briefings.</p>
        <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-[0.18em] text-muted-foreground/70">
          JMIC OCT 2026 · MARSH; INSURANCE BUSINESS 2026
        </p>
      </div>
    </section>
  );
}

const PROOF: [string, string][] = [
  ["Q4 2028", "In-orbit demonstration of our own payload"],
  ["Independent", "Not owned by any data reseller or platform"],
];

export function ProofSection() {
  return (
    <section className="bg-navy-deep px-6 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 text-center sm:grid-cols-2">
        {PROOF.map(([v, l]) => (
          <StatBlock key={l} value={<span className="font-mono text-4xl text-gold">{v}</span>} label={l} />
        ))}
      </div>
    </section>
  );
}

function StatBlock({ value, label, hera }: { value: React.ReactNode; label: string; hera?: string }) {
  return (
    <div className="flex flex-col bg-navy px-6 py-10">
      <Reveal className={hera ? "flex flex-1 flex-col" : undefined}>
        {value}
        <p className="mt-3 whitespace-pre-line font-mono text-[9px] leading-relaxed tracking-[0.18em] text-muted-foreground">
          {label.toUpperCase()}
        </p>
        {hera && (
          <div className="mt-auto pt-6">
            <div className="border-t border-white/10 pt-4">
              <p className="font-mono text-[10px] tracking-[0.2em] text-foreground">HERA AI</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{hera}</p>
            </div>
          </div>
        )}
      </Reveal>
    </div>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-navy px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-balance text-center text-4xl font-semibold tracking-tight text-gold sm:text-6xl lg:text-7xl">
            Start with your own vessels.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-pretty mt-5 text-center text-base text-muted-foreground">
            Send us up to 50 IMO numbers or a list of the areas you watch. Within two working days we return a sample report showing what HERA AI finds, under NDA.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-center font-mono text-sm tracking-[0.14em] text-foreground">
            <span className="select-all">info@seker-space.com</span>
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  company: z.string().trim().min(1, "Company is required").max(120),
  email: z.string().trim().email("Enter a valid work email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

const fieldClass =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-gold/60";
const labelClass =
  "mb-2 block font-mono text-[10px] tracking-[0.2em] text-muted-foreground";

function ContactForm() {
  const [values, setValues] = useState({ name: "", company: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website }),
      });
      if (!res.ok) throw new Error("request failed");
      setValues({ name: "", company: "", email: "", message: "" });
      setWebsite("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5 text-left">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute h-px w-px overflow-hidden opacity-0"
        style={{ position: "absolute", left: "-9999px" }}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="c-name">NAME</label>
          <input id="c-name" className={fieldClass} value={values.name} onChange={set("name")} maxLength={100} placeholder="Jane Doe" />
          {errors.name && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="c-company">COMPANY</label>
          <input id="c-company" className={fieldClass} value={values.company} onChange={set("company")} maxLength={120} placeholder="Organisation" />
          {errors.company && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.company}</p>}
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="c-email">WORK EMAIL</label>
        <input id="c-email" type="email" className={fieldClass} value={values.email} onChange={set("email")} maxLength={255} placeholder="jane@company.com" />
        {errors.email && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.email}</p>}
      </div>
      <div>
        <label className={labelClass} htmlFor="c-message">MESSAGE</label>
        <textarea id="c-message" rows={5} className={fieldClass} value={values.message} onChange={set("message")} maxLength={1000} placeholder="What decisions are you trying to make?" />
        {errors.message && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.message}</p>}
      </div>
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] text-navy transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "SENDING…" : "Request a sample report"}
        </button>
        {status === "sent" && (
          <p className="font-mono text-[10px] tracking-[0.18em] text-foreground">
            Thank you. We will be in touch.
          </p>
        )}
        {status === "error" && (
          <p className="font-mono text-[10px] tracking-[0.18em] text-alert">
            Something went wrong. Please email info@seker-space.com directly.
          </p>
        )}
      </div>
    </form>
  );
}
const LIVE = [
  "Vessel identity by IMO, MMSI, name or call sign.",
  "Cross-checks on flag, call sign, name and dimensions, with conflicts flagged.",
  "Sanctions screening against official lists, with an audit trail.",
  "A live vessel picture at the world's key chokepoints.",
  "API access and written briefings.",
];

export function LiveTodaySection() {
  return (
    <section className="border-y border-white/10 bg-navy-deep px-6 py-12">
      <div className="mx-auto max-w-[1500px]">
        <p className="text-eyebrow text-gold">Live today</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LIVE.map((t) => (
            <li key={t} className="flex gap-3 rounded-lg border border-white/10 bg-card p-4 text-sm text-foreground">
              <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STEPS: [string, string][] = [
  ["Collect", "We gather vessel signals, registry records, sanctions lists and imagery from several independent sources."],
  ["Cross-check", "Every field is compared across sources. Where they disagree, HERA AI flags it and shows why."],
  ["Deliver", "You receive one record per ship with a confidence score, through the platform, the API or a briefing."],
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-navy px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <Reveal>
            <h2 className="text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">How it works</h2>
          </Reveal>
          <ol className="mt-10 grid gap-4">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <li className="rounded-lg border border-white/10 bg-card p-6">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground">0{i + 1}</p>
                  <h3 className="mt-2 text-lg font-light text-foreground">{t}</h3>
                  <p className="text-pretty mt-2 text-sm text-muted-foreground">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal delay={0.1}>
          <SampleRecord />
          <p className="text-pretty mt-3 text-sm text-muted-foreground">
            Every field shows where it came from and whether independent sources agree. Sample data, not a real ship.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function FindsSection() {
  return (
    <section className="bg-navy-deep px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p className="text-eyebrow text-gold">Example finding</p>
          <h2 className="text-balance mt-6 text-4xl font-semibold tracking-tight text-gold sm:text-6xl lg:text-7xl">What HERA AI finds</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-lg border border-white/10 bg-card p-8">
            <span className="block h-1.5 w-1.5 rounded-full bg-alert" />
            <h3 className="mt-4 text-xl font-light text-foreground">A renamed tanker on a sanctions list</h3>
            <p className="text-pretty mt-3 text-base text-muted-foreground">
              A tanker broadcasting a new name carried an IMO number that appears on the UK sanctions list under its former name. HERA AI matched the permanent IMO number, flagged the identity inconsistency and attached the official list entry.
            </p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground/80">
            Illustrative example based on public sanctions data. HERA AI reports indicators, not accusations.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
