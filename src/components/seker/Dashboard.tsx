import { useEffect, useState } from "react";
import { CountUp, Reveal } from "./primitives";
import { SekerLogo } from "./Logo";
import { EyeCanvas } from "./EyeCanvas";

const TOP_STATS = [
  { label: "Spoofs detected · 24h", sub: "3 zones · 11 flags", to: 173, suffix: "", tone: "text-alert" },
  { label: "Active digital twins", sub: "avg refresh 4.2s", to: 120, suffix: "K", tone: "text-cyan" },
  { label: "Stream latency P99", sub: "SLA: < 250ms", to: 112, suffix: "ms", tone: "text-foreground" },
];

/* ---------------- live map ---------------- */

type Ship = { x: number; y: number; c: string; r: number; lane: boolean };
const CLASS_COLORS = ["#4a9eff", "#f59e42", "#3ddc84", "#4dd9c0", "#a855f7", "#ec4899", "#8fa3bb"];

/* --- real web-mercator basemap (CARTO dark), z5 tiles x15..19 y11..13 --- */
const Z = 5, TX0 = 15, TY0 = 11, TCOLS = 5, TROWS = 3, TS = 256;
const W = TCOLS * TS, H = TROWS * TS;
const WORLD = TS * 2 ** Z;
const px = (lon: number) => ((lon + 180) / 360) * WORLD - TX0 * TS;
const py = (lat: number) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * WORLD - TY0 * TS;
};
const r1 = (n: number) => Math.round(n * 10) / 10;

const rnd = (i: number, k: number) => {
  const v = Math.sin(i * k) * 43758.5453;
  return v - Math.floor(v);
};

// real Mediterranean shipping lanes as [lat, lon] waypoints
const LANES: [number, number][][] = [
  [[35.9, -5.4], [36.4, -2.0], [37.2, 1.5], [37.8, 6.0], [37.6, 10.2], [36.9, 13.0], [35.4, 17.5], [34.6, 22.0], [33.4, 27.0], [31.8, 31.4], [31.3, 32.3]],
  [[36.8, 15.4], [38.6, 16.5], [40.2, 18.6], [42.0, 16.2], [43.8, 14.0], [45.2, 12.5]],
  [[35.2, 23.6], [36.6, 25.0], [38.2, 24.6], [39.8, 25.2], [40.4, 26.4], [40.9, 28.2], [41.1, 29.1]],
  [[37.4, 15.2], [39.2, 14.6], [41.0, 13.2], [43.0, 10.4], [43.4, 7.6], [42.2, 5.4], [39.5, 3.0]],
  [[36.2, 27.5], [35.4, 32.0], [34.6, 34.6], [33.0, 35.2]],
  [[37.0, 11.0], [35.4, 11.6], [33.8, 13.5], [32.9, 18.0], [32.2, 23.5]],
];

// open-water scatter boxes [latMin, latMax, lonMin, lonMax]
const SEA: [number, number, number, number][] = [
  [35.7, 37.2, -4.5, -0.6], [36.6, 39.2, 0.6, 4.2], [37.6, 40.2, 4.6, 8.2],
  [38.4, 42.6, 5.0, 9.0], [33.2, 37.4, 10.6, 14.4], [33.6, 38.4, 15.0, 18.4],
  [34.2, 37.2, 19.2, 23.4], [31.8, 34.4, 25.0, 32.4], [39.8, 43.2, 15.2, 18.6],
  [36.6, 39.6, 24.0, 26.4], [42.2, 43.4, 30.0, 37.0], [33.4, 35.6, 27.5, 34.4],
  [30.8, 33.2, 17.0, 24.0], [40.4, 41.4, 26.6, 28.6],
];

function buildFleet(): Ship[] {
  const out: Ship[] = [];
  // lane traffic
  let i = 0;
  LANES.forEach((wp, li) => {
    const steps = 62;
    for (let s = 0; s < steps; s++, i++) {
      const t = (s / steps) * (wp.length - 1);
      const a = wp[Math.floor(t)];
      const b = wp[Math.min(Math.floor(t) + 1, wp.length - 1)];
      const f = t - Math.floor(t);
      const lat = a[0] + (b[0] - a[0]) * f + (rnd(i, 12.98) - 0.5) * 0.4;
      const lon = a[1] + (b[1] - a[1]) * f + (rnd(i, 78.23) - 0.5) * 0.4;
      const head = (Math.atan2(px(b[1]) - px(a[1]), -(py(b[0]) - py(a[0]))) * 180) / Math.PI;
      out.push({
        x: r1(px(lon)), y: r1(py(lat)),
        c: CLASS_COLORS[(li + s) % CLASS_COLORS.length],
        r: r1(head + (rnd(i, 3.71) - 0.5) * 24 + (s % 2 ? 180 : 0)),
        lane: true,
      });
    }
  });
  // scattered traffic
  SEA.forEach((box, bi) => {
    for (let s = 0; s < 48; s++, i++) {
      const lat = box[0] + rnd(i, 5.13) * (box[1] - box[0]);
      const lon = box[2] + rnd(i, 9.71) * (box[3] - box[2]);
      out.push({
        x: r1(px(lon)), y: r1(py(lat)),
        c: CLASS_COLORS[(bi + s) % CLASS_COLORS.length],
        r: r1(rnd(i, 2.17) * 360),
        lane: false,
      });
    }
  });
  return out;
}
const FLEET = buildFleet();

const TARGET = { lat: 37.5, lon: 23.8 };
const FENCE = { lat: 36.2, lon: 13.6 };

function LiveMap() {
  const [tab, setTab] = useState("LIVE MAP");
  return (
    <div className="rounded-lg border border-white/10 bg-[#060d18]">
      <div className="flex items-center gap-1 border-b border-white/5 px-2 py-2">
        <TabRow tabs={["LIVE MAP", "SEKER-1 MISSION", "FUSION"]} active={tab} onSelect={setTab} />
      </div>
      <div className="relative overflow-hidden bg-[#0b0b0b]">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          {/* real basemap tiles */}
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${TCOLS}, 1fr)` }}>
            {Array.from({ length: TCOLS * TROWS }).map((_, i) => (
              <img
                key={i}
                src={`https://basemaps.cartocdn.com/dark_all/${Z}/${TX0 + (i % TCOLS)}/${TY0 + Math.floor(i / TCOLS)}.png`}
                alt=""
                loading="lazy"
                className="block h-full w-full"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-[#09121f]/35" />

          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
            <defs>
              <filter id="shipGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="1.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>


            {/* fleet */}
            {FLEET.map((s, i) => (
              <polygon
                key={i}
                points="0,-6 4.3,4.8 -4.3,4.8"
                fill={s.c}
                opacity={s.lane ? 0.95 : 0.7}
                filter={s.lane ? "url(#shipGlow)" : undefined}
                transform={`translate(${s.x} ${s.y}) rotate(${s.r}) scale(${s.lane ? 1 : 0.8})`}
              />
            ))}

            {/* geo-fence with flagged cluster */}
            <circle cx={r1(px(FENCE.lon))} cy={r1(py(FENCE.lat))} r="70" fill="#ff4d4d" opacity="0.12" />
            <circle cx={r1(px(FENCE.lon))} cy={r1(py(FENCE.lat))} r="70" fill="none" stroke="#c9a84c" strokeWidth="1.4" strokeDasharray="7 7" />
            {Array.from({ length: 9 }).map((_, i) => (
              <polygon
                key={`f${i}`}
                points="0,-6 4.3,4.8 -4.3,4.8"
                fill="#ff4d4d"
                transform={`translate(${r1(px(FENCE.lon) + (rnd(i, 4.4) - 0.5) * 96)} ${r1(py(FENCE.lat) + (rnd(i, 7.9) - 0.5) * 96)}) rotate(${i * 41})`}
              />
            ))}

            {/* selected target */}
            <g>
              <circle cx={r1(px(TARGET.lon))} cy={r1(py(TARGET.lat))} r="14" fill="none" stroke="#c9a84c" strokeWidth="1.3" />
              <circle cx={r1(px(TARGET.lon))} cy={r1(py(TARGET.lat))} r="3" fill="#c9a84c" />
              <line x1={r1(px(TARGET.lon))} y1={r1(py(TARGET.lat)) - 14} x2={r1(px(TARGET.lon))} y2={r1(py(TARGET.lat)) - 48} stroke="#c9a84c" strokeWidth="1" />
            </g>
          </svg>

        {/* zoom control */}
        <div className="absolute left-3 top-3 overflow-hidden rounded border border-white/15 bg-navy/85 font-mono text-sm text-muted-foreground">
          <button className="block h-7 w-7 border-b border-white/10 hover:text-foreground">+</button>
          <button className="block h-7 w-7 hover:text-foreground">−</button>
        </div>

        {/* target callout */}
        <div className="pointer-events-none absolute left-[63%] top-[16%] rounded-md border border-gold/40 bg-navy/90 px-3 py-2 font-mono text-[10px] leading-relaxed tracking-[0.12em]">
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
        <div className="absolute bottom-3 right-3 hidden max-w-[46%] flex-wrap justify-end gap-3 rounded-md border border-white/10 bg-navy/90 px-3 py-2 font-mono text-[9px] tracking-[0.16em] text-muted-foreground sm:flex">
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

        <Reveal className="mt-12">
          <div className="relative h-[340px] overflow-hidden rounded-xl border border-white/10 sm:h-[440px]">
            <EyeCanvas />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/70 to-transparent px-6 pb-6 pt-16 text-center">
              <p className="font-mono text-[9px] tracking-[0.28em] text-gold">HERA AI · INSIGHT</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Every satellite pass, downlink and vessel track converges into one verified picture.
              </p>
            </div>
          </div>
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
