import { useEffect, useRef, useState } from "react";
import type { GeoJSONSource, Map as MlMap, Marker } from "maplibre-gl";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskingSection } from "./Tasking";
import vessels from "@/assets/vessels.jpg";

/* Synthetic scenario. Alert at 21:40Z, all pass times derive from it. */
type LL = [number, number];
const LP: LL = [56.462, 25.118]; // last AIS position, Fujairah anchorage
const T: LL = [56.548, 25.031]; // where the hull is found
const KM_LAT = 110.574;
const kmLon = (lat: number) => 111.32 * Math.cos((lat * Math.PI) / 180);

function circle(c: LL, km: number, n = 96, rx = 1, ry = 1, rot = 0): LL[] {
  const out: LL[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    let x = Math.cos(a) * km * rx, y = Math.sin(a) * km * ry;
    const r = (rot * Math.PI) / 180;
    [x, y] = [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
    out.push([c[0] + x / kmLon(c[1]), c[1] + y / KM_LAT]);
  }
  return out;
}

/* Descending pass: curved ground track, swath offset to one side by the off-nadir look. */
function pass(target: LL, offKm: number, swKm: number, side: 1 | -1, curve: number) {
  const lonAt = (lat: number, off: number) => target[0] + (0.22 * (lat - target[1]) + curve * (lat - target[1]) ** 2) + off / kmLon(lat);
  const track: LL[] = [], near: LL[] = [], far: LL[] = [], fpNear: LL[] = [], fpFar: LL[] = [];
  for (let lat = 22.6; lat <= 27.6; lat += 0.05) {
    const centre = -side * (offKm + swKm / 2);
    track.push([lonAt(lat, centre), lat]);
    near.push([lonAt(lat, centre + side * offKm), lat]);
    far.push([lonAt(lat, centre + side * (offKm + swKm)), lat]);
    if (Math.abs(lat - target[1]) <= swKm / 2 / KM_LAT + 0.02) {
      fpNear.push(near[near.length - 1]);
      fpFar.push(far[far.length - 1]);
    }
  }
  return { track, swath: [...near, ...far.reverse(), near[0]], footprint: [...fpNear, ...fpFar.reverse(), fpNear[0]] };
}

const P = {
  rf: pass(T, 120, 80, -1, 0.04),
  sar: pass(T, 230, 25, 1, 0.03),
  eoN: pass([T[0] + 0.03, T[1]], 160, 14, 1, 0.025),
  eoD: pass(T, 110, 12, -1, 0.03),
};

const PASTTRACK: LL[] = [[56.92, 24.58], [56.83, 24.72], [56.72, 24.86], [56.62, 24.98], [56.54, 25.06], [56.49, 25.1], LP];
const ANCHORAGE: LL[] = [[56.42, 25.09], [56.52, 25.09], [56.54, 25.24], [56.42, 25.25], [56.42, 25.09]];

type VType = "tanker" | "cargo" | "service" | "passenger" | "fishing";
const VCOL: Record<VType, string> = { tanker: "#e2574c", cargo: "#6cc070", service: "#e0a33c", passenger: "#5aa9e6", fishing: "#d7d7d7" };
type V = { id: string; type: VType; p: LL; hdg: number; kn: number };
const seedV: V[] = [
  ["tanker", 56.44, 25.09, 40, 0], ["tanker", 56.47, 25.15, 210, 0], ["tanker", 56.49, 25.19, 15, 0], ["cargo", 56.43, 25.17, 330, 0],
  ["tanker", 56.5, 25.12, 120, 0], ["cargo", 56.455, 25.205, 75, 0], ["tanker", 56.42, 25.12, 260, 0], ["service", 56.4, 25.135, 95, 4],
  ["tanker", 56.68, 25.3, 340, 12], ["cargo", 56.75, 24.92, 20, 14], ["tanker", 56.62, 24.86, 200, 11], ["cargo", 56.8, 25.45, 175, 15],
  ["passenger", 56.39, 25.33, 160, 9], ["fishing", 56.58, 25.2, 70, 3], ["fishing", 56.66, 25.05, 230, 2], ["service", 56.52, 25.08, 300, 6],
].map(([type, x, y, h, k], i) => ({ id: `v${i}`, type: type as VType, p: [x as number, y as number], hdg: h as number, kn: k as number }));

const ALERT = 21 * 60 + 40;
const hhmm = (minAfter: number) => { const m = (ALERT + minAfter) % 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}Z`; };

const PASSES = [
  { id: "RF-1", h: 0.8, sensor: "RF", res: "2 KM CEP", ona: "24°", cloud: "N/A", st: "selected", why: "Earliest listen. Geolocates emitters inside the 18 nm reach.", step: 2 },
  { id: "SAR-2", h: 2.2, sensor: "SAR", res: "3 M", ona: "31°", cloud: "N/A", st: "selected", why: "Sees through cloud and darkness over the narrowed area.", step: 3 },
  { id: "EO-3", h: 3.6, sensor: "EO", res: "0.5 M", ona: "22°", cloud: "85%", st: "rejected", why: "Night and 85% cloud. The image would show nothing.", step: 3 },
  { id: "UAV-1", h: 3, sensor: "EO/IR", res: "0.1 M", ona: "ORBIT", cloud: "N/A", st: "selected", why: "Already on patrol 40 km away. Holds the hull in view.", step: 4 },
  { id: "RF-2", h: 6.9, sensor: "RF", res: "2 KM CEP", ona: "28°", cloud: "N/A", st: "standby", why: "Kept in reserve if the vessel moves before imaging.", step: 4 },
  { id: "SAR-1", h: 9.1, sensor: "SAR", res: "1 M", ona: "19°", cloud: "N/A", st: "standby", why: "Later than needed. Backup for custody.", step: 5 },
  { id: "EO-4", h: 10.3, sensor: "EO", res: "0.3 M", ona: "17°", cloud: "30%", st: "selected", why: "Daylight, 30% cloud. High-resolution confirmation.", step: 5 },
] as const;

const STEPS = [
  { t: 0, label: "Dark", cap: "Vessel A, a 183 m tanker, stops broadcasting near the Fujairah anchorage. Its last position and past track stay on the map." },
  { t: 2, label: "Reach", cap: "HERA AI draws every place Vessel A could have reached since its last report: 18 nm." },
  { t: 48, label: "RF", cap: "RF-1 listens for the vessel's transmissions and narrows the search to about 2 km." },
  { t: 132, label: "SAR", cap: "EO-3 is rejected: night and 85% cloud. SAR-2 images the area and finds a 183 m hull, matching the registry." },
  { t: 180, label: "Drone", cap: "A long-endurance drone already on patrol is cued to Vessel A and holds it in view: hull name, draught marks and deck activity." },
  { t: 618, label: "Profile", cap: "EO-4 adds a daylight high-resolution image. Every result goes into Vessel A's profile with its source and time." },
];

const CHIPS = [
  { step: 3, src: "SAR-2 · 3 M", t: hhmm(132).replace("Z", ":14"), tone: "sar", zoom: 640 },
  { step: 4, src: "UAV-1 · EO/IR", t: hhmm(196).replace("Z", ":40"), tone: "drone", zoom: 1100 },
  { step: 5, src: "EO-4 · 0.3 M", t: hhmm(618).replace("Z", ":02"), tone: "eo", zoom: 820 },
];

const STEP_MS = 7000;
const fc = (features: unknown[]) => ({ type: "FeatureCollection", features }) as unknown as Parameters<GeoJSONSource["setData"]>[0];
const line = (c: LL[], props = {}) => ({ type: "Feature", properties: props, geometry: { type: "LineString", coordinates: c } });
const poly = (c: LL[], props = {}) => ({ type: "Feature", properties: props, geometry: { type: "Polygon", coordinates: [c] } });
const pt = (c: LL, props = {}) => ({ type: "Feature", properties: props, geometry: { type: "Point", coordinates: c } });

function overlays(step: number) {
  const f: unknown[] = [];
  f.push(poly(ANCHORAGE, { k: "anch" }));
  f.push(line(PASTTRACK, { k: "past" }));
  if (step >= 1) f.push(poly(circle(LP, 33.34), { k: "reach" }));
  if (step >= 2) { f.push(line(P.rf.track, { k: "trk" }), poly(P.rf.swath, { k: "sw-rf" }), poly(circle(T, 1.1, 64, 1, 0.65, 35), { k: "rfell" })); }
  if (step >= 3) {
    f.push(line(P.eoN.track, { k: "trk-rej" }), poly(P.eoN.swath, { k: "sw-rej" }));
    f.push(line(P.sar.track, { k: "trk" }), poly(P.sar.swath, { k: "sw-sar" }), poly(P.sar.footprint, { k: "fp" }));
  }
  if (step >= 4) f.push(line(circle(T, 3.2), { k: "orbit" }));
  if (step >= 5) { f.push(line(P.eoD.track, { k: "trk" }), poly(P.eoD.swath, { k: "sw-eo" }), poly(P.eoD.footprint, { k: "fp" })); }
  return fc(f);
}

const fmtDM = (v: number, pos: string, neg: string, w: number) => {
  const a = Math.abs(v), d = Math.floor(a), m = (a - d) * 60;
  return `${String(d).padStart(w, "0")}°${m.toFixed(2).padStart(5, "0")}'${v >= 0 ? pos : neg}`;
};

function hasWebGL() {
  try { const c = document.createElement("canvas"); return Boolean(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

function useUtc() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toISOString().slice(11, 19) + "Z");
    f(); const id = setInterval(f, 1000); return () => clearInterval(id);
  }, []);
  return t;
}

function tag(text: string, tone: "cyan" | "alert" | "gold" | "muted") {
  const el = document.createElement("div");
  const c = { cyan: "#4dd9c0", alert: "#ff4d4d", gold: "#c9a84c", muted: "#8fa2b8" }[tone];
  el.style.cssText = `font:10px 'Space Mono',monospace;letter-spacing:.08em;color:${c};background:rgba(6,12,21,.82);border:1px solid ${c}55;padding:1px 5px;white-space:nowrap;pointer-events:none;transform:translate(10px,-50%)`;
  el.textContent = text;
  return el;
}

export function TaskingScreen() {
  const [mode, setMode] = useState<"map" | "plan">("map");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [seen, setSeen] = useState(false);
  const [gl, setGl] = useState(true);
  const [reduce, setReduce] = useState(false);
  const [cursor, setCursor] = useState<LL>(LP);
  const box = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const drone = useRef<Marker | null>(null);
  const fleet = useRef<V[]>(seedV.map((v) => ({ ...v, p: [...v.p] as LL })));
  const utc = useUtc();

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r); setGl(hasWebGL());
    if (r) { setStep(5); setPlaying(false); }
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el); return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || !playing || reduce || mode !== "map") return;
    const id = setTimeout(() => { if (step < 5) setStep(step + 1); else setPlaying(false); }, STEP_MS);
    return () => clearTimeout(id);
  }, [seen, playing, step, reduce, mode]);

  // Map setup
  useEffect(() => {
    if (!seen || !gl || mode !== "map" || !mapEl.current) return;
    let dead = false; let raf = 0; let tick: ReturnType<typeof setInterval> | undefined;
    (async () => {
      const ml = await import("maplibre-gl");
      const worker = (await import("maplibre-gl/dist/maplibre-gl-worker.mjs?url")).default;
      await import("maplibre-gl/dist/maplibre-gl.css");
      ml.setWorkerUrl(worker);
      if (dead || !mapEl.current) return;
      const m = new ml.Map({
        container: mapEl.current,
        center: [56.5, 25.1], zoom: 8.7, minZoom: 6, maxZoom: 14, attributionControl: false, dragRotate: false,
        style: {
          version: 8,
          sources: {
            s2: { type: "raster", tileSize: 256, maxzoom: 15, tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg"], attribution: '<a href="https://s2maps.eu" target="_blank" rel="noreferrer">Sentinel-2 cloudless 2016</a> by <a href="https://eox.at" target="_blank" rel="noreferrer">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016)' },
            lbl: { type: "raster", tileSize: 256, maxzoom: 15, tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/overlay_bright_3857/default/g/{z}/{y}/{x}.png"], attribution: 'Labels &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors, rendering &copy; EOX' },
          },
          layers: [
            { id: "s2", type: "raster", source: "s2", paint: { "raster-saturation": -0.25, "raster-brightness-max": 0.85 } },
            { id: "lbl", type: "raster", source: "lbl", paint: { "raster-opacity": 0.9 } },
          ],
        },
      });
      map.current = m;
      m.addControl(new ml.NavigationControl({ showCompass: true, visualizePitch: false }), "top-right");
      m.addControl(new ml.ScaleControl({ unit: "nautical", maxWidth: 110 }), "bottom-left");
      m.addControl(new ml.AttributionControl({ compact: false }), "bottom-right");
      m.on("mousemove", (e: { lngLat: { lng: number; lat: number } }) => setCursor([e.lngLat.lng, e.lngLat.lat]));
      m.on("load", () => {
        const size = 24; const data = new Uint8Array(size * size * 4);
        for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
          const half = (y / size) * 7 + 1; const inside = y > 2 && y < 22 && Math.abs(x - 12) < half;
          data[(y * size + x) * 4 + 3] = inside ? 255 : 0;
        }
        m.addImage("ais", { width: size, height: size, data }, { sdf: true });
        m.addSource("ov", { type: "geojson", data: overlays(0) });
        m.addSource("ships", { type: "geojson", data: fc([]) });
        const is = (k: string) => ["==", ["get", "k"], k] as ["==", ["get", string], string];
        const any = (...k: string[]) => ["in", ["get", "k"], ["literal", k]] as unknown as import("maplibre-gl").FilterSpecification;
        m.addLayer({ id: "sw", type: "fill", source: "ov", filter: any("sw-rf", "sw-sar", "sw-eo"), paint: { "fill-color": ["match", ["get", "k"], "sw-rf", "#4dd9c0", "#c9a84c"], "fill-opacity": 0.07 } });
        m.addLayer({ id: "sw-o", type: "line", source: "ov", filter: any("sw-rf", "sw-sar", "sw-eo"), paint: { "line-color": ["match", ["get", "k"], "sw-rf", "#4dd9c0", "#c9a84c"], "line-width": 1, "line-opacity": 0.7 } });
        m.addLayer({ id: "rej", type: "line", source: "ov", filter: any("sw-rej", "trk-rej"), paint: { "line-color": "#ff4d4d", "line-width": 1, "line-dasharray": [3, 3], "line-opacity": 0.8 } });
        m.addLayer({ id: "fp", type: "fill", source: "ov", filter: is("fp"), paint: { "fill-color": "#c9a84c", "fill-opacity": 0.22 } });
        m.addLayer({ id: "trk", type: "line", source: "ov", filter: is("trk"), paint: { "line-color": "#eef2f7", "line-width": 1, "line-opacity": 0.55, "line-dasharray": [6, 2] } });
        m.addLayer({ id: "anch", type: "line", source: "ov", filter: is("anch"), paint: { "line-color": "#eef2f7", "line-width": 1, "line-dasharray": [2, 2], "line-opacity": 0.6 } });
        m.addLayer({ id: "reach", type: "fill", source: "ov", filter: is("reach"), paint: { "fill-color": "#ff4d4d", "fill-opacity": 0.06 } });
        m.addLayer({ id: "reach-o", type: "line", source: "ov", filter: is("reach"), paint: { "line-color": "#ff4d4d", "line-width": 1.2, "line-dasharray": [4, 2] } });
        m.addLayer({ id: "rfell", type: "line", source: "ov", filter: is("rfell"), paint: { "line-color": "#4dd9c0", "line-width": 1.5 } });
        m.addLayer({ id: "orbit", type: "line", source: "ov", filter: is("orbit"), paint: { "line-color": "#e0a33c", "line-width": 1.2, "line-dasharray": [1, 2] } });
        m.addLayer({ id: "past", type: "line", source: "ov", filter: is("past"), paint: { "line-color": "#e2574c", "line-width": 1.5, "line-opacity": 0.9 } });
        m.addLayer({ id: "ships", type: "symbol", source: "ships", layout: { "icon-image": "ais", "icon-size": ["case", ["==", ["get", "kn"], 0], 0.42, 0.52], "icon-rotate": ["get", "hdg"], "icon-rotation-alignment": "map", "icon-allow-overlap": true }, paint: { "icon-color": ["get", "c"], "icon-halo-color": "#060c15", "icon-halo-width": 1 } });
        const pushShips = () => (m.getSource("ships") as GeoJSONSource | undefined)?.setData(fc(fleet.current.map((v) => pt(v.p, { hdg: v.hdg, kn: v.kn, c: VCOL[v.type] }))));
        pushShips();
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          tick = setInterval(() => {
            for (const v of fleet.current) {
              if (v.kn === 0) { v.hdg = (v.hdg + (Math.random() - 0.5) * 2 + 360) % 360; continue; }
              const d = v.kn * 0.00009; const r = (v.hdg * Math.PI) / 180;
              v.p = [v.p[0] + (Math.sin(r) * d) / Math.cos((v.p[1] * Math.PI) / 180), v.p[1] + Math.cos(r) * d];
              if (v.p[1] > 25.6 || v.p[1] < 24.6 || v.p[0] > 57.1 || v.p[0] < 56.36) v.hdg = (v.hdg + 180) % 360;
            }
            pushShips();
          }, 1000);
          let a = 0;
          const spin = () => { a += 0.004; drone.current?.setLngLat([T[0] + (Math.cos(a) * 3.2) / kmLon(T[1]), T[1] + (Math.sin(a) * 3.2) / KM_LAT]); raf = requestAnimationFrame(spin); };
          raf = requestAnimationFrame(spin);
        }
        setReadyTick((n) => n + 1);
      });
    })().catch((err) => { console.error("tasking map", err); setGl(false); });
    return () => { dead = true; cancelAnimationFrame(raf); if (tick) clearInterval(tick); markers.current.forEach((k) => k.remove()); drone.current = null; map.current?.remove(); map.current = null; };
  }, [seen, gl, mode]);

  const [readyTick, setReadyTick] = useState(0);

  // Step overlays, markers and camera
  useEffect(() => {
    const m = map.current; if (!m || !m.getSource("ov")) return;
    (m.getSource("ov") as GeoJSONSource).setData(overlays(step));
    (async () => {
      const ml = await import("maplibre-gl");
      markers.current.forEach((k) => k.remove()); markers.current = []; drone.current = null;
      const add = (el: HTMLElement, at: LL) => { const k = new ml.Marker({ element: el, anchor: "left" }).setLngLat(at).addTo(m); markers.current.push(k); return k; };
      const dot = (col: string, hollow = false) => { const e = document.createElement("div"); e.style.cssText = `width:10px;height:10px;border-radius:50%;border:2px solid ${col};background:${hollow ? "transparent" : col};transform:translateX(-5px)`; return e; };
      add(tag("FUJAIRAH ANCH. A", "muted"), [56.41, 25.235]);
      add(dot("#e2574c", true), LP); add(tag(`VESSEL A · LAST AIS ${hhmm(0)}`, "alert"), LP);
      if (step >= 1) add(tag("REACH 18 NM", "alert"), circle(LP, 33.34, 8)[1]);
      if (step >= 2) add(tag("RF-1 · 2 KM", "cyan"), [T[0] + 0.02, T[1] + 0.012]);
      if (step >= 3) { add(dot("#c9a84c"), T); add(tag(`SAR-2 · HULL 183 M · ${hhmm(132)}`, "gold"), [T[0] + 0.004, T[1] - 0.012]); }
      if (step >= 4) { const e = document.createElement("div"); e.style.cssText = "width:9px;height:9px;background:#e0a33c;transform:translateX(-4px) rotate(45deg)"; drone.current = add(e, [T[0] + 3.2 / kmLon(T[1]), T[1]]); add(tag("UAV-1 · ORBIT 3.2 KM", "gold"), [T[0] + 0.035, T[1] + 0.03]); }
      if (step >= 5) add(tag("PROFILE UPDATED", "cyan"), [T[0] + 0.004, T[1] - 0.024]);
    })();
    const zoomed = step >= 2;
    const w = mapEl.current?.clientWidth ?? 800;
    const z = (zoomed ? 11.3 : 8.6) - (w < 520 ? 0.8 : 0);
    m.easeTo({ center: zoomed ? [T[0] + 0.01, T[1]] : [56.5, 25.08], zoom: z, duration: reduce ? 0 : 1600 });
  }, [step, readyTick, reduce]);

  const jump = (i: number) => { setStep(i); setPlaying(false); };
  const lit = (id: string) => PASSES.find((p) => p.id === id)!.step <= step;
  const stCls = { selected: "text-gold", standby: "text-cyan", rejected: "text-alert" } as const;

  return (
    <div ref={box} className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-deep">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-alert/80" /><span className="h-2.5 w-2.5 rounded-full bg-amber/80" /><span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
          </div>
          <p className="min-w-0 truncate font-mono text-[10px] tracking-[0.18em] text-muted-foreground">HERA AI · TASKING · VESSEL A</p>
          <span className="shrink-0 rounded border border-muted-foreground/40 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.16em] text-muted-foreground">DESIGN PREVIEW</span>
          <span className="ml-auto hidden shrink-0 font-mono text-[10px] tabular-nums text-foreground/70 sm:inline">UTC {utc}</span>
          <div className="walkthrough-toggle flex shrink-0 items-center font-mono text-[10px]" role="group" aria-label="Tasking view">
            {(["map", "plan"] as const).map((v, i) => (
              <span key={v} className="flex items-center">
                {i > 0 && <span className="text-muted-foreground" aria-hidden>|</span>}
                <Button variant="ghost" size="sm" aria-pressed={mode === v} onClick={() => setMode(v)} className={`h-auto rounded-none px-2 py-1 font-mono text-inherit hover:bg-gold/10 hover:text-gold ${mode === v ? "text-gold" : "text-muted-foreground"}`}>{v.toUpperCase()}</Button>
              </span>
            ))}
          </div>
        </div>

        {mode === "plan" ? <TaskingSection planBody /> : (
          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 border-white/10 lg:border-r">
              <div className="relative h-[340px] bg-navy sm:h-[480px] lg:h-[560px]">
                {gl ? <div ref={mapEl} className="tasking-map h-full w-full" aria-label="Map of the Gulf of Oman off Fujairah with vessel traffic and satellite passes" role="img" />
                  : <img src="/tasking-final.jpg" alt="Final step: Vessel A found by SAR, held by a drone orbit and confirmed by a daylight image" className="absolute inset-0 h-full w-full object-cover" />}
                <div className="pointer-events-none absolute left-2 top-2 rounded border border-white/10 bg-navy-deep/85 px-2 py-1 font-mono text-[10px] tabular-nums text-foreground/80">
                  {fmtDM(cursor[1], "N", "S", 2)} {fmtDM(cursor[0], "E", "W", 3)}
                </div>
                <div className="pointer-events-none absolute left-2 top-9 rounded border border-white/10 bg-navy-deep/85 px-2 py-1 font-mono text-[10px] tabular-nums text-gold">
                  SCENARIO {hhmm(STEPS[step].t)} · T+{String(Math.floor(STEPS[step].t / 60)).padStart(2, "0")}:{String(STEPS[step].t % 60).padStart(2, "0")}
                </div>
                <div className="pointer-events-none absolute bottom-8 right-2 hidden flex-col gap-0.5 rounded border border-white/10 bg-navy-deep/85 px-2 py-1.5 font-mono text-[9px] text-foreground/75 sm:flex">
                  {(Object.keys(VCOL) as VType[]).map((k) => <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2" style={{ background: VCOL[k] }} />{k.toUpperCase()}</span>)}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-3 py-2">
                <Button variant="ghost" size="sm" onClick={() => { if (step === 5 && !playing) setStep(0); setPlaying(!playing); }} aria-label={playing ? "Pause scenario" : "Play scenario"} className="h-7 w-7 p-0 text-gold hover:bg-gold/10 hover:text-gold">
                  {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </Button>
                {STEPS.map((s, i) => (
                  <button key={s.label} type="button" onClick={() => jump(i)} aria-current={i === step} className={`border px-2 py-1 font-mono text-[10px] tracking-[0.12em] transition-colors ${i === step ? "border-gold text-gold" : i < step ? "border-white/15 text-foreground/70" : "border-white/10 text-muted-foreground"} hover:border-gold/60`}>
                    {i + 1} {s.label.toUpperCase()}
                  </button>
                ))}
              </div>
              <p aria-live="polite" className="border-t border-white/10 px-4 py-3 text-sm font-light text-foreground/90">{STEPS[step].cap}</p>
            </div>

            <div className="min-w-0 border-t border-white/10 p-4 font-mono text-[10px] lg:border-t-0">
              <p className="tracking-[0.2em] text-muted-foreground">TASKING REQUEST · TR-0417</p>
              <dl className="mt-3 grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-1.5">
                {[
                  ["TARGET", "VESSEL A · TANKER · 183 M"],
                  ["AOI", "R 18 NM · 25°07.08'N 056°27.72'E"],
                  ["WINDOW", `${hhmm(0)} TO ${hhmm(720)} (12 H)`],
                  ["SENSORS", "RF · SAR · EO · UAV"],
                  ["PRIORITY", "P1 · IMMEDIATE"],
                ].map(([k, v]) => (
                  <div key={k} className="contents"><dt className="text-muted-foreground">{k}</dt><dd className="min-w-0 truncate border-b border-white/10 pb-1 text-foreground/90">{v}</dd></div>
                ))}
              </dl>

              <p className="mt-5 tracking-[0.2em] text-muted-foreground">CANDIDATE PASSES</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[300px] text-left tabular-nums">
                  <thead className="text-muted-foreground"><tr><th className="py-1 font-normal">PASS</th><th className="font-normal">UTC</th><th className="font-normal">SNS</th><th className="font-normal">RES</th><th className="font-normal">ONA</th><th className="font-normal">CLD</th><th className="text-right font-normal">HERA AI</th></tr></thead>
                  <tbody>
                    {PASSES.map((p) => (
                      <tr key={p.id} className={`border-t border-white/5 align-top transition-opacity ${lit(p.id) ? "opacity-100" : "opacity-35"}`}>
                        <td className="py-1.5 text-foreground">{p.id}</td>
                        <td>{hhmm(Math.round(p.h * 60))}</td><td>{p.sensor}</td><td className="whitespace-nowrap">{p.res}</td><td>{p.ona}</td><td>{p.cloud}</td>
                        <td className={`text-right ${lit(p.id) ? stCls[p.st] : "text-muted-foreground"}`}>{lit(p.id) ? p.st.toUpperCase() : "PENDING"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="mt-2 space-y-1 font-sans text-[11px] font-light text-foreground/70">
                {PASSES.filter((p) => lit(p.id)).map((p) => <li key={p.id} className="truncate"><span className="font-mono text-[10px] text-foreground/90">{p.id}</span> {p.why}</li>)}
              </ul>

              <p className="mt-5 tracking-[0.2em] text-muted-foreground">COLLECTED</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {CHIPS.map((c) => {
                  const on = step >= c.step;
                  return (
                    <figure key={c.src} className="min-w-0">
                      <div className="relative aspect-square overflow-hidden border border-white/10 bg-navy">
                        {on && <div className={`absolute inset-0 ${c.tone === "sar" ? "grayscale" : ""}`} style={{ backgroundImage: `url(${vessels})`, backgroundSize: `${c.zoom}%`, backgroundPosition: "51% 47%" }} role="img" aria-label={`${c.src} image of Vessel A`} />}
                        {on && <span className="absolute left-[30%] top-[30%] h-[40%] w-[40%] border border-cyan" />}
                        {!on && <span className="absolute inset-0 grid place-items-center text-muted-foreground">AWAITING</span>}
                      </div>
                      <figcaption className="mt-1 truncate text-[9px] text-foreground/70">{c.src}</figcaption>
                      <figcaption className="truncate text-[9px] tabular-nums text-muted-foreground">{c.t}Z</figcaption>
                    </figure>
                  );
                })}
              </div>

              <Button disabled className="mt-5 h-auto w-full rounded-none border border-white/15 bg-transparent py-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">SEND TASKING</Button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs font-light text-muted-foreground">Tasking is in development. Scenario, vessels, passes and times are illustrative.</p>
    </div>
  );
}
