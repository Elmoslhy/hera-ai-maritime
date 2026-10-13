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
  capabilities: { title: string; text: string; roadmap?: boolean }[];
  blocks: { label: string; title: string; text: string; bullets: string[]; image: string; alt: string }[];
  useCaseIds: string[];
  roadmapNote: string;
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
      { title: "Vessel follow", text: "Keep custody of a vessel from one pass, or one drone flight, to the next.", roadmap: true },
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
    headline: ["Price the risk", "the vessel is actually running."],
    body: "HERA AI shows insurers what a vessel has done, not only what it declared: dark periods, encounters, identity changes and loading beyond its marks.",
    heroImage: network,
    statement: { title: "Underwrite on evidence.", body: "Declarations tell you what a vessel says it did. HERA AI tells you what it was observed doing, with the source behind every finding." },
    capabilities: [{ title: "Load line and draught checks", text: "Draught against the permitted mark for zone and season." }, { title: "Sanctions exposure", text: "Encounters with listed vessels, direct or one hop away." }, { title: "Identity and flag history", text: "Name, flag and owner changes over time." }, { title: "Inspection record", text: "Port state control findings linked to each vessel." }, { title: "Fleet screening", text: "Every insured vessel screened daily." }, { title: "Claims evidence packs", text: "The full chain behind a finding, ready for a dispute." }],
    blocks: [{ label: "THE QUESTION", title: "Is this risk what the proposal says it is?", text: "Sanctions exposure, unsafe loading and identity games can sit behind declarations that look clean.", bullets: ["Encounters with listed vessels.", "Loading beyond the mark for the route.", "Repeated changes of flag and name."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "Behaviour, scored and sourced", text: "HERA AI screens the fleet you insure and scores indicators with their evidence, so underwriting and claims teams see why, not only what.", bullets: ["Load line status per zone and season.", "Draught integrity checked before any warning.", "Missing data shown as not verified, never as compliant."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Inside the underwriting workflow", text: "Results arrive where your teams already work.", bullets: ["Fleet screening by API.", "Alerts on watched vessels.", "Evidence packs for claims."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["load-line", "identity", "dark-transfer"],
    roadmapNote: "Task imaging on an insured vessel after an alert, so the evidence pack is complete.",
  },
  {
    slug: "commodity-trading",
    navName: "Commodity trading",
    description: "Read the flows that declarations miss.",
    eyebrow: "Commodity trading",
    headline: ["Read the flows", "the declarations miss."],
    body: "HERA AI counts the ships that are really waiting, estimates what they carry and flags the transfers that move cargo out of sight.",
    heroImage: vessels,
    statement: { title: "Trade on what is really at sea.", body: "Flow models built on broadcasts undercount the vessels that go silent. HERA AI adds them back, with stated confidence." },
    capabilities: [{ title: "Anchorage census", text: "Every hull counted, broadcasting or not." }, { title: "Cargo estimates", text: "Estimated from draught, with a stated range." }, { title: "Dark transfer indicators", text: "Cargo moved at sea, out of sight." }, { title: "Port call reconstruction", text: "Loading and discharge inferred from behaviour." }, { title: "Seker briefs", text: "Client-only weekly and daily intelligence." }, { title: "Data feeds", text: "Records that drop straight into your models." }],
    blocks: [{ label: "THE QUESTION", title: "How much is really moving, and where?", text: "Silent arrivals and transfers at sea distort the picture your positions are priced on.", bullets: ["Silent arrivals at key anchorages.", "Transfers that relocate cargo.", "Draught changes that reveal loading."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "Counts and estimates you can audit", text: "Every vessel in a census carries its attribution confidence, and every cargo estimate carries its method and range.", bullets: ["Hull detections matched to identities.", "Cargo estimated from draught.", "Unattributed vessels reported, never guessed."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Straight into your flow models", text: "Daily feeds and briefs, built for analysts.", bullets: ["Daily census and encounter feeds.", "Client-only Seker briefs.", "API records with full provenance."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["anchorage", "dark-transfer"],
    roadmapNote: "Task a collection over any anchorage or chokepoint you trade on.",
  },
  {
    slug: "ports",
    navName: "Ports and maritime authorities",
    description: "See every arrival before it reaches the pilot station.",
    eyebrow: "Ports and maritime authorities",
    headline: ["See every arrival", "before it reaches the pilot station."],
    body: "HERA AI tells port authorities and pilot organisations who is arriving, whether their identity holds up, and what to expect at the boarding ground.",
    heroImage: ports,
    statement: { title: "Safer arrivals start offshore.", body: "The best time to question an arrival is hours before it reaches the boarding ground." },
    capabilities: [{ title: "Arrival screening", text: "Identity and flag checked before berth allocation." }, { title: "Pilot boarding risk", text: "Each arrival scored before the pilot leaves the station." }, { title: "Sea state at the boarding ground", text: "Wave height, period and direction for the arrival window." }, { title: "Anchorage congestion", text: "Every vessel waiting, broadcasting or not." }, { title: "Inspection record", text: "Pilot transfer deficiencies linked to each vessel." }, { title: "Watched areas", text: "Alerts on approaches and anchorages." }],
    blocks: [{ label: "THE QUESTION", title: "What is coming, and is it safe to board?", text: "Pilot boarding is one of the most dangerous moments at sea, and most of the risk is knowable in advance.", bullets: ["Identity before berth allocation.", "Boarding history and transfer deficiencies.", "Sea state for the arrival window."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "A risk score for each arrival", text: "HERA AI compares each boarding with the station's normal and checks the planned approach against the swell.", bullets: ["Boarding duration against the station baseline.", "Lee and boarding side against the swell.", "Inspection record for each vessel."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Hours before arrival", text: "Advisories reach the station in time to brief the pilot and the boat crew.", bullets: ["Advisories before arrival.", "Alerts on watched vessels.", "API into port systems."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["pilot-boarding", "identity", "anchorage"],
    roadmapNote: "Send a close-range drone to document a vessel at anchor before it berths.",
  },
  {
    slug: "fisheries",
    navName: "Fisheries and environment",
    description: "Protect what lies under the surface.",
    eyebrow: "Fisheries and environment",
    headline: ["Protect what lies", "under the surface."],
    body: "HERA AI flags fishing activity inside protected and closed areas, and the meetings at sea where catch changes hands out of sight.",
    heroImage: fisheries,
    statement: { title: "Enforcement needs evidence.", body: "A fishing vessel that switches off inside a protected area leaves no broadcast trail. HERA AI looks for what remains." },
    capabilities: [{ title: "Protected area watch", text: "Alerts inside closed and protected areas." }, { title: "Dark fishing indicators", text: "Broadcast gaps where fishing patterns stop and start." }, { title: "Transshipment encounters", text: "Meetings with carrier vessels at sea." }, { title: "Fleet identity checks", text: "Flag, name and MMSI history for fishing fleets." }, { title: "Patrol prioritisation", text: "Ranked lists of vessels worth a look." }, { title: "Evidence packs", text: "The chain behind each case." }],
    blocks: [{ label: "THE QUESTION", title: "Who is fishing where they should not?", text: "Closed areas only work if someone can see who enters them.", bullets: ["Broadcast gaps inside protected areas.", "Loitering typical of fishing.", "Meetings with carrier vessels."], image: vessels, alt: "Vessels at sea seen from orbit" }, { label: "HOW HERA AI ANSWERS", title: "Patterns, positions and identities", text: "HERA AI scores encounters and silent periods, and measures position independently of what the vessel reports.", bullets: ["Encounters scored by duration, distance and location.", "Independent position for silent vessels.", "Identity history across flags and names."], image: network, alt: "Satellite network above the Earth" }, { label: "HOW IT REACHES YOU", title: "Built for patrol planning", text: "Results arrive ranked, so scarce patrols go where they matter.", bullets: ["Prioritised lists for patrols.", "Alerts on watched areas.", "Evidence packs for enforcement."], image: heraUi, alt: "HERA AI platform interface" }],
    useCaseIds: ["dark-transfer"],
    roadmapNote: "Task a pass or a drone over a protected area when a vessel goes dark inside it.",
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
