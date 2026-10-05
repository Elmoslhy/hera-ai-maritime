// Newsroom content. Only status "published" items render anywhere.
export type NewsType = "Press release" | "News" | "Event";

export type NewsItem = {
  slug: string;
  type: NewsType;
  status: "published" | "draft";
  date: string;
  title: string;
  subtitle: string;
  summary: string;
  image: string;
  alt: string;
  dateline: string;
  body: string[];
  quote?: { text: string; author: string; role: string };
  cta?: { label: string; href: string };
};

export const newsroom = {
  hero: {
    heading: "Newsroom",
    subheading: "Announcements, milestones and resources for journalists, partners and investors.",
  },
  boilerplate: "Seker Space Intelligence is a Luxembourg maritime space company building European sovereign capability in maritime intelligence. Seker combines its own multi-sensor space payload with HERA AI, its AI-driven data-fusion platform, to deliver verified vessel intelligence to commercial and public institutions.",
  mediaContact: {
    label: "Media enquiries",
    email: "info@seker-space.com",
    subject: "Press enquiry",
    text: "For interviews, images or background information, write to us and we will reply promptly.",
  },
  factSheet: [
    {
      label: "Headquarters",
      value: "Luxembourg",
    },
    {
      label: "Focus",
      value: "European sovereign maritime intelligence",
    },
    {
      label: "Platform",
      value: "HERA AI, AI-driven maritime data fusion",
    },
    {
      label: "Space segment",
      value: "Multi-sensor payload in development",
    },
    {
      label: "Leadership",
      value: "Moustafa Elmoslhey, Founder and CEO",
    },
  ],
};

export const newsItems: NewsItem[] = [
  {
    slug: "seker-opens-six-engineering-roles",
    type: "Press release",
    status: "published",
    date: "2026-10-05",
    title: "Seker Space Intelligence opens six engineering roles in Luxembourg",
    subtitle: "The company is building the team that will deliver its first multi-sensor payload and scale HERA AI, its maritime intelligence platform.",
    summary: "Seker opens six senior roles across its space segment, platform and programme teams, all based in Luxembourg.",
    image: "/careers/hero.webp",
    alt: "Engineers in cleanroom suits integrating a compact satellite payload on an integration stand.",
    dateline: "LUXEMBOURG, 5 October 2026",
    body: [
      "Seker Space Intelligence, a Luxembourg maritime space company building European sovereign capability in maritime intelligence, today opened six senior engineering roles across its space segment, platform and programme teams.",
      "The roles are a VP of Engineering for the space segment, a Head of Engineering for payload delivery, a Payload Systems Engineer, an RF & Electronics Engineer, a Head of Platform Engineering for HERA AI, and a Programme Manager. All six are based in Luxembourg.",
      "The new team will take Seker's first multi-sensor payload from design to qualified flight hardware, and scale HERA AI, the company's AI-driven data-fusion platform, for the commercial and public institutions that rely on it.",
      "Candidates can find the roles at seker-space.com/careers and apply by email to info@seker-space.com, quoting the job ID in the subject line.",
    ],
    quote: {
      text: "Europe needs its own answer to maritime intelligence, and that answer has to be built by engineers who ship real hardware and real software. We are building a small, senior team in Luxembourg to deliver our first payload and to scale HERA AI for the institutions that rely on it.",
      author: "Moustafa Elmoslhey",
      role: "Founder and CEO, Seker Space Intelligence",
    },
    cta: {
      label: "View open roles",
      href: "/careers",
    },
  },
  {
    slug: "seker-at-luxembourg-venture-days-2026",
    type: "Event",
    status: "draft",
    date: "2026-10-05",
    title: "Seker to pitch at Luxembourg Venture Days 2026",
    subtitle: "Seker will present its approach to sovereign maritime intelligence in the space session on 14 October.",
    summary: "Seker pitches in the space session of the Luxembourg Venture Days pitching sessions on 14 October 2026.",
    image: "/careers/mission.webp",
    alt: "A small satellite in orbit above the ocean at dawn, with faint vessel wakes on the sea below.",
    dateline: "LUXEMBOURG, 5 October 2026",
    body: [
      "Seker Space Intelligence will pitch in the space session of the Luxembourg Venture Days pitching sessions on 14 October 2026.",
      "The company will present how it combines its own multi-sensor space payload with HERA AI, its AI-driven data-fusion platform, to give commercial and public institutions a verified picture of activity at sea.",
    ],
    cta: {
      label: "Contact us",
      href: "mailto:info@seker-space.com?subject=Luxembourg%20Venture%20Days",
    },
  },
];

export const SITE_URL = "https://hera-sea-spy.lovable.app";

export const publishedNews = (): NewsItem[] =>
  newsItems
    .filter((n) => n.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));

export const formatNewsDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
