"use client"

import * as React from "react"

import { SaveShapeDialog } from "@/app/_components/shape-editor/save-shape-dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ShapeEditorAction } from "@/hooks/use-shape-editor"
import { pointsToClipPathPolygon } from "@/lib/shapes/path-utils"
import { PRESET_SHAPES } from "@/lib/shapes/presets"
import type { SavedShape } from "@/lib/shapes/types"
import Trash9 from "reicon-react/icons/Trash9"

type ShapeGalleryProps = {
  savedShapes: SavedShape[]
  onSaveCurrent: (name: string) => void
  onRemoveSaved: (id: string) => void
  dispatch: React.Dispatch<ShapeEditorAction>
}

export function ShapeGallery({
  savedShapes,
  onSaveCurrent,
  onRemoveSaved,
  dispatch,
}: ShapeGalleryProps) {
  return (
    <Tabs defaultValue="presets" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="my-shapes">My Shapes</TabsTrigger>
        </TabsList>
        <SaveShapeDialog onSave={onSaveCurrent} />
      </div>

      <TabsContent value="presets">
        <ScrollArea className="h-36">
          <div className="flex gap-3 pr-3">
            {PRESET_SHAPES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="group flex w-24 shrink-0 flex-col items-center gap-1.5"
                onClick={() =>
                  dispatch({
                    type: "LOAD_POINTS",
                    points: preset.points,
                    cornerRadius: preset.cornerRadius,
                  })
                }
              >
                <span className="flex size-14 items-center justify-center rounded-lg border border-mat-border bg-mat transition-colors group-hover:border-cta">
                  <span
                    className="size-8 bg-cta transition-transform group-hover:scale-110"
                    style={{
                      clipPath: pointsToClipPathPolygon(preset.points, 1),
                    }}
                  />
                </span>
                <span className="text-center text-base leading-tight text-muted-foreground">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="my-shapes">
        {savedShapes.length === 0 ? (
          <p className="text-base text-muted-foreground">
            No saved shapes yet. Use &ldquo;Save shape&rdquo; to keep one here.
          </p>
        ) : (
          <ScrollArea className="h-36">
            <div className="flex gap-3 pr-3">
              {savedShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="group flex w-24 shrink-0 flex-col items-center gap-1.5"
                >
                  <button
                    type="button"
                    aria-label={`Load shape "${shape.name}"`}
                    onClick={() =>
                      dispatch({
                        type: "LOAD_SHAPE",
                        points: shape.points,
                        fill: shape.fill,
                        border: shape.border,
                      })
                    }
                    className="flex size-14 items-center justify-center rounded-lg border border-mat-border bg-mat transition-colors group-hover:border-cta"
                  >
                    <span
                      className="block size-8 rounded-xs transition-transform group-hover:scale-110"
                      style={{
                        clipPath: pointsToClipPathPolygon(shape.points, 1),
                        background:
                          shape.fill.mode === "gradient"
                            ? `linear-gradient(${shape.fill.gradientAngle}deg, ${shape.fill.color1}, ${shape.fill.color2})`
                            : shape.fill.color1,
                      }}
                    />
                  </button>
                  <div className="flex items-center gap-0.5">
                    <span className="max-w-16 truncate text-base text-muted-foreground">
                      {shape.name}
                    </span>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => onRemoveSaved(shape.id)}
                      aria-label={`Delete ${shape.name}`}
                    >
                      <Trash9 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </TabsContent>
    </Tabs>
  )
}
