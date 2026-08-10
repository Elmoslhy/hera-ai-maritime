import { useEffect, useRef } from "react";
import satellite from "@/assets/satellite-real.png";
import earthTexture from "@/assets/earth-texture.jpg";

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
  { r: 44.5, flatten: 0.26, tilt: -16, period: 34, phase: 0.12, sat: 58 },
  { r: 48.5, flatten: 0.40, tilt: 24, period: 46, phase: 0.55, sat: 48 },
  { r: 42.5, flatten: 0.14, tilt: 4, period: 27, phase: 0.78, sat: 42 },
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
      <div ref={stageRef} className="absolute left-1/2 top-1/2 h-[min(122vh,1040px)] w-[min(122vh,1040px)] -translate-x-1/2 -translate-y-1/2">
        {/* atmosphere glow */}
        <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(90,170,235,0.30),rgba(77,217,192,0.12)_58%,transparent_70%)] blur-3xl" />

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
        <div className="absolute inset-[10%] z-[2] animate-[globe-breathe_28s_ease-in-out_infinite]">
          {/* rotating sphere: seamless equirectangular texture scrolling inside a circular mask */}
          <div className="absolute inset-0 overflow-hidden rounded-full" role="img" aria-label="Earth rotating, seen from orbit">
            <div
              className="absolute inset-0 animate-[earth-spin_140s_linear_infinite] will-change-[background-position]"
              style={{
                backgroundImage: `url(${earthTexture})`,
                backgroundSize: "200% 100%",
                backgroundRepeat: "repeat-x",
                transform: "rotate(-9deg) scale(1.06)",
              }}
            />
            {/* horizontal squeeze near the limbs, so the flat scroll reads as curvature */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,12,21,0.95)_0%,rgba(6,12,21,0.55)_9%,rgba(6,12,21,0)_26%,rgba(6,12,21,0)_74%,rgba(6,12,21,0.55)_91%,rgba(6,12,21,0.95)_100%)]" />
            {/* vertical pole shading */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,21,0.8)_0%,rgba(6,12,21,0)_22%,rgba(6,12,21,0)_78%,rgba(6,12,21,0.8)_100%)]" />
            {/* sun-lit side + night terminator */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_38%,rgba(6,12,21,0.32)_74%,rgba(6,12,21,0.78)_100%)]" />
          </div>
          {/* limb light + atmosphere rim */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(9,18,31,0.75),0_0_110px_rgba(96,176,235,0.30)]" />
          <div className="absolute -inset-[0.8%] rounded-full border border-[rgba(140,200,255,0.35)] blur-[2px]" />
          <div className="absolute -inset-[2.5%] rounded-full bg-[radial-gradient(circle,transparent_69%,rgba(120,190,255,0.16)_74%,transparent_82%)]" />

          {/* vessel pings */}
          {VESSELS.map((v, i) => (
            <div key={i} className="absolute h-1.5 w-1.5" style={{ left: `${v.x}%`, top: `${v.y}%` }}>
              <span
                className="absolute inset-0 rounded-full border border-cyan/70"
                style={{ animation: `vessel-ping 4.2s ease-out ${v.delay}s infinite` }}
              />
              <span className="absolute inset-[2px] rounded-full bg-cyan shadow-[0_0_8px_rgba(77,217,192,0.9)]" />
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
              className="w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_14px_rgba(77,217,192,0.45)]"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(9,18,31,0.5),rgba(9,18,31,0.16)_38%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,21,0.5)_0%,transparent_18%,transparent_76%,rgba(6,12,21,0.72)_100%)]" />
    </div>
  );
}

export function HeroHud() {
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden w-[286px] -translate-y-1/2 space-y-3 lg:block">
      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-gold/15 px-3 py-2">
          <span className="font-mono text-xs tracking-[0.22em] text-gold">HERA AI · FUSION</span>
          <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.18em] text-muted-foreground">
            <span className="blink-dot h-1.5 w-1.5 rounded-full bg-cyan" /> FUSING
          </span>
        </div>

        <div className="px-3 py-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[13px] leading-none text-foreground">M/V ARGEST</p>
              <p className="mt-1.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                IMO 9412783 · 35.8104N 14.4903E
              </p>
            </div>
            <span className="rounded-[2px] border border-gold/40 bg-gold/10 px-1.5 py-1 font-mono text-xs tracking-[0.16em] text-gold">
              VERIFIED
            </span>
          </div>

          {/* sensor chips */}
          <div className="mt-3 flex flex-wrap gap-1">
            {["AIS-T", "AIS-S", "RF", "SAR", "TIR"].map((c) => (
              <span
                key={c}
                className="rounded-[2px] border border-cyan/25 px-1.5 py-[3px] font-mono text-[7.5px] tracking-[0.16em] text-cyan/80"
              >
                {c}
              </span>
            ))}
          </div>

          {/* signal trace */}
          <svg viewBox="0 0 240 34" className="mt-3 h-[34px] w-full" aria-hidden>
            <defs>
              <linearGradient id="hud-trace" x1="0" x2="1">
                <stop offset="0" stopColor="#4dd9c0" stopOpacity="0.05" />
                <stop offset="0.5" stopColor="#4dd9c0" stopOpacity="0.9" />
                <stop offset="1" stopColor="#4dd9c0" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="0" x2="240" y1={i * 11 + 1} y2={i * 11 + 1} stroke="#eef2f7" strokeOpacity="0.05" strokeWidth="0.5" />
            ))}
            <path
              d={Array.from({ length: 61 })
                .map((_, i) => {
                  const x = i * 4;
                  const y = 17 - Math.sin(i * 0.55) * 6 * Math.sin(i * 0.11) - (i % 7 === 0 ? 3 : 0);
                  return `${i ? "L" : "M"}${x} ${y.toFixed(1)}`;
                })
                .join(" ")}
              fill="none"
              stroke="url(#hud-trace)"
              strokeWidth="1.1"
            />
          </svg>

          <div className="mt-2 flex items-center justify-between font-mono text-[9px] tracking-[0.16em] text-muted-foreground">
            <span>POSITION CONFIDENCE</span>
            <span className="text-gold">98.4%</span>
          </div>
          <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[98.4%] rounded-full bg-gradient-to-r from-gold/50 to-gold" />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[
              ["SOG", "12.4 kn"],
              ["COG", "271°"],
              ["AGE", "38 s"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[2px] border border-white/8 px-2 py-1.5">
                <p className="font-mono text-[7.5px] tracking-[0.18em] text-muted-foreground">{k}</p>
                <p className="mt-0.5 font-mono text-[10px] text-foreground">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-gold/15 px-3 py-2">
          <span className="font-mono text-xs tracking-[0.22em] text-gold">THE SENSOR LAYER</span>
          <span className="h-px flex-1 bg-gold/20" />
        </div>
        <ul className="divide-y divide-white/5">
          {[
            { k: "AIS-T", v: "identity claim", s: 4 },
            { k: "AIS-S", v: "position claim", s: 3 },
            { k: "RF", v: "true location", s: 5 },
            { k: "SAR", v: "hull image", s: 4 },
            { k: "TIR", v: "engine heat", s: 2 },
          ].map((row) => (
            <li key={row.k} className="flex items-center gap-2.5 px-3 py-2">
              <span className="w-10 font-mono text-[9.5px] tracking-[0.14em] text-foreground">{row.k}</span>
              <span className="flex-1 font-mono text-[8.5px] tracking-[0.1em] text-muted-foreground">{row.v}</span>
              <span className="flex items-end gap-[2px]">
                {[1, 2, 3, 4, 5].map((b) => (
                  <span
                    key={b}
                    className={`w-[2.5px] rounded-[1px] ${b <= row.s ? "bg-cyan" : "bg-white/12"}`}
                    style={{ height: 3 + b * 1.6 }}
                  />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
