'use client'

import { useTheme } from 'next-themes'
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

/*
  Theme Control v1.1.2 — precision instrument.

  Two coordinated controls that reuse the existing next-themes architecture:

    • System Follow (role="switch")
        ON  -> theme = "system" (tracks OS via prefers-color-scheme),
               dial disabled + lower opacity.
        OFF -> theme = manual ("dark" | "light"), dial interactive.

    • Theme Intensity Dial (role="slider", 0..100)
        0   -> dark    (rotated fully counter-clockwise / left)
        50  -> balanced pivot
        100 -> light   (rotated fully clockwise / right)
        The resolved site theme flips at the mid point. The continuous value
        is persisted so the knob returns to its last angle.

  Monochrome only. Depth via layered grayscale + inset/────shadow tokens; no
  color, no gradient hue, no glow.
*/

const STORAGE_KEY = 'archive-theme-intensity'

// Dial sweeps across a 270° arc, gap centered at the bottom.
const ARC_START = -135 // value 0 (dark), left
const ARC_END = 135 // value 100 (light), right
const ARC_SWEEP = ARC_END - ARC_START

function valueToAngle(value: number): number {
  return ARC_START + (value / 100) * ARC_SWEEP
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function ThemeControl({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Continuous dial value 0..100. Restored from storage on mount.
  const [value, setValue] = useState(70)
  const dialRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        const parsed = Number.parseInt(stored, 10)
        if (!Number.isNaN(parsed)) setValue(clamp(parsed, 0, 100))
      } else {
        // Seed from the resolved theme so the knob starts sensibly.
        setValue(resolvedTheme === 'dark' ? 20 : 80)
      }
    } catch {
      /* storage unavailable — keep default */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const following = mounted ? theme === 'system' : true

  // Apply a dial value: persist it and resolve to a discrete theme.
  const applyValue = useCallback(
    (next: number) => {
      const v = clamp(Math.round(next), 0, 100)
      setValue(v)
      try {
        window.localStorage.setItem(STORAGE_KEY, String(v))
      } catch {
        /* ignore */
      }
      setTheme(v < 50 ? 'dark' : 'light')
    },
    [setTheme],
  )

  // Pointer geometry -> value. Angle measured from the dial center.
  const pointerToValue = useCallback((clientX: number, clientY: number) => {
    const el = dialRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // atan2 with y-down; 0° points up.
    let deg = (Math.atan2(clientX - cx, cy - clientY) * 180) / Math.PI
    if (deg < ARC_START) deg = deg + 360 > ARC_END + 90 ? ARC_START : deg
    deg = clamp(deg, ARC_START, ARC_END)
    return ((deg - ARC_START) / ARC_SWEEP) * 100
  }, [])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (following) return
      draggingRef.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
      const next = pointerToValue(event.clientX, event.clientY)
      if (next !== null) applyValue(next)
    },
    [following, pointerToValue, applyValue],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || following) return
      const next = pointerToValue(event.clientX, event.clientY)
      if (next !== null) applyValue(next)
    },
    [following, pointerToValue, applyValue],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      draggingRef.current = false
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    [],
  )

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (following) return
      let handled = true
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          applyValue(value + 5)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          applyValue(value - 5)
          break
        case 'Home':
          applyValue(0)
          break
        case 'End':
          applyValue(100)
          break
        case 'PageUp':
          applyValue(value + 20)
          break
        case 'PageDown':
          applyValue(value - 20)
          break
        default:
          handled = false
      }
      if (handled) event.preventDefault()
    },
    [following, value, applyValue],
  )

  const toggleFollow = useCallback(() => {
    if (following) {
      // Leaving system mode — commit to whatever the OS currently resolved to
      // so there is no visual jump, and mirror it onto the dial value.
      const resolved = resolvedTheme === 'dark' ? 'dark' : 'light'
      applyValue(resolved === 'dark' ? 20 : 80)
    } else {
      setTheme('system')
    }
  }, [following, resolvedTheme, applyValue, setTheme])

  // Displayed angle. Before mount we render a stable neutral angle to avoid
  // any hydration mismatch; opacity guards the flash.
  const angle = mounted ? valueToAngle(value) : valueToAngle(70)

  return (
    <div
      className={cn('inline-flex flex-col gap-4', className)}
      data-following={following ? 'true' : 'false'}
    >
      <div className="flex items-start gap-6">
        {/* System Follow switch */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[0.6875rem] uppercase leading-tight tracking-normal text-text-secondary">
            system
            <br />
            follow
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={following}
            aria-label="Follow operating system theme"
            onClick={toggleFollow}
            className={cn(
              'group relative inline-flex h-6 w-11 items-center rounded-full',
              'border border-hairline outline-offset-2',
              'transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
            )}
            style={{
              background: 'var(--switch-track)',
              boxShadow: 'inset 0 1px 2px var(--dial-inset)',
            }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none block h-4 w-4 rounded-full',
                'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                following ? 'translate-x-1' : 'translate-x-6',
              )}
              style={{
                background: 'var(--switch-knob)',
                boxShadow: '0 1px 2px var(--dial-shadow)',
              }}
            />
          </button>
        </div>

        {/* Theme Intensity Dial */}
        <div className="flex flex-col items-center gap-2">
          <div
            ref={dialRef}
            role="slider"
            aria-label="Theme intensity"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={mounted ? value : undefined}
            aria-valuetext={
              value < 50 ? 'Dark' : value === 50 ? 'Balanced' : 'Light'
            }
            aria-disabled={following}
            tabIndex={following ? -1 : 0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className={cn(
              'theme-dial relative h-24 w-24 select-none rounded-full',
              'outline-offset-2',
              following
                ? 'pointer-events-none opacity-40'
                : 'cursor-pointer opacity-100',
            )}
            style={{
              transition: 'opacity 300ms cubic-bezier(0.4,0,0.2,1)',
              touchAction: 'none',
            }}
          >
            {/* Fixed tick ring (recessed outer track) */}
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {Array.from({ length: 21 }).map((_, i) => {
                const a = (valueToAngle((i / 20) * 100) * Math.PI) / 180
                const outer = 47
                const inner = i % 5 === 0 ? 40 : 43
                const x1 = 50 + outer * Math.sin(a)
                const y1 = 50 - outer * Math.cos(a)
                const x2 = 50 + inner * Math.sin(a)
                const y2 = 50 - inner * Math.cos(a)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      i % 5 === 0
                        ? 'var(--dial-tick)'
                        : 'var(--dial-tick-muted)'
                    }
                    strokeWidth={i % 5 === 0 ? 1.4 : 0.9}
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>

            {/* Recessed rim */}
            <div
              className="pointer-events-none absolute rounded-full"
              aria-hidden="true"
              style={{
                inset: '14%',
                background: 'var(--dial-rim)',
                boxShadow:
                  'inset 0 2px 4px var(--dial-inset), inset 0 -1px 1px var(--dial-highlight)',
              }}
            />

            {/* Raised center knob + rotating indicator mark */}
            <div
              className="pointer-events-none absolute rounded-full"
              aria-hidden="true"
              style={{
                inset: '22%',
                background:
                  'radial-gradient(circle at 50% 34%, var(--dial-knob-top), var(--dial-knob-bottom))',
                boxShadow:
                  '0 3px 6px var(--dial-shadow), inset 0 1px 1px var(--dial-highlight)',
                transform: `rotate(${angle}deg)`,
                transition: draggingRef.current
                  ? 'none'
                  : 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {/* Flat center disc */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: '30%',
                  background: 'var(--dial-face)',
                  boxShadow: 'inset 0 1px 1px var(--dial-inset)',
                }}
              />
              {/* Indicator mark near knob edge */}
              <div
                className="absolute left-1/2 top-[10%] h-2 w-[3px] -translate-x-1/2 rounded-full"
                style={{ background: 'var(--dial-tick)' }}
              />
            </div>

            {/* Fixed value dot on the light end (matches reference) */}
            <div
              className="pointer-events-none absolute right-[3%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
              aria-hidden="true"
              style={{ background: 'var(--dial-mark)' }}
            />
          </div>

          {/* dark / light end labels */}
          <div className="flex w-24 items-center justify-between px-0.5 font-mono text-[0.6875rem] text-text-secondary">
            <span>dark</span>
            <span>light</span>
          </div>
        </div>
      </div>
    </div>
  )
}
