"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ShapeEditorAction } from "@/hooks/use-shape-editor"
import { MIN_POINTS, clampPercent } from "@/lib/shapes/path-utils"
import type { Point } from "@/lib/shapes/types"
import { cn } from "@/lib/utils"

type PointListProps = {
  points: Point[]
  selectedPointIndex: number | null
  dispatch: React.Dispatch<ShapeEditorAction>
}

export function PointList({
  points,
  selectedPointIndex,
  dispatch,
}: PointListProps) {
  function handleCoordinateChange(index: number, axis: "x" | "y") {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = Number(event.target.value)
      if (Number.isNaN(raw)) return
      dispatch({
        type: "MOVE_POINT",
        index,
        point: { ...points[index], [axis]: clampPercent(raw) },
      })
    }
  }

  function handleAddPoint() {
    const lastIndex = points.length - 1
    const first = points[0]
    const last = points[lastIndex]
    dispatch({
      type: "ADD_POINT",
      afterIndex: lastIndex,
      point: { x: (first.x + last.x) / 2, y: (first.y + last.y) / 2 },
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Points ({points.length})</span>
        <Button size="sm" variant="outline" onClick={handleAddPoint}>
          <PlusIcon /> Add point
        </Button>
      </div>
      <ScrollArea className="h-48 rounded-lg border">
        <div className="flex flex-col gap-1 p-2">
          {points.map((p, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 rounded-md px-1 py-1",
                selectedPointIndex === i && "bg-accent"
              )}
              onClick={() => dispatch({ type: "SELECT_POINT", index: i })}
            >
              <span className="w-4 shrink-0 text-xs text-muted-foreground">
                {i + 1}
              </span>
              <Input
                type="number"
                value={Math.round(p.x * 10) / 10}
                onChange={handleCoordinateChange(i, "x")}
                onFocus={() => dispatch({ type: "SELECT_POINT", index: i })}
                className="h-8"
                min={0}
                max={100}
                step={0.5}
                aria-label={`Point ${i + 1} x position`}
              />
              <Input
                type="number"
                value={Math.round(p.y * 10) / 10}
                onChange={handleCoordinateChange(i, "y")}
                onFocus={() => dispatch({ type: "SELECT_POINT", index: i })}
                className="h-8"
                min={0}
                max={100}
                step={0.5}
                aria-label={`Point ${i + 1} y position`}
              />
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={points.length <= MIN_POINTS}
                onClick={(event) => {
                  event.stopPropagation()
                  dispatch({ type: "REMOVE_POINT", index: i })
                }}
                aria-label={`Delete point ${i + 1}`}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
