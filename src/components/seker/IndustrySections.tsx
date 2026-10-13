import { useState } from "react";
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

export function SignatureSection({ sig }: { sig: R["signature"] }) {
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

export function MissionsSection({ missions }: { missions: R["missions"] }) {
  return (
    <section className="bg-navy-deep px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">Missions</p></Reveal>
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

export function DeliverablesSection({ items }: { items: R["deliverables"] }) {
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal><p className="text-eyebrow text-gold">Deliverables</p></Reveal>
        <div className="mt-10 rounded-lg border border-white/10 bg-navy/70 backdrop-blur">
          {items.map((d, n) => (
            <div key={d.name} className={`flex flex-wrap items-center justify-between gap-2 px-6 py-4 ${n ? "border-t border-white/10" : ""}`}>
              <span className="font-light text-foreground">{d.name}</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{d.cadence}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
