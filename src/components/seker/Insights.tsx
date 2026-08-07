import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CountUp, Reveal } from "./primitives";

type Insight = {
  tag: string;
  tone: "alert" | "cyan" | "gold";
  headline: string;
  detail: string;
  action: string;
  confidence: number;
};

type Industry = {
  id: string;
  name: string;
  blurb: string;
  metrics: { label: string; to: number; suffix?: string; decimals?: number }[];
  insights: Insight[];
  chart: {
    title: string;
    unit: string;
    series: number[];
    baseline: number[];
    mix: { label: string; value: number; tone: "gold" | "cyan" | "alert" }[];
    gauge: { label: string; value: number; note: string };
  };
};

const INDUSTRIES: Industry[] = [
  {
    id: "defence",
    name: "Defence & Coast Guard",
    blurb:
      "Know which hull is in your waters before it reaches them — even with the transponder off.",
    metrics: [
      { label: "Dark vessels named / week", to: 148 },
      { label: "Median warning time", to: 42, suffix: " min" },
      { label: "Identification confidence", to: 96.8, suffix: "%", decimals: 1 },
    ],
    chart: {
      title: "Dark-vessel detections",
      unit: "per week",
      series: [82, 91, 88, 104, 119, 126, 141, 148],
      baseline: [80, 82, 83, 85, 86, 88, 90, 92],
      mix: [
        { label: "Thermal IR", value: 41, tone: "alert" },
        { label: "RF geolocation", value: 34, tone: "cyan" },
        { label: "AIS anomaly", value: 25, tone: "gold" },
      ],
      gauge: { label: "AI identification", value: 96.8, note: "Model v4 · human-verified" },
    },
    insights: [
      {
        tag: "DARK VESSEL",
        tone: "alert",
        headline: "Tanker went dark 31 NM off the coast",
        detail:
          "AIS stopped at 04:12Z. Thermal bloom and RF emissions still track the same hull heading 118°.",
        action: "Dispatch patrol — intercept window 38 minutes.",
        confidence: 97,
      },
      {
        tag: "SPOOFING",
        tone: "gold",
        headline: "Three hulls broadcasting the same identity",
        detail:
          "Identical MMSI reported from positions 400 NM apart. Two are synthetic.",
        action: "Flag the fake tracks before they enter your picture.",
        confidence: 99,
      },
      {
        tag: "RENDEZVOUS",
        tone: "cyan",
        headline: "Two vessels met outside the shipping lane",
        detail: "Both slowed to 0.4 kn for 51 minutes, hulls within 90 m.",
        action: "Log as a transfer event and watch the receiving vessel.",
        confidence: 94,
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance & P&I",
    blurb:
      "Price the risk you can prove. Every claim backed by a tamper-proof position history.",
    metrics: [
      { label: "Sanction breaches caught", to: 173 },
      { label: "Claims evidence packs / mo", to: 2400 },
      { label: "Position audit accuracy", to: 99.1, suffix: "%", decimals: 1 },
    ],
    chart: {
      title: "Sanction breaches caught",
      unit: "per month",
      series: [61, 74, 88, 97, 112, 134, 158, 173],
      baseline: [60, 63, 67, 70, 74, 78, 82, 86],
      mix: [
        { label: "Port-call proof", value: 46, tone: "gold" },
        { label: "Track forensics", value: 33, tone: "cyan" },
        { label: "Identity spoof", value: 21, tone: "alert" },
      ],
      gauge: { label: "Audit accuracy", value: 99.1, note: "Tamper-proof position history" },
    },
    insights: [
      {
        tag: "SANCTIONS",
        tone: "alert",
        headline: "Insured hull called at a restricted terminal",
        detail:
          "Reported position said open sea. Radar and thermal put it alongside for 9 hours.",
        action: "Trigger policy review before the next voyage.",
        confidence: 98,
      },
      {
        tag: "CLAIM",
        tone: "cyan",
        headline: "Reported grounding time is off by four hours",
        detail: "Verified track shows the hull static on the shoal from 21:40Z.",
        action: "Attach the signed track to the claim file.",
        confidence: 96,
      },
      {
        tag: "EXPOSURE",
        tone: "gold",
        headline: "12 insured hulls entered a war-risk zone this week",
        detail: "Aggregated exposure rose 18% against last quarter's baseline.",
        action: "Reprice the affected policies.",
        confidence: 92,
      },
    ],
  },
  {
    id: "trading",
    name: "Commodity Trading",
    blurb:
      "See the cargo move before the market does. Real flows, not filed paperwork.",
    metrics: [
      { label: "Cargo movements tracked / day", to: 9800 },
      { label: "Port call detection", to: 98.6, suffix: "%", decimals: 1 },
      { label: "Signal-to-desk latency", to: 38, suffix: " ms" },
    ],
    chart: {
      title: "Cargo movements tracked",
      unit: "per day (×100)",
      series: [54, 61, 66, 72, 79, 86, 93, 98],
      baseline: [52, 55, 58, 61, 64, 67, 70, 73],
      mix: [
        { label: "Draught change", value: 44, tone: "cyan" },
        { label: "Port call", value: 38, tone: "gold" },
        { label: "STS transfer", value: 18, tone: "alert" },
      ],
      gauge: { label: "Port-call detection", value: 98.6, note: "38 ms signal-to-desk" },
    },
    insights: [
      {
        tag: "FLOW SHIFT",
        tone: "cyan",
        headline: "Crude loadings out of the Gulf up 14% in 6 days",
        detail: "Draught changes on 31 departures confirm heavier laden hulls.",
        action: "Front-run the tonnage report by four days.",
        confidence: 93,
      },
      {
        tag: "CONGESTION",
        tone: "gold",
        headline: "Queue at the discharge port now 19 vessels",
        detail: "Average wait extended from 2.1 to 5.4 days.",
        action: "Reroute the two nearest fixtures.",
        confidence: 95,
      },
      {
        tag: "STS TRANSFER",
        tone: "alert",
        headline: "Cargo changed hulls mid-ocean",
        detail: "Draught swap detected between two vessels 180 NM offshore.",
        action: "Re-check origin before the cargo is declared.",
        confidence: 91,
      },
    ],
  },
  {
    id: "ports",
    name: "Ports & Authorities",
    blurb: "Plan the berth around what is actually arriving, hour by hour.",
    metrics: [
      { label: "Arrival ETA accuracy", to: 94.7, suffix: "%", decimals: 1 },
      { label: "Berth hours recovered / mo", to: 640 },
      { label: "Vessels in live picture", to: 120, suffix: "K" },
    ],
    chart: {
      title: "Berth hours recovered",
      unit: "per month",
      series: [310, 366, 402, 448, 501, 552, 598, 640],
      baseline: [300, 320, 340, 360, 380, 400, 420, 440],
      mix: [
        { label: "ETA correction", value: 52, tone: "cyan" },
        { label: "Anchorage load", value: 31, tone: "gold" },
        { label: "Unidentified hull", value: 17, tone: "alert" },
      ],
      gauge: { label: "Arrival ETA accuracy", value: 94.7, note: "Rolling 24 h forecast" },
    },
    insights: [
      {
        tag: "ETA",
        tone: "cyan",
        headline: "Inbound bulker will arrive 6 hours early",
        detail: "Speed over ground has held 2.3 kn above her filed plan.",
        action: "Move the pilot booking forward.",
        confidence: 95,
      },
      {
        tag: "ANCHORAGE",
        tone: "gold",
        headline: "Anchorage saturation hits 88% by Thursday",
        detail: "Fourteen arrivals converge inside a nine-hour window.",
        action: "Stagger two berths to clear the peak.",
        confidence: 90,
      },
      {
        tag: "UNIDENTIFIED",
        tone: "alert",
        headline: "Unregistered hull inside the port approach",
        detail: "No AIS, no filing. RF fingerprint matches no known vessel.",
        action: "Alert harbour control now.",
        confidence: 89,
      },
    ],
  },
  {
    id: "environment",
    name: "Fisheries & Environment",
    blurb:
      "Catch the activity that hides from the register — inside protected water.",
    metrics: [
      { label: "IUU events flagged / mo", to: 312 },
      { label: "Protected-zone coverage", to: 100, suffix: "%" },
      { label: "Discharge detections / mo", to: 57 },
    ],
    chart: {
      title: "IUU events flagged",
      unit: "per month",
      series: [128, 156, 181, 204, 233, 262, 289, 312],
      baseline: [125, 138, 150, 163, 175, 188, 200, 212],
      mix: [
        { label: "Dark fishing", value: 48, tone: "alert" },
        { label: "Transshipment", value: 33, tone: "cyan" },
        { label: "Discharge", value: 19, tone: "gold" },
      ],
      gauge: { label: "Protected-zone coverage", value: 100, note: "Persistent revisit, day and night" },
    },
    insights: [
      {
        tag: "IUU FISHING",
        tone: "alert",
        headline: "Trawler working inside a marine reserve",
        detail:
          "Transponder off for 11 hours; thermal signature shows active gear deployment.",
        action: "Issue an enforcement notice with the verified track.",
        confidence: 96,
      },
      {
        tag: "DISCHARGE",
        tone: "gold",
        headline: "Oil sheen trailing a vessel under way",
        detail: "Radar slick 6.2 km long, aligned to her exact course.",
        action: "Name the polluter and log the evidence.",
        confidence: 93,
      },
      {
        tag: "TRANSSHIPMENT",
        tone: "cyan",
        headline: "Reefer met three trawlers in one night",
        detail: "All four hulls dark at the time of the meetings.",
        action: "Trace the catch back to source.",
        confidence: 92,
      },
    ],
  },
];

const TONE = {
  alert: {
    chip: "border-alert/40 bg-alert/10 text-alert",
    bar: "bg-alert",
    edge: "before:bg-alert",
  },
  cyan: {
    chip: "border-cyan/40 bg-cyan/10 text-cyan",
    bar: "bg-cyan",
    edge: "before:bg-cyan",
  },
  gold: {
    chip: "border-gold/40 bg-gold/10 text-gold",
    bar: "bg-gold",
    edge: "before:bg-gold",
  },
} as const;

export function InsightsSection() {
  const [active, setActive] = useState(INDUSTRIES[0].id);
  const industry = INDUSTRIES.find((i) => i.id === active)!;

  return (
    <section className="relative overflow-hidden bg-navy px-6 py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(201,168,76,0.35), transparent 55%), radial-gradient(circle at 85% 90%, rgba(77,217,192,0.28), transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Reveal className="text-center">
          <p className="text-eyebrow text-gold">Insights by Industry</p>
          <h2 className="text-balance mx-auto mt-6 max-w-3xl text-3xl font-light leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Data for actionable insights.
            <span className="mt-2 block text-cyan">We hand you the next move.</span>
          </h2>
          <p className="text-pretty mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            AI fused and trained — with a human touch.
          </p>
          <p className="text-pretty mx-auto mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            The same fused picture answers a different question for every desk.
            Pick yours.
          </p>
        </Reveal>

        {/* industry tabs */}
        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-wrap justify-center gap-2">
            {INDUSTRIES.map((i) => {
              const on = i.id === active;
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setActive(i.id)}
                  className={`relative rounded-full border px-5 py-2.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
                    on
                      ? "border-gold/60 bg-gold/12 text-gold"
                      : "border-white/12 bg-white/[0.02] text-muted-foreground hover:border-white/25 hover:text-foreground"
                  }`}
                >
                  {i.name}
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={industry.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <p className="text-pretty mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
              {industry.blurb}
            </p>

            {/* metrics */}
            <div className="mx-auto mt-9 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/8 sm:grid-cols-3">
              {industry.metrics.map((m) => (
                <div key={m.label} className="bg-navy-deep px-6 py-6 text-center">
                  <CountUp
                    to={m.to}
                    suffix={m.suffix ?? ""}
                    decimals={m.decimals ?? 0}
                    className="font-mono text-2xl font-light text-gold sm:text-3xl"
                  />
                  <p className="mt-2 font-mono text-[9px] tracking-[0.18em] uppercase text-muted-foreground">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>

            {/* insight cards */}
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {industry.insights.map((ins, idx) => {
                const tone = TONE[ins.tone];
                return (
                  <motion.article
                    key={ins.headline}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 * idx,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`group relative overflow-hidden rounded-xl border border-white/10 bg-[#070d16] p-6 transition-colors hover:border-white/20 before:absolute before:inset-y-0 before:left-0 before:w-[2px] ${tone.edge}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`rounded border px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] ${tone.chip}`}
                      >
                        {ins.tag}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                        {ins.confidence}% CONF
                      </span>
                    </div>

                    <h3 className="text-balance mt-4 text-lg font-light leading-snug text-foreground">
                      {ins.headline}
                    </h3>
                    <p className="text-pretty mt-3 text-sm leading-relaxed text-muted-foreground">
                      {ins.detail}
                    </p>

                    <div className="mt-5 border-t border-white/8 pt-4">
                      <p className="font-mono text-[8px] tracking-[0.22em] text-muted-foreground/70">
                        ACTION
                      </p>
                      <p className="text-pretty mt-2 text-sm leading-relaxed text-foreground">
                        {ins.action}
                      </p>
                    </div>

                    <div className="mt-5 h-[2px] w-full overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className={`h-full ${tone.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${ins.confidence}%` }}
                        transition={{ duration: 1.1, delay: 0.2 + 0.08 * idx }}
                      />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
