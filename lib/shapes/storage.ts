const STORAGE_PREFIX = "shape-box-creator"

export const AUTOSAVE_KEY = `${STORAGE_PREFIX}:current-state`
export const SAVED_SHAPES_KEY = `${STORAGE_PREFIX}:saved-shapes`

export function readStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage can throw in Safari private mode or when the quota is exceeded
  }
}

/** A trailing-edge debounce backed by a single timer, so bursts of rapid
 * updates (e.g. pointermove during a drag) collapse into one write instead
 * of hammering localStorage. `flush` lets callers force an immediate write
 * (e.g. on document visibilitychange) so the last edit before a tab close
 * isn't lost inside the debounce window. */
export function createDebouncedPersist<T>(fn: (value: T) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pendingValue: T | undefined
  let hasPending = false

  function flush() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (hasPending) {
      fn(pendingValue as T)
      hasPending = false
      pendingValue = undefined
    }
  }

  function schedule(value: T) {
    pendingValue = value
    hasPending = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(flush, wait)
  }

  return { schedule, flush }
}
