import { Container } from '@/components/primitives/container'
import { Meta } from '@/components/primitives/meta'
import { siteConfig } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline">
      <Container width="shell">
        <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <Meta>© {year} {siteConfig.name}</Meta>
          <Meta className="inline-flex items-baseline gap-2">
            <span>{siteConfig.principle}</span>
            <span aria-hidden="true">/</span>
            <span>{siteConfig.version}</span>
          </Meta>
        </div>
      </Container>
    </footer>
  )
}
