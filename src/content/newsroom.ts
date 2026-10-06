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
    slug: "seker-preselected-fit-4-start",
    type: "News",
    status: "published",
    date: "2026-10-06",
    title: "Seker got pre-selected for Fit 4 Start",
    subtitle: "Seker has been pre-selected for Fit 4 Start, Luxembourg's national acceleration programme for high-potential startups.",
    summary: "Seker has been pre-selected for Fit 4 Start, Luxembourg's national acceleration programme.",
    image: "/careers/mission.webp",
    alt: "A small satellite in orbit above the ocean at dawn, with faint vessel wakes on the sea below.",
    dateline: "LUXEMBOURG, 6 October 2026",
    body: [
      "Seker Space Intelligence has been pre-selected for Fit 4 Start, Luxembourg's national acceleration programme for high-potential startups.",
      "Being pre-selected for Fit 4 Start supports Seker's next phase as it builds European sovereign maritime intelligence, combining its own multi-sensor space payload with HERA AI, its AI-driven data-fusion platform.",
    ],
    cta: {
      label: "Contact us",
      href: "mailto:info@seker-space.com?subject=Fit%204%20Start",
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
