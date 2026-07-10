"use client"

import * as React from "react"

import type { ShapeEditorAction } from "@/hooks/use-shape-editor"
import {
  clampPercent,
  getEdgeMidpoints,
  pointsToSvgPathD,
  resolvePercent,
} from "@/lib/shapes/path-utils"
import type { Point } from "@/lib/shapes/types"
import { cn } from "@/lib/utils"

type EditorCanvasProps = {
  points: Point[]
  selectedPointIndex: number | null
  gridSize: number
  snapEnabled: boolean
  canvasWidth: number
  canvasHeight: number
  cornerRadius: number
  dispatch: React.Dispatch<ShapeEditorAction>
}

/** The viewBox mirrors the configured box's aspect ratio (canvasWidth /
 * canvasHeight) instead of forcing a square, so the editor previews the same
 * proportions — corner cuts, notches, rounding — that the exported clip-path
 * will actually render at. The height axis keeps a fixed 100-unit reference
 * scale and only the width axis is stretched to the right ratio, which keeps
 * the scale-per-CSS-pixel identical on both axes (since the outer container
 * is given that same ratio below) — so vertex circles stay circular and
 * stroke width stays even, without the distortion a naive stretch-to-fill
 * would cause. */
export function EditorCanvas({
  points,
  selectedPointIndex,
  gridSize,
  snapEnabled,
  canvasWidth,
  canvasHeight,
  cornerRadius,
  dispatch,
}: EditorCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const dragIndexRef = React.useRef<number | null>(null)
  const dragRectRef = React.useRef<DOMRect | null>(null)

  const aspectRatio = canvasWidth / canvasHeight
  const viewBoxWidth = 100 * aspectRatio
  const viewBoxHeight = 100
  // px-per-viewBox-unit is the same on both axes (100 / canvasHeight), since
  // the viewBox and the container share one aspect ratio.
  const cornerRadiusVb = cornerRadius * (100 / canvasHeight)

  const toVb = (p: Point) => ({ x: p.x * aspectRatio, y: p.y })

  const shapePathD = pointsToSvgPathD(
    points,
    viewBoxWidth,
    viewBoxHeight,
    2,
    cornerRadiusVb
  )
  const midpoints = getEdgeMidpoints(points)
  const showGrid = snapEnabled && gridSize > 0

  function toPercent(clientX: number, clientY: number, rect: DOMRect): Point {
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    return {
      x: resolvePercent(x, gridSize, snapEnabled),
      y: resolvePercent(y, gridSize, snapEnabled),
    }
  }

  function handlePointerDown(index: number) {
    return (event: React.PointerEvent<SVGCircleElement>) => {
      event.preventDefault()
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      dragIndexRef.current = index
      dragRectRef.current = rect
      event.currentTarget.setPointerCapture(event.pointerId)
      dispatch({ type: "SELECT_POINT", index })
    }
  }

  function handlePointerMove(event: React.PointerEvent<SVGCircleElement>) {
    const index = dragIndexRef.current
    const rect = dragRectRef.current
    if (index === null || !rect) return
    const point = toPercent(event.clientX, event.clientY, rect)
    dispatch({ type: "MOVE_POINT", index, point })
  }

  function handlePointerUp(event: React.PointerEvent<SVGCircleElement>) {
    if (dragIndexRef.current !== null) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragIndexRef.current = null
    dragRectRef.current = null
  }

  function handleAddPoint(edgeIndex: number) {
    return () => {
      dispatch({
        type: "ADD_POINT",
        afterIndex: edgeIndex,
        point: midpoints[edgeIndex],
      })
    }
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
        style={{ aspectRatio }}
        className="w-full touch-none rounded-md bg-background select-none"
      >
        {showGrid && (
          <>
            <defs>
              <pattern
                id="editor-grid"
                width={gridSize * aspectRatio}
                height={gridSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${gridSize * aspectRatio} 0 L 0 0 0 ${gridSize}`}
                  fill="none"
                  className="stroke-border"
                  strokeWidth={0.4}
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={viewBoxWidth}
              height={viewBoxHeight}
              fill="url(#editor-grid)"
            />
          </>
        )}

        <path
          d={shapePathD}
          className="fill-primary/15 stroke-primary"
          strokeWidth={0.6}
        />

        {midpoints.map((mid, i) => (
          <circle
            key={`mid-${i}`}
            cx={toVb(mid).x}
            cy={toVb(mid).y}
            r={1.6}
            className="fill-background stroke-primary/50 hover:fill-primary/30"
            strokeWidth={0.4}
            strokeDasharray="1.2 1.2"
            style={{ cursor: "copy" }}
            onClick={handleAddPoint(i)}
          />
        ))}

        {points.map((p, i) => (
          <circle
            key={`pt-${i}`}
            cx={toVb(p).x}
            cy={toVb(p).y}
            r={2.2}
            className={cn(
              "fill-background stroke-primary",
              selectedPointIndex === i && "fill-primary"
            )}
            strokeWidth={0.8}
            style={{ cursor: "grab", touchAction: "none" }}
            onPointerDown={handlePointerDown(i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        ))}
      </svg>
    </div>
  )
}
