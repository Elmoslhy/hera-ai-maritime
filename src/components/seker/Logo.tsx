import { useEffect, useState } from "react";

const ARC = "M40 34C60 12 180 12 200 34";
const APEX = { x: 120, y: 18.6 };

export function SekerLogo({
  className = "",
  tone = "currentColor",
}: {
  className?: string;
  tone?: string;
}) {
  const [orbiting, setOrbiting] = useState(false);

  // The satellite starts its pass only when motion is welcome; otherwise it rests at the apex.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setOrbiting(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const px = orbiting ? 0 : APEX.x;
  const py = orbiting ? 0 : APEX.y;

  return (
    <svg viewBox="0 0 240 76" className={className} fill="none" aria-label="SEKER">
      <path d={ARC} stroke={tone} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <g>
        {orbiting && (
          <animateMotion
            path={ARC}
            begin="-3.5s"
            dur="7s"
            repeatCount="indefinite"
            calcMode="spline"
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          />
        )}
        <circle cx={px} cy={py} r="7" fill={tone} opacity="0.22" style={{ filter: "blur(3px)" }} />
        <circle cx={px} cy={py} r="3" fill={tone} />
      </g>
    </svg>
  );
}
