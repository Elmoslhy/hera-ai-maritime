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
  "Seker Space Intelligence is a Luxembourg maritime space company building European sovereign capability in maritime intelligence. We combine our own multi-sensor space payload with HERA, our AI-driven data-fusion platform, to deliver verified vessel intelligence to commercial and public institutions. We are building a small, senior team that ships real hardware and real software.";

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
    summary:
      "Lead HERA, our AI-driven maritime intelligence platform, and the team that turns large-scale vessel data into verified intelligence.",
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
];
