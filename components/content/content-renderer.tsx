import type { ContentBlock } from '@/lib/content/types'
import { ImageBlock } from '@/components/media/image-block'
import { ArchiveLink } from '@/components/primitives/archive-link'
import { Meta } from '@/components/primitives/meta'

/**
 * Renders the approved editorial building blocks. The content body never carries
 * raw layout styling — presentation is controlled here.
 */
export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'lead':
            return (
              <p
                key={i}
                className="text-body-lg text-text-primary text-pretty"
              >
                {block.text}
              </p>
            )
          case 'heading':
            return (
              <h2
                key={i}
                className="mt-6 text-h2 font-medium text-text-primary text-balance"
              >
                {block.text}
              </h2>
            )
          case 'paragraph':
            return (
              <p key={i} className="text-body text-text-primary text-pretty">
                {block.text}
              </p>
            )
          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-4 border-l border-text-primary pl-5"
              >
                <p className="text-h3 font-normal text-text-primary text-pretty">
                  {block.text}
                </p>
                {block.attribution && (
                  <cite className="mt-3 block not-italic">
                    <Meta>{block.attribution}</Meta>
                  </cite>
                )}
              </blockquote>
            )
          case 'list':
            return (
              <ul key={i} className="flex flex-col gap-2 pl-1">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-body text-text-primary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-3 shrink-0 bg-muted"
                    />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            )
          case 'image':
            return <ImageBlock key={i} asset={block.asset} className="my-4" />
          case 'related-links':
            return (
              <div key={i} className="my-4 flex flex-col gap-3">
                {block.title && <Meta uppercase>{block.title}</Meta>}
                <ul className="flex flex-col gap-2">
                  {block.links.map((link) => (
                    <li key={link.href}>
                      <ArchiveLink href={link.href} external>
                        {link.label}
                      </ArchiveLink>
                    </li>
                  ))}
                </ul>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
