import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import satelliteReal from "@/assets/satellite-real.png";
import vesselTop from "@/assets/vessel-top.png";
import ocean from "@/assets/ocean.jpg";

/** Detailed SEKER-1 smallsat: bus, deployable arrays, SAR panel, dish, star tracker. */
function Satellite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden>
      <defs>
        <linearGradient id="sat-array" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4dd9c0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4dd9c0" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="sat-bus" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6edf6" />
          <stop offset="55%" stopColor="#9fb0c4" />
          <stop offset="100%" stopColor="#3d4c60" />
        </linearGradient>
        <linearGradient id="sat-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8cf83" />
          <stop offset="100%" stopColor="#8a6f24" />
        </linearGradient>
      </defs>

      {/* solar arrays */}
      {[0, 1].map((side) => {
        const x = side === 0 ? 18 : 214;
        return (
          <g key={side}>
            <line
              x1={side === 0 ? 118 : 202}
              y1="88"
              x2={side === 0 ? 90 : 230}
              y2="88"
              stroke="#9fb0c4"
              strokeWidth="3"
            />
            <rect
              x={x}
              y="58"
              width="72"
              height="60"
              rx="2"
              fill="url(#sat-array)"
              stroke="#4dd9c0"
              strokeWidth="0.9"
              strokeOpacity="0.7"
            />
            {[0, 1, 2].map((i) => (
              <line
                key={i}
                x1={x + 18 * (i + 1)}
                y1="58"
                x2={x + 18 * (i + 1)}
                y2="118"
                stroke="#4dd9c0"
                strokeWidth="0.6"
                strokeOpacity="0.5"
              />
            ))}
            {[0, 1].map((i) => (
              <line
                key={`h${i}`}
                x1={x}
                y1={78 + i * 20}
                x2={x + 72}
                y2={78 + i * 20}
                stroke="#4dd9c0"
                strokeWidth="0.6"
                strokeOpacity="0.35"
              />
            ))}
          </g>
        );
      })}

      {/* bus */}
      <rect x="118" y="52" width="84" height="72" rx="4" fill="url(#sat-bus)" />
      <rect
        x="118"
        y="52"
        width="84"
        height="72"
        rx="4"
        fill="none"
        stroke="#0b1421"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      {/* MLI gold foil band */}
      <rect x="118" y="98" width="84" height="16" fill="url(#sat-gold)" opacity="0.9" />
      <line x1="118" y1="72" x2="202" y2="72" stroke="#0b1421" strokeOpacity="0.35" />
      {/* star tracker + comms mast */}
      <rect x="150" y="40" width="20" height="12" rx="2" fill="#6d7f95" />
      <line x1="160" y1="40" x2="160" y2="18" stroke="#9fb0c4" strokeWidth="2" />
      <circle cx="160" cy="15" r="4" fill="#c9a84c" />
      {/* SAR / sensor aperture underside */}
      <path d="M126 124 H194 L186 140 H134 Z" fill="#1b2a3d" stroke="#4dd9c0" strokeWidth="0.9" />
      <circle cx="160" cy="132" r="4" fill="#4dd9c0" />
      {/* dish */}
      <g transform="translate(206 128) rotate(28)">
        <ellipse rx="16" ry="7" fill="none" stroke="#c9a84c" strokeWidth="1.4" />
        <line x1="0" y1="0" x2="0" y2="-12" stroke="#c9a84c" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

const HANDOFF = [
  { id: "AIS-T", note: "identity claim" },
  { id: "AIS-S", note: "position claim" },
  { id: "RF", note: "true emitter fix" },
  { id: "SAR", note: "hull signature" },
  { id: "TIR", note: "engine heat" },
];

export function DescentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [altitude, setAltitude] = useState(547);
  const [locked, setLocked] = useState(false);
  const [step, setStep] = useState(0);
  const [p, setP] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setP(p);
    setAltitude(Math.max(0, 547 * (1 - Math.min(p / 0.82, 1))));
    setLocked(p > 0.86);
    setStep(Math.min(HANDOFF.length, Math.floor(Math.max(0, p - 0.12) / 0.14)));
  });

  // opacity is driven from state so it stays exactly in step with scroll
  const ramp = (a: number, b: number, from = 0, to = 1) =>
    from + (to - from) * Math.min(1, Math.max(0, (p - a) / (b - a)));
  const starsO = ramp(0, 0.5, 1, 0);
  const satO = ramp(0.6, 0.78, 1, 0);
  const beamO = p < 0.16 ? ramp(0.06, 0.16) : ramp(0.72, 0.8, 1, 0);
  const seaO = ramp(0.15, 0.55);
  const vesselO = ramp(0.48, 0.62);
  const reticleO = ramp(0.7, 0.8);

  // camera / stage transforms
  const satY = useTransform(scrollYProgress, [0, 0.45, 0.75], ["0%", "-28%", "-140%"]);
  const satScale = useTransform(scrollYProgress, [0, 0.45, 0.75], [1, 1.35, 2.4]);
  const beamScaleY = useTransform(scrollYProgress, [0.06, 0.3], [0.2, 1]);
  const seaScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 2.4, 7]);
  const vesselScale = useTransform(scrollYProgress, [0.5, 0.9], [0.25, 1]);
  const reticle = useTransform(scrollYProgress, [0.72, 0.9], [2.2, 1]);

  return (
    <section ref={ref} className="relative h-[420vh] bg-navy-deep" id="descent">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* starfield */}
        <div style={{ opacity: starsO }} className="absolute inset-0">
          <svg viewBox="0 0 1000 700" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {Array.from({ length: 90 }).map((_, i) => {
              const x = (i * 137.5) % 1000;
              const y = (i * 61.8) % 700;
              return (
                <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 1.4 : 0.7} fill="#eef2f7" opacity={i % 3 ? 0.35 : 0.7} />
              );
            })}
          </svg>
        </div>

        {/* ocean surface rushing up */}
        <motion.div
          style={{ scale: seaScale }}
          className="absolute inset-0 origin-[50%_78%]"
        >
          <div style={{ opacity: seaO }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_78%,#0d2436_0%,#081726_45%,#060c15_75%)]" />
          <svg viewBox="0 0 1000 700" className="h-full w-full opacity-40" preserveAspectRatio="none" aria-hidden>
            {Array.from({ length: 22 }).map((_, i) => (
              <path
                key={i}
                d={`M0 ${180 + i * 24} C 250 ${168 + i * 24}, 480 ${196 + i * 24}, 740 ${176 + i * 24} S 1000 ${190 + i * 24}, 1000 ${188 + i * 24}`}
                fill="none"
                stroke="#4dd9c0"
                strokeWidth="0.6"
                strokeOpacity={0.12 + i * 0.01}
              />
            ))}
          </svg>
          </div>
        </motion.div>

        {/* scan beam */}
        <motion.div
          style={{ scaleY: beamScaleY, opacity: beamO }}
          className="pointer-events-none absolute left-1/2 top-[18%] h-[64%] w-[70vw] max-w-[900px] origin-top -translate-x-1/2"
        >
          <div className="h-full w-full [clip-path:polygon(46%_0%,54%_0%,100%_100%,0%_100%)] bg-gradient-to-b from-cyan/35 via-cyan/10 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-full [clip-path:polygon(46%_0%,54%_0%,100%_100%,0%_100%)]">
            <div className="absolute inset-x-0 top-0 h-16 animate-[descent-sweep_3.2s_linear_infinite] bg-gradient-to-b from-transparent via-cyan/35 to-transparent" />
          </div>
        </motion.div>

        {/* satellite */}
        <motion.div
          style={{ y: satY, scale: satScale }}
          className="absolute left-1/2 top-[6%] w-[min(46vw,420px)] -translate-x-1/2"
        >
          <div style={{ opacity: satO }}>
          <Satellite className="w-full drop-shadow-[0_0_28px_rgba(77,217,192,0.25)]" />
          <p className="mt-1 text-center font-mono text-[9px] tracking-[0.24em] text-cyan/80">
            SEKER-1 · SSO 547 KM
          </p>
          </div>
        </motion.div>

        {/* vessel + lock */}
        <motion.div
          style={{ scale: vesselScale }}
          className="absolute left-1/2 top-[62%] w-[min(52vw,460px)] -translate-x-1/2 -translate-y-1/2"
        >
          <div style={{ opacity: vesselO }}>
          <svg viewBox="0 0 400 140" className="w-full" aria-hidden>
            <path
              d="M60 88 H330 L308 112 H86 Z"
              fill="#132135"
              stroke="#4dd9c0"
              strokeWidth="1.2"
            />
            <rect x="228" y="58" width="58" height="30" fill="#1b2a3d" stroke="#4dd9c0" strokeWidth="1" />
            <rect x="240" y="44" width="30" height="14" fill="#1b2a3d" stroke="#4dd9c0" strokeWidth="1" />
            {Array.from({ length: 6 }).map((_, i) => (
              <rect
                key={i}
                x={78 + i * 25}
                y={70}
                width="20"
                height="18"
                fill="#0f1d2e"
                stroke="#4dd9c0"
                strokeWidth="0.7"
                strokeOpacity="0.6"
              />
            ))}
            <path d="M60 112 H320" stroke="#4dd9c0" strokeOpacity="0.35" />
          </svg>
          </div>

          <motion.div
            style={{ scale: reticle, opacity: reticleO }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <svg viewBox="0 0 200 200" className="h-[150%] w-[150%]" aria-hidden>
              <circle cx="100" cy="100" r="76" fill="none" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="6 10" />
              <circle cx="100" cy="100" r="54" fill="none" stroke="#4dd9c0" strokeWidth="0.8" />
              {[
                [24, 24, 24, 48],
                [24, 24, 48, 24],
                [176, 24, 176, 48],
                [176, 24, 152, 24],
                [24, 176, 24, 152],
                [24, 176, 48, 176],
                [176, 176, 176, 152],
                [176, 176, 152, 176],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9a84c" strokeWidth="1.4" />
              ))}
            </svg>
          </motion.div>
        </motion.div>

        {/* HUD */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-eyebrow text-gold">The Descent</p>
              <h2 className="mt-3 max-w-md text-2xl font-light leading-tight tracking-tight text-foreground sm:text-4xl">
                From orbit to hull.{" "}
                <span className="text-cyan">One continuous chain of custody.</span>
              </h2>
            </div>
            <div className="shrink-0 rounded-lg border border-white/10 bg-navy/70 px-4 py-3 text-right backdrop-blur-sm">
              <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">ALTITUDE</p>
              <p className="font-mono text-xl text-cyan sm:text-2xl">
                {altitude.toFixed(1)}
                <span className="ml-1 text-xs text-muted-foreground">km</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {HANDOFF.map((h, i) => (
                <span
                  key={h.id}
                  className={`rounded border px-2.5 py-1.5 font-mono text-[9px] tracking-[0.16em] transition-colors duration-500 ${
                    i < step
                      ? "border-cyan/50 bg-cyan/10 text-cyan"
                      : "border-white/10 text-muted-foreground/60"
                  }`}
                >
                  {h.id}
                  <span className="ml-2 tracking-normal opacity-70">{h.note}</span>
                </span>
              ))}
            </div>

            <div
              className={`rounded-lg border px-4 py-3 backdrop-blur-sm transition-colors duration-500 ${
                locked ? "border-gold/50 bg-gold/10" : "border-white/10 bg-navy/70"
              }`}
            >
              <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
                TARGET · M/V ARGEST
              </p>
              <p
                className={`mt-1 font-mono text-sm tracking-[0.18em] ${
                  locked ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {locked ? "✓ BLUE TICK VERIFIED" : "ACQUIRING…"}
              </p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">35.91N · 14.49E</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}