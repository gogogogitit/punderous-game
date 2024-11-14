'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h1>Oops! Something punexpected happuned.</h1>
      <p>We apologize for the inconvenience. Please try again.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}