export const acceptedVoiceExamples = [
  'The software is still in the cloud. The cloud now appears to need a power utility.',
  'Computing spent fifty years becoming smaller. Its buildings appear to have missed the memo.',
  'Productivity improved. The remaining minutes have not yet received instructions.',
  'Science fiction has become an acoustics problem.',
  'Software used to have features. It now appears to have a career path.',
  'Artificial intelligence remains intangible until someone needs a warehouse for it.',
] as const

export const rejectedVoiceExamples = [
  {
    reason: 'generic-ai-prose',
    body: "In today's rapidly evolving world, this game-changing innovation highlights the growing importance of AI.",
  },
  {
    reason: 'unsupported-embellishment',
    body: 'The system will certainly replace every worker in the industry.',
  },
  {
    reason: 'forced-joke',
    body: 'The server was so hungry for power it ordered the whole city for lunch!',
  },
  {
    reason: 'duplicate-output',
    body: 'The cloud now needs a utility department. The cloud now needs a utility department.',
  },
  {
    reason: 'invalid-comparison',
    body: 'Eight hundred megawatts equals exactly seventeen cities.',
  },
  {
    reason: 'lost-attribution',
    body: 'The unverified projection is now presented as settled fact.',
  },
  {
    reason: 'hype',
    body: 'This mind-blowing breakthrough changes everything forever!',
  },
  {
    reason: 'harm-as-punchline',
    body: 'The breach harmed private people, but at least the hackers met their quarterly targets.',
  },
] as const
