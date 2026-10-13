import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/seker/primitives";
import type { Industry } from "@/content/industries";

type R = NonNullable<Industry["rebuild"]>;

export function RolesSection({ roles }: { roles: R["roles"] }) {
  return (
    <section className="bg-navy-deep px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">Who it serves</p></Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, n) => (
            <Reveal key={r.role} delay={n * 0.05}>
              <div className="h-full rounded-lg border border-white/10 bg-navy/70 p-6 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{r.role}</span>
                </div>
                <p className="mt-5 text-lg font-light text-foreground">{r.question}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SignatureSection({ sig, axis }: { sig: R["signature"]; axis?: string }) {
  if (sig.kind === "flow") return <FlowMonitor sig={sig} axis={axis} />;
  if (sig.kind === "board") return <ArrivalsBoard sig={sig} />;
  if (sig.kind === "origin") return <OriginCheck sig={sig} />;
  if (sig.kind === "cable") return <CableWatch title={sig.title} />;
  return <Lifecycle sig={sig} />;
}

type Origin = Extract<R["signature"], { kind: "origin" }>;

const chip = { cyan: "border-cyan/50 text-cyan", amber: "border-amber/60 text-amber", alert: "border-alert/60 text-alert" };

function OriginCheck({ sig }: { sig: Origin }) {
  const [sel, setSel] = useState(1);
  const reduce = useReducedMotion();
  const t = sig.trips[sel];
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">{sig.title}</p></Reveal>
        <div className="mt-8 flex flex-wrap gap-2">
          {sig.trips.map((tr, n) => (
            <button key={tr.name} type="button" onClick={() => setSel(n)} aria-pressed={sel === n}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.2em] ${sel === n ? "border-gold bg-gold/10 text-gold" : "border-white/20 text-foreground/60"}`}>
              {tr.name}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 rounded-lg border border-white/10 bg-navy-deep/80 p-4 backdrop-blur">
            <svg viewBox="0 0 360 240" className="w-full" role="img" aria-label="Declared fishing area and observed trip track">
              {Array.from({ length: 9 }, (_, n) => <line key={`v${n}`} x1={n * 45} x2={n * 45} y1={0} y2={240} stroke="currentColor" className="text-white/5" />)}
              {Array.from({ length: 6 }, (_, n) => <line key={`h${n}`} y1={n * 48} y2={n * 48} x1={0} x2={360} stroke="currentColor" className="text-white/5" />)}
              <path d="M0,200 L40,215 L70,240 L0,240 Z" fill="currentColor" className="text-white/10" />
              <path d="M100,90 L250,80 L280,170 L130,195 Z" fill="currentColor" stroke="currentColor" strokeDasharray="6 5" strokeWidth={1.5} className="fill-gold/5 text-gold" />
              <text x={110} y={84} className="fill-gold font-mono text-[10px]">DECLARED AREA</text>
              <rect x={250} y={30} width={70} height={45} fill="currentColor" className="text-alert/10" stroke="currentColor" strokeDasharray="3 3" />
              <text x={254} y={26} className="fill-alert font-mono text-[9px]">CLOSED AREA</text>
              <motion.path key={t.name} d={t.track} fill="none" stroke="currentColor" strokeWidth={2} className="text-cyan"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
              <circle cx={60} cy={190} r={4} className="fill-cyan" />
              <text x={30} y={182} className="fill-foreground/60 font-mono text-[9px]">PORT</text>
            </svg>
            <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-foreground/50">ILLUSTRATIVE</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-navy/70 p-5 backdrop-blur">
            <ul className="divide-y divide-white/10">
              {t.checks.map((c) => (
                <li key={c.label} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span className="text-sm font-light text-foreground/85">{c.label}</span>
                  <span className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.15em] ${chip[c.tone]}`}>{c.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
              <span className="font-mono text-xs tracking-[0.2em] text-gold">ORIGIN CONFIDENCE</span>
              <span className="font-mono text-3xl text-gold">{t.confidence}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Board = Extract<R["signature"], { kind: "board" }>;

const tone = (v: string) =>
  ["VERIFIED", "MATCH", "LOW"].includes(v) ? "text-cyan" : ["MEDIUM"].includes(v) ? "text-amber" : "text-alert";

function ArrivalsBoard({ sig }: { sig: Board }) {
  const [sel, setSel] = useState(0);
  const r = sig.rows[sel];
  const cols = ["VESSEL", "ETA", "IDENTITY", "LAST PORTS", "BOARDING RISK", "INSPECTION"];
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">{sig.title}</p></Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 overflow-x-auto rounded-lg border border-white/10 bg-navy-deep/80 p-4 backdrop-blur">
            <table className="w-full min-w-[640px] font-mono text-xs">
              <thead>
                <tr className="text-left tracking-[0.18em] text-gold">
                  {cols.map((c) => <th key={c} className="px-3 py-2 font-normal">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {sig.rows.map((row, n) => (
                  <tr key={row.vessel} onClick={() => setSel(n)} tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(n)}
                    aria-selected={sel === n}
                    className={`cursor-pointer border-t border-white/10 tracking-[0.12em] transition-colors ${sel === n ? "bg-gold/10" : "hover:bg-white/5"}`}>
                    <td className="px-3 py-3 text-foreground">{row.vessel}</td>
                    <td className="px-3 py-3 text-foreground/80">{row.eta}</td>
                    <td className={`px-3 py-3 ${tone(row.identity)}`}>{row.identity}</td>
                    <td className={`px-3 py-3 ${tone(row.lastPorts)}`}>{row.lastPorts}</td>
                    <td className={`px-3 py-3 ${tone(row.risk)}`}>{row.risk}</td>
                    <td className={`px-3 py-3 ${row.inspection === "RECOMMEND" ? "text-gold" : "text-foreground/60"}`}>{row.inspection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 px-3 font-mono text-[11px] tracking-[0.2em] text-foreground/50">ILLUSTRATIVE · SELECT A ROW</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-navy/70 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.2em] text-gold">{r.vessel} · ETA {r.eta}</span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-foreground/50">INSPECTION: {r.inspection}</span>
            </div>
            <dl className="mt-4 divide-y divide-white/10">
              {r.reasons.map((x) => (
                <div key={x.label} className="py-3">
                  <dt className="font-mono text-[11px] tracking-[0.2em] text-foreground/60">{x.label}</dt>
                  <dd className="mt-1 text-sm font-light text-foreground/85">{x.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

type Flow = Extract<R["signature"], { kind: "flow" }>;

function FlowMonitor({ sig, axis }: { sig: Flow; axis?: string }) {
  const [floating, setFloating] = useState(false);
  const reduce = useReducedMotion();
  const W = 640, H = 260, pad = axis ? 44 : 28;
  const max = Math.max(...sig.weeks.map((w) => w.corrected)) * 1.15;
  const step = (W - pad * 2) / sig.weeks.length;
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const line = sig.weeks.map((w, n) => `${n ? "L" : "M"}${pad + step * (n + 0.5)},${y(w.floating)}`).join(" ");
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">{sig.title}</p></Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 rounded-lg border border-white/10 bg-navy/70 p-5 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Export terminal · 8 weeks</span>
              <button type="button" onClick={() => setFloating((f) => !f)} aria-pressed={floating}
                className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.2em] ${floating ? "border-amber text-amber" : "border-white/20 text-foreground/60"}`}>
                FLOATING STORAGE
              </button>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Weekly loaded departures, seen by broadcast and HERA AI corrected">
              {[0.25, 0.5, 0.75, 1].map((f) => (
                <line key={f} x1={pad} x2={W - pad} y1={y(max * f / 1.15)} y2={y(max * f / 1.15)} stroke="currentColor" className="text-white/10" />
              ))}
              {axis && [0.25, 0.5, 0.75, 1].map((f) => (
                <text key={`t${f}`} x={pad - 6} y={y(max * f / 1.15) + 4} textAnchor="end" className="fill-foreground/50 font-mono text-[11px]">{Math.round(max * f / 1.15)}</text>
              ))}
              {axis && <text x={12} y={H / 2} transform={`rotate(-90 12 ${H / 2})`} textAnchor="middle" className="fill-foreground/50 font-mono text-[11px]">{axis}</text>}
              {sig.weeks.map((w, n) => {
                const x = pad + step * n + step * 0.18, bw = step * 0.3;
                return (
                  <g key={n}>
                    <motion.rect x={x} width={bw} fill="currentColor" className="text-white/30"
                      initial={reduce ? false : { height: 0, y: H - pad }} whileInView={{ height: H - pad - y(w.broadcast), y: y(w.broadcast) }} viewport={{ once: true }} transition={{ duration: 0.6, delay: n * 0.05 }} />
                    <motion.rect x={x + bw + 2} width={bw} fill="currentColor" className="text-cyan"
                      initial={reduce ? false : { height: 0, y: H - pad }} whileInView={{ height: H - pad - y(w.corrected), y: y(w.corrected) }} viewport={{ once: true }} transition={{ duration: 0.6, delay: n * 0.05 + 0.1 }} />
                    <text x={pad + step * (n + 0.5)} y={H - 8} textAnchor="middle" className="fill-foreground/50 font-mono text-[11px]">W{n + 1}</text>
                  </g>
                );
              })}
              {floating && (
                <motion.path d={line} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="5 4" className="text-amber"
                  initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
              )}
            </svg>
            <div className="mt-3 flex flex-wrap gap-5 font-mono text-[11px] tracking-[0.15em] text-foreground/60">
              <span className="flex items-center gap-2"><span className="h-2 w-3 bg-white/30" />SEEN BY BROADCAST</span>
              <span className="flex items-center gap-2"><span className="h-2 w-3 bg-cyan" />HERA AI CORRECTED</span>
              {floating && <span className="flex items-center gap-2"><span className="h-0.5 w-3 bg-amber" />FLOATING STORAGE</span>}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-navy/70 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.2em] text-gold">THIS WEEK</span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-foreground/50">ILLUSTRATIVE</span>
            </div>
            <dl className="mt-4 divide-y divide-white/10">
              {sig.summary.map((it) => (
                <div key={it.label} className="py-3">
                  <dt className="text-sm font-light text-foreground/70">{it.label}</dt>
                  <dd className="mt-1 font-mono text-lg text-cyan">{it.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lifecycle({ sig }: { sig: Exclude<R["signature"], { kind: "flow" } | { kind: "board" } | { kind: "origin" } | { kind: "cable" }> }) {
  const [sel, setSel] = useState(0);
  const reduce = useReducedMotion();
  const st = sig.stages[sel];
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal><p className="text-eyebrow text-gold">{sig.title}</p></Reveal>
        <div className="relative mt-12">
          <div className="absolute left-[16.66%] right-[16.66%] top-[11px] h-px bg-white/15" />
          <motion.div
            className="absolute left-[16.66%] top-[11px] h-px bg-gold"
            animate={{ width: `${(sel / (sig.stages.length - 1)) * 66.66}%` }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          />
          <div className="relative grid grid-cols-3">
            {sig.stages.map((s, n) => (
              <button key={s.key} type="button" onClick={() => setSel(n)} className="flex flex-col items-center gap-3" aria-pressed={sel === n}>
                <span className={`h-[22px] w-[22px] rounded-full border-2 ${n <= sel ? "border-gold bg-gold/30" : "border-white/30 bg-navy"}`} />
                <span className={`text-center font-mono text-xs tracking-[0.2em] ${sel === n ? "text-gold" : "text-foreground/60"}`}>{s.key}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={st.key}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-10 rounded-lg border border-white/10 bg-navy/70 p-6 backdrop-blur"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{st.key} · {st.title}</span>
              <span className="font-mono text-xs tracking-[0.2em] text-foreground/50">ILLUSTRATIVE</span>
            </div>
            <dl className="mt-6 divide-y divide-white/10">
              {st.items.map((it) => (
                <div key={it.label} className="flex flex-wrap justify-between gap-2 py-3">
                  <dt className="text-sm font-light text-foreground/70">{it.label}</dt>
                  <dd className="font-mono text-sm text-cyan">{it.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export function MissionsSection({ missions, heading = "Missions" }: { missions: R["missions"]; heading?: string }) {
  return (
    <section className="bg-navy-deep px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">{heading}</p></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {missions.map((m, n) => (
            <Reveal key={m.title} delay={n * 0.05}>
              <div className="flex h-full flex-col rounded-lg border border-white/10 bg-navy/70 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gold">0{n + 1}</span>
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{m.title}</h3>
                </div>
                <p className="mt-5 font-mono text-[11px] tracking-[0.2em] text-foreground/50">NEED</p>
                <p className="mt-1 font-light text-foreground/85">{m.need}</p>
                <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-foreground/50">HERA AI</p>
                <p className="mt-1 font-light text-foreground/85">{m.hera}</p>
                {m.note && <p className="mt-4 text-sm font-light text-foreground/60">{m.note}</p>}
                <div className="mt-auto flex items-center gap-2 pt-6">
                  <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
                  <span className="font-mono text-xs tracking-[0.2em] text-cyan">DELIVERABLE · {m.deliverable.toUpperCase()}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeliverablesSection({ items, note }: { items: R["deliverables"]; note?: string }) {
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal><p className="text-eyebrow text-gold">Deliverables</p></Reveal>
        <div className="mt-10 rounded-lg border border-white/10 bg-navy/70 backdrop-blur">
          {items.map((d, n) => (
            <div key={d.name} className={`flex flex-wrap items-center justify-between gap-2 px-6 py-4 ${n ? "border-t border-white/10" : ""}`}>
              <div className="min-w-0">
                <span className="font-light text-foreground">{d.name}</span>
                {d.fields && <p className="mt-1 text-sm font-light text-foreground/60">{d.fields}</p>}
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{d.cadence}</span>
            </div>
          ))}
        </div>
        {note && <p className="mt-6 text-sm font-light text-foreground/70">{note}</p>}
      </div>
    </section>
  );
}

const CABLE_TRACK: [number, number][] = [
  [20, 40], [90, 70], [160, 100], [200, 118], [222, 132], [238, 124], [254, 140], [270, 132], [286, 148], [302, 140], [318, 156], [334, 150],
];
const SPEEDS = [11, 10.8, 9.5, 6, 3.2, 2, 1.6, 1.4, 1.5, 1.4, 1.4, 1.4];

function CableWatch({ title }: { title: string }) {
  const reduce = useReducedMotion();
  const [p, setP] = useState(reduce ? 1 : 0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (reduce) { setP(1); return; }
    setP(0);
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const v = Math.min(1, (now - t0) / 9000);
      setP(v);
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce]);
  const n = Math.max(1, Math.round(p * (CABLE_TRACK.length - 1)));
  const pts = CABLE_TRACK.slice(0, n + 1);
  const [vx, vy] = pts[pts.length - 1];
  const speed = SPEEDS[n];
  const onCorridor = n >= 4 ? Math.round(((n - 4) / (CABLE_TRACK.length - 5)) * 192) : 0;
  const gap = n >= 8 ? 47 : 0;
  const alert = p >= 0.85;
  const sx = (k: number) => 20 + (k / (SPEEDS.length - 1)) * 320;
  const sy = (v: number) => 90 - (v / 12) * 70;
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">{title}</p></Reveal>
        <div className="mt-10 rounded-lg border border-white/10 bg-navy-deep/80 p-4 backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.15em]">
              <span className="rounded border border-white/15 px-2 py-1 text-cyan">SPEED {speed.toFixed(1)} KN</span>
              <span className="rounded border border-white/15 px-2 py-1 text-cyan">ON CORRIDOR {Math.floor(onCorridor / 60)} H {onCorridor % 60} MIN</span>
              <span className="rounded border border-white/15 px-2 py-1 text-amber">AIS GAP {gap} MIN</span>
              <span className={`rounded-full border px-3 py-1 ${alert ? "border-alert/60 text-alert" : "border-cyan/50 text-cyan"}`}>{alert ? "INDICATOR" : "WATCH"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.2em] text-foreground/50">ILLUSTRATIVE</span>
              <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full border border-gold/60 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-gold hover:bg-gold/10">REPLAY</button>
            </div>
          </div>
          <svg viewBox="0 0 360 200" className="mt-4 w-full" role="img" aria-label="Vessel track crossing a seabed cable and pipeline corridor">
            {Array.from({ length: 9 }, (_, k) => <line key={`v${k}`} x1={k * 45} x2={k * 45} y1={0} y2={200} stroke="currentColor" className="text-white/5" />)}
            <path d="M0,180 C80,170 140,150 200,135 S300,150 360,160" fill="none" stroke="currentColor" strokeWidth={10} className="text-gold/10" />
            <path d="M0,180 C80,170 140,150 200,135 S300,150 360,160" fill="none" stroke="currentColor" strokeWidth={1.2} className="text-gold" />
            <path d="M0,195 C90,185 160,170 220,160 S310,175 360,185" fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="4 3" className="text-gold/70" />
            <text x={6} y={172} className="fill-gold font-mono text-[8px]">CABLE</text>
            <text x={6} y={192} className="fill-gold/70 font-mono text-[8px]">PIPELINE</text>
            <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke="currentColor" strokeWidth={1.6} className={alert ? "text-alert" : "text-cyan"} />
            <polygon points={`${vx},${vy - 5} ${vx + 4},${vy + 4} ${vx - 4},${vy + 4}`} className={alert ? "fill-alert" : "fill-cyan"} />
          </svg>
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="font-mono text-[11px] tracking-[0.2em] text-foreground/50">SPEED TRACE · KN</p>
            <svg viewBox="0 0 360 100" className="mt-2 w-full" aria-hidden>
              <line x1={20} x2={340} y1={sy(0)} y2={sy(0)} stroke="currentColor" className="text-white/15" />
              <text x={0} y={sy(11) + 3} className="fill-foreground/50 font-mono text-[8px]">11</text>
              <text x={0} y={sy(1.4) + 3} className="fill-foreground/50 font-mono text-[8px]">1.4</text>
              <polyline points={SPEEDS.slice(0, n + 1).map((v, k) => `${sx(k)},${sy(v)}`).join(" ")} fill="none" stroke="currentColor" strokeWidth={1.6} className="text-cyan" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
