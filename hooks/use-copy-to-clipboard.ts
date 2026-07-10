"use client"

import * as React from "react"

export function useCopyToClipboard(resetAfterMs = 1500) {
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), resetAfterMs)
      } catch {
        setCopied(false)
      }
    },
    [resetAfterMs]
  )

  return { copy, copied }
}
