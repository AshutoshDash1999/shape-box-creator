"use client"

import * as React from "react"
import { ShapesIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type {
  BorderSettings,
  CanvasSettings,
  FillSettings,
} from "@/lib/shapes/types"

type PreviewPanelProps = {
  clipPath: string
  fill: FillSettings
  border: BorderSettings
  canvas: CanvasSettings
}

export function PreviewPanel({
  clipPath,
  fill,
  border,
  canvas,
}: PreviewPanelProps) {
  const [sampleText, setSampleText] = React.useState("Unconventional Block")
  const matRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  // clip-path: path() (used whenever cornerRadius > 0) bakes absolute pixel
  // coordinates sized to canvas.width/height. Shrinking the box itself (e.g.
  // via maxWidth) would desync those coordinates from the box's actual size
  // and crop/shift the shape, so instead the box always stays at its true
  // size and is scaled down visually with a transform when it doesn't fit.
  React.useEffect(() => {
    const mat = matRef.current
    if (!mat) return
    const update = () => {
      const available = mat.clientWidth
      setScale(Math.min(1, available / canvas.width))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(mat)
    return () => observer.disconnect()
  }, [canvas.width])

  const background =
    fill.mode === "gradient"
      ? `linear-gradient(${fill.gradientAngle}deg, ${fill.color1}, ${fill.color2})`
      : fill.color1

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold tracking-wide text-muted-foreground uppercase">
          Export
        </span>
        <span className="rounded-full bg-cta/15 px-3 py-1 font-mono text-base font-medium text-cta">
          Ready
        </span>
      </div>
      <div
        ref={matRef}
        className="flex items-center justify-center rounded-xl border border-mat-border bg-mat p-8"
      >
        <div
          style={{ width: canvas.width * scale, height: canvas.height * scale }}
        >
          <div
            className="flex items-center justify-center shadow-lg transition-[clip-path] duration-200"
            style={{
              width: canvas.width,
              height: canvas.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              clipPath,
              background,
              border: border.enabled
                ? `${border.width}px solid ${border.color}`
                : undefined,
            }}
          >
            {canvas.showSampleContent && (
              <div className="mix-blend-difference flex flex-col items-center gap-1.5 px-4 text-center text-white">
                <ShapesIcon className="size-6" />
                <span className="text-base font-medium whitespace-pre-wrap">
                  {sampleText}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {canvas.showSampleContent && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sample-text" className="text-base font-normal text-muted-foreground">
            Sample text
          </Label>
          <Textarea
            id="sample-text"
            value={sampleText}
            onChange={(event) => setSampleText(event.target.value)}
            placeholder="Type some text to preview inside the block…"
            rows={3}
            className="text-base"
          />
        </div>
      )}
    </div>
  )
}
