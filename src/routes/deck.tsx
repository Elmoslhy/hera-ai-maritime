import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Satellite, Orbit, Drone, ChevronLeft, ChevronRight } from "lucide-react";
import { HeroScene, HeroHud } from "@/components/seker/HeroScene";
import { IntelPanel } from "@/components/seker/IntelPanel";
import { SekerLogo } from "@/components/seker/Logo";
import { SensorImagers } from "@/components/seker/SensorImagers";
import { LiveMap, DigitalTwin, WindowChrome } from "@/components/seker/Dashboard";
import { taskingSection, taskingLanes } from "@/content/intelligence";
import { industries } from "@/content/industries";
import ocean from "@/assets/ocean.jpg";
import vessels from "@/assets/vessels.jpg";
import vesselTop from "@/assets/vessel-top.png";
import satReal from "@/assets/satellite-real.png";
import satNet from "@/assets/satellite-network.jpg";
import globe from "@/assets/earth-globe.png";

export const Route = createFileRoute("/deck")({
  validateSearch: (s: Record<string, unknown>) => ({ slide: Math.max(1, Number(s.slide) || 1) }),
  head: () => ({
    meta: [
      { title: "Seker Space Intelligence | Deck" },
      { name: "description", content: "Seker Space Intelligence presentation deck for HERA AI." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Seker Space Intelligence | Deck" },
      { property: "og:description", content: "Seker Space Intelligence presentation deck for HERA AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Deck,
});

const W = 1920, H = 1080;

/* ---------- building blocks ---------- */
function Bg({ src, dim = "bg-navy-deep/70", className = "h-full w-full object-cover" }: { src: string; dim?: string; className?: string }) {
  return (
    <div className="deck-bg absolute inset-0">
      <img src={src} alt="" className={className} />
      <div className={`absolute inset-0 ${dim}`} />
    </div>
  );
}
function Text({ children, className = "left-[120px] top-[110px]" }: { children: ReactNode; className?: string }) {
  return <div className={`deck-text absolute z-10 ${className}`}>{children}</div>;
}
function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[24px] uppercase tracking-[0.3em] text-gold">{children}</p>;
}
function Headline({ a, b }: { a: string; b?: string }) {
  return (
    <h2 className="mt-6 text-[104px] font-light leading-[1.02] tracking-tight text-foreground">
      {a}
      {b && (<><br /><span className="text-gold">{b}</span></>)}
    </h2>
  );
}
function Line({ children }: { children: ReactNode }) {
  return <p className="mt-8 max-w-[1000px] text-[32px] font-light text-foreground/80">{children}</p>;
}
function Brackets({ w, h = w, className = "" }: { w: number; h?: number; className?: string }) {
  const c = "absolute h-12 w-12 border-gold";
  return (
    <div className={`absolute ${className}`} style={{ width: w, height: h }}>
      <span className={`${c} left-0 top-0 border-l-[3px] border-t-[3px]`} />
      <span className={`${c} right-0 top-0 border-r-[3px] border-t-[3px]`} />
      <span className={`${c} bottom-0 left-0 border-b-[3px] border-l-[3px]`} />
      <span className={`${c} bottom-0 right-0 border-b-[3px] border-r-[3px]`} />
    </div>
  );
}
function Tag({ tone, children, className = "" }: { tone: "alert" | "cyan" | "gold"; children: ReactNode; className?: string }) {
  const t = { alert: "border-alert/60 text-alert", cyan: "border-cyan/50 text-cyan", gold: "border-gold/50 text-gold" }[tone];
  const d = { alert: "bg-alert", cyan: "bg-cyan", gold: "bg-gold" }[tone];
  return (
    <div className={`absolute whitespace-nowrap rounded border bg-navy-deep/85 px-4 py-2 font-mono text-[20px] tracking-[0.18em] ${t} ${className}`}>
      <span className="flex items-center gap-3"><span className={`blink-dot h-2.5 w-2.5 rounded-full ${d}`} />{children}</span>
    </div>
  );
}
function Hud({ km, ais }: { km: number; ais: "on" | "lost" }) {
  const row = (k: string, on: boolean, lost = false) => (
    <div className="flex items-center justify-between border-t border-white/10 py-3">
      <span className="text-foreground/80">{k}</span>
      <span className={`h-3 w-3 rounded-full ${lost ? "bg-alert shadow-[0_0_10px_var(--color-alert)]" : on ? "bg-cyan shadow-[0_0_10px_var(--color-cyan)]" : "bg-white/20"}`} />
    </div>
  );
  return (
    <div className="deck-text absolute right-[100px] top-1/2 z-10 w-[340px] -translate-y-1/2 rounded-lg border border-white/10 bg-navy/70 p-6 font-mono text-[18px] tracking-[0.18em] backdrop-blur">
      <p className="text-muted-foreground">DISTANCE</p>
      <p className="mb-4 mt-1 text-[44px] tracking-normal text-gold">{km} km</p>
      {row("AIS", ais === "on", ais === "lost")}
      {row("TIR", km === 0)}
      {row("RF", km === 0)}
    </div>
  );
}
function Stars() {
  return (
    <svg viewBox="0 0 1920 1080" className="absolute inset-0 h-full w-full" aria-hidden>
      {Array.from({ length: 220 }).map((_, i) => (
        <circle key={i} cx={(i * 137.5) % 1920} cy={(i * 61.8) % 1080} r={i % 7 === 0 ? 1.8 : 0.9} fill="#eef2f7" opacity={i % 3 ? 0.3 : 0.75} />
      ))}
    </svg>
  );
}
function TitleCentre() {
  return (
    <div className="deck-text absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
      <SekerLogo className="w-[520px] text-foreground" />
      <h1 className="mt-10 text-[104px] font-light leading-[1.02] tracking-tight text-foreground">
        Maritime intelligence<br /><span className="text-gold">you can act on.</span>
      </h1>
    </div>
  );
}
function GlobeScene() {
  return (
    <div className="deck-bg absolute inset-0">
      <div className="absolute inset-0 bg-navy-deep" />
      <HeroScene />
    </div>
  );
}

const ICONS = [Satellite, Orbit, Drone];
const selected = taskingLanes
  .flatMap((l, li) => l.passes.filter((p) => p.status === "selected").map((p) => ({ ...p, li })))
  .sort((a, b) => a.start - b.start);

/* ---------- slides ---------- */
const SLIDES: { title: string; node: ReactNode }[] = [
  {
    title: "Title",
    node: (
      <>
        <GlobeScene />
        <div className="deck-text absolute inset-0 z-10 [&_.lg\:block]:!block"><IntelPanel /><HeroHud /></div>
        <TitleCentre />
      </>
    ),
  },
  {
    title: "The problem",
    node: (
      <>
        <Bg src={vessels} dim="bg-navy-deep/65" />
        <Brackets w={170} h={120} className="left-[1160px] top-[330px]" />
        <Brackets w={150} h={110} className="left-[1480px] top-[560px]" />
        <div className="absolute left-[1000px] top-[720px] h-[90px] w-[130px] rounded-full border-2 border-dashed border-alert/80" />
        <Tag tone="alert" className="left-[1150px] top-[740px]">AIS · SIGNAL LOST</Tag>
        <Text>
          <Eyebrow>The problem</Eyebrow>
          <Headline a="3,300 vessels sail" b="in the shadows." />
        </Text>
        <div className="deck-text absolute bottom-[110px] left-[120px] z-10">
          <div className="flex gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
            {[["76%", "of EU trade moves by sea", "text-gold"], ["×3", "AIS spoofing year on year", "text-alert"], ["$100B+", "sanctions evasion a year", "text-cyan"]].map(([v, l, t]) => (
              <div key={v} className="w-[380px] bg-navy/85 px-8 py-6">
                <p className={`font-mono text-[56px] leading-none ${t}`}>{v}</p>
                <p className="mt-3 text-[22px] font-light text-foreground/80">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-[16px] tracking-[0.2em] text-muted-foreground">EUROSTAT 2024 · ANU/CEPR 2025 · WINDWARD Q3 2025</p>
        </div>
      </>
    ),
  },
  {
    title: "In orbit",
    node: (
      <>
        <div className="deck-bg absolute inset-0 bg-navy-deep">
          <Stars />
          <img src={satNet} alt="" className="absolute bottom-0 left-0 h-[42%] w-full object-cover object-bottom opacity-80 [mask-image:linear-gradient(to_top,black_55%,transparent)]" />
        </div>
        <img src={satReal} alt="" className="deck-drift absolute left-1/2 top-[44%] w-[640px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_80px_rgba(77,217,192,0.3)]" />
        <Text>
          <Eyebrow>In orbit</Eyebrow>
          <Headline a="Watching every vessel" b="from space." />
        </Text>
        <Hud km={547} ais="on" />
      </>
    ),
  },
  {
    title: "The signal stops",
    node: (
      <>
        <Bg src={ocean} dim="bg-navy/70" />
        <div className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2">
          <img src={vesselTop} alt="" className="w-[520px] opacity-60" />
          <span className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-alert/60 [animation-duration:2.4s]" />
          <span className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-alert/80" />
          <Tag tone="alert" className="-right-[260px] -top-[40px]">AIS · SIGNAL LOST<br /><span className="text-[16px] text-foreground/70">Transmitter switched off</span></Tag>
        </div>
        <Text>
          <Eyebrow>The signal stops</Eyebrow>
          <Headline a="When the signal stops," b="most intelligence goes blind." />
        </Text>
        <Hud km={120} ais="lost" />
      </>
    ),
  },
  {
    title: "Located",
    node: (
      <>
        <Bg src={ocean} dim="bg-navy/65" />
        {[["left-[620px]", "SEKER-1"], ["left-[1180px]", "SEKER-2"]].map(([l, n]) => (
          <div key={n} className={`absolute top-[60px] ${l} w-[140px] text-center`}>
            <img src={satReal} alt="" className="w-full" />
            <p className="mt-1 font-mono text-[16px] tracking-[0.2em] text-cyan">{n}</p>
          </div>
        ))}
        <svg viewBox="0 0 1920 1080" className="absolute inset-0 h-full w-full" aria-hidden>
          <line x1="690" y1="170" x2="960" y2="680" stroke="#4dd9c0" strokeWidth="2" strokeDasharray="10 10" />
          <line x1="1250" y1="170" x2="960" y2="680" stroke="#4dd9c0" strokeWidth="2" strokeDasharray="10 10" />
        </svg>
        <div className="absolute left-[960px] top-[680px] -translate-x-1/2 -translate-y-1/2">
          <img src={vesselTop} alt="" className="w-[480px]" />
          <Brackets w={560} h={300} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Tag tone="gold" className="left-1/2 top-[190px] -translate-x-1/2">LOCATED · TIR + RF FUSED</Tag>
        </div>
        <div className="deck-text absolute left-[100px] top-[330px] z-10 w-[400px] [&_*]:!opacity-100">
          <SensorImagers thermal={1} rf={1} fused={1} />
        </div>
        <Text className="left-[100px] top-[90px]">
          <Eyebrow>Located</Eyebrow>
          <Headline a="HERA AI keeps watching." />
        </Text>
        <Hud km={0} ais="lost" />
      </>
    ),
  },
  {
    title: "The platform",
    node: (
      <>
        <div className="deck-bg absolute inset-0 bg-navy-deep" />
        <Text className="left-[120px] top-[70px]">
          <Eyebrow>HERA AI</Eyebrow>
          <h2 className="mt-4 text-[88px] font-light tracking-tight text-foreground">One verified picture.</h2>
        </Text>
        <div className="absolute left-1/2 top-[290px] -translate-x-1/2 [perspective:2400px]">
          <div className="deck-bg origin-top [transform:rotateX(12deg)]" style={{ width: 1632 / 1.25 + "px", transform: "rotateX(12deg) scale(1.25)" }}>
            <WindowChrome>
              <div className="grid grid-cols-[1.6fr_1fr] gap-px bg-white/5">
                <div className="bg-[#050a12] p-3"><LiveMap /></div>
                <div className="max-h-[520px] overflow-hidden bg-[#050a12] p-3"><DigitalTwin /></div>
              </div>
            </WindowChrome>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Task and follow",
    node: (
      <>
        <Bg src={satNet} dim="bg-navy-deep/85" />
        <Text>
          <Eyebrow>{taskingSection.eyebrow}</Eyebrow>
          <Headline a="Task a satellite." b="Follow the vessel." />
        </Text>
        <div className="deck-text absolute bottom-[100px] left-[120px] right-[120px] z-10">
          <div className="grid grid-cols-3 gap-6">
            {taskingSection.cards.map((c, i) => {
              const Icon = ICONS[i];
              return (
                <div key={c.title} className="rounded-lg border border-white/10 bg-navy/75 p-7 backdrop-blur">
                  <div className="flex items-center justify-between"><Icon className="h-9 w-9 text-gold" /><span className="h-2.5 w-2.5 rounded-full bg-cyan" /></div>
                  <p className="mt-5 text-[32px] font-light text-foreground">{c.title}</p>
                  <p className="mt-3 text-[21px] font-light leading-snug text-foreground/75">{c.text}</p>
                </div>
              );
            })}
          </div>
          <div className="relative mt-6 space-y-2 rounded-lg border border-white/10 bg-navy/75 p-5">
            {taskingLanes.map((l) => (
              <div key={l.name} className="flex items-center gap-5">
                <span className="w-[300px] font-mono text-[15px] tracking-[0.12em] text-foreground/75">{l.name.toUpperCase()}</span>
                <div className="relative h-5 flex-1 rounded bg-white/[0.04]">
                  {l.passes.map((p) => (
                    <span key={p.id} className={`absolute top-1 h-3 rounded-sm ${p.status === "selected" ? "bg-gold" : p.status === "standby" ? "bg-cyan/60" : "bg-white/15"}`}
                      style={{ left: `${(p.start / 12) * 100}%`, width: `${Math.max(1.2, (((p.end ?? p.start + 0.3) - p.start) / 12) * 100)}%` }} />
                  ))}
                </div>
              </div>
            ))}
            <svg className="pointer-events-none absolute bottom-5 left-[345px] right-5 top-5" style={{ height: "calc(100% - 40px)", width: "calc(100% - 365px)" }} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <polyline points={selected.map((p) => `${(p.start / 12) * 100},${((p.li + 0.5) / taskingLanes.length) * 100}`).join(" ")}
                fill="none" stroke="#c9a84c" strokeWidth="2" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Who we serve",
    node: (
      <>
        <div className="deck-bg absolute inset-0 bg-navy-deep" />
        <Text className="left-[120px] top-[80px]">
          <Eyebrow>Who we serve</Eyebrow>
          <h2 className="mt-4 text-[80px] font-light leading-[1.02] tracking-tight text-foreground">Five industries, <span className="text-gold">one verified picture.</span></h2>
        </Text>
        <div className="deck-text absolute bottom-[100px] left-[120px] right-[120px] grid grid-cols-5 gap-5">
          {industries.slice(0, 5).map((i) => (
            <div key={i.slug} className="relative h-[640px] overflow-hidden rounded-lg border border-white/10">
              <img src={i.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/75 to-navy-deep/20" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="flex items-center gap-3 font-mono text-[16px] tracking-[0.18em] text-gold"><span className="h-2 w-2 rounded-full bg-cyan" />{i.navName.toUpperCase()}</p>
                <p className="mt-5 text-[30px] font-light leading-tight text-foreground">{i.headline[0]}<br /><span className="text-gold">{i.headline[1]}</span></p>
                <p className="mt-6 border-t border-white/15 pt-4 font-mono text-[16px] tracking-[0.12em] text-cyan">{(i.rebuild?.deliverables[0]?.name ?? "").toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "The market",
    node: (
      <>
        <div className="deck-bg absolute inset-0 bg-navy-deep">
          <Stars />
          <img src={globe} alt="" className="absolute -right-[380px] top-1/2 w-[1200px] -translate-y-1/2" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/70 to-transparent" />
        </div>
        <Text className="left-[120px] top-[140px]">
          <Eyebrow>The market</Eyebrow>
          <div className="mt-12 space-y-12">
            <div><p className="font-mono text-[160px] leading-none text-gold">$54B</p><p className="mt-3 text-[28px] font-light text-foreground/80">Global maritime domain awareness market by 2030</p></div>
            <div><p className="font-mono text-[160px] leading-none text-cyan">18%</p><p className="mt-3 text-[28px] font-light text-foreground/80">Sector growth a year to 2030</p></div>
          </div>
          <Line>Europe needs its own independent maritime intelligence layer.</Line>
        </Text>
      </>
    ),
  },
  {
    title: "Close",
    node: (
      <>
        <GlobeScene />
        <TitleCentre />
        <p className="deck-text absolute bottom-[160px] left-0 right-0 z-10 text-center font-mono text-[34px] tracking-[0.2em] text-cyan">info@seker-space.com</p>
      </>
    ),
  },
];

/* ---------- deck shell ---------- */
function Deck() {
  const { slide } = Route.useSearch();
  const navigate = useNavigate({ from: "/deck" });
  const n = SLIDES.length;
  const i = Math.min(n, slide) - 1;
  const [scale, setScale] = useState(0.5);
  const [ui, setUi] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback((k: number) => {
    const t = Math.min(n - 1, Math.max(0, k));
    if (t !== i) navigate({ search: { slide: t + 1 } });
  }, [i, n, navigate]);

  const poke = useCallback(() => {
    setUi(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setUi(false), 2000);
  }, []);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    root.current?.focus();
    poke();
    return () => window.removeEventListener("resize", fit);
  }, [poke]);

  useEffect(() => { document.title = `${i + 1}/${n} | ${SLIDES[i].title} | Seker deck`; }, [i, n]);

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowRight" || k === " " || k === "PageDown") { e.preventDefault(); goTo(i + 1); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); goTo(i - 1); }
    else if (k === "Home") { e.preventDefault(); goTo(0); }
    else if (k === "End") { e.preventDefault(); goTo(n - 1); }
    else if (k.toLowerCase() === "f") {
      if (document.fullscreenElement) document.exitFullscreen();
      else root.current?.requestFullscreen?.().catch(() => {});
    }
  };

  const stop = (e: React.MouseEvent) => { e.stopPropagation(); root.current?.focus(); };
  const btn = `deck-chrome absolute top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navy/70 text-foreground backdrop-blur transition-opacity duration-500 hover:border-gold hover:text-gold ${ui ? "opacity-100" : "pointer-events-none opacity-0"}`;

  return (
    <div
      ref={root}
      tabIndex={0}
      onKeyDown={onKey}
      onMouseMove={poke}
      onClick={(e) => {
        root.current?.focus();
        const r = root.current!.getBoundingClientRect();
        goTo(e.clientX - r.left < r.width / 3 ? i - 1 : i + 1);
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; poke(); }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) { e.preventDefault(); goTo(dx < 0 ? i + 1 : i - 1); }
      }}
      className="deck-root fixed inset-0 z-[100] cursor-default select-none overflow-hidden bg-navy-deep outline-none"
    >
      <style>{`
        @keyframes deck-bg-in { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: none; } }
        @keyframes deck-text-in { from { opacity: 0; translate: 0 28px; } to { opacity: 1; translate: 0 0; } }
        @keyframes deck-drift { 0%,100% { translate: -50% -50%; rotate: -2deg; } 50% { translate: -50% -53%; rotate: 2deg; } }
        .deck-active .deck-bg { animation: deck-bg-in 1.2s cubic-bezier(.2,.7,.2,1) both; }
        .deck-active .deck-text { animation: deck-text-in .9s .45s cubic-bezier(.2,.7,.2,1) both; }
        .deck-drift { animation: deck-drift 9s ease-in-out infinite; transform: none !important; }
        @media (prefers-reduced-motion: reduce) {
          .deck-active .deck-bg, .deck-active .deck-text, .deck-drift { animation: none !important; }
          .deck-drift { translate: -50% -50%; }
        }
        @media print {
          @page { size: 1920px 1080px; margin: 0; }
          html, body { background: #09121F !important; height: auto !important; overflow: visible !important; }
          *:has(.deck-root) { height: auto !important; overflow: visible !important; position: static !important; transform: none !important; }
          body > *:not(.deck-root):not(:has(.deck-root)) { display: none !important; }
          canvas.fixed, .fixed.pointer-events-none { display: none !important; }
          .deck-root { position: static !important; overflow: visible !important; }
          .deck-chrome { display: none !important; }
          .deck-slide { display: block !important; position: relative !important; transform: none !important; left: 0 !important; top: 0 !important; margin: 0 !important; break-after: page; page-break-after: always; }
          .deck-bg, .deck-text, .deck-drift { animation: none !important; opacity: 1 !important; }
          .deck-drift { translate: -50% -50%; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="deck-chrome absolute inset-x-0 top-0 z-30 h-[3px] bg-white/5">
        <div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${((i + 1) / n) * 100}%` }} />
      </div>

      {SLIDES.map((s, k) => (
        <div
          key={k}
          aria-hidden={k !== i}
          className={`deck-slide absolute overflow-hidden bg-navy-deep ${k === i ? "deck-active" : "hidden"}`}
          style={{ width: W, height: H, left: "50%", top: "50%", marginLeft: -W / 2, marginTop: -H / 2, transform: `scale(${scale})` }}
        >
          {s.node}
        </div>
      ))}

      <button type="button" aria-label="Previous slide" onClick={(e) => { stop(e); goTo(i - 1); }} className={`${btn} left-4`}><ChevronLeft className="h-6 w-6" /></button>
      <button type="button" aria-label="Next slide" onClick={(e) => { stop(e); goTo(i + 1); }} className={`${btn} right-4`}><ChevronRight className="h-6 w-6" /></button>

      <div className="deck-chrome absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1">
        {SLIDES.map((s, k) => (
          <button key={k} type="button" aria-label={`Go to slide ${k + 1}: ${s.title}`} aria-current={k === i}
            onClick={(e) => { stop(e); goTo(k); }} className="p-1.5">
            <span className={`block h-2 rounded-full transition-all ${k === i ? "w-6 bg-gold" : "w-2 bg-white/30 hover:bg-white/60"}`} />
          </button>
        ))}
      </div>
      <p className="deck-chrome absolute bottom-5 right-6 z-30 font-mono text-xs tracking-[0.2em] text-muted-foreground">
        {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </p>
    </div>
  );
}
