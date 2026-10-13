import { Link } from "@tanstack/react-router";
import { Drone, Orbit, Satellite } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "./primitives";
import {
  closingCta,
  deliveryCards,
  taskingLanes,
  taskingSection as s,
  type Pass,
} from "@/content/intelligence";

const H = 12;
const pct = (h: number) => `${(h / H) * 100}%`;
const ICONS = [Satellite, Orbit, Drone];
const allPasses = taskingLanes.flatMap((l) => l.passes.map((p) => ({ ...p, lane: l.name })));
const selected = allPasses.filter((p) => p.status === "selected").sort((a, b) => a.start - b.start);

const blockCls: Record<Pass["status"], string> = {
  selected: "bg-gold border border-gold",
  standby: "border border-cyan bg-cyan/10",
  rejected: "border border-dashed border-alert bg-alert/5",
};

function fmt(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  return `T-${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function useCountdown() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function TaskingSection() {
  const [active, setActive] = useState("p08");
  const tick = useCountdown();
  const pass = allPasses.find((p) => p.id === active)!;
  const next = allPasses.filter((p) => p.status !== "rejected").sort((a, b) => a.start - b.start).slice(0, 4);
  const NOW = 0.5; // simulated hours since alert

  return (
    <>
      <section id="tasking" className="scroll-mt-24 bg-navy px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <span className="inline-block rounded-full border border-gold/60 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-gold">
              {s.pill}
            </span>
            <p className="text-eyebrow mt-6 text-gold">{s.eyebrow}</p>
            <h2 className="text-balance mt-6 text-3xl font-light tracking-tight text-foreground sm:text-5xl">
              {s.headline[0]}
              <br />
              <span className="text-gold">{s.headline[1]}</span>
            </h2>
            <p className="mt-6 max-w-3xl text-base font-light text-foreground/80">{s.body}</p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {s.cards.map((c, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal key={c.title} delay={i * 0.08}>
                  <div className="h-full rounded-lg border border-white/10 bg-navy/70 p-5 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-gold" />
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                    </div>
                    <h3 className="mt-4 font-mono text-sm uppercase tracking-[0.18em] text-foreground">{c.title}</h3>
                    <p className="mt-2 text-sm font-light text-foreground/75">{c.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* console */}
          <div className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-navy-deep">
            <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3">
              <div className="flex shrink-0 gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-alert/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
              </div>
              <p className="mr-auto min-w-0 truncate font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                {s.consoleTitle}
              </p>
              <span className="shrink-0 rounded border border-gold/50 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-gold">
                PREVIEW
              </span>
            </div>

            <div className="grid min-w-0 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">COLLECTION PLAN</p>
                <div className="mt-3 overflow-x-auto">
                  <div className="min-w-[620px]">
                    <div className="grid grid-cols-[150px_1fr] gap-3">
                      <div />
                      <div className="relative h-16">
                        {/* night band */}
                        <div className="absolute inset-y-0 left-0 rounded-sm bg-white/[0.05]" style={{ width: pct(s.nightHours) }}>
                          <span className="absolute left-2 top-1 font-mono text-[9px] tracking-[0.16em] text-muted-foreground">NIGHT</span>
                        </div>
                        {/* cloud */}
                        <div className="absolute inset-x-0 bottom-4 grid grid-cols-4">
                          {s.cloud.map((c, i) => (
                            <div key={i} className="border-l border-white/10 px-2 font-mono text-[9px] tracking-[0.12em] text-foreground/60">
                              CLOUD {c}%
                              <div className="mt-0.5 h-1 rounded-full bg-white/10">
                                <div className="h-full rounded-full bg-foreground/40" style={{ width: `${c}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* hour ticks */}
                        <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono text-[9px] text-muted-foreground">
                          {Array.from({ length: 13 }).map((_, i) => (
                            <span key={i} className="w-0 text-center">{i % 2 === 0 ? `${i}h` : ""}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-2">
                      {taskingLanes.map((lane) => (
                        <div key={lane.name} className="grid grid-cols-[150px_1fr] items-center gap-3 border-t border-white/5 py-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/80">{lane.name}</p>
                          <div className="relative h-7">
                            {lane.passes.map((p) => {
                              const w = p.end ? ((p.end - p.start) / H) * 100 : 3.5;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setActive(p.id)}
                                  aria-label={`${lane.name}, hour ${p.start}, ${p.status}`}
                                  className={`absolute top-0 h-7 rounded-sm transition-shadow ${blockCls[p.status]} ${active === p.id ? "ring-2 ring-foreground/70 ring-offset-2 ring-offset-navy-deep" : ""}`}
                                  style={{ left: pct(p.start), width: `${w}%` }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {/* custody line */}
                      <div className="pointer-events-none absolute inset-y-0 left-[162px] right-0">
                        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
                          {selected.slice(0, -1).map((p, i) => {
                            const n = selected[i + 1];
                            const y = (l: string) => `${((taskingLanes.findIndex((x) => x.name === l) + 0.5) / taskingLanes.length) * 100}%`;
                            return <line key={p.id} x1={pct(p.start)} y1={y(p.lane)} x2={pct(n.start)} y2={y(n.lane)} className="stroke-gold" strokeWidth="1.5" />;
                          })}
                          {(() => {
                            const last = selected[selected.length - 1];
                            const y = `${((taskingLanes.findIndex((x) => x.name === last.lane) + 0.5) / taskingLanes.length) * 100}%`;
                            return <line x1={pct(last.start)} y1={y} x2="100%" y2={y} className="stroke-gold" strokeWidth="1.5" />;
                          })()}
                          {selected.map((p) => (
                            <circle key={p.id} cx={pct(p.start)} cy={`${((taskingLanes.findIndex((x) => x.name === p.lane) + 0.5) / taskingLanes.length) * 100}%`} r="4" className="fill-navy-deep stroke-gold" strokeWidth="2" />
                          ))}
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 font-mono text-[9px] tracking-[0.16em] text-gold">— CUSTODY</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-gold" />SELECTED</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm border border-cyan" />STANDBY</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm border border-dashed border-alert" />REJECTED</span>
                </div>

                <div aria-live="polite" className="mt-4 rounded-lg border border-white/10 bg-navy/70 p-4 backdrop-blur">
                  <p className="font-mono text-[10px] tracking-[0.18em]">
                    <span className="text-muted-foreground">{pass.lane.toUpperCase()} · HOUR {pass.start}{pass.end ? ` TO ${pass.end}` : ""} · </span>
                    <span className={pass.status === "selected" ? "text-gold" : pass.status === "standby" ? "text-cyan" : "text-alert"}>
                      {pass.status.toUpperCase()}
                    </span>
                  </p>
                  <p className="mt-2 text-sm font-light text-foreground/90">{pass.reason}</p>
                </div>
              </div>

              <div className="min-w-0 rounded-lg border border-white/10 bg-navy/70 p-4 backdrop-blur">
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{s.nextTitle}</p>
                <ul className="mt-3 space-y-3">
                  {next.map((p) => {
                    const sec = Math.max(0, Math.round((p.start - NOW) * 3600) - tick);
                    return (
                      <li key={p.id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                        <span className="min-w-0 text-xs text-foreground/80">{p.lane}</span>
                        <span className="shrink-0 font-mono text-xs text-cyan">{fmt(sec)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-deep px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {deliveryCards.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <span className="font-mono text-xs tracking-[0.24em] text-gold">0{i + 1}</span>
                <h3 className="text-balance mt-3 text-lg font-medium text-foreground">{f.title}</h3>
                <p className="text-pretty mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-navy px-6 py-28 text-center">
        <Reveal>
          <h2 className="text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">
            {closingCta.headline[0]}
            <br />
            <span className="text-gold">{closingCta.headline[1]}</span>
          </h2>
          <Link
            to="/"
            hash="contact"
            className="mt-10 inline-block border border-gold/60 bg-gold/90 px-6 py-3 font-mono text-xs tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold"
          >
            {closingCta.button} →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
