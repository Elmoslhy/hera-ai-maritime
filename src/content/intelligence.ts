export const intelligenceHero = {
  eyebrow: "Intelligence in practice",
  headline: ["From a missing signal", "to a finding you can defend."],
  body: "Five maritime questions, worked step by step in HERA AI: what it noticed, what it collected, how it fused the sources and what the client receives.",
  primaryCta: "SEE THE USE CASES",
  secondaryCta: "DISCUSS YOUR USE CASE",
  tags: {
    matched: "AIS · IDENTITY MATCHED",
    dark: "NO AIS · ATTRIBUTED 0.91",
  },
};

export const intelligenceSteps = [
  { n: "01", title: "Detect", text: "HERA AI notices what is missing or out of pattern." },
  { n: "02", title: "Cue", text: "It works out which collection would answer the question." },
  { n: "03", title: "Collect", text: "The right sensor looks at the right place at the right time." },
  { n: "04", title: "Fuse", text: "Every source is reconciled against one vessel identity." },
  { n: "05", title: "Assess", text: "Indicators are scored, each with its evidence." },
  { n: "06", title: "Deliver", text: "The finding reaches the client's system, team or case file." },
];

export type SensorId = "ais" | "geo" | "sar" | "opt" | "tir" | "sea" | "reg";

export const sensors: { id: SensorId; label: string }[] = [
  { id: "ais", label: "Identity broadcast" },
  { id: "geo", label: "Independent geolocation" },
  { id: "sar", label: "All-weather imaging" },
  { id: "opt", label: "High-resolution imaging" },
  { id: "tir", label: "Heat and activity" },
  { id: "sea", label: "Sea state" },
  { id: "reg", label: "Registry and sanctions" },
];

export const useCasesSection = {
  eyebrow: "Mission walkthroughs",
  headline: ["Five investigations,", "step by step."],
  sensorsTitle: "SENSORS IN USE",
  receivesTitle: "What the client receives",
  disclaimer:
    "Scenarios are illustrative. Vessels, positions, times and scores are synthetic. They do not describe any client, vessel or operation.",
};

export type UseCase = {
  geo?: number;
  id: string;
  tag: string;
  question: string;
  audience: string;
  stages: { text: string; sensors: SensorId[] }[];
  finding: { tone: "alert" | "amber" | "cyan"; label: string; score: number; indicators: string[] };
  action: string;
  record: { type: string; evidence: string[]; sources: string[] };
};

export const useCases: UseCase[] = [
  {
    id: "dark-transfer",
    tag: "DARK TRANSFER",
    question: "Did two ships meet to move cargo while one was dark?",
    audience: "Sanctions compliance, commodity analysts",
    stages: [
      { text: "Vessel A, a 183 m tanker, stops broadcasting near a known transfer area. Vessel B has loitered there for eleven hours.", sensors: ["ais"] },
      { text: "HERA AI computes where Vessel A could have reached and plans collection over that area, ranked by revisit, weather and light.", sensors: ["ais", "sea"] },
      { text: "A night pass through cloud finds two hulls 60 m apart. Independent geolocation places a radar emission on the same spot.", sensors: ["sar", "geo"] },
      { text: "Hull lengths match the registered particulars of both vessels.", sensors: ["sar", "reg"] },
      { text: "Dark transfer indicator, 82 of 100. Vessel B is one hop from a listed vessel.", sensors: ["reg", "geo", "sar"] },
      { text: "Vessel A reappears nine hours later, 2.1 m deeper. One record reaches the client with its full evidence chain.", sensors: ["ais"] },
    ],
    finding: { tone: "alert", label: "DARK TRANSFER INDICATOR", score: 82, indicators: ["AIS gap of nine hours near a transfer area", "Two hulls 60 m apart at night", "Radar emission geolocated on the same spot", "Counterpart one hop from a listed vessel", "Draught 2.1 m deeper on reappearance"] },
    action: "Hold the cargo for enhanced due diligence before settlement.",
    record: { type: "dark_transfer", evidence: ["ais_gap_9h", "sar_two_hulls_60m", "rf_emitter_colocated", "registry_one_hop_listed", "draught_delta_2.1m"], sources: ["AIS", "SAR", "RF", "Registry"] },
  },
  {
    id: "identity",
    tag: "IDENTITY",
    question: "Is this ship really where it says it is?",
    audience: "Port authorities, insurers, sanctions screening",
    stages: [
      { text: "Vessel C reports three days at anchor. Its positions are unnaturally steady and its flag disagrees with the registry.", sensors: ["ais", "reg"] },
      { text: "HERA AI requests independent geolocation instead of trusting the reported position.", sensors: ["geo"] },
      { text: "The transmitter is measured 34 km south-west of the reported position. Imaging confirms a hull there.", sensors: ["geo", "sar"] },
      { text: "No hull at the reported anchorage. The hull at sea matches Vessel C's length and beam.", sensors: ["opt", "sar", "reg"] },
      { text: "Identity risk 74 of 100: position divergence, flag mismatch, three flag changes in eighteen months.", sensors: ["geo", "reg"] },
      { text: "The screening result arrives 41 hours before the next port call.", sensors: ["reg"] },
    ],
    finding: { tone: "alert", label: "IDENTITY RISK", score: 74, indicators: ["Transmitter 34 km from reported position", "No hull at the reported anchorage", "Flag disagrees with the registry", "Three flag changes in eighteen months"] },
    action: "Request documents before berth allocation.",
    record: { type: "identity_risk", evidence: ["rf_position_divergence_34km", "imaging_no_hull_at_anchorage", "flag_mismatch", "flag_changes_3_in_18m"], sources: ["AIS", "RF", "SAR", "Optical", "Registry"] },
  },
  {
    id: "load-line",
    tag: "LOAD LINE",
    question: "Is this ship loaded deeper than its route allows?",
    audience: "P&I clubs, charterers, cargo underwriters",
    stages: [
      { text: "Vessel D leaves a loading terminal reporting 14.55 m draught, within its summer mark.", sensors: ["ais"] },
      { text: "HERA AI projects the route against load line zones and seasons. It enters a winter area in three days.", sensors: ["ais", "reg"] },
      { text: "Archive imaging confirms 31 hours alongside the loading terminal.", sensors: ["opt", "tir"] },
      { text: "Draught integrity 91 of 100. Cargo estimated at about 104,000 t, within 4%.", sensors: ["opt", "ais", "reg"] },
      { text: "The winter mark is 14.30 m. The vessel will be 0.25 m too deep for the zone it is entering.", sensors: ["reg", "ais"] },
      { text: "The alert reaches the insurer three days before the crossing.", sensors: ["reg"] },
    ],
    finding: { tone: "amber", label: "LOAD LINE INDICATOR", score: 91, indicators: ["Reported draught 14.55 m", "Winter mark 14.30 m on the projected route", "31 hours alongside the loading terminal", "Cargo estimate about 104,000 t, within 4%"] },
    action: "Ask the operator to confirm loading condition before the crossing.",
    record: { type: "load_line_exceedance", evidence: ["draught_14.55m", "winter_mark_14.30m", "alongside_31h", "cargo_est_104000t"], sources: ["AIS", "Optical", "Thermal", "Registry"] },
  },
  {
    id: "anchorage",
    tag: "ANCHORAGE",
    question: "How many ships are really waiting off this port?",
    audience: "Commodity and freight analysts",
    stages: [
      { text: "Forty-one vessels are broadcasting inside the anchorage.", sensors: ["ais"] },
      { text: "HERA AI schedules a daily all-weather image of the anchorage.", sensors: ["sar"] },
      { text: "The image shows 47 hulls. Six match no broadcast.", sensors: ["sar", "ais"] },
      { text: "Four silent hulls are attributed by length and last known track.", sensors: ["sar", "ais", "reg"] },
      { text: "Census: 47 at anchor, 45 identified, 2 reported as unattributed rather than guessed.", sensors: ["sar", "ais", "reg"] },
      { text: "A daily census with confidence per vessel feeds the analyst's flow model.", sensors: ["ais", "sar"] },
    ],
    finding: { tone: "cyan", label: "ANCHORAGE CENSUS", score: 96, indicators: ["47 hulls imaged, 41 broadcasting", "Four silent hulls attributed by length and track", "Two reported as unattributed", "Confidence given per vessel"] },
    action: "Adjust the congestion estimate in the flow model.",
    record: { type: "anchorage_census", evidence: ["sar_hulls_47", "ais_broadcasting_41", "attributed_silent_4", "unattributed_2"], sources: ["AIS", "SAR", "Registry"] },
  },
  {
    id: "pilot-boarding",
    tag: "PILOT BOARDING",
    question: "What should the pilot station expect?",
    audience: "Pilot organisations, port authorities",
    stages: [
      { text: "Vessel E is six hours from the boarding ground. In two of its last five boardings the pilot boat needed a second approach.", sensors: ["ais", "reg"] },
      { text: "HERA AI requests sea state at the boarding ground for the arrival window.", sensors: ["sea"] },
      { text: "Wave model and coastal buoy agree: 2.6 m from west-south-west, 9 second period.", sensors: ["sea"] },
      { text: "The swell sits on the boarding side. A lee needs about 40° of course change.", sensors: ["sea", "ais"] },
      { text: "Boarding risk 63 of 100: repeat approaches, a pilot transfer deficiency within twelve months, sea state above normal.", sensors: ["sea", "reg"] },
      { text: "The station receives the advisory six hours ahead, in time to brief the pilot and the boat crew.", sensors: ["ais"] },
    ],
    finding: { tone: "amber", label: "BOARDING RISK", score: 63, indicators: ["Second approach in two of five boardings", "Pilot transfer deficiency within twelve months", "Swell 2.6 m on the boarding side", "Lee needs about 40° of course change"] },
    action: "Agree the lee and boarding side with the master before arrival.",
    record: { type: "pilot_boarding_advisory", evidence: ["repeat_approaches_2_of_5", "transfer_deficiency_12m", "swell_2.6m_wsw_9s", "lee_course_change_40deg"], sources: ["AIS", "Sea state", "Registry"] },
  },
];

export const workspaceSection = {
  eyebrow: "Inside HERA AI",
  headline: ["One screen for the picture,", "the news and the answer."],
  body: "HERA AI fuses detections, keeps the operational picture and briefs you with Seker's own client-only intelligence alongside public news, each item linked to the vessels you watch. Ask a question in plain language and HERA AI answers with its sources.",
  frameTitle: "HERA AI · WORKSPACE PREVIEW",
  note: "Preview with synthetic vessels, briefs and news items.",
};

export type WsVessel = {
  id: string;
  chip: string;
  status: string;
  tone: "alert" | "amber";
  confidence: number;
  fields: { label: string; value: string; source: string }[];
};

export const wsVessels: WsVessel[] = [
  {
    id: "a",
    chip: "Vessel A",
    status: "DARK TRANSFER INDICATOR · 82",
    tone: "alert",
    confidence: 0.91,
    fields: [
      { label: "Identity", value: "IMO 9XXXXX4, tanker", source: "Registry + length match" },
      { label: "Length", value: "183 m ±6 m", source: "Imaging" },
      { label: "Last broadcast", value: "9 h 48 min ago", source: "AIS" },
      { label: "Transmitter", value: "0.4 km from hull", source: "Geolocation" },
    ],
  },
  {
    id: "u",
    chip: "Unattributed hull",
    status: "UNDER REVIEW",
    tone: "amber",
    confidence: 0.38,
    fields: [
      { label: "Identity", value: "Not attributed", source: "Registry + length match" },
      { label: "Length", value: "142 m ±8 m", source: "Imaging" },
      { label: "Last broadcast", value: "No broadcast matched", source: "AIS" },
      { label: "Transmitter", value: "Not detected", source: "Geolocation" },
    ],
  },
  {
    id: "c",
    chip: "Vessel C",
    status: "IDENTITY RISK 74",
    tone: "alert",
    confidence: 0.74,
    fields: [
      { label: "Identity", value: "Flag disagrees with registry", source: "Registry" },
      { label: "Length", value: "Matches registered length and beam", source: "Imaging" },
      { label: "Last broadcast", value: "Reports three days at anchor", source: "AIS" },
      { label: "Transmitter", value: "34 km from reported position", source: "Geolocation" },
    ],
  },
];

export const wsLayers = ["Vessels", "Dark detections", "Transfer areas", "Ports", "Incidents", "Sea state"] as const;

export const sekerBriefs = [
  { text: "Transfer activity in the eastern area rose for a third week. Fourteen encounters scored above 50, up from nine. Two involve vessels on your watchlist.", meta: "Weekly brief · 2 h ago", linked: 2 },
  { text: "Six silent arrivals at the eastern anchorage overnight. Four attributed by length and last known track. Two remain unattributed.", meta: "Daily census · 6 h ago", linked: 0 },
  { text: "Flag change ahead of a port call. A watched bulk carrier changed its broadcast flag 48 hours before arrival.", meta: "Alert · 1 day ago", linked: 1 },
];

export const publicNews = [
  { text: "New sanctions designations published.", did: "HERA AI re-screened every watched vessel within the hour. One now sits one hop from a listed vessel.", meta: "3 h ago", linked: 1 },
  { text: "Port authority extends anchorage limits as waiting times rise.", did: "Consistent with the HERA AI census: vessels at anchor up 20% on the week.", meta: "5 h ago", linked: 0 },
  { text: "Gale warning for the northern approaches.", did: "Two watched vessels are due at the pilot boarding ground inside the warning window.", meta: "8 h ago", linked: 2 },
];

export const askExamples = [
  { q: "Which watched vessels went dark this week?", a: "Three vessels on your watchlist had broadcast gaps longer than six hours. Vessel A, at 9 h 48 min, is linked to a dark transfer indicator scored 82. The other two gaps fall in areas of weak reception, so HERA AI gives them little weight.", sources: ["Encounter record", "Weekly brief", "Reception coverage"] },
  { q: "What changed in the sanctions picture today?", a: "Today's public designations added two vessels. After re-screening, no watched vessel is listed directly, but one is now one hop from a listed vessel through an encounter recorded in August.", sources: ["Public designations", "Encounter network", "Watchlist"] },
  { q: "Is the eastern anchorage getting busier?", a: "Yes. The census counts 47 vessels at anchor against 39 a week ago, and vessels not broadcasting rose from two to six. Four of the six are attributed.", sources: ["Anchorage census", "Daily brief"] },
];

export const askFallback = "In this preview HERA AI answers the example questions. Book a session to put your own question to it.";

export const taskingSection = {
  eyebrow: "Tasking and follow",
  headline: ["Task a satellite.", "Follow the vessel."],
  body: "Clients put a vessel under watch and task collection on it directly from HERA AI. HERA AI picks the source that answers the question soonest, then hands custody from one collection to the next as the vessel moves.",
  cards: [
    { title: "Signal geolocation", text: "Partner satellites locate where a vessel's transmissions really come from, whatever position it reports." },
    { title: "Partner constellations", text: "On-demand imaging from commercial constellations, requested, scheduled and checked through HERA AI." },
    { title: "Partner drones", text: "For the last mile, a partner drone launched from the nearest port approaches the vessel to document its name, draught marks and deck activity, where regulations permit." },
  ],
  consoleTitle: "WATCH · VESSEL A · AFTER DARK TRANSFER ALERT",
  nightHours: 5.5,
  cloud: [90, 85, 60, 30],
  nextTitle: "NEXT PASSES OVER VESSEL A",
};

export type PassStatus = "selected" | "standby" | "rejected";
export type Pass = { id: string; start: number; end?: number; status: PassStatus; reason: string };

export const taskingLanes: { name: string; passes: Pass[] }[] = [
  {
    name: "Signal geolocation",
    passes: [
      { id: "p08", start: 0.8, status: "selected", reason: "First look. Listening for transmissions narrows an 18 nm search area to 2 km, and heat sensing confirms activity in the dark." },
      { id: "p69", start: 6.9, status: "standby", reason: "Held in reserve to keep custody if the vessel moves before imaging." },
    ],
  },
  {
    name: "Partner all-weather imaging",
    passes: [
      { id: "p22", start: 2.2, status: "selected", reason: "Earliest pass that sees through cloud and darkness, covering the narrowed area." },
      { id: "p91", start: 9.1, status: "standby", reason: "Seven hours later than needed. Kept as backup." },
    ],
  },
  {
    name: "Partner high-res imaging",
    passes: [
      { id: "p36", start: 3.6, status: "rejected", reason: "Night and 85% cloud. The image would show nothing." },
      { id: "p103", start: 10.3, status: "selected", reason: "Daylight and 30% cloud. Confirms hull form and transfer equipment for the evidence pack." },
    ],
  },
  {
    name: "Long-endurance drone",
    passes: [
      { id: "d109", start: 3, end: 12, status: "selected", reason: "A long-endurance drone already on patrol is cued to the vessel and holds it in view until the evidence is complete: hull name, draught marks and deck activity." },
    ],
  },
];

export const deliveryCards = [
  { title: "API", text: "Every finding as a structured record keyed on IMO number, with sources, method version and confidence." },
  { title: "Alerts", text: "Signed notifications when a watched vessel crosses a threshold you set." },
  { title: "Evidence packs", text: "The full chain from first signal to final score, written for a case file, an underwriting decision or a regulator." },
];

export const closingCta = {
  headline: ["Bring us the question", "you cannot answer today."],
  button: "DISCUSS YOUR USE CASE",
};

export const cargoClaimCase: UseCase = {
  id: "cargo-claim",
  geo: 2,
  tag: "CARGO CLAIM",
  question: "Did the weather really damage this cargo?",
  audience: "Claims teams, cargo underwriters, P&I clubs",
  stages: [
    { text: "A cargo owner claims heavy-weather damage on a voyage last March. The vessel's log reports a severe storm on day six.", sensors: ["reg"] },
    { text: "HERA AI rebuilds the voyage from stored positions, draught reports and port calls, and pulls sea state for every hour of the route.", sensors: ["ais", "sea", "reg"] },
    { text: "Sea state on day six peaked at 3.1 m, well below the storm described in the log. The vessel held 13 knots throughout.", sensors: ["sea", "ais"] },
    { text: "The track shows an unreported 19-hour stop at an anchorage, and the draught fell by 0.6 m during that stop.", sensors: ["ais", "geo"] },
    { text: "Voyage inconsistency indicator, 77 of 100: weather below the reported severity, an undeclared stop and an unexplained draught change.", sensors: ["ais", "sea", "reg"] },
    { text: "The reconstruction, with every source and time stamp, reaches the claims handler before the adjuster is appointed.", sensors: ["reg"] },
  ],
  finding: { tone: "amber", label: "VOYAGE INCONSISTENCY INDICATOR", score: 77, indicators: ["Sea state on day six peaked at 3.1 m", "Vessel held 13 knots throughout", "Unreported 19-hour stop at an anchorage", "Draught fell by 0.6 m during the stop"] },
  action: "Instruct a surveyor and request the deck log for the stop.",
  record: { type: "voyage_inconsistency", evidence: ["sea_state_peak_3.1m", "speed_13kn", "undeclared_stop_19h", "draught_change_0.6m"], sources: ["AIS", "Sea state", "Registry"] },
};

export const originCase: UseCase = {
  id: "origin",
  geo: 0,
  tag: "ORIGIN",
  question: "Where did this cargo really load?",
  audience: "Analysts, trade compliance, refiners",
  stages: [
    { text: "A tanker discharges at a refinery with papers declaring a cargo loaded from another tanker at sea.", sensors: ["ais", "reg"] },
    { text: "HERA AI walks the tanker's history back through every encounter and dark period over 60 days.", sensors: ["ais", "reg"] },
    { text: "Thirty-one days earlier, the tanker went dark for 52 hours near an export terminal. Independent geolocation placed it alongside the terminal.", sensors: ["geo", "ais"] },
    { text: "Draught rose by 5.8 m during the dark period. A later transfer at sea moved part of the cargo to a second tanker.", sensors: ["ais", "sar"] },
    { text: "Origin indicator, 79 of 100: the cargo most likely loaded at the terminal, not at sea. The second tanker inherits the same flag.", sensors: ["ais", "geo", "reg"] },
    { text: "Both cargoes enter the STS Ledger, and the terminal's export estimate is revised upward.", sensors: ["reg"] },
  ],
  finding: { tone: "amber", label: "ORIGIN INDICATOR", score: 79, indicators: ["52-hour dark period near an export terminal", "Independent geolocation alongside the terminal", "Draught rose by 5.8 m while dark", "Part of the cargo moved to a second tanker at sea"] },
  action: "Treat both cargoes as high-risk origin in compliance checks and flow models.",
  record: { type: "origin_indicator", evidence: ["dark_52h", "geo_alongside_terminal", "draught_rise_5.8m", "sts_transfer"], sources: ["AIS", "Geolocation", "SAR", "Registry"] },
};

export const preArrivalCase: UseCase = {
  id: "pre-arrival",
  geo: 1,
  tag: "PRE-ARRIVAL",
  question: "Is the declared voyage true?",
  audience: "Port security, port state control",
  stages: [
    { text: "A product tanker sends its pre-arrival notice, declaring its last ten port calls.", sensors: ["reg"] },
    { text: "HERA AI compares the list with the port calls it observed over the same period.", sensors: ["ais", "reg"] },
    { text: "It finds a three-day broadcast gap that matches the time needed to reach and leave an undeclared terminal.", sensors: ["ais"] },
    { text: "Independent geolocation and draught confirm a call at that terminal: draught rose 4.1 m during the gap.", sensors: ["geo", "ais"] },
    { text: "Declaration mismatch indicator, 81 of 100: one undeclared call, consistent with loading.", sensors: ["geo", "ais", "reg"] },
    { text: "The Pre-Arrival Sheet reaches the port security officer within an hour of the notice, 23 hours before arrival.", sensors: ["reg"] },
  ],
  finding: { tone: "alert", label: "DECLARATION MISMATCH INDICATOR", score: 81, indicators: ["Three-day broadcast gap", "Gap matches a call at an undeclared terminal", "Independent geolocation at the terminal", "Draught rose 4.1 m during the gap"] },
  action: "Request the cargo documents and the ship's log before berth allocation.",
  record: { type: "declaration_mismatch", evidence: ["ais_gap_72h", "geo_at_terminal", "draught_rise_4.1m", "undeclared_call_1"], sources: ["AIS", "Geolocation", "Registry"] },
};

export const transshipmentCase: UseCase = {
  id: "transshipment",
  geo: 0,
  tag: "TRANSSHIPMENT",
  question: "Did this catch change hands at sea?",
  audience: "Fisheries regulators, patrols, seafood importers",
  stages: [
    { text: "A longliner fishing on the high seas stops broadcasting for 14 hours near a carrier vessel's track.", sensors: ["ais"] },
    { text: "HERA AI computes where both vessels could have reached and requests independent geolocation and an all-weather pass.", sensors: ["ais", "geo", "sar"] },
    { text: "The pass shows two hulls side by side for at least four hours, 30 m apart.", sensors: ["sar", "geo"] },
    { text: "The longliner's landing declaration reports no transshipment. The carrier calls at a port two days later.", sensors: ["reg", "ais"] },
    { text: "Transshipment indicator, 84 of 100. The longliner's last three trips show the same pattern.", sensors: ["sar", "geo", "ais", "reg"] },
    { text: "The Transshipment Register entry and a Trip Origin Report reach the regulator before the landing is certified.", sensors: ["reg"] },
  ],
  finding: { tone: "alert", label: "TRANSSHIPMENT INDICATOR", score: 84, indicators: ["14-hour broadcast gap near a carrier track", "Two hulls 30 m apart for at least four hours", "Landing declaration reports no transshipment", "Same pattern on the last three trips"] },
  action: "Hold certification of the catch pending inspection of both vessels.",
  record: { type: "transshipment_indicator", evidence: ["ais_gap_14h", "sar_two_hulls_30m", "declaration_no_transshipment", "pattern_3_trips"], sources: ["AIS", "Geolocation", "SAR", "Registry"] },
};

export const collectsSection = {
  eyebrow: "How HERA AI collects",
  rows: [
    { label: "ON HERA AI ITSELF", text: "Broadcast identity from coastal and satellite AIS networks; registry, ownership and sanctions reference; every derived indicator." },
    { label: "THROUGH PARTNERS, ON REQUEST", text: "Satellite signal geolocation, all-weather and high-resolution imaging, and close-range drones where regulations permit." },
  ],
};

export const cableCorridorCase: UseCase = {
  id: "cable-corridor",
  geo: 1,
  tag: "CABLE CORRIDOR",
  question: "Is that vessel dragging its anchor over our cable?",
  audience: "Navies, coast guards, infrastructure operators",
  stages: [
    { text: "A bulk carrier crossing a cable corridor slows from 11 knots to 1.4 knots and begins a slow zigzag along the cable route.", sensors: ["ais"] },
    { text: "HERA AI matches the track against the corridor and requests partner geolocation and an all-weather pass.", sensors: ["ais", "geo", "sar"] },
    { text: "The vessel stops broadcasting for 47 minutes. Geolocation keeps its position, and imaging shows the hull on the corridor.", sensors: ["geo", "sar"] },
    { text: "Track and speed match a dragging pattern along 9 km of the corridor. The registry shows a change of owner two months ago.", sensors: ["ais", "geo", "reg"] },
    { text: "Corridor risk indicator, 88 of 100.", sensors: ["ais", "geo", "sar", "reg"] },
    { text: "The record, with track, speed trace and imagery, reaches the operations centre while the vessel is still in your waters.", sensors: ["reg"] },
  ],
  finding: { tone: "alert", label: "CORRIDOR RISK INDICATOR", score: 88, indicators: ["Speed fell from 11 kn to 1.4 kn on the corridor", "Zigzag track along 9 km of the cable route", "47-minute broadcast gap, position kept by geolocation", "Change of owner two months ago"] },
  action: "Consider an inspection before the vessel leaves territorial waters.",
  record: { type: "corridor_risk", evidence: ["speed_11_to_1.4kn", "dragging_track_9km", "ais_gap_47min", "owner_change_2mo"], sources: ["AIS", "Geolocation", "SAR", "Registry"] },
};

export const darkTransferDefenseCase: UseCase = {
  ...useCases.find((c) => c.id === "dark-transfer")!,
  id: "dark-transfer-defense",
  geo: 0,
  question: "Did two vessels make an unreported transfer in our waters while one was dark?",
  audience: "Maritime operations centres, coast guards",
};
