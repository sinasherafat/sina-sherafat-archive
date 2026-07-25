'use client'

import { useEffect, useRef, useState } from 'react'
import { ThemeControl } from '@/components/theme/theme-control'
import { Meta } from '@/components/primitives/meta'

/*
  Desktop affordance for the Theme Control. The precision dial is too tall for
  the fixed 56px header bar, so a compact "Theme" trigger opens a small inset
  panel that hosts the full instrument — preserving header height while keeping
  the control one click away. Closes on outside click and Escape.
*/
export function ThemeMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-sm px-2 py-1 font-mono text-[0.6875rem] uppercase text-text-secondary transition-colors duration-150 hover:text-text-primary"
      >
        Theme
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Theme control"
          className="absolute right-0 top-[calc(100%+12px)] z-50 rounded-md border border-hairline bg-canvas p-5 shadow-sm"
          style={{ boxShadow: '0 8px 24px var(--dial-shadow)' }}
        >
          <Meta uppercase className="mb-4 block">
            Theme
          </Meta>
          <ThemeControl />
        </div>
      )}
    </div>
  )
}
