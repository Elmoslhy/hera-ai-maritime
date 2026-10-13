import ocean from "@/assets/ocean.jpg";
import vessels from "@/assets/vessels.jpg";
import network from "@/assets/satellite-network.jpg";
import heraUi from "@/assets/hera-ui.jpg";
import ports from "@/assets/ports.jpg";
import fisheries from "@/assets/fisheries.jpg";

export type Industry = {
  slug: string;
  navName: string;
  description: string;
  eyebrow: string;
  headline: [string, string];
  body: string;
  heroImage: string;
  statement: { title: string; body: string };
  capabilities: { title: string; text: string }[];
  blocks: { label: string; title: string; text: string; bullets: string[]; image: string; alt: string }[];
  useCaseIds: string[];
  roadmapNote: string;
  closing?: { headline: [string, string]; body?: string; button: string };
  rebuild?: {
    roles: { role: string; question: string }[];
    signature:
      | { kind: "flow"; title: string; weeks: { broadcast: number; corrected: number; floating: number }[]; summary: { label: string; value: string }[] }
      | { kind: "board"; title: string; rows: { vessel: string; eta: string; identity: string; lastPorts: string; risk: "LOW" | "MEDIUM" | "HIGH"; inspection: number; reasons: { label: string; text: string }[] }[] }
      | { kind: "origin"; title: string; trips: { name: string; confidence: string; track: string; checks: { label: string; value: string; tone: "cyan" | "amber" | "alert" }[] }[] }
      | { kind?: "lifecycle"; title: string; stages: { key: string; title: string; items: { label: string; value: string }[] }[] };
    missions: { title: string; need: string; hera: string; deliverable: string }[];
    deliverables: { name: string; cadence: string }[];
    deliverablesNote?: string;
    signatureFirst?: boolean;
    signatureAfterMissions?: boolean;
  };
};

export const industries: Industry[] = [
  {
    slug: "defense",
    navName: "Defense and coast guard",
    description: "Find the vessels that do not want to be seen.",
    eyebrow: "Defense and coast guard",
    headline: ["Know which hull is in your waters", "before it reaches them."],
    body: "HERA AI flags vessels that go dark, falsify their position or meet at sea, and tells your watch officers what it saw, from which source, and how sure it is.",
    heroImage: ocean,
    statement: {
      title: "Your watch deserves the full picture.",
      body: "A broadcast track shows only the vessels that choose to be seen. HERA AI adds the ones that do not.",
    },
    capabilities: [
      { title: "Dark vessel detection", text: "Broadcast gaps scored against reception coverage." },
      { title: "Identity and spoofing checks", text: "Reported positions tested against independent measurement." },
      { title: "Encounter indicators", text: "Meetings at sea scored by duration, distance and location." },
      { title: "Watched areas", text: "Alerts when vessels enter, loiter or go dark inside your zones." },
      { title: "Tip and cue", text: "HERA AI recommends the next collection that would answer the question." },
      { title: "Vessel follow", text: "Keep custody of a vessel from one pass, or one drone flight, to the next." },
    ],
    blocks: [
      {
        label: "THE QUESTION",
        title: "Who is out there that does not want to be seen?",
        text: "Patrol assets are scarce and the sea is large. Every hour spent checking a cooperative vessel is an hour not spent on the one that switched off.",
        bullets: ["Broadcast gaps inside watched areas.", "Loitering and rendezvous patterns.", "Changes of flag, name and MMSI."],
        image: vessels,
        alt: "Vessels at sea seen from orbit",
      },
      {
        label: "HOW HERA AI ANSWERS",
        title: "One vessel identity, every source behind it",
        text: "HERA AI reconciles broadcasts, independent geolocation and imaging against one identity anchored on the IMO number, and scores each indicator with its evidence.",
        bullets: [
          "Position measured independently of what the vessel claims.",
          "Hulls attributed by length and last known track.",
          "Every indicator shows its source and confidence.",
        ],
        image: network,
        alt: "Satellite network above the Earth",
      },
      {
        label: "HOW IT REACHES YOU",
        title: "Into the operations room, not another screen",
        text: "Findings arrive as alerts and structured records that plug into the systems your watch already uses.",
        bullets: ["Signed alerts on watched areas and vessels.", "API records keyed on IMO number.", "Evidence packs for case files."],
        image: heraUi,
        alt: "HERA AI platform interface",
      },
    ],
    useCaseIds: ["dark-transfer", "identity"],
    roadmapNote: "Task a satellite pass or a close-range drone on a vessel of interest, directly from HERA AI.",
  },
  {
    slug: "insurance",
    navName: "Insurance and P&I",
    description: "Underwrite on what a vessel actually did.",
    eyebrow: "Insurance and P&I",
    headline: ["Know the vessel", "behind the policy."],
    body: "HERA AI follows every insured vessel from bind to claim: where it really went, who it met, how it was loaded and whether it stayed inside its warranties.",
    heroImage: network,
    statement: { title: "Underwrite on evidence.", body: "Declarations tell you what a vessel says it did. HERA AI tells you what it was observed doing, with the source behind every finding." },
    capabilities: [{ title: "Load line and draught checks", text: "Draught against the permitted mark for zone and season." }, { title: "Sanctions exposure", text: "Encounters with listed vessels, direct or one hop away." }, { title: "Identity and flag history", text: "Name, flag and owner changes over time." }, { title: "Inspection record", text: "Port state control findings linked to each vessel." }, { title: "Fleet screening", text: "Every insured vessel screened daily." }, { title: "Claims evidence packs", text: "The full chain behind a finding, ready for a dispute." }],
    blocks: [{ label: "THE QUESTION", title: "Is this risk what the proposal says it is?", text: "Sanctions exposure, unsafe loading and identity games can sit behind declarations that look clean.", bullets: ["Encounters with listed vessels.", "Loading beyond the mark for the route.", "Repeated changes of flag and name."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "Behaviour, scored and sourced", text: "HERA AI screens the fleet you insure and scores indicators with their evidence, so underwriting and claims teams see why, not only what.", bullets: ["Load line status per zone and season.", "Draught integrity checked before any warning.", "Missing data shown as not verified, never as compliant."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Inside the underwriting workflow", text: "Results arrive where your teams already work.", bullets: ["Fleet screening by API.", "Alerts on watched vessels.", "Evidence packs for claims."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["cargo-claim", "load-line"],
    roadmapNote: "Task imaging on an insured vessel the moment an alert fires, so the file is complete before anyone asks.",
    rebuild: {
      roles: [
        { role: "Underwriter", question: "Should we write this risk, and at what rate?" },
        { role: "Sanctions compliance", question: "Has this voyage exposed us to a listed party?" },
        { role: "Claims handler", question: "What actually happened on this voyage?" },
        { role: "Portfolio manager", question: "How much of our book is in harm's way right now?" },
      ],
      signature: {
        title: "Policy lifecycle",
        stages: [
          { key: "AT BIND", title: "Vessel risk report", items: [{ label: "Identity", value: "Verified" }, { label: "Flag changes", value: "3 in 5 years" }, { label: "Detentions", value: "2 in 36 months" }, { label: "Encounter network score", value: "41" }] },
          { key: "DURING COVER", title: "Live alerts", items: [{ label: "Entered listed area", value: "Observed position, not broadcast" }, { label: "Dark period", value: "11 h" }, { label: "Encounter", value: "Vessel one hop from a listed party" }] },
          { key: "AT CLAIM", title: "Voyage reconstruction", items: [{ label: "Route", value: "Rebuilt from stored positions" }, { label: "Speed", value: "By hour" }, { label: "Sea state", value: "By hour" }, { label: "Port calls", value: "Listed" }, { label: "Draught changes", value: "Listed" }] },
        ],
      },
      missions: [
        { title: "Warranties and listed areas", need: "Know when an insured vessel enters a listed or excluded area, even with its transponder off.", hera: "Checks trading limits and listed areas against observed position, not only broadcast position.", deliverable: "Breach Notice" },
        { title: "Sanctions across the voyage", need: "Screen the whole voyage, not only the vessel at bind.", hera: "Checks every encounter, port call and dark period against listed vessels and terminals.", deliverable: "Voyage Sanctions Check" },
        { title: "Claims reconstruction", need: "Test a claim against what the vessel actually did.", hera: "Rebuilds route, speed, sea state, port calls and draught for any period you name.", deliverable: "Voyage Reconstruction" },
        { title: "Accumulation", need: "See how many insured hulls sit in one port or one storm track.", hera: "Counts your insured fleet by zone in near real time, including vessels not broadcasting.", deliverable: "Exposure Board" },
      ],
      deliverables: [
        { name: "Vessel Risk Report", cadence: "At bind, PDF and API" },
        { name: "Breach Notice", cadence: "Real time" },
        { name: "Voyage Sanctions Check", cadence: "Per voyage" },
        { name: "Voyage Reconstruction", cadence: "On request" },
        { name: "Exposure Board", cadence: "Live" },
      ],
    },
  },
  {
    slug: "commodity-trading",
    navName: "Commodity trading",
    description: "Read the flows that declarations miss.",
    eyebrow: "Commodity trading",
    headline: ["See the barrels", "before the statistics do."],
    body: "HERA AI turns vessel behaviour into flow data: what left, what is waiting, what is floating and what changed hands at sea, days before official figures arrive.",
    heroImage: vessels,
    statement: { title: "Trade on what is really at sea.", body: "Flow models built on broadcasts undercount the vessels that go silent. HERA AI adds them back, with stated confidence." },
    capabilities: [{ title: "Anchorage census", text: "Every hull counted, broadcasting or not." }, { title: "Cargo estimates", text: "Estimated from draught, with a stated range." }, { title: "Dark transfer indicators", text: "Cargo moved at sea, out of sight." }, { title: "Port call reconstruction", text: "Loading and discharge inferred from behaviour." }, { title: "Seker briefs", text: "Client-only weekly and daily intelligence." }, { title: "Data feeds", text: "Records that drop straight into your models." }],
    blocks: [{ label: "THE QUESTION", title: "How much is really moving, and where?", text: "Silent arrivals and transfers at sea distort the picture your positions are priced on.", bullets: ["Silent arrivals at key anchorages.", "Transfers that relocate cargo.", "Draught changes that reveal loading."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "Counts and estimates you can audit", text: "Every vessel in a census carries its attribution confidence, and every cargo estimate carries its method and range.", bullets: ["Hull detections matched to identities.", "Cargo estimated from draught.", "Unattributed vessels reported, never guessed."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Straight into your flow models", text: "Daily feeds and briefs, built for analysts.", bullets: ["Daily census and encounter feeds.", "Client-only Seker briefs.", "API records with full provenance."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["origin", "anchorage"],
    roadmapNote: "Task a collection over any terminal, anchorage or transfer hub you trade on.",
    rebuild: {
      roles: [
        { role: "Crude and products analyst", question: "How much is really leaving each terminal?" },
        { role: "Freight trader", question: "How tight is tonnage in this basin next week?" },
        { role: "Trade compliance", question: "Could this cargo carry a sanctioned origin?" },
        { role: "Quant researcher", question: "Is the signal stable enough to trade on?" },
      ],
      signature: {
        kind: "flow",
        title: "Flow monitor",
        weeks: [
          { broadcast: 9, corrected: 11, floating: 4 },
          { broadcast: 10, corrected: 12, floating: 5 },
          { broadcast: 8, corrected: 11, floating: 5 },
          { broadcast: 11, corrected: 13, floating: 6 },
          { broadcast: 10, corrected: 12, floating: 7 },
          { broadcast: 9, corrected: 12, floating: 7 },
          { broadcast: 11, corrected: 13, floating: 8 },
          { broadcast: 12, corrected: 14, floating: 8 },
        ],
        summary: [
          { label: "Loaded departures", value: "14" },
          { label: "Not broadcasting", value: "2" },
          { label: "Estimated volume", value: "About 11.6 million barrels" },
        ],
      },
      missions: [
        { title: "Export nowcast", need: "Read loadings days before customs data.", hera: "Detects loading from draught change at the berth and estimates volume for every departure.", deliverable: "Terminal Flow Feed" },
        { title: "Floating storage", need: "Know how much oil sits idle at sea.", hera: "Tracks laden tankers idle for more than 20 days with unchanged draught.", deliverable: "Floating Storage Index" },
        { title: "Hidden origin", need: "Know when a cargo's origin is being disguised.", hera: "Links transfers at sea, dark periods and earlier terminal visits into one chain of custody.", deliverable: "STS Ledger" },
        { title: "Congestion and freight", need: "Price freight on real waiting times.", hera: "Counts every vessel waiting, silent or not, and measures time from arrival to berth.", deliverable: "Waiting Time Index" },
      ],
      deliverables: [
        { name: "Terminal Flow Feed", cadence: "Daily, API and CSV" },
        { name: "Floating Storage Index", cadence: "Weekly" },
        { name: "STS Ledger", cadence: "Daily" },
        { name: "Waiting Time Index", cadence: "Daily" },
        { name: "Seker briefs", cadence: "Weekly, clients only" },
      ],
      deliverablesNote: "Every dataset ships with full history for backtesting, method versions and a confidence value on every record.",
    },
  },
  {
    slug: "ports",
    navName: "Ports and maritime authorities",
    description: "See every arrival before it reaches the pilot station.",
    eyebrow: "Ports and maritime authorities",
    headline: ["Know every ship", "before it asks for a berth."],
    body: "HERA AI checks each arrival against what it declared, scores the risk at the pilot boarding ground and keeps watch on the anchorage while ships wait.",
    heroImage: ports,
    statement: { title: "Safer arrivals start offshore.", body: "The best time to question an arrival is hours before it reaches the boarding ground." },
    capabilities: [{ title: "Arrival screening", text: "Identity and flag checked before berth allocation." }, { title: "Pilot boarding risk", text: "Each arrival scored before the pilot leaves the station." }, { title: "Sea state at the boarding ground", text: "Wave height, period and direction for the arrival window." }, { title: "Anchorage congestion", text: "Every vessel waiting, broadcasting or not." }, { title: "Inspection record", text: "Pilot transfer deficiencies linked to each vessel." }, { title: "Watched areas", text: "Alerts on approaches and anchorages." }],
    blocks: [{ label: "THE QUESTION", title: "What is coming, and is it safe to board?", text: "Pilot boarding is one of the most dangerous moments at sea, and most of the risk is knowable in advance.", bullets: ["Identity before berth allocation.", "Boarding history and transfer deficiencies.", "Sea state for the arrival window."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "A risk score for each arrival", text: "HERA AI compares each boarding with the station's normal and checks the planned approach against the swell.", bullets: ["Boarding duration against the station baseline.", "Lee and boarding side against the swell.", "Inspection record for each vessel."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Hours before arrival", text: "Advisories reach the station in time to brief the pilot and the boat crew.", bullets: ["Advisories before arrival.", "Alerts on watched vessels.", "API into port systems."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["pre-arrival", "pilot-boarding"],
    roadmapNote: "Send a close-range drone to document a ship at anchor before it berths.",
    rebuild: {
      signatureFirst: true,
      roles: [
        { role: "Port security officer", question: "Is this ship's declared history true?" },
        { role: "Pilot station", question: "Is it safe to board, and from which side?" },
        { role: "Harbour master", question: "Who is waiting, and who is dragging anchor?" },
        { role: "Port state control", question: "Which arrivals deserve an inspection?" },
      ],
      signature: {
        kind: "board",
        title: "Arrivals board",
        rows: [
          { vessel: "VESSEL F", eta: "06:40", identity: "VERIFIED", lastPorts: "MATCH", risk: "LOW", inspection: 5, reasons: [{ label: "IDENTITY", text: "Broadcast identity, registry and independent position agree." }, { label: "LAST PORTS", text: "All ten declared calls match observed calls." }, { label: "BOARDING RISK", text: "Clean boarding history. Swell on the planned lee is low." }, { label: "INSPECTION", text: "Good flag performance and a recent clean inspection." }] },
          { vessel: "VESSEL G", eta: "08:15", identity: "MISMATCH", lastPorts: "MATCH", risk: "MEDIUM", inspection: 2, reasons: [{ label: "IDENTITY", text: "Reported flag disagrees with the registry." }, { label: "LAST PORTS", text: "Declared calls match observed calls." }, { label: "BOARDING RISK", text: "One second approach in the last five boardings." }, { label: "INSPECTION", text: "Flag change in the last year and an inspection overdue." }] },
          { vessel: "VESSEL H", eta: "09:30", identity: "VERIFIED", lastPorts: "UNDECLARED CALL", risk: "LOW", inspection: 1, reasons: [{ label: "IDENTITY", text: "Identity confirmed by independent geolocation." }, { label: "LAST PORTS", text: "A three-day broadcast gap matches a call at an undeclared terminal." }, { label: "BOARDING RISK", text: "Calm sea state forecast for the arrival window." }, { label: "INSPECTION", text: "Undeclared call and a draught rise during the gap." }] },
          { vessel: "VESSEL J", eta: "11:05", identity: "VERIFIED", lastPorts: "MATCH", risk: "HIGH", inspection: 4, reasons: [{ label: "IDENTITY", text: "Identity confirmed." }, { label: "LAST PORTS", text: "Declared calls match observed calls." }, { label: "BOARDING RISK", text: "Pilot ladder deficiency recorded twice. Swell sits on the boarding side." }, { label: "INSPECTION", text: "Transfer deficiencies in the inspection record." }] },
          { vessel: "VESSEL K", eta: "13:50", identity: "VERIFIED", lastPorts: "MATCH", risk: "LOW", inspection: 6, reasons: [{ label: "IDENTITY", text: "Identity confirmed." }, { label: "LAST PORTS", text: "Declared calls match observed calls." }, { label: "BOARDING RISK", text: "Good boarding history and a sheltered approach." }, { label: "INSPECTION", text: "Young vessel with a strong inspection record." }] },
          { vessel: "VESSEL L", eta: "15:20", identity: "MISMATCH", lastPorts: "UNDECLARED CALL", risk: "MEDIUM", inspection: 3, reasons: [{ label: "IDENTITY", text: "Transmitter position differs from the reported position." }, { label: "LAST PORTS", text: "One observed call is missing from the declaration." }, { label: "BOARDING RISK", text: "Moderate swell in the arrival window." }, { label: "INSPECTION", text: "Behaviour indicators and an older hull raise priority." }] },
        ],
      },
      missions: [
        { title: "Pre-arrival check", need: "Verify declared last port calls before arrival.", hera: "Compares the pre-arrival declaration with the port calls it observed, including calls made while dark.", deliverable: "Pre-Arrival Sheet" },
        { title: "Pilot boarding", need: "Board safely, first time.", hera: "Scores each arrival on its boarding history, transfer deficiencies and sea state, and checks the lee.", deliverable: "Boarding Advisory" },
        { title: "Anchorage safety", need: "Spot a ship dragging anchor before it reaches another.", hera: "Watches anchored ships for drift as wind and sea rise, and counts silent arrivals.", deliverable: "Anchorage Watch" },
        { title: "Inspection targeting", need: "Inspect the ships most likely to fail.", hera: "Ranks arrivals by flag performance, age, inspection history and behaviour.", deliverable: "Inspection Priority List" },
      ],
      deliverables: [
        { name: "Pre-Arrival Sheet", cadence: "Per arrival, 48 hours ahead" },
        { name: "Boarding Advisory", cadence: "Per arrival, 6 hours ahead" },
        { name: "Anchorage Watch", cadence: "Live" },
        { name: "Inspection Priority List", cadence: "Daily" },
      ],
    },
  },
  {
    slug: "fisheries",
    navName: "Fisheries and environment",
    description: "Protect what lies under the surface.",
    eyebrow: "Fisheries and environment",
    headline: ["From the fishing ground", "to the plate."],
    body: "HERA AI follows fishing fleets where they work, where they meet carriers at sea and where their catch lands, so enforcement, regulators and seafood buyers can trust the origin.",
    heroImage: fisheries,
    statement: { title: "Enforcement needs evidence.", body: "A fishing vessel that switches off inside a protected area leaves no broadcast trail. HERA AI looks for what remains." },
    capabilities: [{ title: "Protected area watch", text: "Alerts inside closed and protected areas." }, { title: "Dark fishing indicators", text: "Broadcast gaps where fishing patterns stop and start." }, { title: "Transshipment encounters", text: "Meetings with carrier vessels at sea." }, { title: "Fleet identity checks", text: "Flag, name and MMSI history for fishing fleets." }, { title: "Patrol prioritisation", text: "Ranked lists of vessels worth a look." }, { title: "Evidence packs", text: "The chain behind each case." }],
    blocks: [{ label: "THE QUESTION", title: "Who is fishing where they should not?", text: "Closed areas only work if someone can see who enters them.", bullets: ["Broadcast gaps inside protected areas.", "Loitering typical of fishing.", "Meetings with carrier vessels."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "Patterns, positions and identities", text: "HERA AI scores encounters and silent periods, and measures position independently of what the vessel reports.", bullets: ["Encounters scored by duration, distance and location.", "Independent position for silent vessels.", "Identity history across flags and names."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Built for patrol planning", text: "Results arrive ranked, so scarce patrols go where they matter.", bullets: ["Prioritised lists for patrols.", "Alerts on watched areas.", "Evidence packs for enforcement."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["transshipment"],
    roadmapNote: "Task a pass or a drone over a protected area when a vessel goes dark inside it.",
    rebuild: {
      signatureAfterMissions: true,
      roles: [
        { role: "Fisheries patrol", question: "Which vessel do we board this week?" },
        { role: "Fisheries regulator", question: "Is this catch certificate consistent with the trip?" },
        { role: "Seafood importer", question: "Can we prove the origin of what we buy?" },
        { role: "Protected area manager", question: "Who entered the reserve, and how fast were they going?" },
      ],
      missions: [
        { title: "Zone incursions", need: "Know when foreign fleets fish inside your zone with transponders off.", hera: "Watches fleets that go dark at the zone boundary and measures their position independently.", deliverable: "Incursion Alert" },
        { title: "Transshipment", need: "See where catch changes hands at sea.", hera: "Scores meetings between fishing vessels and carriers by duration, distance and location.", deliverable: "Transshipment Register" },
        { title: "Catch origin", need: "Verify that a catch came from where it is declared.", hera: "Checks each trip's track, encounters and landing against the catch certificate.", deliverable: "Trip Origin Report" },
        { title: "Protected zone conduct", need: "Check speed limits and no-entry rules in protected zones.", hera: "Measures speed and presence inside each zone and reports breaches with the track.", deliverable: "Zone Compliance Report" },
      ],
      signature: {
        kind: "origin",
        title: "Catch origin check",
        trips: [
          {
            name: "TRIP 1 · CLEAN",
            confidence: "0.96",
            track: "M60,190 C90,150 120,140 150,120 S200,100 230,110 S270,140 250,165 S190,180 160,170",
            checks: [
              { label: "Fishing inside declared area", value: "MATCH", tone: "cyan" },
              { label: "Time in closed areas", value: "0 MIN", tone: "cyan" },
              { label: "Encounters with carriers", value: "0", tone: "cyan" },
              { label: "Identity consistent", value: "MATCH", tone: "cyan" },
              { label: "Landing port matches", value: "MATCH", tone: "cyan" },
            ],
          },
          {
            name: "TRIP 2 · FLAGGED",
            confidence: "0.64",
            track: "M60,190 C90,150 120,140 160,120 S240,60 290,55 S320,90 270,120 S200,160 170,170",
            checks: [
              { label: "Fishing inside declared area", value: "MATCH", tone: "cyan" },
              { label: "Time in closed areas", value: "2 H 10 MIN", tone: "amber" },
              { label: "Encounters with carriers", value: "1", tone: "alert" },
              { label: "Identity consistent", value: "MATCH", tone: "cyan" },
              { label: "Landing port matches", value: "MATCH", tone: "cyan" },
            ],
          },
        ],
      },
      deliverables: [
        { name: "Incursion Alert", cadence: "Real time" },
        { name: "Transshipment Register", cadence: "Daily" },
        { name: "Trip Origin Report", cadence: "Per trip, API and PDF" },
        { name: "Zone Compliance Report", cadence: "Monthly" },
      ],
    },
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
