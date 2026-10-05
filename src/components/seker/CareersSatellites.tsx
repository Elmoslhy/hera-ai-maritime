import { motion, useReducedMotion } from "motion/react";
import satellite from "@/assets/satellite-real.png";

// Compact inline version (mobile / tablet): keeps the small panel above the copy.
export function CareersSatellites() {
  const reduced = useReducedMotion();
  return (
    <div className="pointer-events-none relative mb-8 h-[250px] w-full max-w-[360px] xl:hidden" role="img" aria-label="Satellites transmitting maritime intelligence to HERA AI">
      <svg viewBox="0 0 480 420" className="h-full w-full overflow-visible" aria-hidden="true">
        <path d="M25 155 Q240 -55 455 155" fill="none" stroke="var(--color-gold)" strokeOpacity="0.25" />
        {["M85 112 Q105 240 240 287", "M365 118 Q340 235 240 287", "M255 38 L240 287"].map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="var(--color-cyan)" strokeWidth="1" strokeOpacity="0.25" />
            <motion.path d={d} fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeDasharray="16 110" initial={{ strokeDashoffset: 0 }} animate={reduced ? {} : { strokeDashoffset: -252 }} transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }} />
          </g>
        ))}
        {[
          { x: 5, y: 58, width: 150, height: 112, duration: 12 },
          { x: 290, y: 64, width: 142, height: 107, duration: 15 },
          { x: 202, y: 2, width: 100, height: 75, duration: 18 },
        ].map((s) => (
          <motion.g key={s.x} initial={{ y: 0, x: 0 }} animate={reduced ? {} : { y: [0, -9, 0], x: [0, 7, 0] }} transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}>
            <image href={satellite} x={s.x} y={s.y} width={s.width} height={s.height} />
          </motion.g>
        ))}
        <path d="M165 287 Q240 218 315 287 Q240 356 165 287Z" fill="var(--color-navy)" fillOpacity="0.8" stroke="var(--color-gold)" strokeWidth="2" />
        <circle cx="240" cy="287" r="24" fill="none" stroke="var(--color-cyan)" strokeWidth="1.5" />
        <circle cx="240" cy="287" r="13" fill="var(--color-gold)" fillOpacity="0.8" />
        <motion.circle cx="240" cy="287" r="32" fill="none" stroke="var(--color-gold)" strokeWidth="1" initial={{ opacity: 0.3 }} animate={reduced ? {} : { opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
        <text x="240" y="364" textAnchor="middle" fill="var(--color-gold)" className="font-mono text-[22px]">HERA AI</text>
        <text x="240" y="394" textAnchor="middle" fill="var(--color-cyan)" className="font-mono text-[16px]">Maritime intelligence</text>
      </svg>
    </div>
  );
}

type Flyer = {
  from: number;
  y: [number, number, number];
  w: number;
  duration: number;
  startX: number;
};

// Desktop: satellites cross the full hero photo, feeding HERA AI's eye.
const FLYERS: Flyer[] = [
  { from: -300, y: [215, 125, 255], w: 200, duration: 46, startX: 320 },
  { from: -300, y: [110, 45, 150], w: 175, duration: 62, startX: 720 },
  { from: -300, y: [300, 235, 330], w: 150, duration: 38, startX: -60 },
];

const EYE_X = 1160;
const EYE_Y = 520;

export function CareersSatellitesOverlay() {
  const reduced = useReducedMotion();
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden xl:block"
      role="img"
      aria-label="Satellites crossing the sky and feeding intelligence to HERA AI"
    >
      <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
        {/* Data beams down to the HERA AI eye */}
        {[
          "M 640 155 Q 830 400 1115 492",
          "M 880 100 Q 1010 340 1145 486",
          "M 1050 205 Q 1090 360 1178 478",
        ].map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="var(--color-cyan)" strokeWidth="1" strokeOpacity="0.18" />
            <motion.path
              d={d}
              fill="none"
              stroke="var(--color-cyan)"
              strokeWidth="1.5"
              strokeDasharray="14 110"
              initial={{ strokeDashoffset: 0, opacity: 0.7 }}
              animate={reduced ? {} : { strokeDashoffset: -496, opacity: [0.4, 0.85, 0.4] }}
              transition={
                reduced
                  ? {}
                  : { strokeDashoffset: { duration: 6 + i * 1.5, repeat: Infinity, ease: "linear" }, opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" } }
              }
            />
          </g>
        ))}

        {/* Satellites sweeping across the photo */}
        {FLYERS.map((s, i) => (
          <motion.g
            key={s.w}
            initial={{ x: s.startX, y: s.y[1] }}
            animate={
              reduced
                ? {}
                : { x: [s.from, 1740], y: s.y }
            }
            transition={
              reduced
                ? {}
                : { duration: s.duration, times: [0, 0.5, 1], repeat: Infinity, ease: "linear" }
            }
          >
            <image
              href={satellite}
              x={-s.w / 2}
              y={s.w * -0.375}
              width={s.w}
              height={s.w * 0.75}
            />
          </motion.g>
        ))}

        {/* HERA AI eye */}
        <g>
          <path d={`M${EYE_X - 90} ${EYE_Y} Q${EYE_X} ${EYE_Y - 52} ${EYE_X + 90} ${EYE_Y} Q${EYE_X} ${EYE_Y + 52} ${EYE_X - 90} ${EYE_Y}Z`} fill="var(--color-navy)" fillOpacity="0.82" stroke="var(--color-gold)" strokeWidth="2" />
          <circle cx={EYE_X} cy={EYE_Y} r="24" fill="none" stroke="var(--color-cyan)" strokeWidth="1.5" />
          <circle cx={EYE_X} cy={EYE_Y} r="13" fill="var(--color-gold)" fillOpacity="0.8" />
          <motion.circle cx={EYE_X} cy={EYE_Y} r="32" fill="none" stroke="var(--color-gold)" strokeWidth="1" initial={{ opacity: 0.3 }} animate={reduced ? {} : { opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
          <text x={EYE_X} y={EYE_Y + 82} textAnchor="middle" fill="var(--color-gold)" className="font-mono text-[20px]">HERA AI</text>
          <text x={EYE_X} y={EYE_Y + 106} textAnchor="middle" fill="var(--color-cyan)" className="font-mono text-[13px]">Maritime intelligence</text>
        </g>
      </svg>
    </div>
  );
}
