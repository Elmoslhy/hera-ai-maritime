import { useEffect, useRef } from "react";
import satellite from "@/assets/satellite-real.png";
import earthTexture from "@/assets/earth-texture.jpg";
import { OCEAN_MASK_B64 } from "./oceanMask";

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

// ---- Hero: today's Seker globe (ship traffic, satellites, dark-vessel finds) ----
const SPIN_SECONDS = 140;

// main shipping lanes as [lon, lat] waypoints
const LANES: [number, number][][] = [
  [[4, 52], [-2, 50], [-9, 44], [-9.5, 38], [-5.6, 36], [5, 37.5], [14, 35.5], [25, 34], [32.3, 31.6], [33.5, 27], [38, 20], [43.4, 12.6], [52, 12.5], [65, 10], [80.5, 5.8], [92, 6], [98, 4], [103.8, 1.3]],
  [[103.8, 1.3], [110, 8], [114, 21], [122.5, 30.5], [129, 33], [135, 33.5], [140, 35]],
  [[140, 35], [160, 40], [180, 42], [-160, 42], [-140, 40], [-125, 36], [-118, 33.5]],
  [[-118, 33.5], [-105, 20], [-92, 13], [-79.5, 8]],
  [[-79.5, 9.5], [-77, 16], [-75, 24], [-74, 33], [-73.5, 40]],
  [[-73.5, 40], [-55, 42], [-40, 44], [-20, 46], [-9, 44]],
  [[56.5, 26.5], [58.5, 23.5], [62, 20], [65, 15], [72, 10], [80.5, 5.8]],
  [[103.8, 1.3], [96, -6], [80, -12], [60, -25], [40, -32], [20, -35.5], [8, -25], [0, -10], [-12, 5], [-17, 15], [-15, 28], [-9.5, 38]],
  [[-46, -24.5], [-38, -14], [-32, -5], [-24, 5], [-17, 15]],
  [[103.8, 1.3], [110, -6], [115, -20], [114, -32], [130, -36], [151, -34]],
  [[122.5, 30.5], [125, 20], [128, 10], [120, 0], [115, -8]],
  [[-5.6, 36], [-20, 32], [-45, 25], [-66, 18], [-79.5, 9.5]],
  [[4, 52], [8, 55], [12, 57], [18, 58]],
];
// busiest ports: [lon, lat, ships]
const PORTS: [number, number, number][] = [
  [103.8, 1.3, 26], [121.8, 31, 24], [4, 51.9, 20], [56.3, 26.4, 16], [114.2, 22.3, 18], [-118.2, 33.7, 14],
  [-74, 40.6, 12], [32.4, 31.3, 10], [129, 35.1, 12], [55.1, 25, 12], [-46.3, -24, 8], [18.4, -33.9, 6], [151.2, -33.9, 6],
];

let MASK: Uint8Array | null = null;
function isOcean(lon: number, lat: number) {
  if (!MASK) {
    const bin = atob(OCEAN_MASK_B64);
    MASK = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) MASK[i] = bin.charCodeAt(i);
  }
  const x = Math.floor(((((lon + 180) % 360) + 360) % 360));
  const y = Math.min(179, Math.max(0, Math.floor(90 - lat)));
  const i = y * 360 + x;
  return ((MASK[i >> 3] ?? 0) >> (i & 7)) & 1;
}

// deterministic pseudo-random
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

type Ship = { u: number; v: number; b: number; tw: number };
function buildShips() {
  const r = rng(7);
  const ships: Ship[] = [];
  const lanePts: { u: number; v: number }[][] = [];
  const toUV = (lon: number, lat: number) => ({ u: (lon + 180) / 360, v: (90 - lat) / 180 });
  for (const lane of LANES) {
    const pts: { u: number; v: number }[] = [];
    for (let i = 0; i < lane.length - 1; i++) {
      const [a0, b0] = lane[i]!;
      let [a1, b1] = lane[i + 1]!;
      if (a1 - a0 > 180) a1 -= 360;
      if (a0 - a1 > 180) a1 += 360;
      const len = Math.hypot(a1 - a0, b1 - b0);
      const steps = Math.max(2, Math.round(len / 1.2));
      for (let k = 0; k < steps; k++) {
        const f = k / steps;
        pts.push(toUV(a0 + (a1 - a0) * f, b0 + (b1 - b0) * f));
        if (r() < 0.42) {
          const lon = a0 + (a1 - a0) * f + (r() - 0.5) * 1.6;
          const lat = b0 + (b1 - b0) * f + (r() - 0.5) * 1.6;
          if (isOcean(lon, lat)) ships.push({ ...toUV(lon, lat), b: 0.45 + r() * 0.55, tw: r() * 6.28 });
        }
      }
    }
    lanePts.push(pts);
  }
  for (const [lon, lat, n] of PORTS) {
    let placed = 0;
    for (let tries = 0; tries < n * 12 && placed < n; tries++) {
      const a = lon + (r() - 0.5) * 3.2;
      const b = lat + (r() - 0.5) * 2.4;
      if (isOcean(a, b)) {
        ships.push({ ...toUV(a, b), b: 0.6 + r() * 0.4, tw: r() * 6.28 });
        placed++;
      }
    }
  }
  return { ships, lanePts };
}

export function HeroScene() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<HTMLDivElement | null>(null);
  const textureRef = useRef<HTMLDivElement | null>(null);
  const shipCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current, stage = stageRef.current, globe = globeRef.current;
    const tex = textureRef.current, sc = shipCanvasRef.current, fx = fxCanvasRef.current, panel = panelRef.current;
    if (!root || !stage || !globe || !tex || !sc || !fx || !panel) return;
    const sctx = sc.getContext("2d"), fctx = fx.getContext("2d");
    if (!sctx || !fctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { ships, lanePts } = buildShips();
    const satImg = new Image();
    satImg.src = satellite;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let B = 0, RW = 0, RH = 0;
    const resize = () => {
      B = globe.offsetWidth;
      RW = root.offsetWidth;
      RH = root.offsetHeight;
      sc.width = B * dpr; sc.height = B * dpr;
      fx.width = RW * dpr; fx.height = RH * dpr;
      fx.style.width = RW + "px"; fx.style.height = RH + "px";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    const ROT = (-9 * Math.PI) / 180, SCL = 1.06;
    // box point -> root coords
    const project = (x: number, y: number, gr: DOMRect, rr: DOMRect) => {
      const dx = x - B / 2, dy = y - B / 2;
      const rx = (dx * Math.cos(ROT) - dy * Math.sin(ROT)) * SCL;
      const ry = (dx * Math.sin(ROT) + dy * Math.cos(ROT)) * SCL;
      const k = gr.width / B;
      return { x: gr.left - rr.left + gr.width / 2 + rx * k, y: gr.top - rr.top + gr.height / 2 + ry * k };
    };
    const shipBox = (s: Ship, off: number) => {
      let x = (s.u * 2 * B + off) % (2 * B);
      if (x < 0) x += 2 * B;
      return { x, y: s.v * B };
    };
    const avoidRects = () => {
      const section = root.parentElement;
      return section ? Array.from(section.querySelectorAll("[data-hero-avoid]")).map((e) => e.getBoundingClientRect()) : [];
    };

    const trails: { x: number; y: number }[][] = ORBITS.map(() => []);
    let event: { ship: number; sat: number; start: number } | null = null;
    let nextEvent = 2.2;
    let running = true, visible = true, raf = 0, last = 0, simT = 0;

    const frame = (t: number) => {
      const gr = globe.getBoundingClientRect(), rr = root.getBoundingClientRect();
      const off = -((t / SPIN_SECONDS) % 1) * 2 * B;
      tex.style.backgroundPosition = `${off}px 50%`;

      // ---- ships + lanes, locked to the texture ----
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, B, B);
      sctx.strokeStyle = "rgba(215,178,74,0.22)";
      sctx.lineWidth = Math.max(0.6, B / 900);
      for (const pts of lanePts) {
        for (const shift of [0, 2 * B, -2 * B]) {
          sctx.beginPath();
          let prev: number | null = null;
          for (const p of pts) {
            const x = p.u * 2 * B + ((off % (2 * B)) + shift);
            const y = p.v * B;
            if (prev !== null && Math.abs(x - prev) < B * 0.3) sctx.lineTo(x, y);
            else sctx.moveTo(x, y);
            prev = x;
          }
          sctx.stroke();
        }
      }
      const rad = Math.max(0.9, B / 640);
      ships.forEach((s, i) => {
        const p = shipBox(s, off);
        if (p.x > B + 4) return;
        const dark = event && event.ship === i;
        const a = s.b * (0.75 + 0.25 * Math.sin(t * 1.3 + s.tw)) * (dark ? 0.15 : 1);
        sctx.fillStyle = `rgba(255,255,255,${a * 0.22})`;
        sctx.beginPath(); sctx.arc(p.x, p.y, rad * 2.6, 0, 6.283); sctx.fill();
        sctx.fillStyle = `rgba(255,255,255,${a})`;
        sctx.beginPath(); sctx.arc(p.x, p.y, rad, 0, 6.283); sctx.fill();
      });

      // ---- satellites ----
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.clearRect(0, 0, RW, RH);
      const sr = stage.getBoundingClientRect();
      const W = sr.width, cx = sr.left - rr.left + W / 2, cy = sr.top - rr.top + W / 2;
      const globeR = gr.width / 2;
      const sats = ORBITS.map((o, i) => {
        const a = ((t / o.period + o.phase) % 1) * Math.PI * 2;
        const rad2 = (o.tilt * Math.PI) / 180;
        const pos = (ang: number) => {
          const ex = Math.cos(ang) * o.r, ey = Math.sin(ang) * o.r * o.flatten;
          return { x: cx + ((ex * Math.cos(rad2) - ey * Math.sin(rad2)) / 100) * W, y: cy + ((ex * Math.sin(rad2) + ey * Math.cos(rad2)) / 100) * W };
        };
        // gold front half of the orbit
        fctx.beginPath();
        for (let k = 0; k <= 48; k++) {
          const p = pos((k / 48) * Math.PI);
          if (k) fctx.lineTo(p.x, p.y); else fctx.moveTo(p.x, p.y);
        }
        fctx.strokeStyle = "rgba(215,178,74,0.32)";
        fctx.lineWidth = 1;
        fctx.stroke();
        const p = pos(a);
        const depth = Math.sin(a);
        const hidden = depth < 0 && Math.hypot(p.x - cx, p.y - cy) < globeR * 1.02;
        const tr = trails[i]!;
        tr.push(p);
        if (tr.length > 26) tr.shift();
        return { p, depth, hidden, size: o.sat * (0.8 + 0.4 * ((depth + 1) / 2)) * (W / 700), tr };
      });
      for (const s of sats) {
        if (s.hidden) { s.tr.length = 0; continue; }
        // trail
        for (let k = 1; k < s.tr.length; k++) {
          fctx.strokeStyle = `rgba(215,178,74,${(k / s.tr.length) * 0.55})`;
          fctx.lineWidth = 1.6;
          fctx.beginPath(); fctx.moveTo(s.tr[k - 1]!.x, s.tr[k - 1]!.y); fctx.lineTo(s.tr[k]!.x, s.tr[k]!.y); fctx.stroke();
        }
        // scan beam towards the Earth
        if (s.depth > 0) {
          const dx = cx - s.p.x, dy = cy - s.p.y, L = Math.hypot(dx, dy) || 1;
          const tx = s.p.x + (dx / L) * Math.max(0, L - globeR * 0.55), ty = s.p.y + (dy / L) * Math.max(0, L - globeR * 0.55);
          const nx = -dy / L, ny = dx / L, w = s.size * 0.6;
          const g = fctx.createLinearGradient(s.p.x, s.p.y, tx, ty);
          g.addColorStop(0, "rgba(215,178,74,0.22)"); g.addColorStop(1, "rgba(215,178,74,0)");
          fctx.fillStyle = g;
          fctx.beginPath(); fctx.moveTo(s.p.x, s.p.y); fctx.lineTo(tx + nx * w, ty + ny * w); fctx.lineTo(tx - nx * w, ty - ny * w); fctx.closePath(); fctx.fill();
        }
        // halo
        const h = fctx.createRadialGradient(s.p.x, s.p.y, 0, s.p.x, s.p.y, s.size * 1.1);
        h.addColorStop(0, "rgba(215,178,74,0.38)"); h.addColorStop(1, "rgba(215,178,74,0)");
        fctx.fillStyle = h;
        fctx.beginPath(); fctx.arc(s.p.x, s.p.y, s.size * 1.1, 0, 6.283); fctx.fill();
        if (satImg.complete && satImg.naturalWidth) {
          const sw = s.size, sh = (s.size * satImg.naturalHeight) / satImg.naturalWidth;
          fctx.globalAlpha = s.depth > 0 ? 1 : 0.55;
          fctx.drawImage(satImg, s.p.x - sw / 2, s.p.y - sh / 2, sw, sh);
          fctx.globalAlpha = 1;
        }
      }

      // ---- dark vessel found ----
      if (!reduce) {
        if (!event && t > nextEvent) {
          const avoid = avoidRects();
          const front = sats.map((s, i) => ({ s, i })).filter((o) => o.s.depth > 0.2 && !o.s.hidden);
          const pr = panel.getBoundingClientRect();
          const panelOn = pr.width > 0;
          const cands: number[] = [];
          ships.forEach((s, i) => {
            const b = shipBox(s, off);
            if (b.x > B) return;
            if (Math.hypot(b.x - B / 2, b.y - B / 2) > B * 0.42) return;
            const q = project(b.x, b.y, gr, rr);
            const ax = q.x + rr.left, ay = q.y + rr.top;
            if (avoid.some((r) => ax > r.left - 28 && ax < r.right + 28 && ay > r.top - 28 && ay < r.bottom + 28)) return;
            if (panelOn && ax > rr.left + rr.width * 0.55) return;
            cands.push(i);
          });
          if (front.length && cands.length) {
            const ship = cands[Math.floor(Math.random() * cands.length)]!;
            const q = project(shipBox(ships[ship]!, off).x, ships[ship]!.v * B, gr, rr);
            front.sort((a, b) => Math.hypot(a.s.p.x - q.x, a.s.p.y - q.y) - Math.hypot(b.s.p.x - q.x, b.s.p.y - q.y));
            event = { ship, sat: front[0]!.i, start: t };
            root.dataset.finds = String(Number(root.dataset.finds ?? 0) + 1);
          } else nextEvent = t + 0.5;
        }
        let panelAlpha = 0;
        if (event) {
          const e = t - event.start, D = 4.8;
          if (e > D) { event = null; nextEvent = t + 1.4; }
          else {
            const s = ships[event.ship]!;
            const b = shipBox(s, off);
            const q = project(b.x, b.y, gr, rr);
            const sat = sats[event.sat]!;
            const fade = e > D - 0.6 ? (D - e) / 0.6 : 1;
            fctx.globalAlpha = fade;
            // dashed link from the satellite
            const f = Math.min(1, e / 0.8);
            if (!sat.hidden) {
              fctx.setLineDash([6, 6]); fctx.lineDashOffset = -t * 30;
              fctx.strokeStyle = "rgba(215,178,74,0.85)"; fctx.lineWidth = 1.3;
              fctx.beginPath(); fctx.moveTo(sat.p.x, sat.p.y);
              fctx.lineTo(sat.p.x + (q.x - sat.p.x) * f, sat.p.y + (q.y - sat.p.y) * f); fctx.stroke();
              fctx.setLineDash([]);
            }
            if (e > 0.7) {
              // ring closing, then pulsing
              const c = Math.min(1, (e - 0.7) / 0.7);
              const pulse = c < 1 ? 0 : Math.sin((e - 1.4) * 5) * 2;
              const R = 34 - 24 * (1 - Math.pow(1 - c, 3)) + pulse;
              fctx.strokeStyle = "#D7B24A"; fctx.lineWidth = 1.6;
              fctx.beginPath(); fctx.arc(q.x, q.y, R, 0, 6.283); fctx.stroke();
              fctx.fillStyle = "#F2CF68"; fctx.beginPath(); fctx.arc(q.x, q.y, 2.2, 0, 6.283); fctx.fill();
            }
            if (e > 1.2) {
              const k = 18, l = 6;
              fctx.strokeStyle = "#D7B24A"; fctx.lineWidth = 1.4;
              for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
                fctx.beginPath();
                fctx.moveTo(q.x + sx * k, q.y + sy * (k - l)); fctx.lineTo(q.x + sx * k, q.y + sy * k); fctx.lineTo(q.x + sx * (k - l), q.y + sy * k);
                fctx.stroke();
              }
            }
            const pr = panel.getBoundingClientRect();
            if (e > 1.6 && pr.width > 0) {
              const g2 = Math.min(1, (e - 1.6) / 0.5);
              const px = pr.left - rr.left + (pr.left - rr.left + pr.width / 2 < q.x ? pr.width : 0);
              const py = pr.top - rr.top + pr.height / 2;
              const sx = q.x + Math.sign(px - q.x) * 18;
              fctx.strokeStyle = "rgba(215,178,74,0.8)"; fctx.lineWidth = 1;
              fctx.beginPath(); fctx.moveTo(sx, q.y); fctx.lineTo(sx + (px - sx) * g2, q.y + (py - q.y) * g2); fctx.stroke();
              panelAlpha = g2 * fade;
            }
            fctx.globalAlpha = 1;
          }
        }
        panel.style.opacity = String(panelAlpha);
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      simT += dt;
      frame(simT);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!running && visible && !reduce) { running = true; last = 0; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    if (reduce) {
      running = false;
      satImg.onload = () => frame(0);
      frame(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    const io = new IntersectionObserver(([en]) => {
      visible = !!en?.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(root);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return (
    <div ref={rootRef} data-hero-scene className="pointer-events-none absolute inset-0 overflow-hidden">
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
        <div ref={globeRef} className="absolute inset-[10%] z-[2] animate-[globe-breathe_28s_ease-in-out_infinite]">
          <div className="absolute inset-0 overflow-hidden rounded-full" role="img" aria-label="Earth rotating, seen from orbit, with ship traffic on the main shipping lanes">
            {/* rotating layer: texture and ship traffic share one transform and one clock */}
            <div className="absolute inset-0" style={{ transform: "rotate(-9deg) scale(1.06)" }}>
              <div
                ref={textureRef}
                className="absolute inset-0 will-change-[background-position]"
                style={{
                  backgroundImage: `url(${earthTexture})`,
                  backgroundSize: "200% 100%",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "0px 50%",
                }}
              />
              <canvas ref={shipCanvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
            </div>
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
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(9,18,31,0.5),rgba(9,18,31,0.16)_38%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,21,0.5)_0%,transparent_18%,transparent_76%,rgba(6,12,21,0.72)_100%)]" />

      {/* satellites, beams and finds */}
      <canvas ref={fxCanvasRef} className="absolute left-0 top-0" aria-hidden />

      {/* dark vessel found panel, beside the globe and clear of the copy */}
      <div
        ref={panelRef}
        className="absolute bottom-[16%] left-6 hidden w-[230px] rounded-2xl border border-gold/40 bg-[#061428]/90 px-4 py-3 opacity-0 xl:block"
      >
        <p className="flex items-center gap-2 text-[15px] font-semibold text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Dark vessel found
        </p>
        <p className="mt-1 text-[13px] text-[#C9D5E6]">Identity verified by HERA AI</p>
      </div>
    </div>
  );
}

export function HeroHud({ large = false }: { large?: boolean }) {
  const s = (compact: string, big: string) => (large ? big : compact);
  return (
    <div className={`pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 space-y-3 lg:block ${large ? "w-[320px]" : "w-[286px]"}`}>
      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-gold/15 px-3 py-2">
          <span className={`font-mono text-gold ${s("text-xs tracking-[0.22em]", "text-[14px] tracking-[0.18em]")}`}>HERA AI · FUSION</span>
          <span className={`flex items-center gap-1.5 font-mono tracking-[0.18em] text-muted-foreground ${s("text-[8px]", "text-[10px]")}`}>
            <span className="blink-dot h-1.5 w-1.5 rounded-full bg-cyan" /> FUSING
          </span>
        </div>

        <div className="px-3 py-3">
          <div className="flex items-end justify-between">
            <div>
              <p className={`font-mono leading-none text-foreground ${s("text-[13px]", "text-[17px]")}`}>M/V ARGEST</p>
              <p className={`mt-1.5 font-mono tracking-[0.12em] text-muted-foreground ${s("text-[9px]", "text-[11px] leading-[1.6]")}`}>
                IMO 94XXXX7{large ? <br /> : " · "}35.8104N 14.4903E
              </p>
            </div>
            <span className={`rounded-[2px] border border-gold/40 bg-gold/10 px-1.5 py-1 font-mono tracking-[0.14em] text-gold ${s("text-xs", "text-[13px]")}`}>
              VERIFIED
            </span>
          </div>

          {/* sensor chips */}
          <div className="mt-3 flex flex-wrap gap-1">
            {["AIS-T", "AIS-S", "RF", "SAR", "TIR"].map((c) => (
              <span
                key={c}
                className={`rounded-[2px] border border-cyan/25 px-1.5 py-[3px] font-mono text-cyan/80 ${s("text-[7.5px] tracking-[0.16em]", "text-[10px] tracking-[0.12em]")}`}
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

          <div className={`mt-2 flex items-center justify-between font-mono tracking-[0.14em] text-muted-foreground ${s("text-[9px]", "text-[11px]")}`}>
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
                <p className={`font-mono text-muted-foreground ${s("text-[7.5px] tracking-[0.18em]", "text-[10px] tracking-[0.12em]")}`}>{k}</p>
                <p className={`mt-0.5 font-mono text-foreground ${s("text-[10px]", "text-[13px]")}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-gold/15 px-3 py-2">
          <span className={`font-mono text-gold ${s("text-xs tracking-[0.22em]", "text-[14px] tracking-[0.18em]")}`}>INTELLIGENCE PROFILE</span>
          <span className="h-px flex-1 bg-gold/20" />
        </div>
        <ul className="divide-y divide-white/5">
          {[
            ["Identity and owner", "VERIFIED"],
            ["Flag", "MT · CONSISTENT"],
            ["Cargo estimate", "ABOUT 62,000 T"],
            ["Last port call", "PIRAEUS · 2 D"],
            ["Encounters (30 days)", "2"],
            ["Risk indicators", "LOW"],
          ].map(([k, v]) => (
            <li key={k} className={`flex items-center gap-2.5 px-3 py-2`}>
              <span className={`flex-1 font-mono text-muted-foreground ${s("text-[8.5px] tracking-[0.1em]", "text-[11px] tracking-[0.06em]")}`}>{k}</span>
              <span className={`font-mono text-cyan ${s("text-[9.5px] tracking-[0.12em]", "text-[12px] tracking-[0.08em]")}`}>{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HeroShipCard() {
  return (
    <div data-hero-avoid className="pointer-events-none absolute right-6 top-1/2 z-10 hidden w-[286px] -translate-y-1/2 lg:block">
      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-gold/15 px-3 py-2">
          <span className="font-mono text-[13px] tracking-[0.18em] text-gold">HERA AI · SHIP RECORD</span>
          <span className="h-px flex-1 bg-gold/20" />
        </div>
        <div className="flex items-end justify-between border-b border-white/5 px-3 py-3">
          <div>
            <p className="font-mono text-[16px] leading-none text-foreground">M/V ARGEST</p>
            <p className="mt-1.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground">IMO 94XXXX7</p>
          </div>
          <span className="rounded-[2px] border border-gold/40 bg-gold/10 px-1.5 py-1 font-mono text-[13px] tracking-[0.14em] text-gold">VERIFIED</span>
        </div>
        <ul className="divide-y divide-white/5">
          {[
            ["Who owns it", "VERIFIED"],
            ["Flag", "MALTA · CONSISTENT"],
            ["Cargo", "ABOUT 62,000 T"],
            ["Last port", "PIRAEUS · 2 DAYS AGO"],
            ["Meetings at sea, 30 days", "2"],
            ["Risk", "LOW"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center gap-2.5 px-3 py-2">
              <span className="flex-1 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">{k}</span>
              <span className="font-mono text-[12px] tracking-[0.08em] text-cyan">{v}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-white/5 px-3 py-3">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
            <span>HERA AI CONFIDENCE</span>
            <span className="text-cyan">98%</span>
          </div>
          <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[98%] rounded-full bg-cyan" />
          </div>
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">SAMPLE SHIP</p>
    </div>
  );
}

/** In-flow sample ship record with a source marker beside each field. */
export function SampleRecord() {
  const rows: [string, string, string][] = [
    ["Who owns it", "VERIFIED", "2 sources agree"],
    ["Flag", "MALTA · CONSISTENT", "3 sources agree"],
    ["Cargo", "ABOUT 62,000 T", "2 sources agree"],
    ["Last port", "PIRAEUS · 2 DAYS AGO", "2 sources agree"],
    ["Meetings at sea, 30 days", "2", "Sources disagree"],
    ["Risk", "LOW", "3 sources agree"],
  ];
  return (
    <div>
      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70">
        <div className="flex items-center gap-3 border-b border-gold/15 px-3 py-2">
          <span className="font-mono text-[13px] tracking-[0.18em] text-gold">HERA AI · SHIP RECORD</span>
          <span className="h-px flex-1 bg-gold/20" />
        </div>
        <div className="flex items-end justify-between border-b border-white/5 px-3 py-3">
          <div>
            <p className="font-mono text-[16px] leading-none text-foreground">M/V ARGEST</p>
            <p className="mt-1.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground">IMO 94XXXX7</p>
          </div>
          <span className="rounded-[2px] border border-gold/40 bg-gold/10 px-1.5 py-1 font-mono text-[13px] tracking-[0.14em] text-gold">VERIFIED</span>
        </div>
        <ul className="divide-y divide-white/5">
          {rows.map(([k, v, src]) => (
            <li key={k} className="px-3 py-2">
              <div className="flex items-center gap-2.5">
                <span className="flex-1 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">{k}</span>
                <span className="font-mono text-[12px] tracking-[0.08em] text-cyan">{v}</span>
              </div>
              <p className={`mt-0.5 text-right font-mono text-[10px] ${src === "Sources disagree" ? "text-alert" : "text-muted-foreground/80"}`}>{src}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-white/5 px-3 py-3">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
            <span>HERA AI CONFIDENCE</span>
            <span className="text-cyan">98%</span>
          </div>
          <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[98%] rounded-full bg-cyan" />
          </div>
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">SAMPLE SHIP</p>
    </div>
  );
}
