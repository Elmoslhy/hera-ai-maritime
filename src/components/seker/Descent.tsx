import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { SensorImagers } from "./SensorImagers";
import { useRef, useState } from "react";
import satelliteReal from "@/assets/satellite-real.png";
import vesselTop from "@/assets/vessel-top.png";
import ocean from "@/assets/ocean.jpg";

type Act = {
  at: number;
  title: string;
  line: string;
};

const ACTS: Act[] = [
  { at: 0.0, title: "In orbit", line: "Our satellite passes over the open sea." },
  { at: 0.15, title: "Normal traffic", line: "Every ship broadcasts who it is and where it is." },
  { at: 0.32, title: "The signal stops", line: "This one switches its transmitter off — and disappears." },
  { at: 0.5, title: "Thermal infrared", line: "But its engines are still hot. We can see the heat." },
  { at: 0.68, title: "Radio frequency", line: "Its radar and radios still leak. Two passes cross the bearings." },
  { at: 0.86, title: "Located", line: "The ship that went dark is found — and it can't hide again." },
];

export function DescentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  const ramp = (a: number, b: number, from = 0, to = 1) =>
    from + (to - from) * Math.min(1, Math.max(0, (p - a) / (b - a)));

  const actIndex = ACTS.reduce((acc, a, i) => (p >= a.at ? i : acc), 0);
  const act = ACTS[actIndex];

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
  const shipScale = useTransform(scrollYProgress, [0.22, 0.6, 1], [0.35, 0.8, 1.15]);
  const reticle = useTransform(scrollYProgress, [0.86, 1], [1.9, 1]);

  const sensors = [
    { key: "AIS", label: "AIS transponder", on: p > 0.16 && p < 0.32, lost: p >= 0.32 },
    { key: "TIR", label: "Thermal infrared", on: p >= 0.5, lost: false },
    { key: "RF", label: "Radio frequency", on: p >= 0.68, lost: false },
  ];

  return (
    <section ref={ref} className="relative h-[640vh] bg-navy-deep" id="descent">
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
          <div key={i} style={{ opacity: s.o }} className={`absolute top-[26%] ${s.side} w-[min(16vw,120px)]`}>
            <img src={satelliteReal} alt="" aria-hidden className="w-full opacity-80" />
            <p className="mt-1 text-center font-mono text-[9px] tracking-[0.2em] text-cyan">SEKER-{i + 1}</p>
          </div>
        ))}

        {/* ship stage */}
        <motion.div style={{ scale: shipScale }} className="absolute left-1/2 top-[60%] w-[min(58vw,560px)] -translate-x-1/2 -translate-y-1/2">
          {/* bearing lines from the two satellites */}
          <div style={{ opacity: rfO }} className="pointer-events-none absolute -inset-[60vw] flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
              <line x1="40" y1="30" x2="200" y2="200" stroke="#4dd9c0" strokeWidth="0.7" strokeDasharray="4 5" />
              <line x1="360" y1="30" x2="200" y2="200" stroke="#4dd9c0" strokeWidth="0.7" strokeDasharray="4 5" />
            </svg>
          </div>

          {/* RF rings */}
          <div style={{ opacity: rfO }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 1.1}s` }}
                className="absolute h-[60%] w-[60%] animate-[rf-ring_3.3s_ease-out_infinite] rounded-full border border-cyan/50"
              />
            ))}
          </div>

          {/* thermal bloom on the hull */}
          <div style={{ opacity: thermalO }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="h-[34%] w-[34%] animate-[thermal-breathe_2.6s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,196,88,0.95),rgba(255,77,77,0.5)_45%,transparent_70%)] blur-[6px]" />
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
              <p className="font-mono text-[9px] tracking-[0.2em] text-cyan">AIS · BROADCASTING</p>
              <p className="mt-1 font-mono text-[11px] text-foreground">34°21.4′N 023°08.9′E</p>
            </div>
          </div>

          {/* AIS lost alert */}
          <div style={{ opacity: alertO }} className="pointer-events-none absolute -right-6 top-[6%] translate-x-full">
            <div className="rounded-md border border-alert/60 bg-alert/10 px-3 py-2 backdrop-blur-sm">
              <p className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-alert">
                <span className="inline-block h-1.5 w-1.5 animate-[alert-blink_0.9s_ease-in-out_infinite] rounded-full bg-alert" />
                AIS · SIGNAL LOST
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Transmitter switched off</p>
            </div>
          </div>

          {/* ghost track the ship pretends to follow */}
          <div style={{ opacity: ghostO }} className="pointer-events-none absolute inset-0">
            <svg viewBox="0 0 400 200" className="h-full w-full" aria-hidden>
              <path d="M40 150 C 120 130, 220 110, 360 60" fill="none" stroke="#ff4d4d" strokeWidth="1" strokeDasharray="3 7" opacity="0.7" />
              <circle cx="360" cy="60" r="4" fill="none" stroke="#ff4d4d" strokeWidth="1" />
            </svg>
          </div>

          {/* final lock */}
          <motion.div style={{ scale: reticle, opacity: lockO }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="h-[86%] w-[86%]" aria-hidden>
              <circle cx="100" cy="100" r="78" fill="none" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="6 10" />
              <circle cx="100" cy="100" r="54" fill="none" stroke="#4dd9c0" strokeWidth="0.8" />
              {[
                [24, 24, 24, 48], [24, 24, 48, 24], [176, 24, 176, 48], [176, 24, 152, 24],
                [24, 176, 24, 152], [24, 176, 48, 176], [176, 176, 176, 152], [176, 176, 152, 176],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9a84c" strokeWidth="1.4" />
              ))}
            </svg>
          </motion.div>
        </motion.div>

        {/* HUD + captions */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28">
          <div className="relative flex items-start justify-end gap-6">
            <div className="absolute left-1/2 top-0 w-full max-w-lg -translate-x-1/2 space-y-2 text-center">
              <p className="font-mono text-[12px] tracking-[0.28em] text-gold">{act.title.toUpperCase()}</p>
            </div>
            <div className="relative shrink-0 space-y-2 text-right">
              <div className="rounded-lg border border-white/10 bg-navy/70 px-4 py-3 backdrop-blur-sm">
                <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">DISTANCE</p>
                <p className="font-mono text-xl text-cyan sm:text-2xl">
                  {distance.toFixed(0)}
                  <span className="ml-1 text-xs text-muted-foreground">km</span>
                </p>
              </div>
              <div className="space-y-1 rounded-lg border border-white/10 bg-navy/70 px-4 py-3 backdrop-blur-sm">
                {sensors.map((s) => (
                  <p key={s.key} className="flex items-center justify-end gap-2 font-mono text-[10px] tracking-[0.18em]">
                    <span className={s.lost ? "text-alert" : s.on ? "text-cyan" : "text-muted-foreground/50"}>{s.key}</span>
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        s.lost ? "animate-[alert-blink_0.9s_ease-in-out_infinite] bg-alert" : s.on ? "bg-cyan" : "bg-muted-foreground/30"
                      }`}
                    />
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="my-4 hidden sm:block">
            <SensorImagers thermal={Math.min(thermalO * 1.6, 1)} rf={Math.min(rfO * 1.6, 1)} fused={fusedO} />
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div />
            <div
              className={`rounded-lg border px-4 py-3 backdrop-blur-sm transition-colors duration-500 ${
                p > 0.86 ? "border-gold/50 bg-gold/10" : p > 0.32 ? "border-alert/40 bg-alert/10" : "border-white/10 bg-navy/70"
              }`}
            >
              <p className="text-xs text-muted-foreground">Vessel</p>
              <p className={`mt-1 text-sm ${p > 0.86 ? "text-gold" : p > 0.32 ? "text-alert" : "text-cyan"}`}>
                {p > 0.86 ? "✓ Located and identified" : p > 0.32 ? "Dark — not transmitting" : "Transmitting normally"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
