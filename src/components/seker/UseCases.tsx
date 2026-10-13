import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./primitives";
import { sensors, useCases, useCasesSection as s, type UseCase } from "@/content/intelligence";

const STAGES = ["Detect", "Cue", "Collect", "Fuse", "Assess", "Deliver"];
const STAGE_MS = 5000;

// Per-case map geometry (viewBox 800x450): dark vessel, counterpart, emitter.
const GEO = [
  { a: [250, 300], b: [470, 210], e: [470, 215] },
  { a: [560, 140], b: [420, 300], e: [420, 300] },
  { a: [180, 320], b: [520, 180], e: [520, 180] },
  { a: [430, 230], b: [480, 260], e: [455, 245] },
  { a: [300, 280], b: [520, 200], e: [520, 200] },
];

const toneClass = {
  alert: "border-alert/40 bg-alert/10 text-alert",
  amber: "border-amber/40 bg-amber/10 text-amber",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
};

function Ship({ x, y, r = 0, cls }: { x: number; y: number; r?: number; cls: string }) {
  return <polygon points="0,-7 5,6 -5,6" transform={`translate(${x} ${y}) rotate(${r})`} className={cls} />;
}

function Brackets({ x, y, size = 22, cls }: { x: number; y: number; size?: number; cls: string }) {
  const h = size / 2;
  const l = 7;
  const d = `M${x - h},${y - h + l}V${y - h}H${x - h + l} M${x + h - l},${y - h}H${x + h}V${y - h + l} M${x + h},${y + h - l}V${y + h}H${x + h - l} M${x - h + l},${y + h}H${x - h}V${y + h - l}`;
  return <path d={d} fill="none" strokeWidth={2} className={cls} />;
}

function OpsMap({ idx, stage }: { idx: number; stage: number }) {
  const g = GEO[idx];
  const [ax, ay] = g.a;
  const [bx, by] = g.b;
  const [ex, ey] = g.e;
  const show = (n: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: stage >= n ? 1 : 0 },
    transition: { duration: 0.6 },
  });
  const anchorage = idx === 3;
  return (
    <svg viewBox="0 0 800 450" className="block h-auto w-full" role="img" aria-label={`Operations map, stage ${stage + 1}: ${STAGES[stage]}`}>
      <rect width="800" height="450" className="fill-navy-deep" />
      <defs>
        <pattern id="uc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" className="stroke-white/[0.05]" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="800" height="450" fill="url(#uc-grid)" className="text-white/[0.05]" />
      {/* land */}
      <path d="M0 0H260C230 40 180 60 120 70C70 80 30 110 0 120Z" className="fill-white/[0.06] stroke-white/10" />
      <path d="M800 0V200C740 190 700 150 690 100C680 60 640 30 600 0Z" className="fill-white/[0.06] stroke-white/10" />
      <path d="M560 450C600 400 680 390 800 380V450Z" className="fill-white/[0.06] stroke-white/10" />

      {/* background traffic */}
      {[[120, 220, 70], [650, 300, 200], [340, 120, 110], [700, 260, 250], [90, 380, 30]].map(([x, y, r], i) => (
        <Ship key={i} x={x} y={y} r={r} cls="fill-cyan/50" />
      ))}

      {/* stage 1: tracks and AIS gap */}
      <motion.g {...show(0)}>
        <path d={`M${ax - 150},${ay + 70} L${ax - 60},${ay + 30}`} className="stroke-cyan/70" strokeWidth="1.5" fill="none" />
        <path d={`M${ax - 60},${ay + 30} L${ax},${ay}`} className="stroke-alert" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
        <path d={`M${bx - 40},${by + 10} q20 -30 40 -10 t40 -5`} className="stroke-cyan/50" strokeWidth="1" fill="none" />
        <Ship x={ax - 60} y={ay + 30} r={65} cls="fill-alert" />
        <Ship x={bx} y={by} r={20} cls="fill-cyan" />
        {anchorage &&
          Array.from({ length: 14 }).map((_, i) => (
            <Ship key={i} x={400 + (i % 5) * 26} y={200 + Math.floor(i / 5) * 28} r={i * 25} cls="fill-cyan/80" />
          ))}
      </motion.g>

      {/* stage 2: reachable area */}
      <motion.circle {...show(1)} cx={ax - 20} cy={ay - 20} r={110} fill="none" className="stroke-gold" strokeDasharray="6 6" strokeWidth="1.5" />

      {/* stage 3: imaging footprint and bearing lines */}
      <motion.g {...show(2)}>
        <polygon points={`${ex - 90},${ey - 60} ${ex + 80},${ey - 80} ${ex + 100},${ey + 60} ${ex - 70},${ey + 80}`} className="fill-cyan/10 stroke-cyan/70" strokeWidth="1" />
        {[[60, 440], [780, 420], [740, 20]].map(([sx, sy], i) => (
          <line key={i} x1={sx} y1={sy} x2={ex} y2={ey} className="stroke-gold/60" strokeDasharray="3 6" strokeWidth="1" />
        ))}
        <circle cx={ex} cy={ey} r={4} className="fill-gold" />
        <motion.circle cx={ex} cy={ey} r={10} className="fill-none stroke-gold" strokeWidth="1" animate={stage >= 2 ? { r: [6, 22], opacity: [1, 0] } : {}} transition={{ duration: 1.8, repeat: Infinity }} />
        <Ship x={ax} y={ay} r={65} cls="fill-foreground/80" />
      </motion.g>

      {/* stage 4: detections */}
      <motion.g {...show(3)}>
        <Brackets x={ax} y={ay} cls="stroke-gold" />
        <Brackets x={bx} y={by} cls="stroke-gold" />
      </motion.g>

      {/* stage 5: assessment reticle */}
      <motion.g {...show(4)}>
        <circle cx={ax} cy={ay} r={24} fill="none" className="stroke-alert" strokeWidth="1.5" />
        <path d={`M${ax - 34},${ay}H${ax - 18} M${ax + 18},${ay}H${ax + 34} M${ax},${ay - 34}V${ay - 18} M${ax},${ay + 18}V${ay + 34}`} className="stroke-alert" strokeWidth="1.5" />
      </motion.g>

      {/* stage 6: delivered */}
      <motion.g {...show(5)}>
        <rect x="24" y="404" width="180" height="26" rx="4" className="fill-navy/80 stroke-cyan/40" />
        <text x="36" y="421" className="fill-cyan font-mono" fontSize="10" letterSpacing="2">RECORD DELIVERED</text>
      </motion.g>
    </svg>
  );
}

function FindingCard({ uc }: { uc: UseCase }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.16em] ${toneClass[uc.finding.tone]}`}>
          {uc.finding.label}
        </span>
        <span className="font-mono text-3xl text-gold">
          {uc.finding.score}
          <span className="text-sm text-muted-foreground">/100</span>
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-sm font-light text-foreground/80">
        {uc.finding.indicators.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
            {i}
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-white/10 pt-4 font-mono text-xs tracking-[0.12em] text-cyan">
        SUGGESTED NEXT STEP · <span className="font-sans tracking-normal text-foreground">{uc.action}</span>
      </p>
    </div>
  );
}

function recordJson(uc: UseCase) {
  return JSON.stringify(
    {
      type: uc.record.type,
      score: uc.finding.score,
      evidence: uc.record.evidence,
      provenance: {
        sources: uc.record.sources,
        method_version: "hera-ai-fusion-2026.10",
        disclaimer: "Indicator for screening, not a finding of fact.",
      },
    },
    null,
    2,
  );
}

export function UseCasesSection({
  ids,
  cases,
  sectionId = "use-cases",
  eyebrow = s.eyebrow,
  headline = s.headline,
}: {
  ids?: string[];
  cases?: UseCase[];
  sectionId?: string;
  eyebrow?: string;
  headline?: readonly string[];
} = {}) {
  const list = cases ? cases : ids ? useCases.filter((c) => ids.includes(c.id)) : useCases;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const uc = list[idx];
  const geoIdx = uc.geo ?? useCases.indexOf(uc);
  const running = playing && inView && !reduce;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStage((n) => (n + 1) % 6), STAGE_MS);
    return () => clearTimeout(t);
  }, [running, stage]);

  const lit = new Set(uc.stages[stage].sensors);

  return (
    <section id={sectionId} className="scroll-mt-24 bg-navy px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-eyebrow text-gold">{eyebrow}</p>
          <h2 className="text-balance mt-6 text-3xl font-light tracking-tight text-foreground sm:text-5xl">
            {headline[0]}
            <br />
            <span className="text-gold">{headline[1]}</span>
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {list.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setIdx(i);
                setStage(0);
              }}
              className={`rounded-full border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                i === idx
                  ? "border-gold/60 bg-gold/12 text-gold"
                  : "border-white/12 bg-white/[0.02] text-muted-foreground hover:border-white/25 hover:text-foreground"
              }`}
            >
              {c.tag}
            </button>
          ))}
        </div>

        <div ref={ref} className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-deep">
              <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-alert/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
                </div>
                <p className="mr-auto truncate font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  HERA AI · {uc.tag}
                </p>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
                  className="rounded border border-white/15 p-1.5 text-gold hover:border-gold/60"
                >
                  {playing && !reduce ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              </div>
              <OpsMap idx={geoIdx} stage={stage} />
            </div>

            {/* stage rail */}
            <div className="relative mt-5">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-white/10">
                <motion.div
                  className="h-full bg-gold"
                  animate={{ width: `${((stage + 1) / 6) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.5 }}
                />
              </div>
              <div className="grid grid-cols-6 pt-3">
                {STAGES.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setStage(i)}
                    className={`text-left font-mono text-[10px] tracking-[0.14em] transition-colors ${
                      i === stage ? "text-gold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    0{i + 1}
                    <span className="hidden sm:block">{name.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {stage === 5 && (
              <div className="mt-6 rounded-lg border border-white/10 bg-navy/70 p-4 backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{s.receivesTitle}</p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-cyan/90">
                  {recordJson(uc)}
                </pre>
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-5">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">{uc.audience.toUpperCase()}</p>
              <h3 className="mt-3 text-balance text-2xl font-light text-foreground">{uc.question}</h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${idx}-${stage}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="font-mono text-xs tracking-[0.2em] text-gold">
                  0{stage + 1} · {STAGES[stage].toUpperCase()}
                </p>
                <p className="mt-2 text-base font-light text-foreground/85">{uc.stages[stage].text}</p>
              </motion.div>
            </AnimatePresence>

            <div className="rounded-lg border border-white/10 bg-navy/70 p-4 backdrop-blur">
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{s.sensorsTitle}</p>
              <ul className="mt-3 space-y-2">
                {sensors.map((x) => {
                  const on = lit.has(x.id);
                  return (
                    <li key={x.id} className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.1em] ${on ? "text-foreground" : "text-muted-foreground/60"}`}>
                      <span className={`h-2 w-2 rounded-full ${on ? "bg-cyan shadow-[0_0_8px_var(--color-cyan)]" : "bg-white/15"}`} />
                      {x.label.toUpperCase()}
                    </li>
                  );
                })}
              </ul>
            </div>

            {stage >= 4 && <FindingCard uc={uc} />}
          </div>
        </div>

        <p className="mt-12 max-w-3xl text-xs font-light text-muted-foreground">{s.disclaimer}</p>
      </div>
    </section>
  );
}
