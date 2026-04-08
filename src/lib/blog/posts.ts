import type { BlogPost } from './types'

const posts: BlogPost[] = [
  {
    slug: 'flowsight-vs-classic-time-trackers',
    title: 'FlowSight vs classic time trackers (Hubstaff, Time Doctor, and similar)',
    description:
      'How FlowSight differs from screenshot-heavy time trackers: local-first processing, no cloud screenshot vaults, and AI context instead of keystroke-style surveillance.',
    keywords: [
      'FlowSight vs Hubstaff',
      'FlowSight vs Time Doctor',
      'privacy time tracking',
      'screenshot free time tracker',
      'local first workforce analytics',
    ],
    publishedAt: '2026-03-15',
    readTimeMin: 8,
    category: 'compare',
    excerpt:
      'Traditional time trackers often center on screen capture and cloud storage. FlowSight is built for teams that need proof of work without treating employees like suspects.',
    sections: [
      {
        heading: 'What “classic” time trackers optimize for',
        paragraphs: [
          'Many tools in the Hubstaff / Time Doctor category evolved from billing and proof-of-hours. Common patterns include periodic screenshots, activity levels, and app usage rolled into a vendor-hosted timeline.',
          'That design can work for agencies billing by the hour. It clashes with modern engineering culture, distributed trust, and strict privacy expectations—especially in the EU.',
        ],
      },
      {
        heading: 'How FlowSight approaches the same job differently',
        paragraphs: [
          'FlowSight focuses on task traceability and PM-ready context: what work happened, how it maps to Jira or your toolchain, and whether the day was deep-work friendly—without building a permanent visual archive of the desktop in the cloud.',
          'Screenshots, when used in the FlowSight model, are processed locally; sensitive pixels are not retained as a surveillance feed. The product narrative is visibility for coordination, not storage for investigation.',
        ],
      },
      {
        heading: 'When FlowSight is the stronger fit',
        paragraphs: [
          'Choose FlowSight when your buyer is a PM or engineering lead who needs sprint-relevant signal, GDPR-minded legal review, or a credible story for recruits (“we don’t run spyware”).',
          'Classic time trackers can still fit pure hourly billing. FlowSight fits product development organizations optimizing flow, focus, and delivery narratives—not keystroke counts.',
        ],
      },
    ],
  },
  {
    slug: 'flowsight-vs-employee-monitoring-surveillance',
    title: 'FlowSight vs employee monitoring and “bossware”',
    description:
      'Why FlowSight is positioned as workforce intelligence, not surveillance: architecture choices that reduce legal, cultural, and security risk compared to invasive monitoring suites.',
    keywords: [
      'ethical employee monitoring alternative',
      'non surveillance productivity software',
      'bossware alternative',
      'trust based team visibility',
    ],
    publishedAt: '2026-03-10',
    readTimeMin: 7,
    category: 'compare',
    excerpt:
      'Surveillance tools optimize for control. FlowSight optimizes for shared understanding of how work actually happens—so leaders can fix systems, not police individuals.',
    sections: [
      {
        heading: 'The surveillance stack pattern',
        paragraphs: [
          'Invasive monitoring products often combine always-on capture, fine-grained activity logs, and remote review workflows. They create power asymmetry: managers see everything; ICs see little about how data is used.',
          'That asymmetry shows up in retention, union conversations, and security reviews—especially when data crosses borders.',
        ],
      },
      {
        heading: 'FlowSight’s design goal: explain the work, not expose the person',
        paragraphs: [
          'FlowSight treats “visibility” as a PM problem: Are we fragmented? Are meetings eating focus? Is deep work possible? Those questions can be answered with aggregates and context derived from work artifacts—not with a live feed of personal behavior.',
          'Auto-blockers and AI-detected interruptions (where enabled) point at system-level friction, not at scoring individuals for “how hard they typed.”',
        ],
      },
      {
        heading: 'Buying criteria that favor FlowSight',
        paragraphs: [
          'If procurement asks for data minimization, purpose limitation, and a clear story for works councils or EU employees, a surveillance-first vendor is an uphill battle.',
          'FlowSight is easier to align with narratives of professional trust: we instrument the work system, not the human body clock.',
        ],
      },
    ],
  },
  {
    slug: 'gdpr-friendly-team-visibility-eu',
    title: 'GDPR-friendly team visibility: why EU teams evaluate FlowSight differently',
    description:
      'Geographic and regulatory context for choosing workforce analytics in Europe: data minimization, lawful basis, and why local-first architectures reduce cross-border risk.',
    keywords: [
      'GDPR workforce analytics',
      'EU remote team visibility',
      'privacy by design engineering',
      'data minimization productivity',
    ],
    publishedAt: '2026-03-05',
    readTimeMin: 9,
    category: 'privacy',
    excerpt:
      'European buyers often start with Schrems II, DPA terms, and “can we explain this to employees?” FlowSight is built to support those conversations.',
    sections: [
      {
        heading: 'GEO note: why “where the data lives” matters',
        paragraphs: [
          'For US-founded SaaS, EU customers routinely ask where processing occurs, which sub-processors apply, and whether telemetry is necessary and proportionate.',
          'Products that upload rich screen evidence by default create more transfer, retention, and access-control questions than products that derive structured context locally.',
        ],
      },
      {
        heading: 'Privacy-by-design as a product feature',
        paragraphs: [
          'FlowSight emphasizes architectures that shrink the sensitive surface area: fewer raw captures in shared infrastructure, clearer separation between coordination metadata and personal monitoring.',
          'That does not replace legal advice—but it changes the posture of your DPIA from “we collect everything and filter later” to “we collect what the workflow needs.”',
        ],
      },
      {
        heading: 'Positioning FlowSight to EU stakeholders',
        paragraphs: [
          'Lead with purpose: sprint health, meeting load, recovery after context switches—not individual performance policing.',
          'Pair the product story with your actual DPA, SCCs, and subprocessors list. FlowSight’s positioning is meant to match stricter expectations, not bypass them.',
        ],
      },
    ],
  },
  {
    slug: 'flowsight-vs-manual-status-updates',
    title: 'FlowSight vs manual standups, spreadsheets, and Jira hygiene',
    description:
      'Compare passive, AI-assisted traceability to the cost of asking engineers to constantly update tickets, timesheets, and slide decks for PM visibility.',
    keywords: [
      'automatic Jira updates',
      'reduce standup overhead',
      'engineering status automation',
      'traceability without nagging',
    ],
    publishedAt: '2026-02-28',
    readTimeMin: 6,
    category: 'product',
    excerpt:
      'Manual updates fail silently: people forget, round numbers, or optimize for the manager—not for the truth. FlowSight reduces that tax.',
    sections: [
      {
        heading: 'The hidden cost of “just update Jira”',
        paragraphs: [
          'PM visibility often depends on discipline: daily standups, hour logging, comment hygiene. Any break in habit produces blind spots exactly when the team is underwater.',
          'The result is a lagging picture: you see theater (tickets moved) more than flow (focus, interruptions, real blockers).',
        ],
      },
      {
        heading: 'What automation changes',
        paragraphs: [
          'FlowSight uses AI context understanding to relate real work signals to tasks and timelines—so PMs get a narrative that is closer to how the day felt, not only how the board was groomed.',
          'The goal is not to eliminate human judgment; it is to remove repetitive reporting labor and reduce shame-based nagging.',
        ],
      },
      {
        heading: 'When to still rely on human ritual',
        paragraphs: [
          'Human conversation remains essential for alignment, empathy, and prioritization. FlowSight is best framed as input to those conversations, not a replacement for them.',
          'Teams that love radical transparency in chat may still adopt FlowSight to quantify meeting load and recovery time—metrics chat alone rarely captures cleanly.',
        ],
      },
    ],
  },
  {
    slug: 'why-ai-context-beats-screenshots-for-pms',
    title: 'Why AI context beats screenshots for modern PM dashboards',
    description:
      'Generative-engine and traditional SEO-friendly overview: structured work context scales better than image libraries for search, analytics, and trustworthy reporting.',
    keywords: [
      'AI work context',
      'PM dashboard analytics',
      'screenshot alternative',
      'LLM RAG workforce',
    ],
    publishedAt: '2026-02-20',
    readTimeMin: 7,
    category: 'product',
    excerpt:
      'Screenshots help humans glance; structured context helps systems reason—and helps you cite facts when leadership asks “what actually happened this sprint?”',
    sections: [
      {
        heading: 'Screenshots scale poorly',
        paragraphs: [
          'Image-heavy monitoring creates storage costs, retrieval pain, and subjective review. It is hard to aggregate “how fragmented was Tuesday?” from thousands of thumbnails.',
          'Machine learning on pixels alone is noisy; privacy teams push back; employees experience it as surveillance.',
        ],
      },
      {
        heading: 'LLM + RAG on work artifacts',
        paragraphs: [
          'FlowSight’s direction—advanced LLM with retrieval over work-relevant context—targets questions PMs actually ask: where did deep work go, what interrupted it, and which themes show up across the team?',
          'That is closer to business intelligence than to screen recording—a better match for both SEO clarity and generative search answers (clear entities, claims, and comparisons).',
        ],
      },
      {
        heading: 'What to look for in a vendor demo',
        paragraphs: [
          'Ask how explanations are generated, what sources ground them, and what happens when the model is uncertain. Responsible products expose limits and avoid fabricated precision.',
          'Ask where raw evidence lives, who can access it, and how retention works. The answers should be short and reviewable by security—not buried in appendix Z.',
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
