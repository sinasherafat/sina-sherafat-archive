import Link from 'next/link'
import { Container } from '@/components/primitives/container'
import { Meta } from '@/components/primitives/meta'
import { ArchiveLink } from '@/components/primitives/archive-link'
import { navigation, siteConfig } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-hairline md:mt-24">
      <Container width="shell">
        <div className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between md:py-16">
          <div className="max-w-compact">
            <p className="text-body text-text-primary text-pretty">
              {siteConfig.intro}
            </p>
            <p className="mt-3 text-small text-text-secondary">
              {siteConfig.location}
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <Meta as="h2" uppercase className="mb-3 block">
                Archive
              </Meta>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/"
                    className="text-small text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Home
                  </Link>
                </li>
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-small text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <Meta as="h2" uppercase className="mb-3 block">
                Contact
              </Meta>
              <ul className="flex flex-col gap-2 text-small">
                <li>
                  <ArchiveLink href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </ArchiveLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-hairline py-6">
          <Meta>© {year} {siteConfig.name}</Meta>
          <Meta className="inline-flex items-baseline gap-2 whitespace-nowrap text-right">
            <span className="font-medium text-text-primary">
              Personal Archive
            </span>
            <span>{siteConfig.version}</span>
          </Meta>
        </div>
      </Container>
    </footer>
  )
}
