"use client"

import * as React from "react"

import {
  SAVED_SHAPES_KEY,
  readStorage,
  writeStorage,
} from "@/lib/shapes/storage"
import type {
  BorderSettings,
  FillSettings,
  Point,
  SavedShape,
} from "@/lib/shapes/types"

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useSavedShapes() {
  const [shapes, setShapes] = React.useState<SavedShape[]>([])

  React.useEffect(() => {
    // Starting from [] and populating here (rather than a useState lazy
    // initializer) keeps the client's first render matching the
    // server-rendered markup, since localStorage isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShapes(readStorage<SavedShape[]>(SAVED_SHAPES_KEY) ?? [])
  }, [])

  const save = React.useCallback(
    (
      name: string,
      points: Point[],
      fill: FillSettings,
      border: BorderSettings
    ) => {
      const shape: SavedShape = {
        id: generateId(),
        name,
        points,
        fill,
        border,
        createdAt: Date.now(),
      }
      setShapes((current) => {
        const next = [shape, ...current]
        writeStorage(SAVED_SHAPES_KEY, next)
        return next
      })
    },
    []
  )

  const remove = React.useCallback((id: string) => {
    setShapes((current) => {
      const next = current.filter((s) => s.id !== id)
      writeStorage(SAVED_SHAPES_KEY, next)
      return next
    })
  }, [])

  return { shapes, save, remove }
}
