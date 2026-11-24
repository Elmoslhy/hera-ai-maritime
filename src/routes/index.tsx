import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import homeCss from "@/components/seker/home/home.css.txt?raw";
import homeHtml from "@/components/seker/home/home.html.txt?raw";
import homeJs from "@/components/seker/home/home.js.txt?raw";

const TITLE = "SEKER | Independent maritime intelligence";
const DESCRIPTION =
  "The truth about every ship at sea: who it is, who owns it, where it has been and what it is doing. Checked against independent data, with a confidence score on every answer.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    try {
      new Function(homeJs)();
    } catch (e) {
      console.error("Homepage script failed", e);
    }
  }, []);
  return (
    <div className="seker-home">
      <style dangerouslySetInnerHTML={{ __html: homeCss }} />
      <div dangerouslySetInnerHTML={{ __html: homeHtml }} />
    </div>
  );
}
