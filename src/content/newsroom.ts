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
    slug: "seker-growing-fast-q4-2026",
    type: "News",
    status: "published",
    date: "2026-11-25",
    title: "Seker is growing fast, with new clients in Q4 2026",
    subtitle: "Seker is growing fast and has signed new clients in the fourth quarter of 2026, across trading, insurance, banking and the public sector.",
    summary: "Seker is growing fast and has signed new clients in Q4 2026.",
    image: "/careers/mission.webp",
    alt: "A small satellite in orbit above the ocean at dawn, with faint vessel wakes on the sea below.",
    dateline: "LUXEMBOURG, 25 November 2026",
    body: [
      "Seker Space Intelligence is growing fast, with new clients signed in the fourth quarter of 2026 across trading, insurance, banking and the public sector.",
      "The new clients use HERA AI, Seker's AI-driven data-fusion platform, for verified vessel intelligence, from identity checks and cargo verification to sanctions and risk monitoring.",
    ],
    cta: {
      label: "Contact us",
      href: "mailto:info@seker-space.com?subject=New%20clients%20Q4%202026",
    },
  },
];

export const SITE_URL = "https://seker-space.com";

export const publishedNews = (): NewsItem[] =>
  newsItems
    .filter((n) => n.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));

export const formatNewsDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
