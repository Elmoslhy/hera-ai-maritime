import { useEffect, useRef } from "react";
import earth from "@/assets/earth-globe.png";
import satellite from "@/assets/satellite-real.png";

type Orbit = {
  /** semi-major axis, % of stage */
  r: number;
  /** vertical squash of the ellipse */
  flatten: number;
  /** plane tilt in degrees */
  tilt: number;
  /** seconds per revolution */
  period: number;
  /** starting phase, 0..1 */
  phase: number;
  /** satellite size in px at mid depth */
  sat: number;
};

const ORBITS: Orbit[] = [
  { r: 57, flatten: 0.30, tilt: -14, period: 26, phase: 0.12, sat: 112 },
  { r: 65, flatten: 0.42, tilt: 21, period: 38, phase: 0.55, sat: 88 },
  { r: 50, flatten: 0.18, tilt: 5, period: 20, phase: 0.78, sat: 72 },
];

// vessel pings on the ocean, in % of the globe box
const VESSELS = [
  { x: 30, y: 44, delay: 0 },
  { x: 62, y: 33, delay: 1.4 },
  { x: 71, y: 58, delay: 2.6 },
  { x: 24, y: 66, delay: 3.4 },
  { x: 47, y: 74, delay: 4.2 },
  { x: 78, y: 46, delay: 5.1 },
];

export function HeroScene() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const satRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beamRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const W = stageRef.current?.offsetWidth ?? 700;
      ORBITS.forEach((o, i) => {
        const el = satRefs.current[i];
        const a = ((t / o.period + o.phase) % 1) * Math.PI * 2;
        // ellipse in the orbit plane, then tilted
        const ex = Math.cos(a) * o.r;
        const ey = Math.sin(a) * o.r * o.flatten;
        const rad = (o.tilt * Math.PI) / 180;
        const x = ex * Math.cos(rad) - ey * Math.sin(rad);
        const y = ex * Math.sin(rad) + ey * Math.cos(rad);
        // depth: +1 in front of the globe, -1 behind it
        const depth = Math.sin(a);
        const scale = 0.72 + 0.4 * ((depth + 1) / 2);
        if (el) {
          el.style.transform = `translate(-50%,-50%) translate(${(x / 100) * W}px, ${(y / 100) * W}px) scale(${scale})`;
          el.style.opacity = String(depth > 0 ? 1 : 0.4);
          el.style.zIndex = depth > 0 ? "3" : "1";
          el.style.filter = depth > 0 ? "brightness(1.12) saturate(1.05)" : "brightness(0.5) blur(0.6px)";
        }
        const beam = beamRefs.current[i];
        if (beam) {
          const v = VESSELS[i * 2];
          // globe occupies the stage inset by 10%
          const vx = 10 + v.x * 0.8;
          const vy = 10 + v.y * 0.8;
          beam.setAttribute("x1", String(50 + x));
          beam.setAttribute("y1", String(50 + y));
          beam.setAttribute("x2", String(vx));
          beam.setAttribute("y2", String(vy));
          const near = Math.max(0, 1 - Math.hypot(50 + x - vx, 50 + y - vy) / 42);
          beam.setAttribute("opacity", String(depth > 0.15 ? near * 0.85 : 0));
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* starfield */}
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {Array.from({ length: 160 }).map((_, i) => {
          const x = (i * 211.7) % 1600;
          const y = (i * 97.3) % 900;
          return <circle key={i} cx={x} cy={y} r={i % 9 === 0 ? 1.5 : 0.7} fill="#eef2f7" opacity={i % 3 ? 0.28 : 0.65} />;
        })}
      </svg>

      {/* globe + orbits stage */}
      <div ref={stageRef} className="absolute left-1/2 top-1/2 h-[min(78vh,700px)] w-[min(78vh,700px)] -translate-x-1/2 -translate-y-[48%]">
        {/* atmosphere glow */}
        <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(77,217,192,0.22),transparent_62%)] blur-2xl" />

        {/* orbit paths (behind the globe) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 z-0 h-full w-full" aria-hidden>
          {ORBITS.map((o, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="50"
              rx={o.r}
              ry={o.r * o.flatten}
              transform={`rotate(${o.tilt} 50 50)`}
              fill="none"
              stroke="#e6edf5"
              strokeOpacity="0.13"
              strokeWidth="0.18"
            />
          ))}
        </svg>

        {/* earth */}
        <div className="absolute inset-[10%] z-[2] animate-[globe-breathe_18s_ease-in-out_infinite]">
          <img src={earth} alt="Earth seen from orbit" width={1280} height={1280} className="h-full w-full object-contain opacity-[0.88]" />
          {/* night terminator */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_36%,transparent_28%,rgba(9,18,31,0.78)_76%)]" />

          {/* vessel pings */}
          {VESSELS.map((v, i) => (
            <div key={i} className="absolute h-2 w-2" style={{ left: `${v.x}%`, top: `${v.y}%` }}>
              <span
                className="absolute inset-0 rounded-full border border-cyan/70"
                style={{ animation: `vessel-ping 4.2s ease-out ${v.delay}s infinite` }}
              />
              <span className="absolute inset-[3px] rounded-full bg-cyan shadow-[0_0_10px_rgba(77,217,192,0.9)]" />
            </div>
          ))}

        </div>

        {/* live capture beams from each satellite down to a vessel */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 z-[4] h-full w-full" aria-hidden>
          {ORBITS.map((_, i) => (
            <line
              key={i}
              ref={(el) => {
                beamRefs.current[i] = el;
              }}
              stroke="#4dd9c0"
              strokeWidth="0.22"
              strokeDasharray="1.4 1.8"
              opacity="0"
            />
          ))}
        </svg>

        {/* satellites travelling their orbits */}
        {ORBITS.map((o, i) => (
          <div
            key={i}
            ref={(el) => {
              satRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ width: o.sat }}
          >
            <img
              src={satellite}
              alt=""
              aria-hidden
              className="w-full drop-shadow-[0_2px_26px_rgba(9,18,31,0.9)] drop-shadow-[0_0_18px_rgba(77,217,192,0.35)]"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,rgba(9,18,31,0.7),rgba(9,18,31,0.28)_40%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(9,18,31,0.55)_75%)]" />
    </div>
  );
}

export function HeroHud() {
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden w-[300px] -translate-y-1/2 space-y-4 lg:block">
      <div className="rounded-md border border-white/10 bg-navy/70 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em]">
          <span className="text-cyan">HERA AI · FUSION</span>
          <span className="text-muted-foreground">FUSING</span>
        </div>
        <p className="mt-4 font-mono text-sm text-foreground">M/V ARGEST</p>
        <p className="font-mono text-[10px] text-muted-foreground">35.81N · 14.49E</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["AIS-T", "AIS-S", "RF", "SAR", "TIR"].map((c) => (
            <span key={c} className="rounded border border-cyan/30 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.14em] text-cyan/80">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-4 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
          POSITION CONFIDENCE <span className="text-gold">98%</span>
        </p>
        <div className="mt-1.5 h-[3px] w-full rounded-full bg-white/10">
          <div className="h-full w-[98%] rounded-full bg-gold" />
        </div>
        <p className="mt-3 font-mono text-[9px] tracking-[0.18em] text-muted-foreground">CROSS-CHECKING SOURCES…</p>
      </div>

      <div className="rounded-md border border-white/10 bg-navy/70 p-4 backdrop-blur-sm">
        <p className="font-mono text-[9px] tracking-[0.22em] text-gold">THE SENSOR LAYER</p>
        <ul className="mt-3 space-y-2.5">
          {[
            ["AIS-T", "identity claim", true],
            ["AIS-S", "position claim", true],
            ["RF", "true location · emissions", false],
            ["SAR", "hull image · all-weather", false],
            ["TIR", "heat · proof of activity", false],
          ].map(([k, v, on]) => (
            <li key={k as string} className="flex items-center gap-3">
              <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-cyan" : "bg-gold/60"}`} />
              <span className="w-14 font-mono text-[10px] tracking-[0.16em] text-foreground">{k}</span>
              <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
