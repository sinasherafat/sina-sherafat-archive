import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/page-shell'
import { PageHeader } from '@/components/layout/page-header'
import { Container } from '@/components/primitives/container'
import { Section } from '@/components/primitives/section'
import { NoteRow } from '@/components/notes/note-row'
import { getAllNotes } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Notes',
  description:
    'Selected observations, essays, and working thoughts — edited enough to reward reading.',
  alternates: { canonical: '/notes' },
}

export default function NotesPage() {
  const notes = getAllNotes()

  return (
    <PageShell>
      <PageHeader
        eyebrow="Notes"
        title="Selected thinking"
        intro="Observations, methods, and working ideas kept for their lasting relevance rather than their recency."
        width="reading"
      />

      <Section>
        <Container width="standard">
          <div>
            {notes.map((note) => (
              <NoteRow key={note.id} note={note} />
            ))}
          </div>
        </Container>
      </Section>
    </PageShell>
  )
}
