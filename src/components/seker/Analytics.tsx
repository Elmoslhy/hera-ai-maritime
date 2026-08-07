import { useEffect, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useRef } from "react";
import { CountUp, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/*  Section intro                                                      */
/* ------------------------------------------------------------------ */

export function AnalyticsSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep px-6 py-28">
      {/* faint grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(77,217,192,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(77,217,192,0.6) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <Reveal className="text-center">
          <p className="text-eyebrow text-gold">The Intelligence Layer</p>
          <h2 className="text-balance mt-6 text-3xl font-light leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Accuracy is our edge.
            <span className="mt-2 block text-cyan">Real-time, everywhere.</span>
          </h2>
          <p className="text-pretty mx-auto mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            HERA AI turns raw signal into decisions. Every position is scored for
            confidence, every anomaly cross-checked across five sensors — delivered
            in the time it takes a wave to break.
          </p>
        </Reveal>

        <AnalyticsPanel />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Analytics panel (window chrome)                                    */
/* ------------------------------------------------------------------ */

const ACC_STATS = [
  { label: "Fusion accuracy", sub: "5-sensor cross-check · 30d", to: 97.4, suffix: "%", decimals: 1, tone: "text-gold" },
  { label: "Dark-vessel recall", sub: "AIS-off detection", to: 94.2, suffix: "%", decimals: 1, tone: "text-cyan" },
  { label: "Spoof correction rate", sub: "GPS/AIS tamper fixes", to: 99.1, suffix: "%", decimals: 1, tone: "text-foreground" },
  { label: "Decision latency P50", sub: "signal → insight", to: 38, suffix: "ms", decimals: 0, tone: "text-cyan" },
];

function AnalyticsPanel() {
  return (
    <Reveal className="mt-14">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050a12] shadow-[0_50px_140px_-50px_rgba(0,0,0,0.95)]">
        {/* header bar */}
        <div className="flex flex-wrap items-center gap-4 border-b border-white/8 bg-[#04080f] px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-alert/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
          </div>
          <p className="text-base font-light tracking-wide text-foreground">HERA Intelligence</p>
          <span className="ml-1 rounded border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-cyan">
            ANALYTICS
          </span>
          <div className="mr-auto" />
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em]">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              LIVE STREAM
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-cyan">2.4M signals / day</span>
          </div>
        </div>

        {/* accuracy stat row */}
        <div className="grid grid-cols-2 gap-px border-b border-white/8 bg-white/5 lg:grid-cols-4">
          {ACC_STATS.map((s) => (
            <div key={s.label} className="bg-[#070d16] px-5 py-5">
              <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                {s.label.toUpperCase()}
              </p>
              <p className="mt-1 font-mono text-[8px] tracking-[0.12em] text-muted-foreground/60">
                {s.sub}
              </p>
              <CountUp
                to={s.to}
                suffix={s.suffix}
                decimals={s.decimals}
                className={`mt-3 block font-mono text-3xl ${s.tone}`}
              />
            </div>
          ))}
        </div>

        {/* main grid */}
        <div className="grid gap-px bg-white/5 lg:grid-cols-[1.5fr_1fr]">
          <div className="bg-[#050a12] p-5">
            <AccuracyChart />
          </div>
          <div className="bg-[#050a12] p-5">
            <GaugePanel />
          </div>
        </div>

        <div className="grid gap-px bg-white/5 lg:grid-cols-2">
          <div className="bg-[#050a12] p-5">
            <SensorBreakdown />
          </div>
          <div className="bg-[#050a12] p-5">
            <Comparison />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Accuracy chart — time series of fusion confidence                  */
/* ------------------------------------------------------------------ */

// synthetic 48-point series, 92% → 99% band, gently trending up
const SERIES_HERA = [
  93.1, 92.8, 93.6, 94.0, 93.4, 94.2, 95.0, 94.6, 95.3, 95.9, 95.1, 96.0,
  96.4, 95.8, 96.7, 97.0, 96.5, 97.2, 97.6, 97.0, 97.4, 97.9, 97.3, 98.0,
  98.2, 97.7, 98.3, 98.6, 98.1, 98.5, 98.8, 98.3, 98.7, 97.9, 98.4, 98.9,
  98.6, 98.2, 98.7, 99.0, 98.5, 98.8, 99.1, 98.6, 98.9, 99.2, 98.8, 97.4,
];
const SERIES_LEGACY = [
  71, 69, 72, 70, 68, 71, 73, 70, 69, 72, 71, 68, 70, 72, 69, 71, 70, 72, 71, 69,
  70, 72, 71, 68, 70, 71, 69, 72, 70, 71, 69, 72, 70, 71, 69, 70, 72, 69, 71, 70,
  68, 71, 70, 72, 69, 71, 70, 68,
];
const CHART_W = 720;
const CHART_H = 280;
const PAD = { l: 36, r: 16, t: 16, b: 26 };

function pathFor(vals: number[], yMin: number, yMax: number) {
  const n = vals.length;
  const ix = (i: number) => PAD.l + (i / (n - 1)) * (CHART_W - PAD.l - PAD.r);
  const iy = (v: number) =>
    PAD.t + (1 - (v - yMin) / (yMax - yMin)) * (CHART_H - PAD.t - PAD.b);
  let d = "";
  vals.forEach((v, i) => {
    d += `${i === 0 ? "M" : "L"}${ix(i).toFixed(1)} ${iy(v).toFixed(1)} `;
  });
  return { d, ix, iy };
}

function AccuracyChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const yMin = 60;
  const yMax = 100;

  const hera = pathFor(SERIES_HERA, yMin, yMax);
  const legacy = pathFor(SERIES_LEGACY, yMin, yMax);

  // area fill under HERA line
  const areaD =
    hera.d +
    `L${hera.ix(SERIES_HERA.length - 1).toFixed(1)} ${CHART_H - PAD.b} ` +
    `L${hera.ix(0).toFixed(1)} ${CHART_H - PAD.b} Z`;

  const gridVals = [70, 80, 90, 100];

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
            FUSION CONFIDENCE · 48H
          </p>
          <p className="mt-1 text-sm text-foreground">HERA AI vs legacy AIS-only</p>
        </div>
        <div className="flex items-center gap-4 font-mono text-[9px] tracking-[0.14em]">
          <span className="flex items-center gap-1.5 text-gold">
            <span className="h-0.5 w-4 bg-gold" /> HERA AI
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-0.5 w-4 bg-muted-foreground/40" /> LEGACY
          </span>
        </div>
      </div>

      <div className="mt-4">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full">
          <defs>
            <linearGradient id="heraFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
            </linearGradient>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* gridlines + y labels */}
          {gridVals.map((g) => {
            const gy =
              PAD.t + (1 - (g - yMin) / (yMax - yMin)) * (CHART_H - PAD.t - PAD.b);
            return (
              <g key={g}>
                <line
                  x1={PAD.l}
                  y1={gy}
                  x2={CHART_W - PAD.r}
                  y2={gy}
                  stroke="#ffffff"
                  strokeOpacity="0.05"
                />
                <text
                  x={PAD.l - 6}
                  y={gy + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  style={{ font: "9px 'Space Mono', monospace" }}
                >
                  {g}
                </text>
              </g>
            );
          })}

          {/* x labels */}
          {["-48h", "-36h", "-24h", "-12h", "NOW"].map((t, i) => (
            <text
              key={t}
              x={PAD.l + (i / 4) * (CHART_W - PAD.l - PAD.r)}
              y={CHART_H - 8}
              textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
              className="fill-muted-foreground/60"
              style={{ font: "9px 'Space Mono', monospace" }}
            >
              {t}
            </text>
          ))}

          {/* legacy dashed */}
          <motion.path
            d={legacy.d}
            fill="none"
            stroke="#4a6378"
            strokeWidth="1.4"
            strokeDasharray="5 5"
            initial={reduce ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          {/* hera area */}
          <motion.path
            d={areaD}
            fill="url(#heraFill)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
          />

          {/* hera line */}
          <motion.path
            d={hera.d}
            fill="none"
            stroke="#c9a84c"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lineGlow)"
            initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />

          {/* final point pulse */}
          <motion.circle
            cx={hera.ix(SERIES_HERA.length - 1)}
            cy={hera.iy(SERIES_HERA[SERIES_HERA.length - 1])}
            r="4"
            fill="#c9a84c"
            initial={reduce ? {} : { scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
          />
          <motion.circle
            cx={hera.ix(SERIES_HERA.length - 1)}
            cy={hera.iy(SERIES_HERA[SERIES_HERA.length - 1])}
            r="4"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="1.4"
            animate={{ r: [4, 14], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.6 }}
          />
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] tracking-[0.1em]">
        <span className="text-muted-foreground">
          HERA avg <span className="text-gold">97.0%</span>
        </span>
        <span className="text-muted-foreground">
          Legacy avg <span className="text-muted-foreground/70">70.4%</span>
        </span>
        <span className="text-muted-foreground">
          Uplift <span className="text-cyan">+26.6 pts</span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gauge panel — radial accuracy meter                                */
/* ------------------------------------------------------------------ */

function GaugePanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(0);
  const target = 97.4;

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => c.stop();
  }, [inView]);

  const R = 90;
  const C = 2 * Math.PI * R;
  const startAngle = -220; // deg
  const sweep = 260; // deg
  const progress = val / 100;
  const dash = (progress * sweep) / 360 * C;

  const cx = 130, cy = 130;

  return (
    <div ref={ref} className="flex h-full flex-col">
      <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
        COMBINED CONFIDENCE · ALL SENSORS
      </p>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative">
          <svg viewBox="0 0 260 260" className="w-[230px] max-w-full">
            {/* track */}
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.06"
              strokeWidth="12"
              strokeDasharray={`${(sweep / 360) * C} ${C}`}
              strokeLinecap="round"
              transform={`rotate(${startAngle} ${cx} ${cy})`}
            />
            {/* progress */}
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              transform={`rotate(${startAngle} ${cx} ${cy})`}
            />
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4dd9c0" />
                <stop offset="100%" stopColor="#c9a84c" />
              </linearGradient>
            </defs>
            {/* tick marks */}
            {Array.from({ length: 11 }).map((_, i) => {
              const a = ((startAngle + (i / 10) * sweep) * Math.PI) / 180;
              const x1 = cx + Math.cos(a) * (R + 12);
              const y1 = cy + Math.sin(a) * (R + 12);
              const x2 = cx + Math.cos(a) * (R + 18);
              const y2 = cy + Math.sin(a) * (R + 18);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ffffff"
                  strokeOpacity={i % 5 === 0 ? 0.25 : 0.1}
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl text-foreground">
              {val.toFixed(1)}
              <span className="text-xl text-muted-foreground">%</span>
            </span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-gold">
              VERIFIED
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-center text-[9px] tracking-[0.12em]">
        <div className="rounded-md border border-white/8 bg-white/[0.02] py-2">
          <p className="text-cyan">AIS</p>
          <p className="mt-1 text-muted-foreground">99.6%</p>
        </div>
        <div className="rounded-md border border-white/8 bg-white/[0.02] py-2">
          <p className="text-cyan">RF</p>
          <p className="mt-1 text-muted-foreground">96.1%</p>
        </div>
        <div className="rounded-md border border-white/8 bg-white/[0.02] py-2">
          <p className="text-cyan">TIR</p>
          <p className="mt-1 text-muted-foreground">93.8%</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sensor breakdown — horizontal bars                                 */
/* ------------------------------------------------------------------ */

const SENSORS = [
  { name: "AIS-T", acc: 99.6, color: "#4a9eff" },
  { name: "AIS-S", acc: 98.9, color: "#4dd9c0" },
  { name: "SAR", acc: 96.3, color: "#c9a84c" },
  { name: "RF", acc: 96.1, color: "#a855f7" },
  { name: "TIR", acc: 93.8, color: "#f59e42" },
  { name: "OPT", acc: 91.2, color: "#3ddc84" },
];

function SensorBreakdown() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref}>
      <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
        PER-SENSOR ACCURACY
      </p>
      <div className="mt-4 space-y-3">
        {SENSORS.map((s, i) => (
          <div key={s.name}>
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em]">
              <span className="flex items-center gap-2 text-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="text-muted-foreground">{s.acc.toFixed(1)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color, boxShadow: `0 0 8px ${s.color}66` }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${s.acc}%` } : {}}
                transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-pretty font-mono text-[9px] leading-relaxed tracking-[0.1em] text-muted-foreground">
        Fusion lifts each sensor above its standalone ceiling. The weak
        individual source becomes decisive when triangulated against the other four.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Comparison — HERA vs traditional providers                          */
/* ------------------------------------------------------------------ */

const COMPARE = [
  { metric: "Position accuracy", hera: 97.4, legacy: 70.4 },
  { metric: "Dark-vessel detection", hera: 94.2, legacy: 22.0 },
  { metric: "Spoofing caught", hera: 99.1, legacy: 41.0 },
  { metric: "Latency P50", hera: 38, legacy: 1200, latency: true },
];

function Comparison() {
  return (
    <div>
      <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
        HERA AI vs TRADITIONAL AIS
      </p>
      <div className="mt-4 space-y-4">
        {COMPARE.map((c) => (
          <div key={c.metric} className="flex items-center gap-3">
            <span className="w-36 shrink-0 font-mono text-[10px] leading-tight tracking-[0.08em] text-muted-foreground">
              {c.metric.toUpperCase()}
            </span>
            <div className="flex flex-1 items-center gap-3">
              <div className="flex-1">
                <div className="relative h-5 overflow-hidden rounded-sm bg-white/5">
                  <div
                    className="h-full rounded-sm bg-gold/80"
                    style={{ width: `${c.latency ? (38 / 1200) * 100 : c.hera}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-end pr-2 font-mono text-[9px] text-foreground">
                    {c.latency ? `${c.hera}ms` : `${c.hera}%`}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[8px] text-gold">HERA</span>
            </div>
            <div className="flex w-24 items-center gap-2">
              <div className="flex-1">
                <div className="relative h-5 overflow-hidden rounded-sm bg-white/5">
                  <div
                    className="h-full rounded-sm bg-muted-foreground/30"
                    style={{ width: `${c.latency ? 100 : c.legacy}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-end pr-2 font-mono text-[9px] text-muted-foreground">
                    {c.latency ? `${(c.legacy / 1000).toFixed(1)}s` : `${c.legacy}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md border border-cyan/20 bg-cyan/5 px-3 py-2 font-mono text-[9px] leading-relaxed tracking-[0.1em] text-cyan">
        ◆ Accuracy compounds: every verified position sharpens the next.
        Traditional providers decay. HERA improves with every orbit.
      </div>
    </div>
  );
}
