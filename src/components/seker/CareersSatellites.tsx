import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";
import satellite from "@/assets/careers-satellite.png";

type Orbiter = { x: number; y: number; width: number; drift: number; duration: number; angle: number };

function SatelliteLink({ node, eyeX, eyeY, reduced }: { node: Orbiter; eyeX: number; eyeY: number; reduced: boolean }) {
  const progress = useMotionValue(0);
  const x = useTransform(progress, (v) => node.x + Math.sin(v * Math.PI * 2) * node.drift);
  const y = useTransform(progress, (v) => node.y + Math.sin(v * Math.PI * 2) * node.drift * 0.35);
  const path = useTransform(progress, (v) => {
    const sx = node.x + Math.sin(v * Math.PI * 2) * node.drift;
    const sy = node.y + Math.sin(v * Math.PI * 2) * node.drift * 0.35;
    return `M${sx} ${sy} Q${(sx + eyeX) / 2} ${sy + (eyeY - sy) * 0.8} ${eyeX} ${eyeY}`;
  });

  useEffect(() => {
    progress.set(0);
    if (reduced) return;
    const playback = animate(progress, 1, { duration: node.duration, repeat: Infinity, ease: "linear" });
    return () => playback.stop();
  }, [progress, reduced, node.duration]);

  return (
    <g>
      <motion.path d={path} fill="none" stroke="var(--color-cyan)" strokeWidth="1" strokeOpacity="0.35" />
      <motion.path d={path} fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeDasharray="24 190" initial={{ strokeDashoffset: 0 }} animate={reduced ? {} : { strokeDashoffset: -428 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
      <motion.g style={{ x, y }}>
        <g transform={`rotate(${node.angle})`}>
          <image href={satellite} x={-node.width / 2} y={-node.width * 0.375} width={node.width} height={node.width * 0.75} />
        </g>
      </motion.g>
    </g>
  );
}

const DESKTOP_NODES: Orbiter[] = [
  { x: 250, y: 130, width: 210, drift: 55, duration: 30, angle: -15 },
  { x: 1160, y: 155, width: 290, drift: 65, duration: 38, angle: 12 },
  { x: 1280, y: 520, width: 185, drift: 35, duration: 34, angle: -18 },
];
const COMPACT_NODES: Orbiter[] = [
  { x: 110, y: 95, width: 145, drift: 20, duration: 30, angle: -15 },
  { x: 485, y: 95, width: 175, drift: 22, duration: 38, angle: 12 },
  { x: 550, y: 285, width: 100, drift: 15, duration: 34, angle: -18 },
];

function OrbitalMesh({ compact = false }: { compact?: boolean }) {
  const reduced = Boolean(useReducedMotion());
  const eyeX = compact ? 310 : 920;
  const eyeY = compact ? 285 : 440;
  return (
    <svg viewBox={compact ? "0 0 640 430" : "0 0 1440 680"} className="h-full w-full" aria-hidden="true">
      <path d={compact ? "M55 120 Q300 -45 590 145" : "M130 130 Q710 -75 1320 175"} fill="none" stroke="var(--color-gold)" strokeOpacity="0.2" strokeWidth="1" />
      {(compact ? COMPACT_NODES : DESKTOP_NODES).map((node) => <SatelliteLink key={node.width} node={node} eyeX={eyeX} eyeY={eyeY} reduced={reduced} />)}
      <g transform={`translate(${eyeX} ${eyeY})`}>
        <ellipse rx="98" ry="30" transform="rotate(-15)" fill="none" stroke="var(--color-gold)" strokeWidth="1" strokeOpacity="0.45" />
        <circle r="48" fill="var(--color-navy)" fillOpacity="0.85" stroke="var(--color-gold)" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M-70 0 Q0 -55 70 0 Q0 55 -70 0Z" fill="var(--color-navy)" stroke="var(--color-gold)" strokeWidth="2" />
        <circle r="23" fill="none" stroke="var(--color-cyan)" strokeWidth="1.5" />
        <circle r="12" fill="var(--color-gold)" />
        <motion.circle r="32" fill="none" stroke="var(--color-gold)" strokeWidth="1" initial={{ opacity: 0.45 }} animate={reduced ? {} : { opacity: [0.45, 0.9, 0.45] }} transition={{ duration: 5, repeat: Infinity }} />
        <text y="83" textAnchor="middle" fill="var(--color-gold)" className={compact ? "font-mono text-[28px]" : "font-mono text-[24px]"}>HERA AI</text>
      </g>
    </svg>
  );
}

export function CareersSatellites() {
  return <div className="pointer-events-none relative mb-8 h-[250px] w-full max-w-[440px] xl:hidden" role="img" aria-label="Satellite constellation connected to HERA AI"><OrbitalMesh compact /></div>;
}

export function CareersSatellitesOverlay() {
  return <div className="pointer-events-none absolute inset-x-0 top-24 hidden h-[min(48vw,620px)] xl:block" role="img" aria-label="Three satellites relaying maritime intelligence to HERA AI"><OrbitalMesh /></div>;
}
