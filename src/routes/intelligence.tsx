import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { Reveal, SectionBackground } from "@/components/seker/primitives";
import { UseCasesSection } from "@/components/seker/UseCases";
import { WorkspaceSection } from "@/components/seker/Workspace";
import { TaskingScreen } from "@/components/seker/TaskingMap";
import { AlertCards } from "@/components/seker/Insights";
import vessels from "@/assets/vessels.jpg";
import {
  intelligenceHero as h,
  closingCta,
  cableCorridorCase,
  cargoClaimCase,
  originCase,
  preArrivalCase,
  transshipmentCase,
} from "@/content/intelligence";

const TITLE = "HERA AI | SEKER";
const DESCRIPTION =
  "HERA AI brings every source on a ship into one profile, flags what does not add up and tells you what to do next.";

type Status = "live" | "built" | "dev";
const STATUS: Record<Status, { label: string; badge: string; dot: string; meaning: string }> = {
  live: { label: "LIVE", badge: "border-cyan/60 bg-cyan/10 text-cyan", dot: "bg-cyan", meaning: "Running today" },
  built: { label: "BUILT, GOING LIVE", badge: "border-gold/60 bg-gold/10 text-gold", dot: "bg-gold", meaning: "Tested, switching on as its data loads" },
  dev: { label: "IN DEVELOPMENT", badge: "border-muted-foreground/50 bg-muted-foreground/10 text-muted-foreground", dot: "bg-muted-foreground", meaning: "On our roadmap" },
};

function StatusBadge({ s, className = "" }: { s: Status; className?: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${STATUS[s].badge} ${className}`}>
      {STATUS[s].label}
    </span>
  );
}

const CAPS: [string, string, Status][] = [
  ["Vessel digital twin", "One profile per ship, with every name, flag and transponder number it has used.", "live"],
  ["Sanctions screening", "Five official lists from the US, UK, EU and Japan, with every version kept for audit.", "live"],
  ["Identity risk", "Flag hopping, renaming and shared identities, each shown with its evidence.", "live"],
  ["Track plausibility", "Reported movements checked against what a ship can physically do.", "live"],
  ["Evidence on every answer", "Sources, method and time on every result, and gaps shown with a reason.", "live"],
  ["Watched areas and alerts", "Draw an area or list a fleet, and get alerts as events happen.", "live"],
  ["Ask HERA AI and briefings", "Answers in plain language, with their sources shown.", "live"],
  ["API and data feeds", "The same intelligence as a feed, with its evidence attached.", "live"],
  ["Meetings at sea", "Ship-to-ship meetings, filtered and scored for review.", "built"],
  ["Network exposure", "Links to listed ships through meetings at sea.", "built"],
  ["Coverage gaps", "Gaps in reporting, judged against where receivers can hear.", "built"],
  ["Load line and cargo", "Draught against the permitted load line, with cargo inferred and labelled.", "built"],
  ["Flag-state profile", "Flag standing, conventions, certificates and detention history.", "built"],
  ["Pilot boarding risk", "What a pilot station should expect before a ship arrives.", "built"],
  ["Port calls and voyage replay", "Every port call detected and every voyage replayed.", "dev"],
  ["Satellite and drone tasking", "Send a satellite or a drone to take a second look.", "dev"],
];

const CASES = [
  { ...cableCorridorCase, tag: "Defense and coast guard" },
  { ...cargoClaimCase, tag: "Insurance and P&I" },
  { ...originCase, tag: "Commodity trading" },
  { ...preArrivalCase, tag: "Ports and maritime authorities" },
  { ...transshipmentCase, tag: "Fisheries and environment" },
];

function Chapter({ i, title, line, status, children }: { i: number; title: string; line: string; status: Status; children: React.ReactNode }) {
  const flip = i % 2 === 1;
  return (
    <section className={`px-6 py-20 ${flip ? "bg-navy-deep" : "bg-navy"}`}>
      <div className={`mx-auto grid max-w-7xl items-center gap-10 ${flip ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"}`}>
        <Reveal className={flip ? "lg:order-2" : ""}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.24em] text-gold">0{i + 1}</span>
            <StatusBadge s={status} />
          </div>
          <h2 className="text-balance mt-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="text-pretty mt-5 max-w-md text-base font-light text-foreground/75">{line}</p>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">{children}</Reveal>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntelligencePage,
});

function Reticle({
  className,
  tag,
  tone,
}: {
  className: string;
  tag: string;
  tone: "cyan" | "alert";
}) {
  const c = "absolute h-4 w-4 border-gold";
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      <div className="relative h-full w-full">
        <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
        <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
        <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
        <div
          className={`absolute left-0 top-full mt-2 flex items-center gap-2 whitespace-nowrap rounded-lg border border-white/10 bg-navy/70 px-2 py-1 font-mono text-[10px] tracking-[0.16em] backdrop-blur ${
            tone === "cyan" ? "text-cyan" : "text-alert"
          }`}
        >
          <span
            className={`blink-dot h-1.5 w-1.5 rounded-full ${tone === "cyan" ? "bg-cyan" : "bg-alert"}`}
          />
          {tag}
        </div>
      </div>
    </div>
  );
}

function IntelligencePage() {
  return (
    <div className="overflow-x-hidden bg-navy">
      <ScrollProgress />
      <Nav />
      <main>
        <section className="relative flex min-h-screen items-center px-6 py-32">
          <SectionBackground src={vessels} alt="Vessels at sea seen from orbit" overlay="bg-navy/65" />
          <Reticle className="left-[8%] top-[22%] h-16 w-20 sm:h-20 sm:w-28" tag={h.tags.matched} tone="cyan" />
          <Reticle className="right-[10%] bottom-[18%] h-16 w-20 sm:h-20 sm:w-28" tag={h.tags.dark} tone="alert" />
          <div className="relative mx-auto w-full max-w-7xl">
            <Reveal>
              <p className="text-eyebrow text-gold">HERA AI</p>
              <h1 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl">
                One platform.
                <br />
                <span className="text-gold">Every ship.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-balance text-lg font-light text-foreground/80">
                HERA AI brings every source on a ship into one profile, flags what does not add up and tells you what to do next.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#use-cases"
                  className="border border-gold/60 bg-gold/90 px-6 py-3 font-mono text-xs tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold"
                >
                  SEE THE USE CASES →
                </a>
                <Link
                  to="/"
                  hash="contact"
                  className="border border-gold/60 px-6 py-3 font-mono text-xs tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
                >
                  DISCUSS YOUR USE CASE
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-navy-deep px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <h2 className="text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">What HERA AI does.</h2>
              <p className="text-pretty mt-5 max-w-2xl text-base font-light text-muted-foreground">Every feature shows where it stands today.</p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {(Object.keys(STATUS) as Status[]).map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <StatusBadge s={s} />
                    <span className="text-sm font-light text-muted-foreground">{STATUS[s].meaning}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CAPS.map(([t, d, s], i) => (
                <Reveal key={t} delay={(i % 4) * 0.05}>
                  <div className="h-full rounded-lg border border-white/10 bg-navy/70 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`mt-1 block h-1.5 w-1.5 shrink-0 rounded-full ${STATUS[s].dot}`} />
                      <StatusBadge s={s} />
                    </div>
                    <h3 className="mt-4 text-lg font-light text-foreground">{t}</h3>
                    <p className="mt-2 text-sm font-light text-muted-foreground">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Chapter i={0} status="live" title="Sensor fusion" line="Every source on a ship, checked against the others, field by field.">
          <WorkspaceSection part="fusion" />
        </Chapter>
        <Chapter i={1} status="dev" title="Satellite and drone tasking" line="Put a ship under watch, and HERA AI will send the right satellite or drone to take a look.">
          <TaskingScreen />
        </Chapter>
        <Chapter i={2} status="live" title="Briefings and Ask HERA AI" line="Seker briefs and public news linked to your ships, and answers that show their sources.">
          <WorkspaceSection part="briefing" />
        </Chapter>
        <Chapter i={3} status="live" title="Alerts with a next step" line="Each warning arrives with what was seen and what to do about it.">
          <AlertCards />
        </Chapter>

        <UseCasesSection cases={CASES} eyebrow="Use cases" headline={["See it work.", ""]} />

        <section className="bg-navy-deep px-6 py-16 text-center">
          <Reveal>
            <p className="text-eyebrow text-gold">How you get it</p>
            <p className="mt-6 font-mono text-lg tracking-[0.24em] text-foreground sm:text-2xl">
              Platform <span className="text-gold">·</span> API <span className="text-gold">·</span> Briefings
            </p>
          </Reveal>
        </section>

        <section className="bg-navy px-6 py-28 text-center">
          <Reveal>
            <h2 className="text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">
              {closingCta.headline[0]}
              <br />
              <span className="text-gold">{closingCta.headline[1]}</span>
            </h2>
            <Link
              to="/"
              hash="contact"
              className="mt-10 inline-block border border-gold/60 bg-gold/90 px-6 py-3 font-mono text-xs tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold"
            >
              {closingCta.button} →
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
