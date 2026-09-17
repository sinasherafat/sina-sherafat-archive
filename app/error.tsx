'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Editorial reader error', error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-screen max-w-reading flex-col justify-center px-5 py-20 sm:px-8">
      <p className="font-mono text-meta uppercase tracking-[0.04em] text-text-secondary">
        Reader unavailable
      </p>
      <h1 className="mt-6 text-h1 font-medium text-balance">
        The approved inventory could not be opened.
      </h1>
      <p className="mt-5 text-body-lg text-text-secondary">
        No replacement text has been generated. Try the same approved pool again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 w-fit rounded-sm text-body font-medium underline decoration-hairline underline-offset-[6px] hover:decoration-text-primary"
      >
        Retry →
      </button>
    </main>
  )
}
