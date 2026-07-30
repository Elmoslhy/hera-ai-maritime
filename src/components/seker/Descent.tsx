import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import satelliteReal from "@/assets/satellite-real.png";
import vesselTop from "@/assets/vessel-top.png";
import ocean from "@/assets/ocean.jpg";

const STEPS = [
  "Our satellite passes over the sea",
  "The ship sends out its position",
  "We listen to its radio signal",
  "Radar looks at the actual hull",
  "Heat shows the engines running",
  "It's the real ship — confirmed",
];

export function DescentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [p, setP] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  const distance = Math.max(0, 547 * (1 - Math.min(p / 0.84, 1)));
  const locked = p > 0.88;
  const step = Math.min(STEPS.length - 1, Math.floor(p / (1 / STEPS.length)));

  const ramp = (a: number, b: number, from = 0, to = 1) =>
    from + (to - from) * Math.min(1, Math.max(0, (p - a) / (b - a)));

  const starsO = ramp(0, 0.45, 1, 0);
  const satO = ramp(0.55, 0.72, 1, 0);
  const beamO = p < 0.14 ? ramp(0.04, 0.14) : ramp(0.7, 0.8, 1, 0);
  const seaO = ramp(0.12, 0.5);
  const vesselO = ramp(0.46, 0.62);
  const reticleO = ramp(0.72, 0.82);

  const satY = useTransform(scrollYProgress, [0, 0.45, 0.72], ["0%", "-24%", "-130%"]);
  const satScale = useTransform(scrollYProgress, [0, 0.45, 0.72], [1, 1.4, 2.6]);
  const beamScaleY = useTransform(scrollYProgress, [0.04, 0.3], [0.2, 1]);
  const seaScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.9, 4.6]);
  const vesselScale = useTransform(scrollYProgress, [0.46, 0.92], [0.18, 1.5]);
  const reticle = useTransform(scrollYProgress, [0.72, 0.92], [2, 1]);

  return (
    <section ref={ref} className="relative h-[420vh] bg-navy-deep" id="descent">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* stars */}
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

        {/* real ocean rushing up */}
        <motion.div style={{ scale: seaScale }} className="absolute inset-0 origin-[50%_72%]">
          <div style={{ opacity: seaO }} className="absolute inset-0">
            <img
              src={ocean}
              alt="Ocean seen from above"
              loading="lazy"
              width={1920}
              height={1088}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/60" />
          </div>
        </motion.div>

        {/* scan beam */}
        <motion.div
          style={{ scaleY: beamScaleY, opacity: beamO }}
          className="pointer-events-none absolute left-1/2 top-[20%] h-[62%] w-[70vw] max-w-[900px] origin-top -translate-x-1/2"
        >
          <div className="h-full w-full [clip-path:polygon(47%_0%,53%_0%,100%_100%,0%_100%)] bg-gradient-to-b from-cyan/30 via-cyan/8 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-full [clip-path:polygon(47%_0%,53%_0%,100%_100%,0%_100%)]">
            <div className="absolute inset-x-0 top-0 h-16 animate-[descent-sweep_3.2s_linear_infinite] bg-gradient-to-b from-transparent via-cyan/30 to-transparent" />
          </div>
        </motion.div>

        {/* satellite */}
        <motion.div
          style={{ y: satY, scale: satScale }}
          className="absolute left-1/2 top-[8%] w-[min(52vw,460px)] -translate-x-1/2"
        >
          <div style={{ opacity: satO }}>
            <img
              src={satelliteReal}
              alt="SEKER satellite in orbit"
              loading="lazy"
              width={1024}
              height={768}
              className="w-full drop-shadow-[0_0_60px_rgba(77,217,192,0.18)]"
            />
          </div>
        </motion.div>

        {/* vessel */}
        <motion.div
          style={{ scale: vesselScale }}
          className="absolute left-1/2 top-[62%] w-[min(62vw,620px)] -translate-x-1/2 -translate-y-1/2"
        >
          <div style={{ opacity: vesselO }}>
            <img
              src={vesselTop}
              alt="Cargo ship seen from directly above"
              loading="lazy"
              width={1024}
              height={768}
              className="w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            />
          </div>

          <motion.div
            style={{ scale: reticle, opacity: reticleO }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <svg viewBox="0 0 200 200" className="h-[80%] w-[80%]" aria-hidden>
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

        {/* text */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="max-w-md text-2xl font-light leading-tight tracking-tight text-foreground sm:text-4xl">
                From space, all the way down to one ship.
              </h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground sm:text-base">
                Keep scrolling to follow the journey.
              </p>
            </div>
            <div className="shrink-0 rounded-lg border border-white/10 bg-navy/70 px-4 py-3 text-right backdrop-blur-sm">
              <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">DISTANCE</p>
              <p className="font-mono text-xl text-cyan sm:text-2xl">
                {distance.toFixed(0)}
                <span className="ml-1 text-xs text-muted-foreground">km</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p
              key={step}
              className="max-w-md animate-fade-in text-lg font-light text-foreground sm:text-2xl"
            >
              {STEPS[step]}
            </p>

            <div
              className={`rounded-lg border px-4 py-3 backdrop-blur-sm transition-colors duration-500 ${
                locked ? "border-gold/50 bg-gold/10" : "border-white/10 bg-navy/70"
              }`}
            >
              <p className="text-xs text-muted-foreground">Ship</p>
              <p className={`mt-1 text-sm ${locked ? "text-gold" : "text-muted-foreground"}`}>
                {locked ? "✓ Verified — it's really this ship" : "Checking…"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
