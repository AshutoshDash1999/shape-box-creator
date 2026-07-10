"use client"

import * as React from "react"

import { DEFAULT_STATE } from "@/lib/shapes/constants"
import {
  addPointAt,
  movePointTo,
  pointsToClipPathValue,
  pointsToCssSnippet,
  pointsToSvgMarkup,
  pointsToSvgPathD,
  removePointAt,
} from "@/lib/shapes/path-utils"
import {
  AUTOSAVE_KEY,
  createDebouncedPersist,
  readStorage,
  writeStorage,
} from "@/lib/shapes/storage"
import type {
  BorderSettings,
  CanvasSettings,
  FillSettings,
  Point,
  ShapeEditorState,
} from "@/lib/shapes/types"

export type ShapeEditorAction =
  | { type: "MOVE_POINT"; index: number; point: Point }
  | { type: "ADD_POINT"; afterIndex: number; point: Point }
  | { type: "REMOVE_POINT"; index: number }
  | { type: "SELECT_POINT"; index: number | null }
  | { type: "LOAD_POINTS"; points: Point[]; cornerRadius?: number }
  | {
      type: "LOAD_SHAPE"
      points: Point[]
      fill: FillSettings
      border: BorderSettings
    }
  | { type: "SET_FILL"; fill: Partial<FillSettings> }
  | { type: "SET_BORDER"; border: Partial<BorderSettings> }
  | { type: "SET_CANVAS"; canvas: Partial<CanvasSettings> }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: ShapeEditorState }

function reducer(
  state: ShapeEditorState,
  action: ShapeEditorAction
): ShapeEditorState {
  switch (action.type) {
    case "MOVE_POINT":
      return {
        ...state,
        points: movePointTo(state.points, action.index, action.point),
      }
    case "ADD_POINT":
      return {
        ...state,
        points: addPointAt(state.points, action.afterIndex, action.point),
        selectedPointIndex: action.afterIndex + 1,
      }
    case "REMOVE_POINT":
      return {
        ...state,
        points: removePointAt(state.points, action.index),
        selectedPointIndex:
          state.selectedPointIndex === action.index
            ? null
            : state.selectedPointIndex,
      }
    case "SELECT_POINT":
      return { ...state, selectedPointIndex: action.index }
    case "LOAD_POINTS":
      return {
        ...state,
        points: action.points,
        selectedPointIndex: null,
        // 0 is a meaningful radius ("sharp"), so only an absent field means
        // "keep whatever the user set".
        canvas:
          action.cornerRadius === undefined
            ? state.canvas
            : { ...state.canvas, cornerRadius: action.cornerRadius },
      }
    case "LOAD_SHAPE":
      return {
        ...state,
        points: action.points,
        fill: action.fill,
        border: action.border,
        selectedPointIndex: null,
      }
    case "SET_FILL":
      return { ...state, fill: { ...state.fill, ...action.fill } }
    case "SET_BORDER":
      return { ...state, border: { ...state.border, ...action.border } }
    case "SET_CANVAS":
      return { ...state, canvas: { ...state.canvas, ...action.canvas } }
    case "RESET":
      return DEFAULT_STATE
    case "HYDRATE":
      return action.state
    default:
      return state
  }
}

export function useShapeEditor() {
  const [state, dispatch] = React.useReducer(reducer, DEFAULT_STATE)

  const persistRef = React.useRef(
    createDebouncedPersist<ShapeEditorState>((value) => {
      writeStorage(AUTOSAVE_KEY, value)
    }, 400)
  )

  // Reading localStorage must wait until after the initial (SSR-matching)
  // render, otherwise the client's first render would diverge from the
  // server's and React would flag a hydration mismatch.
  React.useEffect(() => {
    const saved = readStorage<ShapeEditorState>(AUTOSAVE_KEY)
    if (saved) {
      dispatch({ type: "HYDRATE", state: saved })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    persistRef.current.schedule(state)
  }, [state])

  React.useEffect(() => {
    const persist = persistRef.current
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        persist.flush()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      persist.flush()
    }
  }, [])

  const { points, canvas } = state

  const derived = React.useMemo(
    () => ({
      clipPath: pointsToClipPathValue(
        points,
        canvas.width,
        canvas.height,
        canvas.precision,
        canvas.cornerRadius
      ),
      cssSnippet: pointsToCssSnippet(
        points,
        canvas.width,
        canvas.height,
        canvas.precision,
        canvas.cornerRadius
      ),
      svgPathD: pointsToSvgPathD(
        points,
        canvas.width,
        canvas.height,
        canvas.precision,
        canvas.cornerRadius
      ),
      svgMarkup: pointsToSvgMarkup(
        points,
        canvas.width,
        canvas.height,
        canvas.precision,
        canvas.cornerRadius
      ),
    }),
    [
      points,
      canvas.width,
      canvas.height,
      canvas.precision,
      canvas.cornerRadius,
    ]
  )

  return { state, dispatch, derived }
}
