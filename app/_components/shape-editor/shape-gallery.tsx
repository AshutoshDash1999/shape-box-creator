"use client"

import * as React from "react"
import { Trash2Icon } from "lucide-react"

import { SaveShapeDialog } from "@/app/_components/shape-editor/save-shape-dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ShapeEditorAction } from "@/hooks/use-shape-editor"
import { pointsToClipPathPolygon } from "@/lib/shapes/path-utils"
import { PRESET_SHAPES } from "@/lib/shapes/presets"
import type { SavedShape } from "@/lib/shapes/types"

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
        <ScrollArea className="h-40">
          <div className="grid grid-cols-4 gap-3 pr-3 sm:grid-cols-6 lg:grid-cols-4">
            {PRESET_SHAPES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="flex flex-col items-center gap-1.5"
                onClick={() =>
                  dispatch({
                    type: "LOAD_POINTS",
                    points: preset.points,
                    cornerRadius: preset.cornerRadius,
                  })
                }
              >
                <span
                  className="size-12 bg-primary/70 transition-transform hover:scale-105"
                  style={{
                    clipPath: pointsToClipPathPolygon(preset.points, 1),
                  }}
                />
                <span className="text-[11px] text-muted-foreground">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="my-shapes">
        {savedShapes.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No saved shapes yet. Use &ldquo;Save shape&rdquo; to keep one here.
          </p>
        ) : (
          <ScrollArea className="h-40">
            <div className="grid grid-cols-4 gap-3 pr-3 sm:grid-cols-6 lg:grid-cols-4">
              {savedShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="flex flex-col items-center gap-1.5"
                >
                  <button
                    type="button"
                    className="group"
                    onClick={() =>
                      dispatch({
                        type: "LOAD_SHAPE",
                        points: shape.points,
                        fill: shape.fill,
                        border: shape.border,
                      })
                    }
                  >
                    <span
                      className="block size-12 transition-transform group-hover:scale-105"
                      style={{
                        clipPath: pointsToClipPathPolygon(shape.points, 1),
                        background:
                          shape.fill.mode === "gradient"
                            ? `linear-gradient(${shape.fill.gradientAngle}deg, ${shape.fill.color1}, ${shape.fill.color2})`
                            : shape.fill.color1,
                      }}
                    />
                  </button>
                  <div className="flex items-center gap-1">
                    <span className="max-w-16 truncate text-[11px] text-muted-foreground">
                      {shape.name}
                    </span>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => onRemoveSaved(shape.id)}
                      aria-label={`Delete ${shape.name}`}
                    >
                      <Trash2Icon />
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
