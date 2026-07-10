"use client"

import { motion } from "motion/react"
import * as React from "react"

import type { ShapeEditorAction } from "@/hooks/use-shape-editor"
import {
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
  const [activePointIndex, setActivePointIndex] = React.useState<
    number | null
  >(null)

  const aspectRatio = canvasWidth / canvasHeight
  const viewBoxWidth = 100 * aspectRatio
  const viewBoxHeight = 100
  // px-per-viewBox-unit is the same on both axes (100 / canvasHeight), since
  // the viewBox and the container share one aspect ratio.
  const cornerRadiusVb = cornerRadius * (100 / canvasHeight)

  const toVb = (p: Point) => ({ x: p.x * aspectRatio, y: p.y })
  const toPx = (p: Point) => ({
    x: (p.x / 100) * canvasWidth,
    y: (p.y / 100) * canvasHeight,
  })

  // Anchors the coordinate label up-right of the point by default, flipping
  // to whichever side keeps it inside the visible canvas near an edge.
  const LABEL_GAP = 5
  const LABEL_WIDTH = 34
  const LABEL_HEIGHT = 13
  function getLabelBox(point: Point, vb: { x: number; y: number }) {
    const flipX = point.x > 80
    const flipY = point.y < 15
    return {
      x: flipX ? vb.x - LABEL_GAP - LABEL_WIDTH : vb.x + LABEL_GAP,
      y: flipY ? vb.y + LABEL_GAP : vb.y - LABEL_GAP - LABEL_HEIGHT,
    }
  }

  const shapePathD = pointsToSvgPathD(
    points,
    viewBoxWidth,
    viewBoxHeight,
    2,
    cornerRadiusVb
  )
  const midpoints = getEdgeMidpoints(points)
  // The grid is a visual aid independent of snapping — it should stay
  // visible even when "snap to grid" is off, as long as a grid size is set.
  const showGrid = gridSize > 0

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
      setActivePointIndex(index)
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
    setActivePointIndex(null)
  }

  const activePoint =
    activePointIndex !== null ? points[activePointIndex] : null
  const activeVb = activePoint ? toVb(activePoint) : null
  const activePx = activePoint ? toPx(activePoint) : null
  const labelBox =
    activePoint && activeVb ? getLabelBox(activePoint, activeVb) : null

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
    <div className="rounded-lg border border-mat-border bg-mat p-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
        style={{ aspectRatio, overflow: "visible" }}
        className="w-full touch-none select-none"
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
                  className="stroke-mat-grid"
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

        <motion.path
          d={shapePathD}
          className="fill-primary/15 stroke-primary"
          strokeWidth={0.6}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {midpoints.map((mid, i) => (
          <motion.circle
            key={`mid-${i}`}
            cx={toVb(mid).x}
            cy={toVb(mid).y}
            r={1.6}
            className="fill-background stroke-primary/50 hover:fill-primary/30"
            strokeWidth={0.4}
            strokeDasharray="1.2 1.2"
            style={{ cursor: "copy" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.9 + i * 0.02 }}
            whileHover={{ scale: 1.3 }}
            onClick={handleAddPoint(i)}
          />
        ))}

        {points.map((p, i) => (
          <motion.circle
            key={`pt-${i}`}
            cx={toVb(p).x}
            cy={toVb(p).y}
            className={cn(
              "fill-background stroke-primary",
              selectedPointIndex === i && "fill-primary"
            )}
            strokeWidth={0.8}
            style={{ cursor: "grab", touchAction: "none" }}
            initial={{ r: 0 }}
            animate={{ r: selectedPointIndex === i ? 3 : 2.2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onPointerDown={handlePointerDown(i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        ))}

        {activePoint && activeVb && activePx && labelBox && (
          <g className="pointer-events-none">
            <line
              x1={activeVb.x}
              x2={activeVb.x}
              y1={0}
              y2={viewBoxHeight}
              className="stroke-primary/40"
              strokeWidth={0.3}
              strokeDasharray="1.5 1.5"
            />
            <line
              x1={0}
              x2={viewBoxWidth}
              y1={activeVb.y}
              y2={activeVb.y}
              className="stroke-primary/40"
              strokeWidth={0.3}
              strokeDasharray="1.5 1.5"
            />
            <rect
              x={labelBox.x}
              y={labelBox.y}
              width={LABEL_WIDTH}
              height={LABEL_HEIGHT}
              rx={2}
              className="fill-background stroke-primary/30"
              strokeWidth={0.4}
            />
            <text
              x={labelBox.x + 3}
              y={labelBox.y + 5.4}
              className="fill-foreground font-mono"
              style={{ fontSize: 4.2 }}
            >
              {Math.round(activePoint.x * 10) / 10}%,{" "}
              {Math.round(activePoint.y * 10) / 10}%
            </text>
            <text
              x={labelBox.x + 3}
              y={labelBox.y + 10.4}
              className="fill-muted-foreground font-mono"
              style={{ fontSize: 3.2 }}
            >
              {Math.round(activePx.x)}px, {Math.round(activePx.y)}px
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
