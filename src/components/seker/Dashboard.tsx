import { useEffect, useState } from "react";
import { CountUp, Reveal } from "./primitives";
import { SekerLogo } from "./Logo";

const TOP_STATS = [
  { label: "Spoofs detected · 24h", sub: "3 zones · 11 flags", to: 173, suffix: "", tone: "text-alert" },
  { label: "Active digital twins", sub: "avg refresh 4.2s", to: 8400, suffix: "", tone: "text-cyan" },
  { label: "Stream latency P99", sub: "SLA: < 250ms", to: 112, suffix: "ms", tone: "text-foreground" },
];

/* ---------------- live map ---------------- */

type Ship = { x: number; y: number; c: string; r: number };
const CLASS_COLORS = ["#4a9eff", "#f59e42", "#3ddc84", "#4dd9c0", "#a855f7", "#ec4899", "#8fa3bb"];

// deterministic pseudo-random fleet spread across the basin
const FLEET: Ship[] = Array.from({ length: 220 }).map((_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const rx = a - Math.floor(a);
  const ry = b - Math.floor(b);
  const x = Math.round((12 + rx * 830) * 10) / 10;
  const y = Math.round((60 + ry * 300) * 10) / 10;
  return { x, y, c: CLASS_COLORS[i % CLASS_COLORS.length], r: (i * 47) % 360 };
});

function LiveMap() {
  const [tab, setTab] = useState("LIVE MAP");
  return (
    <div className="rounded-lg border border-white/10 bg-[#060d18]">
      <div className="flex items-center gap-1 border-b border-white/5 px-2 py-2">
        <TabRow tabs={["LIVE MAP", "SEKER-1 MISSION", "FUSION"]} active={tab} onSelect={setTab} />
      </div>
      <div className="relative overflow-hidden">
        <svg viewBox="0 0 860 420" className="h-full w-full">
          <defs>
            <pattern id="grid" width="43" height="42" patternUnits="userSpaceOnUse">
              <path d="M43 0H0V42" fill="none" stroke="#4dd9c0" strokeWidth="0.4" opacity="0.07" />
            </pattern>
          </defs>
          <rect width="860" height="420" fill="#0b0f14" />
          <rect width="860" height="420" fill="url(#grid)" />
          {/* coarse land masses — Europe above, Africa below */}
          <g fill="#1a1f26" stroke="#2a323c" strokeWidth="0.8">
            <path d="M0 0 H860 V52 C 760 62, 690 40, 610 66 C 540 88, 470 58, 396 84 C 330 108, 268 74, 196 96 C 128 116, 66 92, 0 108 Z" />
            <path d="M0 330 C 120 306, 240 336, 360 312 C 470 292, 590 322, 700 300 C 780 286, 830 306, 860 296 V420 H0 Z" />
            {/* Italy + Greece hints */}
            <path d="M330 60 C 350 96, 378 128, 404 152 C 414 162, 402 172, 390 162 C 358 134, 330 100, 318 70 Z" />
            <path d="M600 70 C 630 92, 640 120, 622 138 C 606 152, 588 132, 592 108 Z" />
          </g>
          {/* fleet — one triangle per vessel, heading-rotated */}
          {FLEET.map((s, i) => (
            <polygon
              key={i}
              points="0,-5 3.6,4 -3.6,4"
              fill={s.c}
              opacity="0.85"
              transform={`translate(${s.x} ${s.y}) rotate(${s.r})`}
            />
          ))}
          {/* geo-fence with flagged cluster */}
          <circle cx="250" cy="250" r="58" fill="#ff4d4d" opacity="0.10" />
          <circle cx="250" cy="250" r="58" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="6 6" />
          {[
            [232, 238], [252, 246], [266, 232], [244, 262], [270, 258], [222, 256],
          ].map(([x, y], i) => (
            <polygon key={`f${i}`} points="0,-5 3.6,4 -3.6,4" fill="#ff4d4d" transform={`translate(${x} ${y}) rotate(${i * 53})`} />
          ))}
          {/* selected target */}
          <g>
            <circle cx="512" cy="196" r="10" fill="none" stroke="#c9a84c" strokeWidth="1" />
            <line x1="512" y1="186" x2="512" y2="150" stroke="#c9a84c" strokeWidth="0.7" />
          </g>
        </svg>

        {/* zoom control */}
        <div className="absolute left-3 top-3 overflow-hidden rounded border border-white/15 bg-navy/85 font-mono text-sm text-muted-foreground">
          <button className="block h-7 w-7 border-b border-white/10 hover:text-foreground">+</button>
          <button className="block h-7 w-7 hover:text-foreground">−</button>
        </div>

        {/* target callout */}
        <div className="pointer-events-none absolute left-[58%] top-[24%] rounded-md border border-gold/40 bg-navy/90 px-3 py-2 font-mono text-[10px] leading-relaxed tracking-[0.12em]">
          ATLANTIC PEARL · MMSI 215789012
          <br />
          <span className="text-muted-foreground">14.1 kn · </span>
          <span className="text-gold">UNVERIFIED</span>
        </div>

        {/* geo-fencing tool */}
        <div className="absolute bottom-3 left-3 w-52 rounded-lg border border-white/10 bg-navy/90 p-3 backdrop-blur-sm">
          <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">GEO-FENCING</p>
          <div className="mt-2 rounded border border-white/10 bg-white/[0.04] px-2 py-1.5 font-mono text-[10px] text-foreground">
            Restricted
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[9px] tracking-[0.14em]">
            <span className="rounded border border-white/10 px-2 py-1 text-muted-foreground">● CIRCLE</span>
            <span className="rounded border border-gold/40 bg-gold/10 px-2 py-1 text-gold">▰ POLYGON</span>
          </div>
          <p className="mt-2 font-mono text-[10px] text-alert">37 in zones</p>
        </div>

        {/* legend */}
        <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-wrap justify-center gap-3 rounded-md border border-white/10 bg-navy/90 px-3 py-2 font-mono text-[9px] tracking-[0.16em] text-muted-foreground sm:flex">
          {[
            ["#4a9eff", "CARGO"], ["#f59e42", "TANKER"], ["#3ddc84", "PASSENGER"], ["#4dd9c0", "FISHING"],
            ["#a855f7", "TUG"], ["#ec4899", "SAILING"], ["#8fa3bb", "UNKNOWN"], ["#ff4d4d", "FLAGGED"],
          ].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabRow({ tabs, active, onSelect }: { tabs: string[]; active: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`rounded px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] transition-colors ${
            active === t ? "bg-white/8 text-cyan" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------------- sensor layer thumbnails ---------------- */

function TirThumb() {
  return (
    <svg viewBox="0 0 100 56" className="h-full w-full" aria-hidden>
      <rect width="100" height="56" fill="#1a0f22" />
      <ellipse cx="52" cy="30" rx="30" ry="9" fill="#ff4d4d" opacity="0.55" />
      <ellipse cx="60" cy="30" rx="14" ry="8" fill="#ffc458" />
      <circle cx="62" cy="30" r="4" fill="#fff6d8" />
    </svg>
  );
}
function EoThumb() {
  return (
    <svg viewBox="0 0 100 56" className="h-full w-full" aria-hidden>
      <rect width="100" height="56" fill="#0e1620" />
      <rect x="18" y="25" width="64" height="8" rx="3" fill="#b8c4d2" />
      <rect x="26" y="20" width="10" height="5" fill="#dfe7ef" />
      <rect x="46" y="27" width="26" height="3" fill="#7b8798" />
    </svg>
  );
}
function SarThumb() {
  return (
    <svg viewBox="0 0 100 56" className="h-full w-full" aria-hidden>
      <rect width="100" height="56" fill="#0a0a0a" />
      {Array.from({ length: 90 }).map((_, i) => (
        <rect key={i} x={(i * 37) % 100} y={(i * 23) % 56} width="1.4" height="1.4" fill="#ffffff" opacity="0.25" />
      ))}
      <ellipse cx="50" cy="29" rx="28" ry="6" fill="#e8e8e8" opacity="0.9" />
      <ellipse cx="50" cy="29" rx="18" ry="3" fill="#ffffff" />
    </svg>
  );
}

const LAYERS = [
  { key: "TIR · THERMAL", spec: "LWIR 8-14µM", note: "SEKER-1 PAYLOAD · SHARED CLOCK", el: <TirThumb /> },
  { key: "EO · OPTICAL", spec: "0.5 M", note: "TASKED · SIMULATED", el: <EoThumb /> },
  { key: "SAR · X-BAND", spec: "3 M", note: "TASKED · SIMULATED", el: <SarThumb /> },
];

/* ---------------- digital twin panel ---------------- */

const IDENTITY = [["Type", "Tanker"], ["Flag", "MT"], ["IMO", "—"], ["Call sign", "—"]];
const KINEMATICS = [["Position", "37.500, 23.800"], ["Speed", "14.1 kn"], ["Course", "90°"], ["Dest", "—"]];
const SOURCES: { id: string; on: boolean }[] = [
  { id: "AIS-T", on: true }, { id: "AIS-S", on: true }, { id: "SAR", on: true },
  { id: "PORT", on: true }, { id: "RF", on: false }, { id: "OPT", on: false },
];
const TIMELINE = [
  { t: "-2h 14m", text: "Position verified · AIS-T + AIS-S", tone: "text-foreground/80" },
  { t: "-9h 02m", text: "Speed anomaly · 3.1 kn over baseline", tone: "text-amber" },
  { t: "-1d 03h", text: "Port call · Piraeus", tone: "text-foreground/80" },
  { t: "-3d 08h", text: "AIS gap 47 min · re-acquired by SAR", tone: "text-alert" },
];
const SPEED_BARS = [3, 4, 5, 5, 4, 7, 9, 12, 18, 30, 46, 58, 72, 88, 96, 84, 66, 52, 40, 28, 18, 11, 7, 4];

function DigitalTwin() {
  const [tab, setTab] = useState("TWIN");
  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-[#070d16]">
      <div className="flex flex-wrap gap-1 border-b border-white/5 px-2 py-2">
        <TabRow tabs={["TWIN", "STREAM", "API", "DATA", "FUSION", "CHAT"]} active={tab} onSelect={setTab} />
      </div>

      <div className="space-y-6 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-light leading-tight tracking-wide text-foreground">
              ATLANTIC
              <br />
              PEARL
            </h3>
            <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
              MMSI 215789012 · MT
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl leading-none text-gold">
              88.7<span className="text-base">%</span>
            </p>
            <p className="mt-2 max-w-[170px] font-mono text-[8px] leading-relaxed tracking-[0.14em] text-muted-foreground">
              CONFIDENCE · RECENCY-BASED (TRACK &lt; 10 PTS)
            </p>
          </div>
        </div>

        <div className="rounded border border-gold/40 bg-gold/10 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-gold">
          ○ UNVERIFIED · IMO REQUIRED
        </div>

        <div className="grid grid-cols-2 gap-x-6">
          {[["IDENTITY", IDENTITY], ["KINEMATICS", KINEMATICS]].map(([title, rows]) => (
            <div key={title as string}>
              <p className="border-b border-white/10 pb-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                {title as string}
              </p>
              <dl className="mt-2 space-y-1.5">
                {(rows as string[][]).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3">
                    <dt className="text-[12px] text-muted-foreground">{k}</dt>
                    <dd className="font-mono text-[11px] text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div>
          <p className="border-b border-white/10 pb-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
            SENSOR LAYERS
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {LAYERS.map((l) => (
              <div key={l.key} className="overflow-hidden rounded border border-white/10 bg-black/40">
                <div className="flex items-center justify-between px-1.5 py-1 font-mono text-[7px] tracking-[0.1em] text-cyan">
                  <span>{l.key}</span>
                  <span className="text-muted-foreground">{l.spec}</span>
                </div>
                <div className="aspect-[16/9]">{l.el}</div>
                <p className="px-1.5 py-1 font-mono text-[6.5px] leading-tight tracking-[0.08em] text-muted-foreground">
                  {l.note}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[9px] leading-relaxed text-muted-foreground">
            Payload layers share SEKER-1's clock — a position discrepancy is attributable to the vessel.
            Tasked layers are fused on the ground.
          </p>
        </div>

        <div>
          <p className="border-b border-white/10 pb-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
            SPEED DISTRIBUTION · 30 DAYS
          </p>
          <div className="mt-3 flex h-16 items-end gap-[3px]">
            {SPEED_BARS.map((h, i) => (
              <span key={i} className="flex-1 rounded-sm bg-cyan/70" style={{ height: `${Math.max(h, 3)}%` }} />
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[8px] text-muted-foreground">
            <span>0 kn</span><span>6</span><span>12</span><span>18</span><span>24+</span>
          </div>
        </div>

        <div>
          <p className="border-b border-white/10 pb-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
            FUSION SOURCES
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SOURCES.map((s) => (
              <span
                key={s.id}
                className={`rounded border px-2 py-1 font-mono text-[9px] tracking-[0.16em] ${
                  s.on ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 text-muted-foreground/60"
                }`}
              >
                {s.id}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="border-b border-white/10 pb-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
            EVENT TIMELINE
          </p>
          <div className="mt-2 space-y-1.5">
            {TIMELINE.map((e) => (
              <div key={e.t} className="flex gap-3 font-mono text-[10px] tracking-[0.1em]">
                <span className="w-16 shrink-0 text-muted-foreground">{e.t}</span>
                <span className={e.tone}>{e.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- window chrome ---------------- */

function useUtc() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setT(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function WindowChrome({ children }: { children: React.ReactNode }) {
  const utc = useUtc();
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#050a12] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex flex-wrap items-center gap-4 border-b border-white/8 bg-navy-deep px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-alert/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
        </div>
        <SekerLogo className="h-5 w-auto text-foreground" />
        <div className="mr-auto">
          <p className="text-lg font-light tracking-wide text-cyan">HERA AI</p>
          <p className="font-mono text-[8px] tracking-[0.24em] text-muted-foreground">
            VERIFIED MARITIME DATA LAYER
          </p>
        </div>
        <div className="flex items-center gap-3 rounded border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] tracking-[0.16em]">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> API
          </span>
          <span className="text-cyan">OPERATIONAL</span>
          <span className="text-muted-foreground">· 14 732 SIGNALS ·</span>
          <span className="text-muted-foreground">P50</span>
          <span className="text-foreground">45MS</span>
        </div>
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
          UTC <span className="text-gold">{utc}</span>
        </p>
      </div>
      {children}
    </div>
  );
}

/* ---------------- section ---------------- */

const FEATURES = [
  { title: "Multi-source fusion", body: "Every AIS stream cross-validated against SAR, thermal and optical imagery in real time." },
  { title: "Digital twin per vessel", body: "Identity, kinematics, behavioural baseline, anomaly history and risk — refreshed every 4.2 seconds." },
  { title: "Blue Tick verification", body: "Spoofing corrected automatically. AIS gaps logged and context-scored. Low latency, everywhere." },
];

export function DashboardSection() {
  return (
    <section className="bg-navy px-6 py-28">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="text-center">
          <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-5xl">
            We don't track vessels. <span className="text-gold">We know them.</span>
          </h2>
        </Reveal>

        <Reveal className="mt-14">
          <WindowChrome>
            <div className="grid grid-cols-3 gap-px border-b border-white/8 bg-white/5 lg:grid-cols-3">
              {TOP_STATS.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-4 bg-[#070d16] px-5 py-4">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                      {s.label.toUpperCase()}
                    </p>
                    <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-muted-foreground/60">{s.sub}</p>
                  </div>
                  <CountUp to={s.to} suffix={s.suffix} className={`font-mono text-2xl ${s.tone}`} />
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-white/5 lg:grid-cols-[1.6fr_1fr]">
              <div className="bg-[#050a12] p-3">
                <LiveMap />
              </div>
              <div className="bg-[#050a12] p-3">
                <DigitalTwin />
              </div>
            </div>
          </WindowChrome>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <span className="font-mono text-[9px] tracking-[0.24em] text-gold">0{i + 1}</span>
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
