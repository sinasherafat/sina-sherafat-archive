import type { Note } from './types'

/**
 * Selected notes — thinking that clarifies methods, ideas, or recurring themes.
 * Text-first; no mandatory thumbnails.
 */
export const notes: Note[] = [
  {
    id: 'note_reward_attention',
    slug: 'reward-attention',
    title: 'A site that rewards attention',
    description:
      'On building interfaces that do not compete with the work they hold.',
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-20',
    topics: ['Design', 'Restraint'],
    visibility: 'public',
    readingTime: 3,
    seoDescription:
      'On building interfaces that do not compete with the work they hold.',
    body: [
      {
        type: 'lead',
        text: 'The most useful thing an interface can do is disappear at the right moment.',
      },
      {
        type: 'paragraph',
        text: 'A page that asks for attention spends the very thing it hopes to earn. Every animation, badge, and gradient is a small withdrawal from the reader’s patience. When the work is good, the interface should get out of its way.',
      },
      {
        type: 'paragraph',
        text: 'Restraint is not minimalism as a style. It is a decision about where meaning lives. If meaning lives in the work, the surrounding system should be quiet enough to let that work be seen clearly.',
      },
      {
        type: 'quote',
        text: 'The site should not ask for attention. It should reward attention.',
      },
      {
        type: 'paragraph',
        text: 'This is harder than it looks, because quiet is easy to mistake for empty. The difference is hierarchy: silence created through order and omission, not through a lack of anything to say.',
      },
    ],
  },
  {
    id: 'note_honest_incompleteness',
    slug: 'honest-incompleteness',
    title: 'Honest incompleteness',
    description:
      'Why unfinished work can be published without pretending to be finished.',
    publishedAt: '2026-03-09',
    topics: ['Method', 'Writing'],
    visibility: 'public',
    readingTime: 2,
    seoDescription:
      'Why unfinished work can be published without pretending to be finished.',
    body: [
      {
        type: 'lead',
        text: 'Work in progress can be shown, as long as its status is explicit and the available material is meaningful.',
      },
      {
        type: 'paragraph',
        text: 'The temptation is to wait until something is complete before making it visible. But completeness is rare, and much of the most interesting thinking happens while a thing is still becoming. The alternative to hiding is not exaggeration — it is honesty about state.',
      },
      {
        type: 'paragraph',
        text: 'A concept is labeled a concept. An archived experiment is labeled as archived. Nothing is dressed up as more finished than it is. This is what lets an archive hold a finished product and an early experiment on the same shelf without the two being confused.',
      },
    ],
  },
  {
    id: 'note_editing_creates_value',
    slug: 'editing-creates-value',
    title: 'Editing creates value',
    description:
      'A smaller body of coherent work is stronger than a complete inventory.',
    publishedAt: '2026-01-22',
    topics: ['Method', 'Curation'],
    visibility: 'public',
    readingTime: 2,
    seoDescription:
      'A smaller body of coherent work is stronger than a complete inventory of activity.',
    body: [
      {
        type: 'lead',
        text: 'An archive grows through careful inclusion, not accumulation.',
      },
      {
        type: 'paragraph',
        text: 'It is easy to measure output and hard to measure coherence, so most public records drift toward volume. But a visitor does not remember how much was published. They remember whether the parts belonged together.',
      },
      {
        type: 'paragraph',
        text: 'Selection is the work. Deciding what not to include is the same act as deciding what the archive is about. Over time, the omissions say as much as the entries.',
      },
    ],
  },
]
