# HERA AI Maritime

Brand:

	•	Background: #09121F (Deep Navy)
	•	Accent: #C9A84C (Antique Gold)
	•	Data/operational: #4dd9c0 (Cyan)
	•	Alert: #ff4d4d (Red)
	•	Fonts: Inter (body) + Space Mono (data/labels/monospace elements)

Assets to upload: hero-video.mp4, satellite-network.png, cubesat.png, ocean.png, vessels.png, hera-ui.png — use as full-screen backgrounds per section.

SECTION 1 — VIDEO HERO
Full-screen autoplay muted looped video (hero-video.mp4). Centered SEKER logo (orbital arc SVG above clean geometric wordmark) in white. Subtle dark overlay. Animated scroll indicator at bottom (mouse icon + chevrons). Nothing else. Cinematic silence.

SECTION 2 — LAUNCHING WITH HERA AI
Full-screen background: hera-ui.png (80% dark navy overlay). Centered text:

	•	Badge: “Space-Powered Intelligence · In Real Time · EU Sovereign”
	•	Headline: “Launching with HERA AI”
	•	Subline: “The verified maritime intelligence layer Europe has been waiting for.”
	•	Tag: “Launching 2026”

SECTION 3 — THE CONSTELLATION
Full-screen background: satellite-network.png. Dark overlay.

	•	Eyebrow: “The Constellation”
	•	Headline: “Every vessel signal. Fused in orbit. Delivered in real time.”
	•	Source chips row: AIS-T · AIS-S · SAR · RF · OPT · TIR · Proprietary Sensors

SECTION 4 — THE OCEAN
Full-screen background: ocean.png (moonlit dark sea). Minimal overlay.

	•	Eyebrow: “The Problem”
	•	Headline: “The dark sea is not dark to us.”
	•	Stat line: “$54B market · 18% CAGR · Zero EU sovereign providers today”

SECTION 5 — VESSEL SCANNING
Full-screen background: vessels.png. Dark overlay.

	•	Eyebrow: “HERA AI · Verified Maritime Data Layer”
	•	Headline: “We don’t track vessels. We know them.”
	•	Body: “Digital twin per vessel. Tamper-proof data (Blue Tick verified). Spoofing corrected. Minimum latency. Everywhere.”

SECTION 6 — THE PROBLEM
Dark navy section. Two-column layout.

Left column:

	•	Eyebrow: “The Problem”
	•	Headline: “Maritime intelligence is broken.”
	•	Sourced statement: “76% of all EU trade by weight moves by sea — yet a growing shadow fleet of over 3,300 vessels operates outside the system, moving billions in sanctioned cargo through AIS manipulation, GPS jamming, and identity fraud. The intelligence layer meant to stop this is fragmented, foreign-controlled, and failing.” — Eurostat 2024 · ANU/CEPR 2025 · Windward Q3 2025
	•	Three alert rows (red dot + monospace text):
	1.	“AIS Spoofing ×3 YoY — AIS tampering and GPS jamming are used to evade sanctions. Current platforms detect it slowly and incompletely.”
	2.	“$100B+ annual sanctions evasion — enforcement agencies have unlimited appetite for verified maritime intelligence. No adequate tool exists.”
	3.	“Zero EU sovereign providers — at any scale, in any jurisdiction, today.”

Right column — 4 animated count-up stat blocks:

	•	$54B — Global MDA market by 2030
	•	18% — Sector CAGR 2024–2030
	•	×3 — YoY growth in AIS spoofing
	•	Zero — EU sovereign providers today

SECTION 7 — HERA AI DASHBOARD
Full-width dark section. Centered headline: “We don’t track vessels. We know them.”

Top stats bar (4 columns, count-up animation on scroll):

	•	17,253 — Vessels Tracked
	•	23 (red) — Spoofs · 24h
	•	7,891 — Digital Twins Active
	•	104ms — Stream Latency P99

Below: two-column dashboard mockup:

Left — Live Map panel:
Tabs: LIVE MAP · SEKER-1 MISSION · FUSION
SVG map of Europe/Mediterranean with:

	•	Cyan dots (verified vessels) — dense cluster around Europe, Mediterranean, Atlantic
	•	Amber dots (pending)
	•	Red dots (spoofing)
	•	Popup: “SARAVA II · MMSI 211166830 · 0 kn · Verified”
	•	Legend: VERIFIED · PENDING · SPOOFING

Right — Digital Twin panel:
Tabs: TWIN · STREAM · API · DATA
Vessel card:

	•	Name: ANYTHING GOES IV · MMSI 229000804 · Bulk Carrier
	•	Confidence: 80.7%
	•	Blue Tick Verified badge
	•	Fields: Position 40.701, 13.958 · Speed 11.3 kn · IMO 9001033 · Course 228.1°
	•	Fusion sources: AIS-T · AIS-S · SAR · TIR (active/cyan) · RF · OPT (inactive) · Proprietary (gold)
	•	Event timeline: -2h 14m position verified · -1d 03h port call Rotterdam · -3d 08h AIS gap 47min (amber) · -7d ownership confirmed
	•	Risk: LOW (green)

Below dashboard — 3 feature cards:

	1.	Multi-source fusion — Every AIS stream cross-validated against ESA SAR, TIR, and optical imagery in real time.
	2.	Digital twin per vessel — Living intelligence object: identity, kinematics, behavioural baseline, anomaly history, sanctions risk. Updated every 4.2 seconds.
	3.	Blue Tick verification — Tamper-proof data. Spoofing corrected automatically. AIS gaps logged and context-scored. Minimum latency. Everywhere.

SECTION 8 — CONTACT
Clean centered section:

	•	Headline: “Get in touch.”
	•	Email (cyan, clickable): info@seker-space.com
	•	CTA button (gold): “Request Intelligence Brief →” → mailto:info@seker-space.com
	•	Fine print: “Strictly confidential · For discussion purposes only · Seker Space Intelligence S.A. is in formation · Luxembourg”

GLOBAL ELEMENTS:

Nav (fixed, transparent → dark on scroll):

	•	Left: SEKER logo SVG (white)
	•	Right: live UTC clock (Space Mono) + “● Coming Soon” (cyan, blinking dot)

Gold progress bar — 1.5px top of screen, tracks scroll position

Ken Burns effect — slow zoom on each image background when section activates

Parallax — subtle vertical shift on background images during scroll

Framer Motion — staggered fade-up reveal for text elements in each section

Footer: SEKER logo (gold, subtle) + “© 2026 Seker Space Intelligence S.A. · Luxembourg · seker-space.com”

No investor deck links. No funding amounts. No LSA/SnT/partner mentions. No founder bio.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/10aed053-9123-4140-aa62-054127d749db).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
