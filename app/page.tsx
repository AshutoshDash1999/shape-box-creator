"use client"

import { CodeOutput } from "@/app/_components/shape-editor/code-output"
import { EditorCanvas } from "@/app/_components/shape-editor/editor-canvas"
import { PointList } from "@/app/_components/shape-editor/point-list"
import { PreviewPanel } from "@/app/_components/shape-editor/preview-panel"
import {
  CanvasSettingsPanel,
  SettingsPanel,
} from "@/app/_components/shape-editor/settings-panel"
import { ShapeGallery } from "@/app/_components/shape-editor/shape-gallery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSavedShapes } from "@/hooks/use-saved-shapes"
import { useShapeEditor } from "@/hooks/use-shape-editor"
import { pointsToClipPathPolygon } from "@/lib/shapes/path-utils"

export default function Page() {
  const { state, dispatch, derived } = useShapeEditor()
  const { shapes: savedShapes, save, remove } = useSavedShapes()

  const markBackground =
    state.fill.mode === "gradient"
      ? `linear-gradient(${state.fill.gradientAngle}deg, ${state.fill.color1}, ${state.fill.color2})`
      : state.fill.color1

  return (
    <div className="mx-auto flex min-h-svh max-w-7xl flex-col gap-8 p-4 sm:p-6">
      <header className="flex items-center gap-3.5">
        <span
          aria-hidden
          className="size-9 shrink-0 rounded-md ring-1 ring-mat-border"
          style={{
            clipPath: pointsToClipPathPolygon(state.points, 1),
            background: markBackground,
          }}
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-xl font-extrabold tracking-tight">
            Shape Box Creator
          </h1>
          <p className="text-base text-muted-foreground">
            Drag polygon points to design unconventional UI blocks, then copy
            the clip-path or SVG.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
        <ShapeGallery
          savedShapes={savedShapes}
          onSaveCurrent={(name) =>
            save(name, state.points, state.fill, state.border)
          }
          onRemoveSaved={remove}
          dispatch={dispatch}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              Editor
              <span className="font-mono text-base font-normal tabular-nums text-muted-foreground">
                {state.points.length} points
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <EditorCanvas
              points={state.points}
              selectedPointIndex={state.selectedPointIndex}
              gridSize={state.canvas.gridSize}
              snapEnabled={state.canvas.snapEnabled}
              canvasWidth={state.canvas.width}
              canvasHeight={state.canvas.height}
              cornerRadius={state.canvas.cornerRadius}
              dispatch={dispatch}
            />
            <PointList
              points={state.points}
              selectedPointIndex={state.selectedPointIndex}
              dispatch={dispatch}
            />

            <Separator />

            <CanvasSettingsPanel canvas={state.canvas} dispatch={dispatch} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-5">
            <PreviewPanel
              clipPath={derived.clipPath}
              fill={state.fill}
              border={state.border}
              canvas={state.canvas}
            />
            <CodeOutput
              cssSnippet={derived.cssSnippet}
              svgMarkup={derived.svgMarkup}
            />

            <Separator />

            <SettingsPanel
              fill={state.fill}
              border={state.border}
              dispatch={dispatch}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
