import { motion, useReducedMotion } from "motion/react";
import satellite from "@/assets/satellite-real.png";

export function CareersSatellites() {
  const reduced = useReducedMotion();
  return (
    <div className="pointer-events-none relative mb-8 h-[250px] w-full max-w-[360px] xl:absolute xl:right-6 xl:top-24 xl:mb-0 xl:h-[320px]" role="img" aria-label="Satellites transmitting maritime intelligence to HERA AI">
      <svg viewBox="0 0 480 420" className="h-full w-full overflow-visible" aria-hidden="true">
        <path d="M25 155 Q240 -55 455 155" fill="none" stroke="var(--color-gold)" strokeOpacity="0.25" />
        {["M85 112 Q105 240 240 287", "M365 118 Q340 235 240 287", "M255 38 L240 287"].map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="var(--color-cyan)" strokeWidth="1" strokeOpacity="0.25" />
            <motion.path d={d} fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeDasharray="16 110" initial={{ strokeDashoffset: 0 }} animate={reduced ? {} : { strokeDashoffset: -252 }} transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }} />
          </g>
        ))}
        {[
          { x: 20, y: 64, width: 130, height: 98, duration: 12 },
          { x: 304, y: 70, width: 122, height: 92, duration: 15 },
          { x: 212, y: 3, width: 86, height: 65, duration: 18 },
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