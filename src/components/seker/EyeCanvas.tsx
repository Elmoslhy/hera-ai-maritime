import { useEffect, useRef } from "react";
import satelliteImg from "@/assets/satellite-real.png";
import vesselImg from "@/assets/vessel-top.png";

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
  dive: [7.2, 9.6],
  sea: [7.4, 9.2],
  hunt: [9.6, 11.6],
  lock: [11.6, 12.8],
  reveal: [12.8, 13.8],
} as const;

const LOOP = 21;

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

    // real photographic assets — same satellite/vessel art as the hero scene
    const sprites: { sat?: HTMLImageElement; ship?: HTMLImageElement; shipRed?: HTMLCanvasElement } = {};
    const tint = (img: HTMLImageElement, color: string, amount: number) => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const cx = c.getContext("2d");
      if (!cx) return c;
      cx.drawImage(img, 0, 0);
      cx.globalCompositeOperation = "source-atop";
      cx.globalAlpha = amount;
      cx.fillStyle = color;
      cx.fillRect(0, 0, c.width, c.height);
      return c;
    };
    const loadSprite = (src: string, onDone: (img: HTMLImageElement) => void) => {
      const img = new Image();
      img.src = src;
      img.decode?.().then(() => onDone(img)).catch(() => {
        img.onload = () => onDone(img);
      });
    };
    loadSprite(satelliteImg, (img) => { sprites.sat = img; });
    loadSprite(vesselImg, (img) => {
      sprites.ship = img;
      sprites.shipRed = tint(img, "#ff4d4d", 0.55);
    });

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
      return { x: w * (0.12 + 0.76 * f), y: h * (0.30 - 0.075 * Math.sin(Math.PI * f)) };
    };

    const drawSatellite = (x: number, y: number, a: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = a;
      if (sprites.sat) {
        const iw = sprites.sat.naturalWidth || 1;
        const ih = sprites.sat.naturalHeight || 1;
        const dw = 74;
        const dh = (dw * ih) / iw;
        ctx.drawImage(sprites.sat, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
        return;
      }
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

    const seaShips = Array.from({ length: 9 }, () => ({
      x: 0.08 + rnd() * 0.84,
      y: 0.66 + rnd() * 0.28,
      p: rnd(),
    }));

    const drawShip = (x: number, y: number, s: number, color: string, a: number) => {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(x, y);
      ctx.scale(s, s);

      // hull — elongated body with pointed bow (top-down view)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-13, -3.2);
      ctx.quadraticCurveTo(-15.5, 0, -13, 3.2);
      ctx.lineTo(7, 3.2);
      ctx.quadraticCurveTo(16, 2.8, 16, 0);
      ctx.quadraticCurveTo(16, -2.8, 7, -3.2);
      ctx.closePath();
      ctx.fill();

      // deck edge highlight
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-11, -2);
      ctx.lineTo(8, -2);
      ctx.moveTo(-11, 2);
      ctx.lineTo(8, 2);
      ctx.stroke();

      // cargo hatch rows
      ctx.globalAlpha = a * 0.55;
      for (const hx of [-6, -2.5, 1, 4.5]) {
        ctx.fillRect(hx, -1.8, 2.2, 3.6);
      }
      ctx.globalAlpha = a;

      // bridge / superstructure near the stern
      ctx.fillStyle = color === "#ff4d4d" ? "#ff7a7a" : "rgba(232,190,82,0.85)";
      ctx.fillRect(-10, -1.4, 2.6, 2.8);
      ctx.fillRect(-9, -2.2, 0.8, 4.4);

      ctx.restore();
    };

    /** Act 2 — the eye descends to the sea and pins a vessel running dark. */
    const drawSea = (t: number, eyeX: number, eyeY: number) => {
      const seaA = easeOut(seg(t, T.sea[0], T.sea[1]));
      if (seaA <= 0.001) return;

      const horizon = h * 0.58;
      const tgt = { x: w * 0.63, y: h * 0.84 };
      const hunt = easeInOut(seg(t, T.hunt[0], T.hunt[1]));
      const lock = easeInOut(seg(t, T.lock[0], T.lock[1]));
      const reveal = easeOut(seg(t, T.reveal[0], T.reveal[1]));

      ctx.save();
      ctx.globalAlpha = seaA;

      // water
      const water = ctx.createLinearGradient(0, horizon, 0, h);
      water.addColorStop(0, "rgba(11,26,45,0.75)");
      water.addColorStop(1, "rgba(4,12,22,0.98)");
      ctx.fillStyle = water;
      ctx.fillRect(0, horizon, w, h - horizon);

      // horizon line
      ctx.strokeStyle = "rgba(201,168,76,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(w, horizon);
      ctx.stroke();

      // swell
      ctx.strokeStyle = "rgba(143,163,189,0.10)";
      for (let i = 1; i <= 8; i++) {
        const y = horizon + ((h - horizon) * i) / 8;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const yy = y + Math.sin(x * 0.012 + t * 0.8 + i) * (1.2 + i * 0.35);
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }

      // search beam from the eye, sweeping then settling on the target
      const sweepX = w * (0.5 + 0.34 * Math.sin(t * 1.6));
      const beamX = sweepX + (tgt.x - sweepX) * lock;
      if (hunt > 0) {
        const g = ctx.createLinearGradient(0, eyeY, 0, tgt.y);
        g.addColorStop(0, "rgba(201,168,76,0.02)");
        g.addColorStop(1, `rgba(201,168,76,${0.14 + 0.12 * lock})`);
        const spread = (w * 0.09) * (1 - 0.55 * lock);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(eyeX, eyeY);
        ctx.lineTo(beamX - spread, h);
        ctx.lineTo(beamX + spread, h);
        ctx.closePath();
        ctx.fill();
      }

      // cooperative traffic — broadcasting AIS
      for (const s of seaShips) {
        const x = ((s.x + t * 0.008 * (s.p > 0.5 ? 1 : -1)) % 1.1) * w;
        const y = horizon + (h - horizon) * ((s.y - 0.58) / 0.42);
        drawShip(x, y, 0.55 + s.p * 0.25, MUTED, seaA * 0.7);
        const ping = (t * 0.6 + s.p) % 1;
        ctx.globalAlpha = seaA * (1 - ping) * 0.5;
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, 6 + ping * 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = seaA;
      }

      // the dark vessel — no AIS, only a faint wake until HERA pins it
      const darkColor = lock > 0.4 ? "#ff4d4d" : "#33455c";
      ctx.globalAlpha = seaA * (0.18 + 0.82 * lock);
      // wake trail behind the stern
      ctx.save();
      ctx.globalAlpha = seaA * (0.08 + 0.12 * lock);
      const wakeGrad = ctx.createLinearGradient(tgt.x - 18, tgt.y, tgt.x - 60, tgt.y);
      wakeGrad.addColorStop(0, lock > 0.4 ? "rgba(255,77,77,0.25)" : "rgba(143,163,189,0.25)");
      wakeGrad.addColorStop(1, "rgba(143,163,189,0)");
      ctx.fillStyle = wakeGrad;
      ctx.beginPath();
      ctx.moveTo(tgt.x - 16, tgt.y - 2.5);
      ctx.lineTo(tgt.x - 55, tgt.y - 7);
      ctx.lineTo(tgt.x - 55, tgt.y + 7);
      ctx.lineTo(tgt.x - 16, tgt.y + 2.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      drawShip(tgt.x, tgt.y, 1.05, darkColor, seaA * (0.3 + 0.7 * lock));
      ctx.globalAlpha = seaA;

      if (hunt > 0.15) {
        // reticle closes in
        const rr = 64 - 30 * lock;
        ctx.strokeStyle = lock > 0.5 ? "#ff4d4d" : ACCENT_LIT;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = seaA * (0.35 + 0.65 * lock);
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(tgt.x, tgt.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          ctx.beginPath();
          ctx.moveTo(tgt.x + dx * (rr - 12), tgt.y + dy * (rr - 12));
          ctx.lineTo(tgt.x + dx * (rr + 10), tgt.y + dy * (rr + 10));
          ctx.stroke();
        }
      }

      if (reveal > 0) {
        ctx.globalAlpha = seaA * reveal;
        ctx.font = '11px "Space Mono", ui-monospace, monospace';
        ctx.textAlign = "left";
        const lx = tgt.x + 48;
        const ly = tgt.y - 52;
        ctx.strokeStyle = "rgba(255,77,77,0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tgt.x + 26, tgt.y - 26);
        ctx.lineTo(lx - 8, ly + 6);
        ctx.stroke();
        ctx.fillStyle = "#ff4d4d";
        ctx.fillText("AIS OFF · RUNNING DARK", lx, ly);
        ctx.fillStyle = ACCENT_LIT;
        ctx.fillText("FOUND BY RF + THERMAL", lx, ly + 18);
        ctx.fillStyle = "#e6edf5";
        ctx.fillText("36.21 N  13.60 E · 11.4 kn", lx, ly + 36);
      }

      ctx.restore();
    };

    const frame = (now: number) => {
      let t = start === null ? 0 : (now - start) / 1000;
      if (reduced) t = Math.max(t, 9);
      if (t > LOOP && start !== null) {
        start = now;
        t = 0;
      }

      const cx = w / 2;
      const cy = h * 0.44;
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

      const dive = easeInOut(seg(t, T.dive[0], T.dive[1]));
      const diveS = 1 - 0.58 * dive;
      const diveDy = -h * 0.16 * dive;
      const eyeX = cx;
      const eyeY = cy + diveDy;

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
        ctx.save();
        ctx.translate(cx, cy + diveDy);
        ctx.scale(diveS, diveS);
        ctx.translate(-cx, -cy);
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
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      drawSea(t, eyeX, eyeY);
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