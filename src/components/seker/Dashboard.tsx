import { useState } from "react";
import { CountUp, Reveal } from "./primitives";

const TOP_STATS = [
  { label: "Vessels Tracked", to: 17253, suffix: "", tone: "text-foreground" },
  { label: "Spoofs · 24h", to: 23, suffix: "", tone: "text-alert" },
  { label: "Digital Twins Active", to: 7891, suffix: "", tone: "text-foreground" },
  { label: "Stream Latency P99", to: 104, suffix: "ms", tone: "text-cyan" },
];

const VERIFIED: [number, number][] = [
  [512, 214], [498, 238], [540, 196], [556, 232], [575, 250], [604, 236], [470, 262],
  [452, 232], [430, 206], [408, 250], [386, 228], [520, 268], [548, 288], [578, 300],
  [606, 282], [636, 264], [662, 296], [690, 276], [712, 308], [736, 288], [352, 268],
  [318, 300], [286, 268], [250, 306], [214, 282], [182, 320], [148, 292], [116, 330],
  [252, 214], [292, 190], [332, 176], [372, 160], [418, 148], [462, 160], [500, 142],
  [540, 158], [584, 148], [624, 172], [664, 190], [700, 214], [742, 236], [776, 262],
  [86, 268], [120, 240], [158, 226], [196, 250], [232, 350], [300, 358], [368, 340],
  [436, 356], [504, 336], [572, 352], [640, 338], [708, 356], [776, 336],
];
const PENDING: [number, number][] = [
  [466, 208], [598, 214], [340, 240], [672, 240], [244, 268], [744, 200], [406, 306],
];
const SPOOFING: [number, number][] = [
  [620, 320], [530, 322], [700, 178],
];

function LiveMap() {
  const [tab, setTab] = useState("LIVE MAP");
  return (
    <div className="rounded-xl border border-white/10 bg-navy-deep/80 p-4 backdrop-blur-sm">
      <TabRow tabs={["LIVE MAP", "SEKER-1 MISSION", "FUSION"]} active={tab} onSelect={setTab} />
      <div className="relative mt-4 overflow-hidden rounded-lg border border-white/5 bg-[#060d18]">
        <svg viewBox="0 0 860 420" className="h-full w-full">
          <defs>
            <pattern id="grid" width="43" height="42" patternUnits="userSpaceOnUse">
              <path d="M43 0H0V42" fill="none" stroke="#4dd9c0" strokeWidth="0.4" opacity="0.09" />
            </pattern>
          </defs>
          <rect width="860" height="420" fill="url(#grid)" />
          <g fill="none" stroke="#4dd9c0" strokeWidth="0.9" opacity="0.3">
            <path d="M120 120 L200 96 L286 108 L340 84 L430 92 L520 70 L612 88 L700 74 L790 104" />
            <path d="M150 200 L214 176 L280 196 L352 172 L420 190 L492 168 L560 190 L640 172 L720 198 L800 180" />
            <path d="M96 300 L180 276 L268 296 L356 272 L444 294 L534 268 L620 292 L710 270 L800 296" />
            <path d="M300 130 C 360 200, 420 210, 470 268 C 520 320, 600 330, 660 300" />
            <path d="M470 268 C 540 258, 610 268, 680 246" />
          </g>
          {VERIFIED.map(([x, y], i) => (
            <circle key={`v${i}`} cx={x} cy={y} r="2.6" fill="#4dd9c0" opacity="0.85" />
          ))}
          {PENDING.map(([x, y], i) => (
            <circle key={`p${i}`} cx={x} cy={y} r="3" fill="#e0a33c" opacity="0.9" />
          ))}
          {SPOOFING.map(([x, y], i) => (
            <g key={`s${i}`}>
              <circle cx={x} cy={y} r="9" fill="#ff4d4d" opacity="0.15" />
              <circle cx={x} cy={y} r="3.4" fill="#ff4d4d" />
            </g>
          ))}
          <g>
            <circle cx="512" cy="214" r="7" fill="none" stroke="#4dd9c0" strokeWidth="1" />
            <line x1="512" y1="214" x2="512" y2="164" stroke="#4dd9c0" strokeWidth="0.8" />
          </g>
        </svg>
        <div className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 rounded-md border border-cyan/40 bg-navy/90 px-3 py-2 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-foreground">
          SARAVA II · MMSI 211166830
          <br />
          <span className="text-muted-foreground">0 kn · </span>
          <span className="text-cyan">VERIFIED</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
        <Legend color="bg-cyan" label="VERIFIED" />
        <Legend color="bg-amber" label="PENDING" />
        <Legend color="bg-alert" label="SPOOFING" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function TabRow({
  tabs,
  active,
  onSelect,
}: {
  tabs: string[];
  active: string;
  onSelect: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`rounded-md px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] transition-colors ${
            active === t
              ? "bg-white/8 text-cyan"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

const FIELDS = [
  ["POSITION", "40.701, 13.958"],
  ["SPEED", "11.3 kn"],
  ["IMO", "9001033"],
  ["COURSE", "228.1°"],
];

const SOURCES: { id: string; state: "active" | "inactive" | "gold" }[] = [
  { id: "AIS-T", state: "active" },
  { id: "AIS-S", state: "active" },
  { id: "SAR", state: "active" },
  { id: "TIR", state: "active" },
  { id: "RF", state: "inactive" },
  { id: "OPT", state: "inactive" },
  { id: "PROPRIETARY", state: "gold" },
];

const TIMELINE: { t: string; text: string; tone?: string }[] = [
  { t: "-2h 14m", text: "Position verified" },
  { t: "-1d 03h", text: "Port call · Rotterdam" },
  { t: "-3d 08h", text: "AIS gap 47 min", tone: "text-amber" },
  { t: "-7d", text: "Ownership confirmed" },
];

function DigitalTwin() {
  const [tab, setTab] = useState("TWIN");
  return (
    <div className="rounded-xl border border-white/10 bg-navy-deep/80 p-4 backdrop-blur-sm">
      <TabRow tabs={["TWIN", "STREAM", "API", "DATA"]} active={tab} onSelect={setTab} />
      <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-medium tracking-wide text-foreground">
              ANYTHING GOES IV
            </h3>
            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
              MMSI 229000804 · BULK CARRIER
            </p>
          </div>
          <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-cyan">
            ✓ BLUE TICK VERIFIED
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
            <span>CONFIDENCE</span>
            <span className="text-cyan">80.7%</span>
          </div>
          <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-cyan" style={{ width: "80.7%" }} />
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
          {FIELDS.map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">{k}</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
          FUSION SOURCES
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SOURCES.map((s) => (
            <span
              key={s.id}
              className={`rounded border px-2 py-1 font-mono text-[9px] tracking-[0.16em] ${
                s.state === "active"
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : s.state === "gold"
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-white/10 text-muted-foreground"
              }`}
            >
              {s.id}
            </span>
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
          {TIMELINE.map((e) => (
            <div key={e.t} className="flex gap-4 font-mono text-[10px] tracking-[0.12em]">
              <span className="w-16 shrink-0 text-muted-foreground">{e.t}</span>
              <span className={e.tone ?? "text-foreground/80"}>{e.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[10px] tracking-[0.2em]">
          <span className="text-muted-foreground">RISK</span>
          <span className="flex items-center gap-2 text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            LOW
          </span>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Multi-source fusion",
    body: "Every AIS stream cross-validated against ESA SAR, TIR, and optical imagery in real time.",
  },
  {
    title: "Digital twin per vessel",
    body: "Living intelligence object: identity, kinematics, behavioural baseline, anomaly history, sanctions risk. Updated every 4.2 seconds.",
  },
  {
    title: "Blue Tick verification",
    body: "Tamper-proof data. Spoofing corrected automatically. AIS gaps logged and context-scored. Minimum latency. Everywhere.",
  },
];

export function DashboardSection() {
  return (
    <section className="bg-navy px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-5xl">
            We don't track vessels. <span className="text-gold">We know them.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 lg:grid-cols-4">
          {TOP_STATS.map((s, i) => (
            <div key={s.label} className="bg-navy-deep px-5 py-7 text-center">
              <Reveal delay={i * 0.08}>
                <CountUp
                  to={s.to}
                  suffix={s.suffix}
                  className={`font-mono text-2xl sm:text-3xl ${s.tone}`}
                />
                <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                  {s.label.toUpperCase()}
                </p>
              </Reveal>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <LiveMap />
          </Reveal>
          <Reveal delay={0.1}>
            <DigitalTwin />
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <span className="font-mono text-[9px] tracking-[0.24em] text-gold">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-lg font-medium text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}