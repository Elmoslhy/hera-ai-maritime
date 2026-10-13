import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Satellite, Orbit, Drone } from "lucide-react";
import { HeroScene } from "@/components/seker/HeroScene";
import { SekerLogo } from "@/components/seker/Logo";
import { SensorImagers } from "@/components/seker/SensorImagers";
import { LiveMap, DigitalTwin, WindowChrome } from "@/components/seker/Dashboard";
import { FindingCard, OpsMap } from "@/components/seker/UseCases";
import { intelligenceSteps, useCases, sekerBriefs, askExamples, taskingSection, taskingLanes } from "@/content/intelligence";
import { industries } from "@/content/industries";
import ocean from "@/assets/ocean.jpg";
import vesselTop from "@/assets/vessel-top.png";

export const Route = createFileRoute("/deck")({
  head: () => ({
    meta: [
      { title: "Seker Space Intelligence | Investor deck" },
      { name: "description", content: "Seker Space Intelligence presentation deck for HERA AI." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Seker Space Intelligence | Investor deck" },
      { property: "og:description", content: "Seker Space Intelligence presentation deck for HERA AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Deck,
});

const W = 1920, H = 1080;

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[22px] uppercase tracking-[0.3em] text-gold">{children}</p>;
}
function Title({ children }: { children: ReactNode }) {
  return <h2 className="mt-6 text-[76px] font-light leading-[1.05] tracking-tight text-foreground">{children}</h2>;
}
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-white/10 bg-navy/70 backdrop-blur ${className}`}>{children}</div>;
}
function Pad({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0 px-[120px] py-[100px]">{children}</div>;
}
function Stat({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className="bg-navy px-10 py-12">
      <p className={`font-mono text-[72px] leading-none ${tone}`}>{value}</p>
      <p className="mt-5 font-mono text-[18px] tracking-[0.18em] text-muted-foreground">{label.toUpperCase()}</p>
    </div>
  );
}
function Ocean({ dim = "bg-navy/70" }: { dim?: string }) {
  return (
    <>
      <img src={ocean} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className={`absolute inset-0 ${dim}`} />
    </>
  );
}
function Brackets({ size }: { size: number }) {
  const c = "absolute h-10 w-10 border-gold";
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: size, height: size }}>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

const dark = useCases.find((u) => u.id === "dark-transfer")!;
const darkIdx = useCases.indexOf(dark);
const ask = askExamples[0];
const passes = taskingLanes.flatMap((l) => l.passes.map((p) => ({ ...p, lane: l.name })));
const ICONS = [Satellite, Orbit, Drone];

const SLIDES: { title: string; node: ReactNode }[] = [
  {
    title: "Title",
    node: (
      <>
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/60 to-transparent" />
        <Pad>
          <SekerLogo className="h-[90px] w-auto text-foreground" />
          <h1 className="mt-[260px] max-w-[1000px] text-[104px] font-light leading-[1.02] tracking-tight text-foreground">
            Maritime intelligence <span className="text-gold">you can act on.</span>
          </h1>
        </Pad>
      </>
    ),
  },
  {
    title: "The problem",
    node: (
      <>
        <Ocean dim="bg-navy-deep/92" />
        <Pad>
          <div className="grid h-full grid-cols-2 gap-20">
            <div>
              <Eyebrow>The problem</Eyebrow>
              <Title>Maritime decisions rest on broken intelligence.</Title>
              <p className="mt-10 border-l border-gold/40 pl-8 text-[28px] font-light leading-snug text-muted-foreground">
                76% of all EU trade by weight moves by sea, yet a growing shadow fleet of over 3,300 vessels operates outside the system through AIS manipulation, GPS jamming and identity fraud.
              </p>
              <p className="mt-6 pl-8 font-mono text-[16px] tracking-[0.18em] text-muted-foreground/70">EUROSTAT 2024 · ANU/CEPR 2025 · WINDWARD Q3 2025</p>
            </div>
            <div className="grid grid-cols-2 gap-px self-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <Stat value="$54B" label="Global MDA market by 2030" tone="text-gold" />
              <Stat value="18%" label="Sector CAGR 2024 to 2030" tone="text-cyan" />
              <Stat value="×3" label="YoY growth in AIS spoofing" tone="text-alert" />
              <Stat value="LU" label="Built in Luxembourg, EU" tone="text-foreground" />
            </div>
          </div>
        </Pad>
      </>
    ),
  },
  {
    title: "The signal stops",
    node: (
      <>
        <Ocean dim="bg-navy/80" />
        <img src={vesselTop} alt="" className="absolute left-1/2 top-[58%] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-40 grayscale" />
        <div className="absolute left-1/2 top-[58%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-alert/70" />
        <Pad>
          <p className="font-mono text-[26px] tracking-[0.3em] text-alert">● AIS LOST · THE SIGNAL STOPS</p>
          <Title>When a vessel switches off,<br /><span className="text-gold">most maritime intelligence goes blind.</span></Title>
        </Pad>
      </>
    ),
  },
  {
    title: "Located",
    node: (
      <>
        <Ocean dim="bg-navy/70" />
        <div className="absolute left-[38%] top-[60%] -translate-x-1/2 -translate-y-1/2">
          <img src={vesselTop} alt="" className="w-[460px]" />
          <Brackets size={500} />
          <p className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-gold/50 bg-navy/80 px-4 py-2 font-mono text-[20px] tracking-[0.2em] text-gold">LOCATED · TIR + RF FUSED</p>
        </div>
        <div className="absolute right-[100px] top-[100px] w-[560px] [&_*]:!opacity-100">
          <SensorImagers thermal={1} rf={1} fused={1} />
        </div>
        <Pad>
          <p className="font-mono text-[26px] tracking-[0.3em] text-gold">LOCATED</p>
          <Title>HERA AI keeps watching.</Title>
        </Pad>
      </>
    ),
  },
  {
    title: "HERA AI",
    node: (
      <Pad>
        <Eyebrow>HERA AI</Eyebrow>
        <h2 className="mt-8 max-w-[1300px] text-[104px] font-light leading-[1.02] tracking-tight text-foreground">
          A digital twin of <span className="text-gold">every vessel at sea.</span>
        </h2>
        <p className="mt-10 max-w-[1100px] text-[32px] font-light text-foreground/80">
          HERA AI builds and maintains a live digital twin for every vessel on the ocean, then delivers verified intelligence to customers every day.
        </p>
        <div className="mt-16 flex flex-wrap gap-4">
          {["AIS-T", "AIS-S", "SAR", "RF", "OPT", "TIR", "PROPRIETARY SENSORS"].map((c) => (
            <span key={c} className="rounded-full border border-cyan/30 bg-cyan/5 px-7 py-3 font-mono text-[22px] tracking-[0.2em] text-cyan">{c}</span>
          ))}
        </div>
      </Pad>
    ),
  },
  {
    title: "How it works",
    node: (
      <Pad>
        <Eyebrow>How it works</Eyebrow>
        <Title>From a missing signal<br /><span className="text-gold">to a finding you can defend.</span></Title>
        <div className="mt-20 grid grid-cols-6 gap-5">
          {intelligenceSteps.map((s) => (
            <Panel key={s.n} className="h-[340px] p-7">
              <p className="font-mono text-[22px] tracking-[0.2em] text-gold">{s.n}</p>
              <p className="mt-6 text-[36px] font-light text-foreground">{s.title}</p>
              <p className="mt-4 text-[22px] font-light leading-snug text-foreground/75">{s.text}</p>
            </Panel>
          ))}
        </div>
      </Pad>
    ),
  },
  {
    title: "The platform",
    node: (
      <div className="absolute inset-0 flex flex-col px-[80px] py-[60px]">
        <Eyebrow>The platform</Eyebrow>
        <div className="mt-6 origin-top-left scale-[1.18]" style={{ width: `${(W - 160) / 1.18}px` }}>
          <WindowChrome>
            <div className="grid grid-cols-[1.6fr_1fr] gap-px bg-white/5">
              <div className="bg-[#050a12] p-3"><LiveMap /></div>
              <div className="max-h-[640px] overflow-hidden bg-[#050a12] p-3"><DigitalTwin /></div>
            </div>
          </WindowChrome>
        </div>
      </div>
    ),
  },
  {
    title: "Inside HERA AI",
    node: (
      <Pad>
        <Eyebrow>Inside HERA AI</Eyebrow>
        <Title>Briefs and answers, <span className="text-gold">with their sources.</span></Title>
        <div className="mt-14 grid grid-cols-2 gap-8">
          <Panel className="p-8">
            <div className="flex gap-6 border-b border-white/10 pb-4 font-mono text-[18px] tracking-[0.2em]">
              <span className="border-b-2 border-gold pb-3 text-gold">SEKER BRIEFS</span>
              <span className="text-muted-foreground">PUBLIC NEWS</span>
            </div>
            <ul className="mt-6 space-y-6">
              {sekerBriefs.map((b) => (
                <li key={b.meta}>
                  <p className="text-[24px] font-light leading-snug text-foreground/85">{b.text}</p>
                  <p className="mt-2 font-mono text-[16px] tracking-[0.15em] text-muted-foreground">{b.meta.toUpperCase()}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-8">
            <p className="font-mono text-[18px] tracking-[0.2em] text-cyan">ASK HERA AI</p>
            <p className="mt-6 rounded border border-white/10 bg-white/[0.03] px-5 py-4 text-[26px] text-foreground">{ask.q}</p>
            <p className="mt-6 text-[26px] font-light leading-snug text-foreground/85">{ask.a}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {ask.sources.map((s) => (
                <span key={s} className="rounded-full border border-gold/40 px-4 py-1.5 font-mono text-[16px] tracking-[0.15em] text-gold">{s.toUpperCase()}</span>
              ))}
            </div>
          </Panel>
        </div>
      </Pad>
    ),
  },
  {
    title: "Task and follow",
    node: (
      <Pad>
        <Eyebrow>{taskingSection.eyebrow}</Eyebrow>
        <Title>{taskingSection.headline[0]} <span className="text-gold">{taskingSection.headline[1]}</span></Title>
        <div className="mt-12 grid grid-cols-3 gap-6">
          {taskingSection.cards.map((c, i) => {
            const Icon = ICONS[i];
            return (
              <Panel key={c.title} className="p-7">
                <Icon className="h-9 w-9 text-gold" />
                <p className="mt-5 text-[30px] font-light text-foreground">{c.title}</p>
                <p className="mt-3 text-[21px] font-light leading-snug text-foreground/75">{c.text}</p>
              </Panel>
            );
          })}
        </div>
        <Panel className="mt-8 p-7">
          <p className="font-mono text-[18px] tracking-[0.2em] text-muted-foreground">{taskingSection.consoleTitle}</p>
          <div className="relative mt-5 space-y-3">
            {taskingLanes.map((l) => (
              <div key={l.name} className="flex items-center gap-5">
                <span className="w-[260px] font-mono text-[16px] tracking-[0.12em] text-foreground/80">{l.name.toUpperCase()}</span>
                <div className="relative h-7 flex-1 rounded bg-white/[0.03]">
                  {l.passes.map((p) => (
                    <span
                      key={p.id}
                      className={`absolute top-1 h-5 rounded-sm ${p.status === "selected" ? "bg-gold" : p.status === "standby" ? "bg-cyan/60" : "bg-white/15"}`}
                      style={{ left: `${(p.start / 12) * 100}%`, width: `${Math.max(1.2, (((p.end ?? p.start + 0.3) - p.start) / 12) * 100)}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <svg className="pointer-events-none absolute inset-y-0 left-[280px] right-0 h-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
              <polyline
                points={passes.filter((p) => p.status === "selected").sort((a, b) => a.start - b.start).map((p) => `${(p.start / 12) * 100},${taskingLanes.findIndex((l) => l.name === p.lane) * (100 / taskingLanes.length) + 50 / taskingLanes.length}`).join(" ")}
                fill="none" stroke="#c9a84c" strokeWidth="0.4" strokeDasharray="1.5 1" vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <p className="mt-4 font-mono text-[16px] tracking-[0.15em] text-gold">CUSTODY · HANDED FROM ONE COLLECTION TO THE NEXT AS THE VESSEL MOVES</p>
        </Panel>
      </Pad>
    ),
  },
  {
    title: "Who we serve",
    node: (
      <Pad>
        <Eyebrow>Who we serve</Eyebrow>
        <Title>Five industries, <span className="text-gold">one verified picture.</span></Title>
        <div className="mt-16 grid grid-cols-5 gap-5">
          {industries.slice(0, 5).map((i) => (
            <Panel key={i.slug} className="flex h-[480px] flex-col p-7">
              <p className="flex items-center gap-3 font-mono text-[16px] tracking-[0.18em] text-gold"><span className="h-2 w-2 rounded-full bg-cyan" />{i.navName.toUpperCase()}</p>
              <p className="mt-6 text-[30px] font-light leading-tight text-foreground">{i.headline[0]} <span className="text-gold">{i.headline[1]}</span></p>
              <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
                {(i.rebuild?.deliverables ?? []).slice(0, 2).map((d) => (
                  <p key={d.name} className="font-mono text-[16px] tracking-[0.1em] text-cyan">{d.name.toUpperCase()}</p>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </Pad>
    ),
  },
  {
    title: "One case, end to end",
    node: (
      <Pad>
        <Eyebrow>One case, end to end · Dark transfer</Eyebrow>
        <div className="mt-10 grid grid-cols-[1.5fr_1fr] gap-8">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#050a12]">
            <div className="flex items-center gap-2 border-b border-white/8 bg-navy-deep px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-alert/80" /><span className="h-3 w-3 rounded-full bg-amber/80" /><span className="h-3 w-3 rounded-full bg-cyan/80" />
              <span className="ml-4 font-mono text-[16px] tracking-[0.2em] text-gold">05 · ASSESS</span>
            </div>
            <OpsMap idx={darkIdx} stage={4} />
          </div>
          <div className="origin-top-left scale-[1.45]" style={{ width: 480 }}>
            <FindingCard uc={dark} />
          </div>
        </div>
      </Pad>
    ),
  },
  {
    title: "The market",
    node: (
      <Pad>
        <Eyebrow>The market</Eyebrow>
        <div className="mt-16 grid w-[1100px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <Stat value="$54B" label="Global MDA market by 2030" tone="text-gold" />
          <Stat value="18%" label="Sector CAGR 2024 to 2030" tone="text-cyan" />
        </div>
        <p className="mt-16 max-w-[1300px] text-[52px] font-light leading-tight text-foreground">
          Maritime domain awareness is growing fast, and <span className="text-gold">Europe needs its own independent layer.</span>
        </p>
      </Pad>
    ),
  },
  {
    title: "Close",
    node: (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <SekerLogo className="h-[140px] w-auto text-foreground" />
        <p className="mt-16 text-[88px] font-light tracking-tight text-foreground">Maritime intelligence <span className="text-gold">you can act on.</span></p>
        <p className="mt-12 font-mono text-[32px] tracking-[0.2em] text-cyan">info@seker-space.com</p>
      </div>
    ),
  },
];

function Deck() {
  const [i, setI] = useState(0);
  const [scale, setScale] = useState(0.5);
  const n = SLIDES.length;
  const go = useCallback((d: number) => setI((v) => Math.min(n - 1, Math.max(0, v + d))), [n]);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      else if (e.key.toLowerCase() === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("resize", fit); window.removeEventListener("keydown", key); };
  }, [go]);

  useEffect(() => { document.title = `${i + 1}/${n} | ${SLIDES[i].title} | Seker deck`; }, [i, n]);

  return (
    <div
      className="deck-root fixed inset-0 z-[100] cursor-default overflow-hidden bg-navy-deep"
      onClick={() => go(1)}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
    >
      <style>{`
        @keyframes deck-enter { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .deck-active .deck-inner { animation: deck-enter 0.8s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .deck-active .deck-inner { animation: none; } }
        @media print {
          @page { size: 1920px 1080px; margin: 0; }
          html, body { background: #09121F !important; height: auto !important; overflow: visible !important; }
          *:has(> .deck-root), *:has(.deck-root) { height: auto !important; overflow: visible !important; position: static !important; transform: none !important; }
          canvas.fixed, .fixed.pointer-events-none { display: none !important; }
          body > *:not(.deck-root):not(:has(.deck-root)) { display: none !important; }
          .deck-root { position: static !important; overflow: visible !important; }
          .deck-chrome { display: none !important; }
          .deck-slide { display: block !important; position: relative !important; transform: none !important; left: 0 !important; top: 0 !important; margin: 0 !important; break-after: page; page-break-after: always; }
          .deck-inner { animation: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <div className="deck-chrome absolute inset-x-0 top-0 z-20 h-[3px] bg-white/5">
        <div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${((i + 1) / n) * 100}%` }} />
      </div>
      {SLIDES.map((s, k) => (
        <div
          key={k}
          className={`deck-slide absolute overflow-hidden bg-navy-deep ${k === i ? "deck-active" : "hidden"}`}
          style={{ width: W, height: H, left: "50%", top: "50%", marginLeft: -W / 2, marginTop: -H / 2, transform: `scale(${scale})` }}
          aria-hidden={k !== i}
        >
          <div className="deck-inner absolute inset-0">{s.node}</div>
        </div>
      ))}
      <p className="deck-chrome absolute bottom-4 right-6 z-20 font-mono text-xs tracking-[0.2em] text-muted-foreground">
        {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </p>
    </div>
  );
}
