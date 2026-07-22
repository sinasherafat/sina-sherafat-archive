import type { SVGProps } from 'react'

/**
 * Minimal line icons — consistent optical weight, square viewBox, functional only.
 * Icons represent actions; the personal mark represents authorship. Never mix them.
 */

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.5 4.5H11.5V10.5" />
    </svg>
  )
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h10" />
      <path d="M9 4l4 4-4 4" />
    </svg>
  )
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M13 8H3" />
      <path d="M7 4 3 8l4 4" />
    </svg>
  )
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 5h11" />
      <path d="M2.5 11h11" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4l8 8" />
      <path d="M12 4l-8 8" />
    </svg>
  )
}
