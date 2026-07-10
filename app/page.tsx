"use client"

import { CodeOutput } from "@/app/_components/shape-editor/code-output"
import { EditorCanvas } from "@/app/_components/shape-editor/editor-canvas"
import { PointList } from "@/app/_components/shape-editor/point-list"
import { PreviewPanel } from "@/app/_components/shape-editor/preview-panel"
import { SettingsPanel } from "@/app/_components/shape-editor/settings-panel"
import { ShapeGallery } from "@/app/_components/shape-editor/shape-gallery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSavedShapes } from "@/hooks/use-saved-shapes"
import { useShapeEditor } from "@/hooks/use-shape-editor"

export default function Page() {
  const { state, dispatch, derived } = useShapeEditor()
  const { shapes: savedShapes, save, remove } = useSavedShapes()

  return (
    <div className="mx-auto flex min-h-svh max-w-7xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Shape Box Creator</h1>
        <p className="text-sm text-muted-foreground">
          Drag polygon points to design unconventional UI blocks, then copy
          the clip-path or SVG.
        </p>
      </header>

      <Card>
        <CardContent>
          <ShapeGallery
            savedShapes={savedShapes}
            onSaveCurrent={(name) =>
              save(name, state.points, state.fill, state.border)
            }
            onRemoveSaved={remove}
            dispatch={dispatch}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
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
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Tabs defaultValue="settings">
              <TabsList className="w-full">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="export">Preview &amp; Export</TabsTrigger>
              </TabsList>
              <TabsContent value="settings">
                <SettingsPanel
                  fill={state.fill}
                  border={state.border}
                  canvas={state.canvas}
                  dispatch={dispatch}
                />
              </TabsContent>
              <TabsContent value="export" className="flex flex-col gap-4">
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
