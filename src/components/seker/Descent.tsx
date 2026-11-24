import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { SensorImagers } from "./SensorImagers";
import { useRef, useState } from "react";
import satelliteReal from "@/assets/satellite-real.png";
import vesselTop from "@/assets/vessel-top.png";
import ocean from "@/assets/ocean.jpg";

type Act = { at: number; title: string; head: string; line: string };

const ACTS: Act[] = [
  { at: 0.0, title: "In orbit", head: "Seker payloads watch from 547 km up.", line: "Four sensors on one clock, passing over the world's busiest waters." },
  { at: 0.15, title: "Normal traffic", head: "A ship reports who it is.", line: "Its AIS transponder broadcasts its name, number and position, as the rules require." },
  { at: 0.32, title: "AIS signal lost", head: "Then the signal stops.", line: "The transponder is switched off. To most tracking systems, the ship has vanished." },
  { at: 0.5, title: "Thermal signature", head: "Its heat gives it away.", line: "Thermal infrared sees the running engine at +41°C, by day and by night." },
  { at: 0.68, title: "RF detected", head: "So does its own radar.", line: "Two satellites hear its navigation radar on X-band and measure where the signal comes from." },
  { at: 0.86, title: "Fused in HERA AI", head: "Found, and named.", line: "HERA AI fuses heat and radio into one position at 97% confidence, and matches the ship to its IMO number." },
];

export function DescentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  const ramp = (a: number, b: number, from = 0, to = 1) =>
    from + (to - from) * Math.min(1, Math.max(0, (p - a) / (b - a)));

  const actIndex = ACTS.reduce((acc, a, i) => (p >= a.at ? i : acc), 0);
  const act = ACTS[actIndex]!;
  const finalStep = actIndex === 5;

  // altitude readout
  const distance = Math.max(0, 547 * (1 - Math.min(p / 0.86, 1)));

  // opacities
  const starsO = ramp(0.02, 0.3, 1, 0);
  const seaO = ramp(0.05, 0.32);
  const satBigO = ramp(0.26, 0.4, 1, 0);
  const shipO = ramp(0.22, 0.34);
  const aisO = ramp(0.16, 0.24) * (1 - ramp(0.32, 0.4));
  const alertO = ramp(0.32, 0.38) * (1 - ramp(0.5, 0.58));
  const ghostO = ramp(0.36, 0.44) * (1 - ramp(0.62, 0.7));
  const thermalO = ramp(0.5, 0.58) * (1 - ramp(0.72, 0.8, 0, 0.55));
  const rfO = ramp(0.68, 0.75) * (1 - ramp(0.9, 0.98, 0, 0.5));
  const lockO = ramp(0.86, 0.93);
  const fusedO = ramp(0.8, 0.9);
  const darkShipO = ramp(0.4, 0.48) * (1 - ramp(0.5, 0.56)); // ship fades into the dark before TIR

  // camera
  const seaScale = useTransform(scrollYProgress, [0, 0.32, 0.6, 1], [1, 1.7, 2.4, 3.1]);
  const satY = useTransform(scrollYProgress, [0, 0.26, 0.4], ["-2%", "-16%", "-120%"]);
  const satScale = useTransform(scrollYProgress, [0, 0.26, 0.4], [1, 1.35, 2.4]);
  const shipScale = useTransform(scrollYProgress, [0.22, 0.6, 1], [0.35, 0.7, 0.85]);
  const reticle = useTransform(scrollYProgress, [0.86, 1], [1.9, 1]);

  const sensors = [
    { key: "AIS", label: "AIS transponder", on: p > 0.16 && p < 0.32, lost: p >= 0.32 },
    { key: "TIR", label: "Thermal infrared", on: p >= 0.5, lost: false },
    { key: "RF", label: "Radio frequency", on: p >= 0.68, lost: false },
  ];

  return (
    <section ref={ref} data-pass-scene data-keep-center className="relative h-[320vh] bg-navy-deep" id="descent">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* stars */}
        <div style={{ opacity: starsO }} className="absolute inset-0">
          <svg viewBox="0 0 1000 700" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {Array.from({ length: 110 }).map((_, i) => {
              const x = (i * 137.5) % 1000;
              const y = (i * 61.8) % 700;
              return <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 1.4 : 0.7} fill="#eef2f7" opacity={i % 3 ? 0.3 : 0.7} />;
            })}
          </svg>
        </div>

        {/* ocean */}
        <motion.div style={{ scale: seaScale }} className="absolute inset-0 origin-[50%_68%]">
          <div style={{ opacity: seaO }} className="absolute inset-0">
            <img src={ocean} alt="Open ocean seen from orbit" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy/70" />
          </div>

          {/* thermal palette pass over the water */}
          <div
            style={{ opacity: thermalO }}
            className="absolute inset-0 mix-blend-screen"
            aria-hidden
          >
            <img src={ocean} alt="" className="h-full w-full object-cover opacity-40 [filter:grayscale(1)_contrast(1.9)_sepia(1)_hue-rotate(-25deg)_saturate(3)]" />
          </div>
        </motion.div>

        {/* satellite */}
        <motion.div style={{ y: satY, scale: satScale }} className="absolute left-1/2 top-[10%] w-[min(46vw,420px)] -translate-x-1/2">
          <div style={{ opacity: satBigO }}>
            <img src={satelliteReal} alt="SEKER satellite in low Earth orbit" loading="lazy" className="w-full drop-shadow-[0_0_70px_rgba(77,217,192,0.2)]" />
          </div>
        </motion.div>

        {/* two small satellites for the RF cross-fix */}
        {[
          { side: "left-[8%]", o: rfO },
          { side: "right-[8%]", o: rfO },
        ].map((s, i) => (
          <div key={i} style={{ opacity: s.o }} className={`absolute top-[17%] ${s.side} w-[min(16vw,120px)]`}>
            <img src={satelliteReal} alt="" aria-hidden className="w-full opacity-80" />
            <p className="mt-1 text-center text-[11px] text-gold">SEKER-{i + 1}</p>
          </div>
        ))}

        {/* ship stage */}
        <motion.div style={{ scale: shipScale }} className="absolute left-1/2 top-[46%] w-[min(58vw,520px)] -translate-x-1/2 -translate-y-1/2">
          {/* bearing lines from the two satellites */}
          <div style={{ opacity: rfO }} className="pointer-events-none absolute -inset-[60vw] flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
              <line x1="40" y1="30" x2="200" y2="200" stroke="#D7B24A" strokeWidth="0.7" strokeDasharray="4 5" />
              <line x1="360" y1="30" x2="200" y2="200" stroke="#D7B24A" strokeWidth="0.7" strokeDasharray="4 5" />
            </svg>
          </div>

          {/* RF rings */}
          <div style={{ opacity: rfO }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 1.1}s` }}
                className="absolute h-[60%] w-[60%] pass-ring rounded-full border border-gold/50"
              />
            ))}
          </div>

          {/* thermal bloom on the hull */}
          <div style={{ opacity: thermalO }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="h-[34%] w-[34%] pass-heat rounded-full bg-[radial-gradient(circle,rgba(255,196,88,0.95),rgba(215,140,60,0.5)_45%,transparent_70%)] blur-[6px]" />
          </div>

          {/* AIS ping while broadcasting */}
          <div style={{ opacity: aisO }} className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            {[0, 1].map((i) => (
              <span key={i} style={{ animationDelay: `${i * 1.2}s` }} className="pass-ping absolute h-[30%] w-[30%] rounded-full border border-foreground/60" />
            ))}
          </div>

          {/* the vessel */}
          <div
            style={{ opacity: Math.max(shipO - darkShipO * 0.75, thermalO * 0.9, lockO) }}
            className="relative"
          >
            <img
              src={vesselTop}
              alt="Cargo vessel seen from directly above"
              loading="lazy"
              className="w-full drop-shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
              style={{ filter: thermalO > 0.2 ? `grayscale(1) contrast(1.6) sepia(1) hue-rotate(-20deg) saturate(${1 + thermalO * 2.5})` : undefined }}
            />
          </div>

          {/* AIS broadcast label */}
          <div style={{ opacity: aisO }} className="pointer-events-none absolute -right-6 top-[6%] translate-x-full">
            <div className="rounded-md border border-cyan/40 bg-navy/80 px-3 py-2 backdrop-blur-sm">
              <p className="font-mono text-[11px] text-gold">AIS · broadcasting</p>
              <p className="mt-1 font-mono text-[11px] text-foreground">34°21.4′N 023°08.9′E</p>
            </div>
          </div>

          {/* AIS lost alert */}
          <div style={{ opacity: alertO }} className="pointer-events-none absolute -right-6 top-[6%] translate-x-full">
            <div className="rounded-md border border-white/30 bg-navy/80 px-3 py-2">
              <p className="flex items-center gap-2 font-mono text-[11px] text-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/60" />
                AIS · signal lost
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Transmitter switched off</p>
            </div>
          </div>

          {/* ghost track the ship pretends to follow */}
          <div style={{ opacity: ghostO }} className="pointer-events-none absolute inset-0">
            <svg viewBox="0 0 400 200" className="h-full w-full" aria-hidden>
              <path d="M40 150 C 120 130, 220 110, 360 60" fill="none" stroke="#D7B24A" strokeWidth="1" strokeDasharray="3 7" opacity="0.7" />
              <circle cx="360" cy="60" r="4" fill="none" stroke="#D7B24A" strokeWidth="1" />
            </svg>
          </div>

          {/* final lock */}
          <motion.div style={{ scale: reticle, opacity: lockO }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="h-[86%] w-[86%]" aria-hidden>
              <circle cx="100" cy="100" r="78" fill="none" stroke="#D7B24A" strokeWidth="0.8" strokeDasharray="6 10" />
              <circle cx="100" cy="100" r="54" fill="none" stroke="#D7B24A" strokeWidth="0.8" />
              {[
                [24, 24, 24, 48], [24, 24, 48, 24], [176, 24, 176, 48], [176, 24, 152, 24],
                [24, 176, 24, 152], [24, 176, 48, 176], [176, 176, 176, 152], [176, 176, 152, 176],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D7B24A" strokeWidth="1.4" />
              ))}
            </svg>
          </motion.div>
        </motion.div>

        {/* HUD + captions */}
        <div className="pointer-events-none absolute inset-0 z-10 p-5 pt-24 sm:p-10 sm:pt-28">
          {/* top left */}
          <div className="absolute left-5 top-24 max-w-[55%] sm:left-10 sm:top-28">
            <p className="text-eyebrow">SEKER-1 · SEKER-2</p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">How HERA AI finds a ship that goes dark</p>
          </div>
          {/* top right */}
          <div className="absolute right-5 top-24 flex flex-col items-end gap-2 text-right sm:right-10 sm:top-28">
            <p className="font-display text-2xl font-bold tabular-nums text-foreground sm:text-4xl">
              {distance.toFixed(0)}<span className="ml-1 text-sm font-normal text-muted-foreground">km</span>
            </p>
            <div className="flex gap-1.5">
              {sensors.map((s) => (
                <span
                  key={s.key}
                  className={`rounded-full border px-2.5 py-0.5 text-[12px] ${
                    s.lost ? "border-white/20 text-muted-foreground line-through" : s.on ? "border-gold bg-gold/15 text-gold" : "border-white/15 text-muted-foreground"
                  }`}
                >
                  {s.key}
                </span>
              ))}
            </div>
            <p className="text-[12px] text-muted-foreground">In-orbit demonstration · 2030</p>
          </div>

          {/* step list, right */}
          <ol className="absolute right-10 top-1/2 hidden -translate-y-1/2 space-y-2.5 text-right lg:block">
            {ACTS.map((a, i) => (
              <li key={a.title} className={`flex items-center justify-end gap-3 text-sm transition-colors duration-300 ${i === actIndex ? "text-gold" : i < actIndex ? "text-foreground/70" : "text-muted-foreground/50"}`}>
                {a.title}
                <span className={`h-1.5 w-1.5 rounded-full ${i === actIndex ? "bg-gold" : i < actIndex ? "bg-foreground/50" : "bg-white/20"}`} />
              </li>
            ))}
          </ol>

          {/* sensor panels, left (desktop) */}
          <div className="absolute left-10 top-1/2 hidden -translate-y-1/2 sm:block">
            <SensorImagers thermal={Math.min(thermalO * 1.6, 1)} rf={Math.min(rfO * 1.6, 1)} fused={fusedO} compact={finalStep} />
          </div>

          {/* caption */}
          <div className="absolute inset-x-5 bottom-8 mx-auto max-w-3xl text-center sm:bottom-10">
            {/* phone chips */}
            <div className="mb-3 flex justify-center gap-1.5 sm:hidden">
              {[
                { k: "Thermal +41°C", on: actIndex >= 3 },
                { k: "RF X-band", on: actIndex >= 4 },
                { k: "HERA AI 97%", on: actIndex >= 5 },
              ].map((c) => (
                <span key={c.k} className={`rounded-full border px-2 py-0.5 text-[11px] transition-opacity duration-300 ${c.on ? "border-gold text-gold opacity-100" : "opacity-0"}`}>{c.k}</span>
              ))}
            </div>
            <p className="text-[13px] text-muted-foreground">{actIndex + 1} of 6</p>
            <motion.div key={actIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">{act.head}</p>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] text-muted-foreground sm:text-lg">{act.line}</p>
            </motion.div>
            <p className="mt-4 text-[12px] text-muted-foreground/80">Illustrative scenario. Seker payloads fly from 2030.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
