import type {
  ClaimRecord,
  EditorialEvent,
  EditorialForm,
  Lens,
  Perspective,
  SourceRecord,
} from './types'

const SPEC_DATE = '2026-09-17T00:00:00.000Z'

export const fixtureSource: SourceRecord = {
  id: 'src-spec-fixtures',
  url: '/about#fixtures',
  title: 'Synthetic voice examples and editorial fixtures',
  publisher: 'Technology Editorial Engine specification',
  publishedAt: SPEC_DATE,
  sourceTier: 'A',
  fetchedAt: SPEC_DATE,
  canonicalHash: 'fixture-spec-v1-2026-09-17',
  fixture: true,
}

interface PerspectiveSeed {
  lens: Lens
  form: EditorialForm
  body: string
  qualityScore: number
  absurdityLevel: 0 | 1 | 2 | 3
}

interface EventSeed {
  id: string
  slug: string
  title: string
  category: string
  claim: string
  claimType?: ClaimRecord['type']
  perspectives: [PerspectiveSeed, PerspectiveSeed, PerspectiveSeed]
}

const seeds: EventSeed[] = [
  {
    id: 'evt-fixture-city-power',
    slug: 'city-power-campus',
    title: 'A hypothetical computing campus uses city-scale power',
    category: 'Infrastructure',
    claim:
      'In this synthetic scenario, a company says a future computing campus would draw electricity on the scale of a mid-sized city.',
    claimType: 'company_claim',
    perspectives: [
      {
        lens: 'infrastructure',
        form: 'observation',
        body:
          'A hypothetical AI company says its next computing campus will draw as much electricity as a mid-sized city. The software is still in the cloud. The cloud now appears to need a power utility, a planning department, and several people whose job is to explain the word cloud.',
        qualityScore: 94,
        absurdityLevel: 2,
      },
      {
        lens: 'physical',
        form: 'scale',
        body:
          'The product arrives as a small field on a screen. Its fictional power requirement belongs in the vocabulary of substations and municipal grids. Interface design has become unusually good at concealing electrical geography.',
        qualityScore: 91,
        absurdityLevel: 1,
      },
      {
        lens: 'institutional',
        form: 'footnote',
        body:
          'In this hypothetical case, city-scale power gives a software feature the administrative outline of a public utility.',
        qualityScore: 88,
        absurdityLevel: 1,
      },
    ],
  },
  {
    id: 'evt-fixture-funding',
    slug: 'forty-billion-before-profit',
    title: 'A fictional startup raises forty billion dollars before profit',
    category: 'Capital',
    claim:
      'In this synthetic scenario, a fictional startup raises forty billion dollars before reaching profitability.',
    perspectives: [
      {
        lens: 'money',
        form: 'observation',
        body:
          'A fictional startup raises $40 billion before reaching profitability. The number is too large to feel like a bet on a product and too specific to feel like weather. At some point, venture capital stops resembling funding and begins resembling urban planning conducted without the city.',
        qualityScore: 93,
        absurdityLevel: 2,
      },
      {
        lens: 'institutional',
        form: 'scale',
        body:
          'Forty billion dollars would require committees, districts, and public hearings in most civic settings. In the synthetic technology version, it can arrive as a financing announcement and a photograph of several people near a logo.',
        qualityScore: 90,
        absurdityLevel: 2,
      },
      {
        lens: 'absurd',
        form: 'footnote',
        body:
          'The fictional company has not reached profitability. It has, however, reached the fiscal scale of a place.',
        qualityScore: 87,
        absurdityLevel: 2,
      },
    ],
  },
  {
    id: 'evt-fixture-land',
    slug: 'data-center-land',
    title: 'A synthetic data-center campus covers an enormous site',
    category: 'Compute',
    claim:
      'In this synthetic scenario, a new data-center campus covers more land than several major airports combined.',
    perspectives: [
      {
        lens: 'physical',
        form: 'observation',
        body:
          'A synthetic data-center site covers more land than several major airports combined. Computing spent fifty years becoming smaller, faster, and less visible. Its buildings appear to have missed the memo and are now expanding across the map with the confidence of weather systems.',
        qualityScore: 95,
        absurdityLevel: 2,
      },
      {
        lens: 'historical',
        form: 'observation',
        body:
          'The history of computing is usually told as a shrinking story: room, cabinet, desk, pocket. The fictional infrastructure behind it now runs the sequence in reverse. The device keeps getting thinner while the place required to serve it becomes a land-use category.',
        qualityScore: 92,
        absurdityLevel: 1,
      },
      {
        lens: 'infrastructure',
        form: 'scale',
        body:
          'An airport-sized computing site still presents its work as something weightless and remote. The useful trick is not miniaturization. It is moving the visible edge of the machine somewhere most users will never visit.',
        qualityScore: 89,
        absurdityLevel: 1,
      },
    ],
  },
  {
    id: 'evt-fixture-twelve-seconds',
    slug: 'twelve-second-task',
    title: 'A fictional model compresses an hour of work into twelve seconds',
    category: 'Automation',
    claim:
      'In this synthetic scenario, a model completes in twelve seconds a task that previously occupied a person for one hour.',
    perspectives: [
      {
        lens: 'time',
        form: 'observation',
        body:
          'A fictional model completes in twelve seconds a task that once occupied a person for an hour. Productivity has improved by fifty-nine minutes and forty-eight seconds. The task is settled. The remaining time has not yet received instructions and may soon become a management concern.',
        qualityScore: 96,
        absurdityLevel: 2,
      },
      {
        lens: 'human',
        form: 'observation',
        body:
          'The synthetic system does not merely finish the task faster. It returns most of the hour to the person who expected to spend it. Automation is often described as removing work. In practice, it may first produce an awkward surplus of unscheduled human attention.',
        qualityScore: 92,
        absurdityLevel: 1,
      },
      {
        lens: 'behavioral',
        form: 'footnote',
        body:
          'A twelve-second task leaves fifty-nine minutes for checking whether the twelve-second task was correct.',
        qualityScore: 86,
        absurdityLevel: 2,
      },
    ],
  },
  {
    id: 'evt-fixture-speaking',
    slug: 'office-conversation-computers',
    title: 'Natural speech becomes an ordinary computer interface',
    category: 'Interfaces',
    claim:
      'In this synthetic scenario, companies design offices around employees speaking naturally to computers throughout the day.',
    perspectives: [
      {
        lens: 'historical',
        form: 'observation',
        body:
          'Ten years before this synthetic scenario, speaking naturally to a computer was a demonstration. Now companies are redesigning offices around employees doing it all day. Science fiction has completed the difficult transition from spectacle to an acoustics problem with procurement paperwork.',
        qualityScore: 94,
        absurdityLevel: 2,
      },
      {
        lens: 'physical',
        form: 'scale',
        body:
          'A voice interface occupies no visible desk space, then changes the walls, spacing, and noise rules of the entire fictional office. The software disappears into conversation. The building receives the feature request.',
        qualityScore: 90,
        absurdityLevel: 1,
      },
      {
        lens: 'language',
        form: 'footnote',
        body:
          'Talking to the computer became normal. Listening to everyone else talk to theirs became facilities policy.',
        qualityScore: 88,
        absurdityLevel: 2,
      },
    ],
  },
  {
    id: 'evt-fixture-glasses',
    slug: 'glasses-summarize-room',
    title: 'Synthetic smart glasses summarize the room',
    category: 'Wearables',
    claim:
      'In this synthetic scenario, smart glasses can summarize a room while the wearer is physically present in it.',
    perspectives: [
      {
        lens: 'behavioral',
        form: 'observation',
        body:
          'Synthetic smart glasses can summarize the room while you are standing in it. The device does not remove anyone from the meeting. It offers a more efficient form of attendance in which the body remains present while the interpretation is quietly subcontracted.',
        qualityScore: 93,
        absurdityLevel: 2,
      },
      {
        lens: 'human',
        form: 'observation',
        body:
          'A room used to ask for attention in real time. In the fictional glasses scenario, it can be compressed into a short account before the moment has finished happening. Being present is becoming a source format that another system can process on your behalf.',
        qualityScore: 91,
        absurdityLevel: 1,
      },
      {
        lens: 'absurd',
        form: 'footnote',
        body:
          'We have nearly solved the inconvenience of occupying the same moment as our own attention.',
        qualityScore: 85,
        absurdityLevel: 2,
      },
    ],
  },
  {
    id: 'evt-fixture-workforce',
    slug: 'digital-workforce',
    title: 'A fictional company calls autonomous processes a workforce',
    category: 'Agents',
    claim:
      'In this synthetic scenario, a company describes thousands of autonomous software processes as its digital workforce.',
    claimType: 'company_claim',
    perspectives: [
      {
        lens: 'language',
        form: 'observation',
        body:
          'A fictional company refers to thousands of autonomous software processes as its digital workforce. Software used to have features and background tasks. It now has colleagues, managers, and an implied human-resources department. Headcount has acquired a file extension.',
        qualityScore: 95,
        absurdityLevel: 2,
      },
      {
        lens: 'institutional',
        form: 'observation',
        body:
          'Calling software a workforce does more than describe capability. It imports an institution: delegation, supervision, access control, performance review, and responsibility when something goes wrong. The synthetic agents arrive as code and immediately require an organization chart.',
        qualityScore: 93,
        absurdityLevel: 1,
      },
      {
        lens: 'historical',
        form: 'scale',
        body:
          'Software once waited for commands. The fictional workforce is described as planning, acting, remembering, and escalating. The verbs changed first. Employment policy is still catching up with the grammar.',
        qualityScore: 89,
        absurdityLevel: 1,
      },
    ],
  },
  {
    id: 'evt-fixture-three-minutes',
    slug: 'three-minutes-saved',
    title: 'A hypothetical service saves three minutes per user',
    category: 'Productivity',
    claim:
      'In this synthetic scenario, a service saves one hundred million users an average of three minutes per day.',
    perspectives: [
      {
        lens: 'human',
        form: 'scale',
        body:
          'A hypothetical service saves one hundred million people three minutes each day. The arithmetic produces centuries of recovered human time every twenty-four hours. The product has finished its calculation. Civilization has not yet published a plan for the reclaimed Tuesdays.',
        qualityScore: 96,
        absurdityLevel: 2,
      },
      {
        lens: 'time',
        form: 'observation',
        body:
          'Three minutes is too small to notice in one life and immense when repeated across a population. The fictional service turns personal fragments into a civilizational quantity, then returns them individually, where they are likely to be spent waiting for another screen.',
        qualityScore: 92,
        absurdityLevel: 1,
      },
      {
        lens: 'institutional',
        form: 'footnote',
        body:
          'At population scale, a convenience feature becomes an unofficial ministry for distributing spare minutes.',
        qualityScore: 87,
        absurdityLevel: 1,
      },
    ],
  },
  {
    id: 'evt-fixture-accelerators',
    slug: 'warehouse-of-accelerators',
    title: 'A fictional chipmaker ships warehouse-scale accelerator volume',
    category: 'Semiconductors',
    claim:
      'In this synthetic scenario, a chipmaker ships enough accelerators in one year to fill thousands of server racks.',
    perspectives: [
      {
        lens: 'scale',
        form: 'observation',
        body:
          'A fictional chipmaker ships enough accelerators in one year to fill thousands of server racks. Artificial intelligence remains intangible in public discussion right up until someone must insure the warehouse, cool the aisles, and find a loading dock for the future.',
        qualityScore: 94,
        absurdityLevel: 2,
      },
      {
        lens: 'physical',
        form: 'scale',
        body:
          'The synthetic intelligence is discussed in parameters and capabilities. Its delivery unit is still a box that occupies a rack, produces heat, and travels by freight. Abstraction has a surprisingly conventional shipping department.',
        qualityScore: 91,
        absurdityLevel: 1,
      },
      {
        lens: 'infrastructure',
        form: 'footnote',
        body:
          'Enough invisible intelligence eventually becomes visible as aisles, cables, cooling pipes, and inventory forms.',
        qualityScore: 88,
        absurdityLevel: 1,
      },
    ],
  },
  {
    id: 'evt-fixture-safety-office',
    slug: 'product-becomes-institution',
    title: 'A synthetic model accumulates institutional support systems',
    category: 'Governance',
    claim:
      'In this synthetic scenario, a model requires dedicated safety, policy, infrastructure, legal, and energy functions.',
    perspectives: [
      {
        lens: 'institutional',
        form: 'observation',
        body:
          'A synthetic model requires its own safety team, policy group, infrastructure division, legal framework, and energy strategy. It is still described as a product. The word product is doing the administrative work of a much larger noun that has not yet been approved.',
        qualityScore: 96,
        absurdityLevel: 2,
      },
      {
        lens: 'language',
        form: 'observation',
        body:
          'Product once meant something a company made and sold. In this fictional case it also means the offices, rules, utilities, and public arguments required to keep the thing operating. The label stayed small while the institution grew around it.',
        qualityScore: 92,
        absurdityLevel: 1,
      },
      {
        lens: 'money',
        form: 'footnote',
        body:
          'When a product needs its own energy strategy, the operating budget has begun to resemble public administration.',
        qualityScore: 86,
        absurdityLevel: 1,
      },
    ],
  },
  {
    id: 'evt-fixture-laundry',
    slug: 'four-minute-laundry',
    title: 'A fictional robot folds laundry in four minutes',
    category: 'Robotics',
    claim:
      'In this synthetic scenario, a household robot folds one load of laundry in four minutes.',
    perspectives: [
      {
        lens: 'time',
        form: 'observation',
        body:
          'A fictional robot folds a load of laundry in four minutes. The technical achievement is easy to measure. The stranger achievement is that centuries of domestic negotiation can now be expressed as a benchmark, repeated under laboratory lighting, and placed on a product roadmap.',
        qualityScore: 93,
        absurdityLevel: 2,
      },
      {
        lens: 'historical',
        form: 'footnote',
        body:
          'Human civilization spent thousands of years arranging for someone else to fold the laundry. The robot formalizes the arrangement.',
        qualityScore: 90,
        absurdityLevel: 2,
      },
      {
        lens: 'behavioral',
        form: 'scale',
        body:
          'Four-minute folding does not eliminate the household task. It relocates the person from doing the work to preparing, loading, checking, and discussing the machine that does it. Progress often changes the prepositions first.',
        qualityScore: 88,
        absurdityLevel: 1,
      },
    ],
  },
  {
    id: 'evt-fixture-memory',
    slug: 'assistant-remembers-everything',
    title: 'A hypothetical assistant remembers every user instruction',
    category: 'AI Assistants',
    claim:
      'In this synthetic scenario, a company says its assistant can remember everything a user tells it.',
    claimType: 'company_claim',
    perspectives: [
      {
        lens: 'human',
        form: 'observation',
        body:
          'A hypothetical assistant can remember everything you tell it. The feature is presented as relief from forgetting, which is reasonable. It also turns every casual instruction into durable administrative material. Perfect memory arrives with the quiet social problem of deciding what should have been temporary.',
        qualityScore: 95,
        absurdityLevel: 1,
      },
      {
        lens: 'language',
        form: 'scale',
        body:
          'The industry spent years describing memory as a capability to add. In the fictional assistant, forgetting becomes the missing feature. Human limitation has been promoted to a privacy setting.',
        qualityScore: 92,
        absurdityLevel: 2,
      },
      {
        lens: 'absurd',
        form: 'footnote',
        body:
          'In this hypothetical case, software has solved memory. Users may shortly rediscover the advantages of an incomplete record.',
        qualityScore: 89,
        absurdityLevel: 2,
      },
    ],
  },
]

export const fixtureEvents: EditorialEvent[] = seeds.map((seed) => ({
  id: seed.id,
  titleInternal: seed.title,
  category: seed.category,
  eventAt: SPEC_DATE,
  createdAt: SPEC_DATE,
  scores: {
    freshness: 0,
    significance: 100,
    transformability: 100,
    sourceConfidence: 100,
    novelty: 100,
    voiceFit: 100,
  },
  status: 'active',
  sourceIds: [fixtureSource.id],
  fixture: true,
}))

export const fixtureClaims: ClaimRecord[] = seeds.map((seed) => ({
  id: `clm-${seed.id.replace('evt-', '')}`,
  eventId: seed.id,
  text: seed.claim,
  type: seed.claimType ?? 'observed',
  confidence: 'high',
  sourceId: fixtureSource.id,
  sourceSpan: 'Canonical specification, Appendix C; adapted synthetic scenario.',
  eventAt: SPEC_DATE,
  numbers: [],
  fixture: true,
}))

export const fixturePerspectives: Perspective[] = seeds.flatMap(
  (seed, eventIndex) =>
    seed.perspectives.map((perspective, perspectiveIndex) => {
      const sequence = String(eventIndex * 3 + perspectiveIndex + 1).padStart(
        2,
        '0',
      )

      return {
        id: `per-fixture-${sequence}`,
        slug: `${seed.slug}-${perspective.lens}`,
        eventId: seed.id,
        eventTitle: seed.title,
        category: seed.category,
        eventAt: SPEC_DATE,
        displayDate: 'SPECIMEN',
        lens: perspective.lens,
        form: perspective.form,
        body: perspective.body,
        sourceLine: 'Canonical specification / synthetic editorial fixture',
        qualityScore: perspective.qualityScore,
        absurdityLevel: perspective.absurdityLevel,
        status: 'active',
        sources: [fixtureSource],
        corrected: false,
        fixture: true,
        promptVersion: 'fixture-v1.0',
        modelVersion: 'human-reviewed-fixture',
        referenceDatasetVersion: 'reference-v1.0',
      }
    }),
)

export function getFixturePerspective(idOrSlug: string): Perspective | null {
  return (
    fixturePerspectives.find(
      (perspective) =>
        perspective.id === idOrSlug || perspective.slug === idOrSlug,
    ) ?? null
  )
}

export function getInitialFixturePerspective(): Perspective {
  return fixturePerspectives[0]
}
