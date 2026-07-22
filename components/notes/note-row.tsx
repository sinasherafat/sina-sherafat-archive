import Link from 'next/link'
import type { Note } from '@/lib/content/types'
import { formatDate } from '@/lib/format'
import { Meta } from '@/components/primitives/meta'

/** Text-first note row: date in mono, title in Geist Sans, optional descriptor. */
export function NoteRow({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group block border-t border-hairline py-6 first:border-t-0"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
        <Meta as="time" className="md:w-32 md:shrink-0">
          {formatDate(note.publishedAt)}
        </Meta>
        <div className="flex-1">
          <h3 className="text-h3 font-medium text-text-primary transition-colors group-hover:underline group-hover:decoration-text-primary group-hover:underline-offset-[6px]">
            {note.title}
          </h3>
          {note.description && (
            <p className="mt-2 max-w-reading text-body text-text-secondary text-pretty">
              {note.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
