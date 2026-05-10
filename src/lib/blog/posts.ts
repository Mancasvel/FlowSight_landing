import type { BlogPost } from './types'

const posts: BlogPost[] = [
  {
    slug: 'flowsight-vs-classic-time-trackers',
    title: 'FlowSight vs classic time trackers (Hubstaff, Time Doctor, Toggl mindset)',
    description:
      'Why freelancers are abandoning screenshot vaults and blank timesheets for local AI that narrates real work, without treating workers like suspects.',
    keywords: [
      'FlowSight vs Hubstaff',
      'FlowSight vs Time Doctor',
      'local AI time tracking',
      'proof of work freelancer',
      'on device productivity AI',
    ],
    publishedAt: '2026-03-15',
    readTimeMin: 8,
    category: 'compare',
    excerpt:
      'Classic trackers optimize for hours logged. FlowSight optimizes for cognitive sustainability and client-grade receipts generated from how you actually worked.',
    sections: [
      {
        heading: 'What legacy trackers still assume',
        paragraphs: [
          'Hourly billing tools evolved around proof of presence: screenshots, activity scores, idle timers. That made sense for agencies defending invoices, but it collides with remote trust, EU expectations, and any engineer who can choose employers.',
          'Manual trackers (Toggl, Clockify) fix the privacy issue but reintroduce busywork: people forget timers, round numbers, and optimize narratives for managers instead of reality.',
        ],
      },
      {
        heading: 'How FlowSight reframes the job-to-be-done',
        paragraphs: [
          'FlowSight is a Cognitive Health & Productivity agent. Local AI runs on your device, reads the same screen you already stare at, and surfaces context switching, interruption debt, and early burnout cues for you, not for a live bossware feed. FlowSight’s codebase is open to inspect.',
          'When it is time to reassure a client, you export structured proof of work: what shipped, what blocked you, which tools dominated your week, without uploading a surveillance reel to a vendor cloud.',
        ],
      },
      {
        heading: 'When FlowSight wins the evaluation',
        paragraphs: [
          'Choose FlowSight when the buyer is the worker first: freelancers, remote ICs, boutique consultancies, or platforms that need transparency without torching wellbeing.',
          'Keep classic trackers if legal requires keystroke-grade custody or if culture already accepted total visibility. FlowSight is for teams marketing trust, not suspicion.',
        ],
      },
    ],
  },
  {
    slug: 'flowsight-vs-employee-monitoring-surveillance',
    title: 'FlowSight vs employee monitoring (“bossware”)',
    description:
      'Surveillance stacks optimize for control. FlowSight optimizes for cognition plus optional, explicit proof, so adults keep agency over their pixels.',
    keywords: [
      'ethical monitoring alternative',
      'non surveillance productivity',
      'bossware alternative',
      'worker owned telemetry',
    ],
    publishedAt: '2026-03-10',
    readTimeMin: 7,
    category: 'compare',
    excerpt:
      'Bossware sells fear. FlowSight sells clarity: understand overload patterns locally, then choose what clients or platforms see.',
    sections: [
      {
        heading: 'The surveillance playbook',
        paragraphs: [
          'Traditional monitoring combines always-on capture, fine-grained input logging, and manager dashboards that can be accessed without worker visibility. That power asymmetry shows up in attrition, union conversations, and failed security reviews.',
          'Even “AI summaries” of invasive feeds still require invasive feeds. The optics do not change just because a model condenses the spying.',
        ],
      },
      {
        heading: 'FlowSight’s design goal: coach the human, brief the client',
        paragraphs: [
          'FlowSight treats the desktop as sovereign territory. Vision-language inference happens on device; screenshots never leave unless the worker triggers an export.',
          'Cognitive analytics (context switches, interruption storms, fatigue proxies) exist to help individuals protect flow, not to score how hard someone typed.',
        ],
      },
      {
        heading: 'Procurement questions that FlowSight answers cleanly',
        paragraphs: [
          'Ask vendors where pixels live, who can replay them, and whether exports require explicit consent. FlowSight’s architecture is meant to produce short, reviewable answers.',
          'Pair any product claims with your DPA, subprocessors, and DPIA. FlowSight’s story is aligned with data minimization, not a workaround for it.',
        ],
      },
    ],
  },
  {
    slug: 'gdpr-friendly-team-visibility-eu',
    title: 'GDPR-friendly proof of work: why EU buyers scrutinize FlowSight differently',
    description:
      'Schrems II, lawful basis, and purpose limitation still matter. Local-first cognitive analytics shrinks the sensitive surface area compared to cloud screenshot warehouses.',
    keywords: [
      'GDPR productivity software',
      'EU freelancer tooling',
      'data minimization analytics',
      'local AI GDPR',
    ],
    publishedAt: '2026-03-05',
    readTimeMin: 9,
    category: 'privacy',
    excerpt:
      'European stakeholders start with “where is the evidence stored?” FlowSight defaults to “on the worker device until they publish.”',
    sections: [
      {
        heading: 'Why cross-border screenshots are a paperwork magnet',
        paragraphs: [
          'US-founded SaaS routinely faces questions about transfer tools, SCCs, and supplemental measures. Products that upload rich screen evidence by default create more retention, access-control, and subprocessors work than products that derive structured summaries locally.',
          'Works councils and staff reps now expect to read a crisp story: what is collected, why it is proportionate, and how workers can object.',
        ],
      },
      {
        heading: 'Privacy-by-design as a shipping constraint',
        paragraphs: [
          'FlowSight keeps the high-risk asset (the framebuffer) off shared infrastructure. Optional exports become the controlled, lawful-basis-friendly event instead of continuous exfiltration.',
          'That does not replace counsel, but it changes DPIA tone from “collect everything, filter later” to “generate only what the client relationship needs.”',
        ],
      },
      {
        heading: 'How to talk about FlowSight in Brussels, Berlin, or Barcelona',
        paragraphs: [
          'Lead with worker outcomes: fewer context switches, earlier burnout detection, less nagging for status. Then explain client proof as an explicit publish action.',
          'Attach your real DPA, SCCs, and retention schedules. Marketing claims should match operational reality, and that is table stakes for EU trust.',
        ],
      },
    ],
  },
  {
    slug: 'flowsight-vs-manual-status-updates',
    title: 'FlowSight vs manual standups, slide decks, and “just update the ticket”',
    description:
      'Status theater burns hours. FlowSight automates the receipts clients want while keeping the cognitive narrative under worker control.',
    keywords: [
      'automatic client updates',
      'async proof of work',
      'reduce standup overhead',
      'freelancer reporting automation',
    ],
    publishedAt: '2026-02-28',
    readTimeMin: 6,
    category: 'product',
    excerpt:
      'Manual updates fail silently. FlowSight keeps a living, local model of your week so the Friday recap writes itself if you let it.',
    sections: [
      {
        heading: 'The hidden tax of “just send a recap”',
        paragraphs: [
          'Clients ask innocent questions, “what moved this week?”, that force workers to reverse-engineer their own memory after context switching destroyed it.',
          'PM tools become theater: tickets slide, comments inflate, nobody captures the emotional reality of overload.',
        ],
      },
      {
        heading: 'What automation changes when it is local-first',
        paragraphs: [
          'FlowSight continuously distills on device evidence into a narrative backlog: themes, blockers, deep work windows, and artifacts touched. Publishing is deliberate.',
          'Humans still decide priorities; FlowSight removes the busywork of proving you executed.',
        ],
      },
      {
        heading: 'When human rituals still matter',
        paragraphs: [
          '1:1s, planning poker, and design critiques are not replaced by metrics. FlowSight feeds those conversations with ground truth instead of vibes.',
          'Teams that thrive on radical transparency in chat can still use FlowSight to quantify meeting load and recovery time: signals that chat alone rarely captures cleanly.',
        ],
      },
    ],
  },
  {
    slug: 'why-ai-context-beats-screenshots-for-pms',
    title: 'Why on device VL beats screenshot libraries for client trust',
    description:
      'Thumbnails help humans glance; structured, consented exports help clients believe you, without building a cloud surveillance archive.',
    keywords: [
      'local AI inspectable code',
      'vision language work proof',
      'client reporting automation',
      'screenshot alternative',
    ],
    publishedAt: '2026-02-20',
    readTimeMin: 7,
    category: 'product',
    excerpt:
      'Pixels do not scale as knowledge. FlowSight keeps pixels local and ships narratives your clients can forward upstream.',
    sections: [
      {
        heading: 'Screenshot libraries rot',
        paragraphs: [
          'Image-heavy monitoring explodes storage bills, creates subjective review sessions, and fails aggregation questions like “how fragmented was Tuesday afternoon?”',
          'Privacy teams push back; employees experience it as ambient punishment.',
        ],
      },
      {
        heading: 'Vision-language models change the contract',
        paragraphs: [
          'A capable vision-language model running locally can read UI state, documents, and IDE context the way a senior peer would, without mirroring your desktop to a stranger’s AWS account. FlowSight’s own code stays open so you can verify what ships.',
          'The output is prose + structured metrics your client can skim in five minutes, not a flipbook of thumbnails.',
        ],
      },
      {
        heading: 'What to demand in a vendor demo',
        paragraphs: [
          'Ask how uncertainty is surfaced, what happens when the model is unsure, and how workers audit exports before they send.',
          'Ask for a diagram of data flows. If it is busier than a metro map, pause.',
        ],
      },
    ],
  },
]

export function getAllBlogPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getBlogSlugs(): string[] {
  return posts.map((p) => p.slug)
}
