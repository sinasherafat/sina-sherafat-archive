'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Meta } from '@/components/primitives/meta'
import {
  appendSelectionHistory,
  emptySelectionHistory,
  sanitizeSelectionHistory,
} from '@/lib/editorial/selection'
import type { Perspective, SelectionHistory } from '@/lib/editorial/types'

const SESSION_HISTORY_KEY = 'technology-editorial-engine:history:v1'
const SESSION_ID_KEY = 'technology-editorial-engine:session-id:v1'

type TransitionPhase = 'idle' | 'out' | 'in'

function readSessionHistory(): SelectionHistory {
  try {
    const value = sessionStorage.getItem(SESSION_HISTORY_KEY)
    return value
      ? sanitizeSelectionHistory(JSON.parse(value))
      : emptySelectionHistory
  } catch {
    return emptySelectionHistory
  }
}

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_ID_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  sessionStorage.setItem(SESSION_ID_KEY, id)
  return id
}

function writeSessionHistory(history: SelectionHistory): void {
  sessionStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history))
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

function SourceDetails({ perspective }: { perspective: Perspective }) {
  return (
    <details
      key={perspective.id}
      className="group mt-5 border-t border-hairline pt-4"
    >
      <summary className="w-fit cursor-pointer list-none rounded-sm text-small text-text-secondary underline decoration-hairline underline-offset-4 transition-colors hover:text-text-primary group-open:text-text-primary">
        Sources
      </summary>
      <div className="mt-4 max-w-reading space-y-4 text-small text-text-secondary">
        {perspective.sources.map((source) => {
          const external = source.url.startsWith('http')
          const sourceContent = (
            <>
              <span className="block text-text-primary">{source.publisher}</span>
              <span className="block">{source.title}</span>
            </>
          )

          return (
            <div key={source.id}>
              {external ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm underline decoration-hairline underline-offset-4 hover:decoration-text-primary"
                >
                  {sourceContent}
                </a>
              ) : (
                <Link
                  href={source.url}
                  className="rounded-sm underline decoration-hairline underline-offset-4 hover:decoration-text-primary"
                >
                  {sourceContent}
                </Link>
              )}
              <span className="mt-1 block font-mono text-meta uppercase tracking-[0.04em]">
                Tier {source.sourceTier} /{' '}
                {source.fixture ? 'Synthetic fixture' : 'Source record'}
              </span>
            </div>
          )
        })}
        {perspective.corrected && perspective.correctionNote ? (
          <p>
            <span className="font-medium text-text-primary">Corrected.</span>{' '}
            {perspective.correctionNote}
          </p>
        ) : null}
      </div>
    </details>
  )
}

export function EditorialReader({
  initialPerspective,
  updateStableUrl = false,
}: {
  initialPerspective: Perspective
  updateStableUrl?: boolean
}) {
  const [perspective, setPerspective] = useState(initialPerspective)
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [pending, setPending] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const historyRef = useRef<SelectionHistory>(emptySelectionHistory)
  const requestRef = useRef(false)

  useEffect(() => {
    const history = appendSelectionHistory(
      readSessionHistory(),
      initialPerspective,
    )
    historyRef.current = history
    writeSessionHistory(history)
  }, [initialPerspective])

  async function showAnotherPerspective() {
    if (requestRef.current) return
    requestRef.current = true
    setPending(true)
    setError(null)
    const busyTimer = window.setTimeout(() => setBusy(true), 300)

    try {
      const response = await fetch('/api/perspectives/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          history: historyRef.current,
        }),
      })

      if (!response.ok) throw new Error('Selection request failed.')
      const payload = (await response.json()) as { perspective: Perspective }

      setPhase('out')
      await delay(170)
      setPerspective(payload.perspective)
      const history = appendSelectionHistory(
        historyRef.current,
        payload.perspective,
      )
      historyRef.current = history
      writeSessionHistory(history)

      if (updateStableUrl) {
        window.history.replaceState(
          null,
          '',
          `/perspectives/${payload.perspective.slug}`,
        )
      }

      setPhase('in')
      window.setTimeout(() => setPhase('idle'), 190)
    } catch {
      setPhase('idle')
      setError(
        'The approved inventory could not be reached. The current observation remains in place.',
      )
    } finally {
      window.clearTimeout(busyTimer)
      setBusy(false)
      setPending(false)
      requestRef.current = false
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-reading flex-col px-5 py-16 sm:px-8 md:py-24">
      <article
        className="perspective-copy"
        data-phase={phase}
        aria-busy={busy}
      >
        <Meta uppercase className="block">
          {perspective.displayDate} / {perspective.category}
        </Meta>

        <h1 className="mt-8 text-[clamp(2rem,4.2vw,3.7rem)] font-medium leading-[1.08] tracking-[-0.04em] text-balance text-text-primary">
          {perspective.body}
        </h1>

        <p className="mt-7 font-mono text-meta uppercase leading-relaxed tracking-[0.04em] text-text-secondary">
          {perspective.sourceLine}
        </p>

        <SourceDetails perspective={perspective} />
      </article>

      <div className="mt-12 border-t border-hairline pt-7 sm:mt-16">
        <button
          type="button"
          onClick={showAnotherPerspective}
          disabled={pending}
          className="group min-h-11 rounded-sm text-left text-[1.05rem] font-medium text-text-primary underline decoration-hairline underline-offset-[7px] transition-colors duration-150 hover:decoration-text-primary disabled:cursor-wait disabled:text-text-secondary"
        >
          <span>Another perspective →</span>
          {busy ? (
            <span className="ml-2 font-mono text-meta uppercase tracking-[0.04em] text-text-secondary">
              Working
            </span>
          ) : null}
        </button>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small text-text-secondary">
          <Link
            href={`/perspectives/${perspective.slug}`}
            className="rounded-sm underline decoration-hairline underline-offset-4 hover:text-text-primary"
          >
            Stable link
          </Link>
          <Link
            href="/te-engine/about"
            className="rounded-sm underline decoration-hairline underline-offset-4 hover:text-text-primary"
          >
            About
          </Link>
        </div>

        {error ? (
          <p
            className="mt-4 max-w-reading text-small text-text-secondary"
            role="status"
          >
            {error}
          </p>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {phase === 'in'
          ? `New observation loaded: ${perspective.body}`
          : ''}
      </p>
    </section>
  )
}
