import ocean from "@/assets/ocean.jpg";
import vessels from "@/assets/vessels.jpg";
import network from "@/assets/satellite-network.jpg";
import heraUi from "@/assets/hera-ui.jpg";

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
    slug: "maritime-security",
    navName: "Maritime security and coast guard",
    description: "Find the vessels that do not want to be seen.",
    eyebrow: "Maritime security and coast guard",
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
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
