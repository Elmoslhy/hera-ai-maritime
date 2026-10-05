export type JobSection = { heading: string; paragraphs?: string[]; bullets?: string[] };

export type Job = {
  id: string;
  slug: string;
  status: "open" | "closed";
  family: string;
  title: string;
  location: string;
  workArrangement: string;
  employmentType: string;
  reportsTo: string;
  datePosted: string;
  summary: string;
  sections: JobSection[];
};

export const careersIntro =
  "Seker Space Intelligence is a Luxembourg maritime space company building European sovereign capability in maritime intelligence. We combine our own multi-sensor space payload with HERA, our AI-driven data-fusion platform, to deliver verified vessel intelligence to commercial and public institutions. We are building the most advanced maritime engineering company in Europe — real hardware, real software, at global scale.";

export const applicantPrivacy =
  "By sending your application, you agree that Seker Space Intelligence processes your personal data for recruitment purposes only. We keep applications for 12 months, unless you ask us to delete yours sooner by writing to info@seker-space.com.";

export const speculative = {
  id: "SKR-GEN-000",
  title: "Speculative applications",
  text: "Do not see your role? If you build space hardware, data platforms or maritime intelligence products and want to work on European sovereign capability, send your CV to info@seker-space.com with the subject SKR-GEN-000 and the area you are interested in.",
};

export const jobFamilies = [
  { key: "SPC", name: "Space Segment Engineering", description: "Payload architecture, integration, verification and delivery to orbit." },
  { key: "PLT", name: "Platform Engineering", description: "HERA: data pipelines, fusion models, product and infrastructure." },
  { key: "PRG", name: "Programme Management", description: "Schedule, cost, risk and reporting across our programmes." },
  { key: "QAS", name: "Product Assurance & Safety", description: "Independent quality, safety and configuration control." },
  { key: "SEC", name: "Security & Compliance", description: "Information security, export control and regulatory compliance." },
  { key: "COM", name: "Commercial", description: "Sales, customer success, partnerships and marketing." },
  { key: "FIN", name: "Finance & Operations", description: "Finance, funding, people and legal." },
];

export const jobs: Job[] = [
  {
    id: "SKR-SPC-001",
    slug: "skr-spc-001",
    status: "open",
    family: "SPC",
    title: "VP of Engineering",
    location: "Luxembourg",
    workArrangement: "Hybrid. Candidates willing to relocate are welcome.",
    employmentType: "Full-time, permanent",
    reportsTo: "Chief Technology Officer",
    datePosted: "2026-10-05",
    summary:
      "Lead Seker's space segment, from the first hosted payload to the constellation that follows.",
    sections: [
      {
        heading: "The role",
        paragraphs: [
          "The VP of Engineering leads Seker's space segment, from the first hosted payload to the constellation that follows.",
          "You will own payload architecture, integration, verification and delivery, together with the technical relationship with host spacecraft operators and suppliers. A dedicated platform team owns the software and data-fusion chain. You are accountable for how the payload and that chain work together as one system.",
        ],
      },
      {
        heading: "What you will do",
        bullets: [
          "Own the architecture of a multi-sensor satellite payload, including its mass, power, thermal and data budgets.",
          "Manage radio-frequency compatibility and sensor coexistence, and close those risks by measurement before design freeze.",
          "Lead assembly, integration, test and verification, including the model philosophy, the test campaigns and the evidence required at each review gate.",
          "Plan and release long-lead procurement against frozen parameters, so that hardware arrives in time for integration.",
          "Define the next stage of the space segment beyond the first mission, including constellation and formation architecture.",
          "Build and lead a multidisciplinary engineering team in Luxembourg.",
          "Act as the company's technical lead in front of independent reviewers, institutional partners and investors.",
        ],
      },
      {
        heading: "What you bring",
        bullets: [
          "Senior engineering leadership in the space industry.",
          "Flight hardware you have delivered, taken through formal reviews to launch and commissioning.",
          "Hands-on AIT/AIV and environmental qualification experience (thermal vacuum, vibration, EMC).",
          "Working knowledge of ECSS standards and formal review processes.",
          "Systems engineering depth across requirements, budgets, interfaces and verification.",
          "Proven leadership of multidisciplinary engineering teams, and the ability to present credibly to institutional reviewers and partners.",
        ],
      },
      {
        heading: "Valued, not required",
        bullets: [
          "Multi-sensor payloads, commercial components in orbit, or hosted payload accommodation.",
          "Constellation or formation-flying design and operations.",
          "Maritime or Earth observation missions.",
          "Familiarity with the Luxembourg and European space ecosystem, including spectrum licensing.",
        ],
      },
      {
        heading: "What this role is not",
        paragraphs: [
          "This is not a software or machine-learning leadership role. It is also not a pure programme or procurement role: you will personally own the payload physics and the system budgets, not only manage the people who do.",
        ],
      },
      {
        heading: "What we offer",
        paragraphs: [
          "Real ownership of a space programme at a company building sovereign capability for Europe, in a small and senior team where your decisions shape the mission.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send your CV to info@seker-space.com with the subject SKR-SPC-001 VP of Engineering. Our process includes a written technical assessment and interviews with our leadership team.",
        ],
      },
    ],
  },
  {
    id: "SKR-SPC-002",
    slug: "skr-spc-002",
    status: "open",
    family: "SPC",
    title: "Head of Engineering, Payload Delivery",
    location: "Luxembourg",
    workArrangement: "Hybrid, with regular on-site presence for integration and test. Candidates willing to relocate are welcome.",
    employmentType: "Full-time, permanent",
    reportsTo: "VP of Engineering",
    datePosted: "2026-10-05",
    summary:
      "Turn our payload design into qualified flight hardware, and lead the hands-on team that builds and tests it.",
    sections: [
      {
        heading: "The role",
        paragraphs: [
          "The Head of Engineering turns our payload design into qualified flight hardware. You will lead the hands-on engineering team through detailed design, manufacturing, integration, test and delivery, working alongside the VP of Engineering, who owns the architecture and the space segment roadmap.",
        ],
      },
      {
        heading: "What you will do",
        bullets: [
          "Lead the detailed design and manufacturing of payload units across mechanical, electrical and thermal disciplines, with our engineers and suppliers.",
          "Plan and run integration and environmental qualification campaigns (vibration, thermal vacuum, EMC), including test procedures, facility bookings and test readiness.",
          "Manage suppliers technically, from specification through incoming inspection and hardware acceptance.",
          "Run nonconformance handling and configuration control, so that every build follows the approved baseline.",
          "Execute the verification plan and produce the evidence each review gate requires.",
          "Lead the engineering team day to day, and build the processes that make payload production repeatable as the constellation grows.",
        ],
      },
      {
        heading: "What you bring",
        bullets: [
          "Experience delivering space flight hardware through design, qualification and acceptance.",
          "Hands-on leadership of AIT campaigns and environmental qualification (vibration, thermal vacuum, EMC).",
          "Working knowledge of ECSS standards, including verification, product assurance and configuration management.",
          "Proven leadership of engineers and technicians in a hardware delivery environment.",
          "Technical management of suppliers and hardware acceptance.",
        ],
      },
      {
        heading: "Valued, not required",
        bullets: [
          "Exposure to payload electronics, radio-frequency hardware or electromagnetic compatibility.",
          "Small satellite or hosted payload experience.",
          "Moving hardware from prototype to repeatable production.",
          "Eligibility for security clearance.",
        ],
      },
      {
        heading: "What this role is not",
        paragraphs: [
          "This is not a software role, and it is not a programme management role. It is a hands-on engineering leadership seat: you will be in the integration room when it matters.",
        ],
      },
      {
        heading: "What we offer",
        paragraphs: [
          "The chance to build the flight hardware for a first-of-its-kind European payload, and to set up how Seker builds hardware for years to come, in a small and senior team.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send your CV to info@seker-space.com with the subject SKR-SPC-002 Head of Engineering. Our process includes a written technical assessment and interviews with our leadership team.",
        ],
      },
    ],
  },
  {
    id: "SKR-SPC-003",
    slug: "skr-spc-003",
    status: "open",
    family: "SPC",
    title: "Payload Systems Engineer",
    location: "Luxembourg",
    workArrangement: "Hybrid. Candidates willing to relocate are welcome.",
    employmentType: "Full-time, permanent",
    reportsTo: "VP of Engineering, Space Segment",
    datePosted: "2026-10-05",
    summary: "Own the requirements, budgets and interfaces that hold a multi-sensor payload together, from first design to flight.",
    sections: [
      {
        heading: "The role",
        paragraphs: [
          "The Payload Systems Engineer is the systems backbone of our payload. You own the requirements, the mass, power, thermal and data budgets, the interface with the host spacecraft and the verification matrix, and you make sure every design decision closes against them.",
        ],
      },
      {
        heading: "What you will do",
        bullets: [
          "Derive and maintain payload requirements, from mission objectives down to unit specifications.",
          "Own the mass, power, thermal, data and pointing budgets, with margins that hold through every review.",
          "Prepare and negotiate the interface control document with the host spacecraft operator.",
          "Build and run the verification matrix, linking each requirement to its test, analysis, inspection or review.",
          "Lead trade-offs across instruments, processing and accommodation, and record the decisions and their rationale.",
          "Prepare the systems evidence for the preliminary and critical design reviews.",
          "Work with our platform team so that payload data arrives on the ground ready to use.",
        ],
      },
      {
        heading: "What you bring",
        bullets: [
          "Systems engineering experience on space missions, ideally at payload or instrument level.",
          "Hands-on ownership of technical budgets and interface control documents.",
          "Requirements management and verification planning, for example under the ECSS-E-ST-10 series.",
          "Comfort working across mechanical, electrical, radio-frequency and software disciplines.",
          "Clear technical writing for formal reviews.",
        ],
      },
      {
        heading: "Valued, not required",
        bullets: [
          "Multi-sensor or hosted payloads.",
          "Model-based systems engineering tools.",
          "Small satellite missions.",
          "Earth observation or maritime missions.",
        ],
      },
      {
        heading: "What this role is not",
        paragraphs: [
          "This is not a desk role far from the hardware. You will be in design reviews, test campaigns and supplier meetings, and your budgets will decide what flies.",
        ],
      },
      {
        heading: "What we offer",
        paragraphs: [
          "Systems ownership of a first-of-its-kind European payload, in a small and senior team where your numbers drive real decisions.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send your CV to info@seker-space.com with the subject SKR-SPC-003 Payload Systems Engineer. Our process includes a written technical assessment and interviews with our leadership team.",
        ],
      },
    ],
  },
  {
    id: "SKR-SPC-004",
    slug: "skr-spc-004",
    status: "open",
    family: "SPC",
    title: "RF & Electronics Engineer",
    location: "Luxembourg",
    workArrangement: "Hybrid, with regular lab presence. Candidates willing to relocate are welcome.",
    employmentType: "Full-time, permanent",
    reportsTo: "VP of Engineering, Space Segment",
    datePosted: "2026-10-05",
    summary: "Design the receive chains and electronics of our multi-sensor payload, and keep sensitive receivers quiet next to processors and power converters.",
    sections: [
      {
        heading: "The role",
        paragraphs: [
          "You will design and verify the radio-frequency and electronic heart of our payload: sensitive receive chains, digitisers and the electronics around them.",
          "You will also own the hardest problem on board: making sensitive receivers coexist with onboard processing and power electronics, and proving it by measurement.",
        ],
      },
      {
        heading: "What you will do",
        bullets: [
          "Design and analyse receive chains, from antenna interfaces and low-noise front ends through filtering, frequency conversion and digitisation.",
          "Define and apply electromagnetic compatibility design rules across the payload: grounding, shielding, filtering, layout and clock frequency planning.",
          "Run interference analysis and measurement campaigns on engineering models, from near-field scanning to full EMC testing.",
          "Specify, select and qualify components, including commercial parts for use in orbit.",
          "Write the electrical requirements for suppliers and the host spacecraft interface, and verify them at acceptance.",
          "Support integration and test in our lab and at external test facilities.",
        ],
      },
      {
        heading: "What you bring",
        bullets: [
          "Hands-on radio-frequency and electronics design experience, from schematic to tested hardware.",
          "Practical EMC experience: diagnosing and fixing interference, and testing to standards such as ECSS-E-ST-20-07 or MIL-STD-461.",
          "Strong measurement skills with spectrum analysers, network analysers and near-field probes.",
          "Experience with mixed-signal boards and power electronics noise.",
        ],
      },
      {
        heading: "Valued, not required",
        bullets: [
          "Space hardware delivered to flight.",
          "Software-defined radio or digital signal processing.",
          "Commercial components in orbit, including radiation effects.",
          "Small satellite experience.",
        ],
      },
      {
        heading: "What this role is not",
        paragraphs: [
          "This is not a simulation-only role. You will spend real time at the bench, with a probe in your hand.",
        ],
      },
      {
        heading: "What we offer",
        paragraphs: [
          "Ownership of the most important technical challenge on a first-of-its-kind European payload, with the lab time and the authority to solve it properly.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send your CV to info@seker-space.com with the subject SKR-SPC-004 RF & Electronics Engineer. Our process includes a written technical assessment and interviews with our leadership team.",
        ],
      },
    ],
  },
  {
    id: "SKR-PLT-001",
    slug: "skr-plt-001",
    status: "open",
    family: "PLT",
    title: "Head of Platform Engineering, HERA",
    location: "Luxembourg",
    workArrangement: "Hybrid. Candidates willing to relocate are welcome.",
    employmentType: "Full-time, permanent",
    reportsTo: "Head of Engineering",
    datePosted: "2026-10-05",
    summary: "Lead HERA, our AI-driven maritime intelligence platform, and the team that turns large-scale vessel data into verified intelligence.",
    sections: [
      {
        heading: "The role",
        paragraphs: [
          "The Head of Platform Engineering owns HERA, Seker's AI-driven data-fusion platform, end to end: the data pipelines, the fusion and machine-learning models in production, the APIs and product our customers use, and the reliability and security behind them.",
          "You will lead the platform team and work closely with our data fusion scientists, our commercial team and our space segment team, whose payload data will feed the platform.",
        ],
      },
      {
        heading: "What you will do",
        bullets: [
          "Own HERA's architecture: ingestion, storage, processing and delivery of large-scale vessel data from space-based, terrestrial and third-party sources.",
          "Take fusion and machine-learning models from research into monitored production, with clear and calibrated confidence scores.",
          "Build and run the APIs and customer-facing product that commercial and public institutions rely on, with multi-tenant isolation and fine-grained access control.",
          "Make provenance a first-class feature, so that every derived result is traceable to its sources, method and assumptions.",
          "Deliver reliability and security fit for government and defence customers: sovereign hosting, uptime, monitoring and incident response.",
          "Integrate data from Seker's own payload as it comes online.",
          "Build and lead the platform team of software, machine-learning and DevSecOps engineers.",
          "Work with the commercial team on customer onboarding, pilots and new intelligence products.",
        ],
      },
      {
        heading: "What you bring",
        bullets: [
          "Senior experience leading the architecture and delivery of data-intensive platforms in production.",
          "Strong engineering in Python and modern data infrastructure, including streaming ingestion, time-series databases and API design.",
          "Experience taking machine-learning models into production, with monitoring and evaluation.",
          "Cloud infrastructure, containers and CI/CD, with security built in from the start.",
          "Proven leadership of a software team, including hiring and code-quality practices.",
        ],
      },
      {
        heading: "Valued, not required",
        bullets: [
          "Maritime, aviation or geospatial tracking data.",
          "Earth observation or satellite data processing.",
          "Delivering to government, defence or other regulated customers, including security accreditation.",
          "Experience with FastAPI and PostgreSQL or TimescaleDB.",
        ],
      },
      {
        heading: "What this role is not",
        paragraphs: [
          "This is not a research-only role, and it is not a hands-off management role. You will own the architecture personally and still write and review code.",
        ],
      },
      {
        heading: "What we offer",
        paragraphs: [
          "Ownership of the platform at the centre of Seker's product, with data from your own payload arriving from orbit, in a small and senior team building sovereign capability for Europe.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send your CV to info@seker-space.com with the subject SKR-PLT-001 Head of Platform Engineering. Our process includes a written technical assessment and interviews with our leadership team.",
        ],
      },
    ],
  },
  {
    id: "SKR-PRG-001",
    slug: "skr-prg-001",
    status: "open",
    family: "PRG",
    title: "Programme Manager",
    location: "Luxembourg",
    workArrangement: "Hybrid. Candidates willing to relocate are welcome.",
    employmentType: "Full-time, permanent",
    reportsTo: "Chief Executive Officer",
    datePosted: "2026-10-05",
    summary: "Run our space programme's schedule, cost, risk and reporting, and keep every milestone on time and fully evidenced.",
    sections: [
      {
        heading: "The role",
        paragraphs: [
          "The Programme Manager owns the delivery framework of our space programme: the integrated schedule, the budget, the risk register, contract obligations and reporting to our institutional partners.",
          "You work alongside engineering without being part of it, so that progress is measured honestly and every milestone is delivered with complete evidence.",
        ],
      },
      {
        heading: "What you will do",
        bullets: [
          "Build and maintain the integrated master schedule and the critical path, including long-lead procurement.",
          "Own budget tracking, forecasts and earned value for the programme.",
          "Run the risk and opportunity register, with monthly reviews and clear owners.",
          "Manage contract obligations, deliverables and milestone evidence with institutional partners and suppliers.",
          "Organise the review gates, from requirements through preliminary and critical design to acceptance, and track every action to closure.",
          "Produce clear monthly reporting for leadership and partners.",
        ],
      },
      {
        heading: "What you bring",
        bullets: [
          "Programme or project management of space or other high-technology hardware programmes.",
          "Experience with ESA, EU or other institutional contracts, including milestone reporting.",
          "Schedule and cost control tools, for example MS Project or Primavera, and earned value methods.",
          "Working knowledge of ECSS management standards for planning, risk and configuration.",
          "Calm, precise communication with engineers, suppliers and institutional stakeholders.",
        ],
      },
      {
        heading: "Valued, not required",
        bullets: [
          "Hosted payload or small satellite programmes.",
          "Supplier contract management.",
          "A recognised project management certification, such as PMP or PRINCE2.",
        ],
      },
      {
        heading: "What this role is not",
        paragraphs: [
          "This is not an engineering leadership role: technical decisions sit with engineering and the technical authority. It is also not an administrative role: you own the plan, and you call out risk early.",
        ],
      },
      {
        heading: "What we offer",
        paragraphs: [
          "A central seat in a first-of-its-kind European space programme, working directly with the leadership team in a small and senior company.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send your CV to info@seker-space.com with the subject SKR-PRG-001 Programme Manager. Our process includes a written technical assessment and interviews with our leadership team.",
        ],
      },
    ],
  },
];

export const careersPage = {
  hero: {
    heading: "Build Europe's sovereign eye on the oceans",
    subheading: "We design our own multi-sensor space payload and the AI platform that turns its data into verified maritime intelligence. Join the most advanced maritime engineering company in Europe.",
    primaryCta: "See open roles",
    secondaryCta: "Send a speculative application",
    image: "/careers/hero.webp",
    alt: "Engineers in cleanroom suits integrating a compact satellite payload on an integration stand, lit in cool blue with warm gold highlights.",
  },
  whatWeBuild: {
    heading: "What we build",
    items: [
      {
        key: "payload",
        title: "The payload",
        text: "Our space segment engineers take a multi-sensor payload from architecture to qualified flight hardware: budgets, electronics, integration and test.",
        image: "/careers/payload.webp",
        alt: "Gloved hands connecting a harness to satellite payload electronics on an ESD-safe workbench, test equipment softly out of focus.",
      },
      {
        key: "platform",
        title: "The platform",
        text: "Our platform team builds HERA, turning large-scale vessel data into verified intelligence with traceable confidence.",
        image: "/careers/platform.webp",
        alt: "Software engineers reviewing glowing vessel tracks on a large screen showing a dark ocean map.",
      },
      {
        key: "mission",
        title: "The mission",
        text: "The team of Seker deliver the most sophisticated data intelligence.",
        image: "/careers/mission.webp",
        alt: "A small satellite in orbit above the ocean at dawn, with faint vessel wakes on the sea below.",
      },
    ],
  },
  values: {
    heading: "How we work",
    items: [
      {
        title: "Evidence over opinion",
        text: "Decisions close on numbers, tests and traceable data, not on who argues loudest.",
        icon: "ShieldCheck",
      },
      {
        title: "Small and senior",
        text: "Every person owns a real part of the mission, with the authority to match.",
        icon: "Users",
      },
      {
        title: "One system",
        text: "Hardware and software are designed together, from orbit to the customer's screen.",
        icon: "Layers",
      },
      {
        title: "Built for Europe",
        text: "We build sovereign capability for European institutions and the industries they protect.",
        icon: "Globe",
      },
    ],
  },
  process: {
    heading: "How we hire",
    steps: [
      {
        title: "Apply",
        text: "Send your CV to info@seker-space.com with the job ID in the subject line.",
      },
      {
        title: "Written assessment",
        text: "A technical assessment built around real engineering problems. We value your reasoning over a single right answer.",
      },
      {
        title: "Interviews",
        text: "Conversations with our leadership team about your answers, your experience and how you work.",
      },
      {
        title: "Decision",
        text: "We aim to give every candidate a clear answer promptly.",
      },
    ],
  },
  familyImages: {
    SPC: "/careers/payload.webp",
    PLT: "/careers/platform.webp",
    PRG: "/careers/mission.webp",
  },
};
