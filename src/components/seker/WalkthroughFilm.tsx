import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { UseCase } from "@/content/intelligence";
import { DeckScenarioMap } from "./DeckMaps";
import "./walkthrough-film.css";

// Flagship scenarios: industry map slug and plain public file paths.
export const FLAGSHIP_MAP: Record<string, string> = { "cable-corridor": "defense", "cargo-claim": "insurance", origin: "commodity-trading", "pre-arrival": "ports", transshipment: "fisheries" };
const file = (id: string, ext: string) => `/walkthroughs/${id}.${ext}`;

const FILMS: Record<string, { url: string; poster: string; tags: string[][] }> = {
  "cable-corridor": { url: file("cable-corridor", "mp4"), poster: file("cable-corridor", "jpg"), tags: [["11 KN TO 1.4 KN"], ["GEOLOCATION AND ALL-WEATHER PASS REQUESTED"], ["AIS GAP 47 MIN"], ["9 KM", "OWNER CHANGED TWO MONTHS AGO"], [], ["RECORD SENT TO THE OPERATIONS CENTRE"]] },
  "cargo-claim": { url: file("cargo-claim", "mp4"), poster: file("cargo-claim", "jpg"), tags: [["LOG: SEVERE STORM"], ["VOYAGE RECONSTRUCTION"], ["SEA STATE 3.1 M MAX", "13 KN"], ["UNREPORTED 19 H STOP", "DRAUGHT DOWN 0.6 M"], [], ["RECONSTRUCTION SENT TO CLAIMS"]] },
  origin: { url: file("origin", "mp4"), poster: file("origin", "jpg"), tags: [["DECLARED: LOADED AT SEA"], ["60 DAYS"], ["DARK 52 H"], ["DRAUGHT UP 5.8 M", "STS"], [], ["BOTH CARGOES ADDED TO THE STS LEDGER"]] },
  "pre-arrival": { url: file("pre-arrival", "mp4"), poster: file("pre-arrival", "jpg"), tags: [["PRE-ARRIVAL NOTICE: 10 CALLS"], ["OBSERVED PORT CALLS"], ["BROADCAST GAP 3 DAYS"], ["DRAUGHT UP 4.1 M"], [], ["PRE-ARRIVAL SHEET SENT TO PORT SECURITY"]] },
  transshipment: { url: file("transshipment", "mp4"), poster: file("transshipment", "jpg"), tags: [["AIS OFF 14 H"], ["COLLECTION REQUESTED"], ["30 M APART, AT LEAST 4 H"], ["PORT CALL IN 2 DAYS", "LANDING DECLARED NO TRANSSHIPMENT"], [], ["REGISTER ENTRY AND TRIP ORIGIN REPORT SENT"]] },
};
export function useWalkthroughView(id: string) {
  const available = Boolean(FILMS[id]);
  const [choice, setChoice] = useState<{ id: string; mode: "film" | "map" }>();
  const mode = choice?.id === id ? choice.mode : available ? "film" : "map";
  return { available, mode, setMode: (value: "film" | "map") => setChoice({ id, mode: value }) };
}

export function WalkthroughViewToggle({ mode, onChange, available, deck = false }: { mode: "film" | "map"; onChange: (mode: "film" | "map") => void; available: boolean; deck?: boolean }) {
  return <div className={`walkthrough-toggle ml-auto flex shrink-0 items-center font-mono ${deck ? "text-[16px]" : "text-[10px]"}`} role="group" aria-label="Walkthrough view">
    {(["film", "map"] as const).map((value, i) => <span key={value} className="flex items-center">
      {i > 0 && <span className="text-muted-foreground" aria-hidden>|</span>}
      <Button variant="ghost" size="sm" disabled={value === "film" && !available} aria-pressed={mode === value} onClick={(event) => { event.stopPropagation(); onChange(value); }} className={`h-auto rounded-none px-2 py-1 font-mono text-inherit hover:bg-gold/10 hover:text-gold ${mode === value ? "text-gold" : "text-muted-foreground"}`}>{value.toUpperCase()}</Button>
    </span>)}
  </div>;
}

export function WalkthroughFilm({ uc, stage, active = true, frozen = false, deck = false, paused = false }: { uc: UseCase; stage: number; active?: boolean; frozen?: boolean; deck?: boolean; paused?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const visible = useInView(ref, { amount: 0.1 });
  const reduce = useReducedMotion();
  const film = FILMS[uc.id];
  const moving = visible && active && !frozen && !reduce;
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (moving && stage >= 3 && !paused) void element.play().catch(() => undefined);
    else element.pause();
  }, [moving, stage, paused]);
  if (!film) return null;
  const current = frozen ? 4 : stage;
  const scene = current < 3 ? 0 : 2;
  const tags = film.tags[current];
  return <div ref={ref} className={`walkthrough-film relative isolate w-full overflow-hidden bg-navy-deep ${deck ? "walkthrough-film-deck" : "aspect-[1060/560]"}`} data-moving={moving && !paused} data-scenario={uc.id} role="img" aria-label={`${uc.tag}, stage ${current + 1}`}>
    <div className={`wf-scene ${scene === 0 ? "wf-visible" : ""}`}><DeckScenarioMap slug={FLAGSHIP_MAP[uc.id]} stage={Math.min(current, 2)} fluid /></div>
    <div className={`wf-scene ${scene === 2 ? "wf-visible" : ""}`}>
      <img src={film.poster} alt="" className="h-full w-full object-cover" />
      {moving && stage >= 3 && <video ref={video} poster={film.poster} muted loop playsInline autoPlay={!paused} preload={paused ? "metadata" : "none"} className="wf-video absolute inset-0 h-full w-full object-cover"><source src={film.url} type="video/mp4" /></video>}
    </div>
    {scene === 2 && <div className="pointer-events-none absolute inset-0 bg-navy/30" />}
    <div className="wf-tags pointer-events-none absolute left-[3%] top-[4%] flex max-w-[90%] flex-col items-start gap-2">
      <FilmChip tone={current >= 5 ? "cyan" : "gold"} text={`${uc.tag} · ${["DETECT", "CUE", "COLLECT", "FUSE", "ASSESS", "DELIVER"][current]}`} />
      {tags.map((tag) => <FilmChip key={tag} tone={current === 2 ? "cyan" : "gold"} text={tag} />)}
    </div>
    {current >= 3 && <div className="wf-reticle pointer-events-none absolute left-1/2 top-1/2 h-[24%] w-[20%] -translate-x-1/2 -translate-y-1/2">
      <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-gold" /><span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-gold" /><span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-gold" /><span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-gold" />
    </div>}
    {current >= 4 && <div className="wf-score pointer-events-none absolute bottom-[5%] right-[3%] max-w-[58%]"><FilmChip tone="alert" text={`${uc.finding.label} · ${uc.finding.score}/100`} /></div>}
  </div>;
}

function FilmChip({ text, tone }: { text: string; tone: "gold" | "cyan" | "alert" }) {
  const color = { gold: "border-gold/60 text-gold", cyan: "border-cyan/60 text-cyan", alert: "border-alert/60 text-alert" };
  return <span className={`wf-chip flex items-start gap-2 rounded border bg-navy-deep/90 px-2 py-1 font-mono ${color[tone]}`}><span className="mt-[0.4em] h-1.5 w-1.5 shrink-0 rounded-full bg-current" /><span>{text}</span></span>;
}