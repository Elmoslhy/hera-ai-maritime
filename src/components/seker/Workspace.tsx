import { Link } from "@tanstack/react-router";
import { Lock, Globe2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./primitives";
import vessels from "@/assets/vessels.jpg";
import {
  askExamples,
  askFallback,
  publicNews,
  sekerBriefs,
  workspaceSection as s,
  wsLayers,
  wsVessels,
} from "@/content/intelligence";

type Layer = (typeof wsLayers)[number];
const label = "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground";
const panel = "rounded-lg border border-white/10 bg-navy/70 p-4 backdrop-blur";

function Brackets() {
  const c = "absolute h-3 w-3 border-gold";
  return (
    <div className="absolute left-1/2 top-1/2 h-12 w-16 -translate-x-1/2 -translate-y-1/2">
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

function Tile({ grey, title, conf }: { grey?: boolean; title: string; conf: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded border border-white/10">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${vessels})`,
          backgroundSize: "420% auto",
          backgroundPosition: "55.5% 49%",
          filter: grey ? "grayscale(1) contrast(1.3) brightness(2.6)" : "brightness(1.8) saturate(1.1)",
        }}
      />
      {grey && (
        <svg className="absolute inset-0 h-full w-full mix-blend-screen opacity-25" aria-hidden>
          <filter id="ws-speckle">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ws-speckle)" />
        </svg>
      )}
      <Brackets />
      <div className="absolute inset-x-0 top-0 flex justify-between bg-navy-deep/70 px-2 py-1 font-mono text-[8px] tracking-[0.14em] text-foreground/80">
        <span>{title}</span>
        <span className="text-gold">{conf}</span>
      </div>
    </div>
  );
}

const DARK = [
  { id: "a", x: 320, y: 190 },
  { id: "u", x: 410, y: 250 },
  { id: "c", x: 210, y: 300 },
];

function WsMap({ layers, selected, onSelect }: { layers: Set<Layer>; selected: string; onSelect: (id: string) => void }) {
  return (
    <svg viewBox="0 0 560 400" className="block h-auto w-full rounded border border-white/10" role="img" aria-label="Operational picture">
      <rect width="560" height="400" className="fill-navy-deep" />
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" className="stroke-white/[0.04]" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="560" y2={i * 40} className="stroke-white/[0.04]" />
      ))}
      <path d="M0 0H200C170 50 100 70 0 90Z" className="fill-white/[0.06] stroke-white/10" />
      <path d="M560 0V180C500 170 470 120 460 60 455 30 430 10 420 0Z" className="fill-white/[0.06] stroke-white/10" />
      {layers.has("Sea state") && (
        <g className="stroke-cyan/25" fill="none">
          {[60, 110, 160].map((y) => (
            <path key={y} d={`M20 ${y + 200} q20 -10 40 0 t40 0 t40 0`} />
          ))}
        </g>
      )}
      {layers.has("Transfer areas") && (
        <circle cx="350" cy="215" r="70" fill="none" className="stroke-gold/70" strokeDasharray="5 5" />
      )}
      {layers.has("Ports") &&
        [[170, 60], [480, 110]].map(([x, y]) => (
          <g key={x}>
            <rect x={x - 4} y={y - 4} width="8" height="8" className="fill-gold" />
          </g>
        ))}
      {layers.has("Incidents") && (
        <g>
          <path d="M480 300l8 14h-16z" className="fill-amber" />
          <text x="494" y="313" fontSize="9" className="fill-amber font-mono">INCIDENT</text>
        </g>
      )}
      {layers.has("Vessels") &&
        [[90, 160, 60], [250, 120, 110], [470, 240, 200], [150, 360, 30], [380, 340, 250], [300, 70, 80]].map(([x, y, r], i) => (
          <polygon key={i} points="0,-6 4,5 -4,5" transform={`translate(${x} ${y}) rotate(${r})`} className="fill-cyan/80" />
        ))}
      {layers.has("Dark detections") &&
        DARK.map((d) => (
          <g key={d.id} onClick={() => onSelect(d.id)} className="cursor-pointer" role="button" aria-label={`Select dark detection ${d.id}`}>
            <circle cx={d.x} cy={d.y} r="14" className="fill-transparent" />
            <polygon points="0,-7 5,6 -5,6" transform={`translate(${d.x} ${d.y})`} className="fill-alert" />
            {selected === d.id && (
              <rect x={d.x - 13} y={d.y - 13} width="26" height="26" fill="none" className="stroke-gold" strokeWidth="1.5" strokeDasharray="8 10" />
            )}
          </g>
        ))}
    </svg>
  );
}

export function WorkspaceSection() {
  const [sel, setSel] = useState("a");
  const [layers, setLayers] = useState<Set<Layer>>(new Set(wsLayers));
  const [tab, setTab] = useState<"seker" | "public">("seker");
  const [q, setQ] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [free, setFree] = useState("");
  const [fallback, setFallback] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const v = wsVessels.find((x) => x.id === sel)!;
  const ask = (i: number) => {
    setFallback(false);
    setQ(i);
    setChecking(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setChecking(false), 1200);
  };
  const toggle = (l: Layer) =>
    setLayers((p) => {
      const n = new Set(p);
      if (n.has(l)) n.delete(l);
      else n.add(l);
      return n;
    });

  return (
    <section className="bg-navy-deep px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-eyebrow text-gold">{s.eyebrow}</p>
          <h2 className="text-balance mt-6 text-3xl font-light tracking-tight text-foreground sm:text-5xl">
            {s.headline[0]}
            <br />
            <span className="text-gold">{s.headline[1]}</span>
          </h2>
          <p className="mt-6 max-w-3xl text-base font-light text-foreground/80">{s.body}</p>
        </Reveal>

        <div className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-navy-deep">
          <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-alert/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
            </div>
            <p className="truncate font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{s.frameTitle}</p>
          </div>

          <div className="grid min-w-0 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)]">
            {/* LEFT */}
            <div className="min-w-0 space-y-3">
              <p className={label}>Sensor fusion</p>
              <div className="flex flex-wrap gap-2">
                {wsVessels.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setSel(x.id)}
                    className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                      x.id === sel ? "border-gold/60 bg-gold/12 text-gold" : "border-white/12 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {x.chip}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Tile grey title="ALL-WEATHER IMAGING" conf={(v.confidence - 0.03).toFixed(2)} />
                <Tile title="HIGH-RES IMAGING" conf={v.confidence.toFixed(2)} />
              </div>
              <div className={panel}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-foreground">VESSEL DETECTED</p>
                  <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] ${v.tone === "alert" ? "border-alert/40 bg-alert/10 text-alert" : "border-amber/40 bg-amber/10 text-amber"}`}>
                    {v.status}
                  </span>
                </div>
                <dl className="mt-3 space-y-2.5">
                  {v.fields.map((f) => (
                    <div key={f.label}>
                      <dt className={label}>{f.label}</dt>
                      <dd className="text-sm text-foreground">{f.value}</dd>
                      <dd className="font-mono text-[9px] tracking-[0.12em] text-cyan">{f.source.toUpperCase()}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4">
                  <div className="flex justify-between font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                    <span>CONFIDENCE</span>
                    <span className="text-gold">{v.confidence.toFixed(2)}</span>
                  </div>
                  <div className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${v.confidence * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* CENTRE */}
            <div className="min-w-0 space-y-3">
              <p className={label}>Operational picture</p>
              <WsMap layers={layers} selected={sel} onSelect={setSel} />
              <fieldset className={panel}>
                <legend className="sr-only">Layers</legend>
                <p className={label}>Layers</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {wsLayers.map((l) => (
                    <label key={l} className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/85">
                      <input type="checkbox" checked={layers.has(l)} onChange={() => toggle(l)} className="h-3.5 w-3.5 accent-[var(--color-gold)]" />
                      {l}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* RIGHT */}
            <div className="min-w-0 space-y-3">
              <p className={label}>Briefing</p>
              <div className="grid grid-cols-2 rounded-full border border-white/12 p-1">
                {(["seker", "public"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-full py-1.5 font-mono text-[10px] tracking-[0.14em] ${tab === t ? "bg-gold/15 text-gold" : "text-muted-foreground"}`}
                  >
                    {t === "seker" ? "SEKER BRIEFS" : "PUBLIC NEWS"}
                  </button>
                ))}
              </div>
              <ul className="space-y-2">
                {tab === "seker"
                  ? sekerBriefs.map((b) => (
                      <li key={b.text} className={panel}>
                        <p className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] text-gold">
                          <Lock className="h-3 w-3" /> CLIENTS ONLY
                        </p>
                        <p className="mt-2 text-sm font-light text-foreground/90">{b.text}</p>
                        <Meta meta={b.meta} linked={b.linked} />
                      </li>
                    ))
                  : publicNews.map((n) => (
                      <li key={n.text} className={panel}>
                        <p className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] text-muted-foreground">
                          <Globe2 className="h-3 w-3" /> PUBLIC SOURCE
                        </p>
                        <p className="mt-2 text-sm text-foreground">{n.text}</p>
                        <p className="mt-1 text-sm font-light text-cyan/90">{n.did}</p>
                        <Meta meta={n.meta} linked={n.linked} />
                      </li>
                    ))}
              </ul>

              <div className={panel}>
                <p className="font-mono text-[10px] tracking-[0.2em] text-gold">ASK HERA AI</p>
                <div className="mt-3 space-y-1.5">
                  {askExamples.map((e, i) => (
                    <button
                      key={e.q}
                      type="button"
                      onClick={() => ask(i)}
                      className={`block w-full rounded border px-3 py-2 text-left text-xs transition-colors ${q === i && !fallback ? "border-gold/50 text-gold" : "border-white/10 text-foreground/80 hover:border-white/25"}`}
                    >
                      {e.q}
                    </button>
                  ))}
                </div>
                <form
                  className="mt-3 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!free.trim()) return;
                    setQ(null);
                    setFallback(true);
                  }}
                >
                  <input
                    value={free}
                    onChange={(e) => setFree(e.target.value)}
                    placeholder="Ask your own question"
                    aria-label="Ask your own question"
                    className="min-w-0 flex-1 rounded border border-white/12 bg-navy-deep px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
                  />
                  <button type="submit" aria-label="Send question" className="rounded border border-gold/60 px-3 text-gold hover:bg-gold/10">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
                <div aria-live="polite" className="mt-3">
                  {fallback && (
                    <p className="text-sm font-light text-foreground/85">
                      {askFallback}{" "}
                      <Link to="/" hash="contact" className="text-gold underline underline-offset-4">
                        Book a session
                      </Link>
                    </p>
                  )}
                  {q !== null && checking && (
                    <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-cyan">
                      <span className="blink-dot h-1.5 w-1.5 rounded-full bg-cyan" />
                      Checking {askExamples[q].sources.length} sources…
                    </p>
                  )}
                  {q !== null && !checking && (
                    <div>
                      <p className="text-sm font-light text-foreground/90">{askExamples[q].a}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {askExamples[q].sources.map((src) => (
                          <span key={src} className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-cyan">
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs font-light text-muted-foreground">{s.note}</p>
      </div>
    </section>
  );
}

function Meta({ meta, linked }: { meta: string; linked: number }) {
  return (
    <p className="mt-2 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
      {meta.toUpperCase()}
      {linked > 0 && (
        <span className="text-cyan"> · LINKED TO {linked} WATCHED VESSEL{linked > 1 ? "S" : ""}</span>
      )}
    </p>
  );
}
