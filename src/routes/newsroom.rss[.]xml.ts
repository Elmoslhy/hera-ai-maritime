import { createFileRoute } from "@tanstack/react-router";
import { newsroom, publishedNews, SITE_URL } from "@/content/newsroom";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/newsroom/rss.xml")({
  server: {
    handlers: {
      GET: () => {
        const items = publishedNews()
          .map((n) => {
            const link = `${SITE_URL}/newsroom/${n.slug}`;
            return `<item><title>${esc(n.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${new Date(n.date + "T00:00:00Z").toUTCString()}</pubDate><description>${esc(n.summary)}</description></item>`;
          })
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Seker Space Intelligence Newsroom</title><link>${SITE_URL}/newsroom</link><description>${esc(newsroom.hero.subheading)}</description>${items}</channel></rss>`;
        return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
      },
    },
  },
});
