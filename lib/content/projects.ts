import type { Project } from './types'

/**
 * Canonical project content. Data-driven and typed so the archive can grow
 * from four projects to dozens without changing the interface.
 */
export const projects: Project[] = [
  {
    id: 'prj_mneme',
    slug: 'mneme',
    title: 'MNEME',
    summary:
      'A calm narrative system for human creation and thinking.',
    yearStart: 2025,
    yearEnd: null,
    status: 'in-development',
    role: ['Founder', 'Product Direction'],
    disciplines: ['Product', 'AI', 'Narrative Systems'],
    featured: true,
    visibility: 'public',
    cover: {
      src: '/projects/mneme/cover.png',
      alt: 'A quiet grid of layered notes fading into the page, in monochrome.',
      width: 1600,
      height: 1000,
      treatment: 'mono',
      priority: true,
    },
    links: [],
    seoDescription:
      'MNEME is a calm narrative discovery system for human creation and thinking.',
    publishedAt: '2025-09-01',
    updatedAt: '2026-06-12',
    body: [
      {
        type: 'lead',
        text: 'MNEME is a calm narrative discovery system for human creation and thinking. It helps people keep what feels worth returning to and notice meaning across time.',
      },
      { type: 'heading', text: 'Context' },
      {
        type: 'paragraph',
        text: 'Most tools for thought optimize for capture. They are good at collecting and poor at returning. MNEME begins from the opposite premise: the value of a note is revealed later, when a person can see it beside everything else they once found worth keeping.',
      },
      {
        type: 'paragraph',
        text: 'The system treats memory as a slow, editorial act rather than a real-time feed. It is designed to reward attention instead of demanding it, and to make the passage of time legible without turning it into a metric.',
      },
      { type: 'heading', text: 'Approach' },
      {
        type: 'paragraph',
        text: 'The interface stays quiet on purpose. Rather than surfacing streams and counts, MNEME composes a reading surface where connections emerge through proximity and sequence. Retrieval is framed as recognition, not search.',
      },
      {
        type: 'quote',
        text: 'The value of a note is not what it says today. It is what it lets you notice tomorrow.',
      },
      { type: 'heading', text: 'Current state' },
      {
        type: 'paragraph',
        text: 'MNEME is in active development. The current work concerns the retrieval model and the reading surface: how a small set of remembered things can be presented so that meaning accumulates rather than scatters.',
      },
    ],
  },
  {
    id: 'prj_pangaan',
    slug: 'pangaan',
    title: 'Pangaan',
    summary:
      'A venture exploring long-term coordination and shared infrastructure.',
    yearStart: 2024,
    yearEnd: null,
    status: 'evolving',
    role: ['Founder', 'Systems Design'],
    disciplines: ['Systems', 'Institutions', 'Incentives'],
    featured: true,
    visibility: 'public',
    cover: {
      src: '/projects/pangaan/cover.png',
      alt: 'An abstract monochrome network of quiet lines resolving into structure.',
      width: 1600,
      height: 1000,
      treatment: 'mono',
    },
    links: [],
    seoDescription:
      'Pangaan is a venture exploring long-term coordination and shared infrastructure.',
    publishedAt: '2024-11-04',
    updatedAt: '2026-04-20',
    body: [
      {
        type: 'lead',
        text: 'Pangaan studies how groups coordinate around shared resources over long horizons, and what infrastructure makes durable cooperation possible.',
      },
      { type: 'heading', text: 'Idea' },
      {
        type: 'paragraph',
        text: 'Many important problems are not technical but institutional: they require aligning incentives across people who will never meet, over timescales longer than any single project. Pangaan treats that alignment as something that can be designed rather than assumed.',
      },
      { type: 'heading', text: 'Direction' },
      {
        type: 'paragraph',
        text: 'The direction is active but the form is deliberately still open. The current work is concerned with primitives — the smallest reliable units of trust, ownership, and contribution that a larger system can be built on without collapsing into complexity.',
      },
      {
        type: 'list',
        items: [
          'Coordination primitives that remain legible at scale.',
          'Incentives that reward stewardship rather than extraction.',
          'Structures that age well without constant intervention.',
        ],
      },
      { type: 'heading', text: 'Current state' },
      {
        type: 'paragraph',
        text: 'Pangaan is evolving. It is documented here at its honest level of maturity: a serious idea with an active research direction, not a finished product.',
      },
    ],
  },
  {
    id: 'prj_founder_app',
    slug: 'founder-app',
    title: 'Founder App',
    summary:
      'A private working environment for the daily judgment of building.',
    yearStart: 2025,
    yearEnd: null,
    status: 'concept',
    role: ['Founder', 'Product Direction', 'Design'],
    disciplines: ['Product', 'Tools', 'Design'],
    featured: false,
    visibility: 'public',
    cover: {
      src: '/projects/founder-app/cover.png',
      alt: 'A restrained monochrome interface sketch with generous whitespace.',
      width: 1600,
      height: 1000,
      treatment: 'mono',
    },
    links: [],
    seoDescription:
      'Founder App is a concept for a private working environment for the daily judgment of building.',
    publishedAt: '2025-12-15',
    updatedAt: '2026-03-02',
    body: [
      {
        type: 'lead',
        text: 'Founder App is an early concept for a private environment that supports the daily judgment of building — deciding what matters, what to hold, and what to let go.',
      },
      { type: 'heading', text: 'Premise' },
      {
        type: 'paragraph',
        text: 'The hardest part of building is rarely execution. It is maintaining a clear, honest picture of the work while inside it. Founder App explores whether a quiet, personal tool can hold that picture without becoming another dashboard demanding to be fed.',
      },
      { type: 'heading', text: 'Constraints' },
      {
        type: 'paragraph',
        text: 'The design constraints are strict on purpose: no metrics theater, no streaks, no productivity gamification. The tool should reduce noise, not manufacture it.',
      },
      { type: 'heading', text: 'Current state' },
      {
        type: 'paragraph',
        text: 'This is a concept. It is published here to make the thinking visible, not to imply a shipping product.',
      },
    ],
  },
  {
    id: 'prj_harbor',
    slug: 'harbor',
    title: 'Harbor',
    summary:
      'An early experiment in giving temporary work a durable, quiet home.',
    yearStart: 2023,
    yearEnd: 2024,
    status: 'archived',
    role: ['Designer', 'Builder'],
    disciplines: ['Design', 'Web', 'Archival'],
    featured: false,
    visibility: 'public',
    cover: {
      src: '/projects/harbor/cover.png',
      alt: 'A calm monochrome horizon with a single anchored form.',
      width: 1600,
      height: 1000,
      treatment: 'mono',
    },
    links: [],
    seoDescription:
      'Harbor was an early experiment in giving temporary work a durable, quiet home.',
    publishedAt: '2023-06-10',
    updatedAt: '2024-08-01',
    body: [
      {
        type: 'lead',
        text: 'Harbor was an early experiment in preservation: giving temporary work — drafts, prototypes, and passing ideas — a durable and quiet place to be kept.',
      },
      { type: 'heading', text: 'What it was' },
      {
        type: 'paragraph',
        text: 'Harbor treated a personal body of work as something worth archiving rather than broadcasting. It informed much of the thinking that later became this archive and, in a different direction, MNEME.',
      },
      { type: 'heading', text: 'Why it is archived' },
      {
        type: 'paragraph',
        text: 'Harbor completed its purpose as a study. It is kept here honestly, as archived work, because the lessons remained useful even after the project itself stopped.',
      },
    ],
  },
]
