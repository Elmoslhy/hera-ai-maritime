import { useEffect, useRef } from "react";

const BG = "#09121F";
const ACCENT = "#c9a84c";
const ACCENT_LIT = "#e8be52";
const MUTED = "#8fa3bd";

const SHIP_COUNT = 70;
const SAT_COUNT = 5;

type Rnd = () => number;
function mulberry(seed: number): Rnd {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
const easeInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);

/** Timeline, in seconds. */
const T = {
  stars: [0, 0.9],
  sats: [0.6, 2.1],
  cones: [1.9, 2.9],
  ships: [2.6, 3.7],
  net: [3.5, 4.3],
  converge: [4.3, 5.4],
  open: [5.2, 6.4],
} as const;

/** HERA "insight" aperture animation — satellites, downlinks and vessel
 *  tracks converging into a watching eye. Starts when scrolled into view. */
export function EyeCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let start: number | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && start === null) start = performance.now();
      },
      { threshold: 0.25 },
    );
    io.observe(canvas);

    const rnd = mulberry(20260807);
    const starSeed = Array.from({ length: 260 }, () => ({
      x: rnd(),
      y: rnd(),
      r: 0.4 + rnd() * 1.1,
      p: rnd() * Math.PI * 2,
    }));
    const shipSeed = Array.from({ length: SHIP_COUNT }, (_, i) => ({
      x: 0.08 + rnd() * 0.84,
      y: 0.5 + rnd() * 0.3,
      d: rnd(),
      i,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const satPos = (i: number) => {
      const f = (i + 0.5) / SAT_COUNT;
      return { x: w * (0.12 + 0.76 * f), y: h * (0.235 - 0.075 * Math.sin(Math.PI * f)) };
    };

    const drawSatellite = (x: number, y: number, a: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = a;
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-5, -6, 10, 12);
      ctx.moveTo(-5, -1);
      ctx.lineTo(5, -1);
      ctx.moveTo(-22, -4);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-6, 4);
      ctx.lineTo(-22, 4);
      ctx.closePath();
      ctx.moveTo(22, -4);
      ctx.lineTo(6, -4);
      ctx.lineTo(6, 4);
      ctx.lineTo(22, 4);
      ctx.closePath();
      ctx.moveTo(-14, -4);
      ctx.lineTo(-14, 4);
      ctx.moveTo(14, -4);
      ctx.lineTo(14, 4);
      ctx.moveTo(0, -6);
      ctx.lineTo(0, -12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -13.5, 1.6, 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT_LIT;
      ctx.stroke();
      ctx.restore();
    };

    const frame = (now: number) => {
      let t = start === null ? 0 : (now - start) / 1000;
      if (reduced) t = Math.max(t, 9);

      const cx = w / 2;
      const cy = h * 0.37;
      const R = Math.max(70, Math.min(w * 0.15, h * 0.235));

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      wash.addColorStop(0, "rgba(10,31,60,0.85)");
      wash.addColorStop(1, "rgba(9,18,31,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      const starA = easeOut(seg(t, T.stars[0], T.stars[1]));
      for (const s of starSeed) {
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.7 + s.p * 5));
        ctx.globalAlpha = starA * tw * 0.55;
        ctx.fillStyle = s.r > 1.2 ? ACCENT : MUTED;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const dissolve = 1 - easeInOut(seg(t, T.converge[0], T.converge[0] + 0.7));

      const coneBase = h * 0.66;
      if (dissolve > 0.01) {
        for (let i = 0; i < SAT_COUNT; i++) {
          const p = satPos(i);
          const c = easeOut(seg(t, T.cones[0] + i * 0.12, T.cones[1] + i * 0.12));
          if (c <= 0) continue;
          const spread = w * 0.105 * c;
          const bottom = p.y + (coneBase - p.y) * c;
          ctx.save();
          ctx.globalAlpha = dissolve;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y + 6);
          ctx.lineTo(p.x - spread, bottom);
          ctx.lineTo(p.x + spread, bottom);
          ctx.closePath();
          const g = ctx.createLinearGradient(p.x, p.y, p.x, bottom);
          g.addColorStop(0, "rgba(201,168,76,0.16)");
          g.addColorStop(1, "rgba(201,168,76,0)");
          ctx.fillStyle = g;
          ctx.fill();
          ctx.strokeStyle = "rgba(201,168,76,0.22)";
          ctx.lineWidth = 1;
          ctx.stroke();

          const k = ((t * 0.55 + i * 0.17) % 1) * c;
          const sy = p.y + (bottom - p.y) * k;
          const sw = spread * k;
          ctx.globalAlpha = dissolve * (1 - k) * 0.9;
          ctx.strokeStyle = ACCENT_LIT;
          ctx.beginPath();
          ctx.moveTo(p.x - sw, sy);
          ctx.lineTo(p.x + sw, sy);
          ctx.stroke();
          ctx.restore();
        }
      }

      if (dissolve > 0.01) {
        const n = seg(t, T.net[0], T.net[1]);
        const pairs: [number, number][] = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [0, 2],
          [2, 4],
        ];
        ctx.save();
        ctx.strokeStyle = "rgba(201,168,76,0.35)";
        ctx.lineWidth = 0.8;
        pairs.forEach(([a, b], idx) => {
          const pr = easeOut(clamp01(n * pairs.length - idx));
          if (pr <= 0) return;
          const pa = satPos(a);
          const pb = satPos(b);
          ctx.globalAlpha = dissolve * pr;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pa.x + (pb.x - pa.x) * pr, pa.y + (pb.y - pa.y) * pr);
          ctx.stroke();
        });
        ctx.restore();
      }

      if (dissolve > 0.01) {
        for (let i = 0; i < SAT_COUNT; i++) {
          const p = satPos(i);
          const at = T.sats[0] + i * 0.24;
          const a = easeOut(seg(t, at, at + 0.7));
          if (a <= 0) continue;
          drawSatellite(p.x, p.y, a * dissolve, 1);
          const ring = seg(t, at, at + 1.1);
          if (ring > 0 && ring < 1) {
            ctx.save();
            ctx.globalAlpha = (1 - ring) * 0.7 * dissolve;
            ctx.strokeStyle = ACCENT_LIT;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8 + easeOut(ring) * 46, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      const conv = easeInOut(seg(t, T.converge[0], T.converge[1]));
      const aperture = easeInOut(seg(t, T.open[0], T.open[1]));
      const alive = t - T.open[1];
      const spin = alive > 0 ? alive * 0.035 : 0;

      const tickPos = (i: number) => {
        const ang = (i / SHIP_COUNT) * Math.PI * 2 - Math.PI / 2 + spin;
        return { ang, x: cx + Math.cos(ang) * R * 1.02, y: cy + Math.sin(ang) * R * 1.02 };
      };

      for (const s of shipSeed) {
        const appear = easeOut(seg(t, T.ships[0] + s.d * 0.9, T.ships[0] + s.d * 0.9 + 0.5));
        if (appear <= 0) continue;
        const from = { x: s.x * w, y: s.y * h };
        const to = tickPos(s.i);
        const k = easeInOut(clamp01(conv * 1.15 - s.d * 0.15));
        const x = from.x + (to.x - from.x) * k;
        const y = from.y + (to.y - from.y) * k;
        if (k > 0.985) continue;
        ctx.globalAlpha = appear * (0.55 + 0.45 * k);
        ctx.fillStyle = k > 0.5 ? ACCENT_LIT : ACCENT;
        ctx.beginPath();
        ctx.arc(x, y, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (conv > 0.75) {
        const reveal = clamp01((conv - 0.75) / 0.25);
        const breathe = alive > 0 ? 1 + 0.035 * Math.sin(alive * 0.9) : 1;
        const sacc = alive > 0 ? Math.sin(alive * 0.31) * Math.sin(alive * 1.7) : 0;
        const ox = Math.abs(sacc) > 0.85 ? sacc * 5 : 0;

        const lidW = R * 1.55;
        const lidH = R * 1.12 * Math.max(aperture, 0.001);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx - lidW, cy);
        ctx.quadraticCurveTo(cx, cy - lidH * 2, cx + lidW, cy);
        ctx.quadraticCurveTo(cx, cy + lidH * 2, cx - lidW, cy);
        ctx.closePath();
        ctx.clip();

        ctx.translate(ox, 0);

        const irisWash = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
        irisWash.addColorStop(0, "rgba(9,18,31,1)");
        irisWash.addColorStop(0.75, "rgba(10,31,60,0.9)");
        irisWash.addColorStop(1, "rgba(9,18,31,0.2)");
        ctx.fillStyle = irisWash;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = reveal * 0.5;
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 0.7;
        for (const kr of [0.46, 0.6, 0.72, 0.86]) {
          ctx.beginPath();
          ctx.arc(cx, cy, R * kr, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (let i = 0; i < SHIP_COUNT; i++) {
          const { ang } = tickPos(i);
          const major = i % 5 === 0;
          const inner = R * (major ? 0.9 : 0.95);
          const outer = R * (major ? 1.08 : 1.03);
          ctx.globalAlpha = reveal * (major ? 0.95 : 0.6);
          ctx.strokeStyle = major ? ACCENT_LIT : ACCENT;
          ctx.lineWidth = major ? 1.4 : 0.9;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner);
          ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer);
          ctx.stroke();
        }

        ctx.globalAlpha = reveal * 0.35;
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 0.7;
        for (let i = 0; i < 8; i++) {
          const a0 = (i / 8) * Math.PI * 2 + spin * 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a0) * R * 0.36 * breathe, cy + Math.sin(a0) * R * 0.36 * breathe);
          ctx.lineTo(cx + Math.cos(a0 + 0.9) * R * 0.86, cy + Math.sin(a0 + 0.9) * R * 0.86);
          ctx.stroke();
        }

        ctx.globalAlpha = reveal;
        ctx.fillStyle = "#04101f";
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.34 * breathe, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(232,190,82,0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = ACCENT_LIT;
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = reveal * aperture;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        const cl = ctx.createRadialGradient(
          cx - R * 0.3,
          cy - R * 0.32,
          0,
          cx - R * 0.3,
          cy - R * 0.32,
          R * 0.3,
        );
        cl.addColorStop(0, "rgba(244,246,249,0.35)");
        cl.addColorStop(1, "rgba(244,246,249,0)");
        ctx.globalAlpha = reveal;
        ctx.fillStyle = cl;
        ctx.beginPath();
        ctx.arc(cx - R * 0.3, cy - R * 0.32, R * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = reveal * 0.8;
        ctx.strokeStyle = "rgba(201,168,76,0.55)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(cx - lidW, cy);
        ctx.quadraticCurveTo(cx, cy - lidH * 2, cx + lidW, cy);
        ctx.quadraticCurveTo(cx, cy + lidH * 2, cx - lidW, cy);
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className ?? "absolute inset-0 h-full w-full"} aria-hidden="true" />;
}