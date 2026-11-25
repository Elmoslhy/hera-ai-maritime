import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { Reveal } from "./primitives";

const FILM = "/walkthroughs/drone-second-look.mp4";
const POSTER = "/walkthroughs/drone-second-look.jpg";
const ARIA_LABEL = "Illustrative film: a partner drone checks a container ship for HERA AI from high above.";

export function DroneFilmFrame() {
  const reduce = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const active = !reduce || started;

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (active) void element.play().catch(() => undefined);
    else element.pause();
  }, [active]);

  return (
    <figure className="mx-auto w-full max-w-[1100px]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-deep">
        <div className="aspect-video w-full">
          {reduce && !started ? (
            <button
              type="button"
              onClick={() => setStarted(true)}
              aria-label={ARIA_LABEL}
              className="group relative block h-full w-full cursor-pointer"
            >
              <img src={POSTER} alt="" className="h-full w-full object-cover" />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-navy/70 text-gold transition-colors group-hover:bg-gold/10">
                  <Play className="h-5 w-5" />
                </span>
              </span>
            </button>
          ) : (
            <video
              ref={video}
              src={FILM}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={ARIA_LABEL}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs font-light text-muted-foreground">
        Illustrative. Partner drones from bases near major ports are on our roadmap.
      </figcaption>
    </figure>
  );
}

export function SecondLookSection() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <Reveal className="text-center">
          <p className="text-eyebrow text-gold">A second look on demand</p>
          <h2 className="text-balance mt-6 text-3xl font-light leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            When HERA AI is not sure, it sends a closer look.
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="mt-12">
          <DroneFilmFrame />
        </Reveal>
      </div>
    </section>
  );
}
