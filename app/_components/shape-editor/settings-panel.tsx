"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { ShapeEditorAction } from "@/hooks/use-shape-editor"
import type { BorderSettings, CanvasSettings, FillSettings } from "@/lib/shapes/types"

type CanvasSettingsPanelProps = {
  canvas: CanvasSettings
  dispatch: React.Dispatch<ShapeEditorAction>
}

export function CanvasSettingsPanel({
  canvas,
  dispatch,
}: CanvasSettingsPanelProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-base font-semibold tracking-wide text-muted-foreground uppercase">
        Canvas
      </h3>
      <SliderField
        label="Width"
        value={canvas.width}
        min={80}
        max={640}
        step={4}
        suffix="px"
        onChange={(width) => dispatch({ type: "SET_CANVAS", canvas: { width } })}
      />
      <SliderField
        label="Height"
        value={canvas.height}
        min={80}
        max={640}
        step={4}
        suffix="px"
        onChange={(height) =>
          dispatch({ type: "SET_CANVAS", canvas: { height } })
        }
      />
      <SliderField
        label="Corner radius"
        value={canvas.cornerRadius}
        min={0}
        max={100}
        step={1}
        suffix="px"
        onChange={(cornerRadius) =>
          dispatch({ type: "SET_CANVAS", canvas: { cornerRadius } })
        }
      />
      <div className="flex items-center justify-between">
        <Label htmlFor="snap-toggle" className="text-base font-normal text-muted-foreground">
          Snap to grid
        </Label>
        <Switch
          id="snap-toggle"
          checked={canvas.snapEnabled}
          onCheckedChange={(snapEnabled) =>
            dispatch({ type: "SET_CANVAS", canvas: { snapEnabled } })
          }
        />
      </div>
      {canvas.snapEnabled && (
        <SliderField
          label="Grid size"
          value={canvas.gridSize}
          min={1}
          max={25}
          step={1}
          suffix="%"
          onChange={(gridSize) =>
            dispatch({ type: "SET_CANVAS", canvas: { gridSize } })
          }
        />
      )}
      <div className="flex items-center justify-between gap-2">
        <Label className="text-base font-normal text-muted-foreground">
          Output precision
        </Label>
        <Select
          value={String(canvas.precision)}
          onValueChange={(value) =>
            dispatch({
              type: "SET_CANVAS",
              canvas: { precision: Number(value) },
            })
          }
        >
          <SelectTrigger size="sm" aria-label="Output precision">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 decimals</SelectItem>
            <SelectItem value="1">1 decimal</SelectItem>
            <SelectItem value="2">2 decimals</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label
          htmlFor="sample-content-toggle"
          className="text-base font-normal text-muted-foreground"
        >
          Show sample content
        </Label>
        <Switch
          id="sample-content-toggle"
          checked={canvas.showSampleContent}
          onCheckedChange={(showSampleContent) =>
            dispatch({ type: "SET_CANVAS", canvas: { showSampleContent } })
          }
        />
      </div>
    </section>
  )
}

type SettingsPanelProps = {
  fill: FillSettings
  border: BorderSettings
  dispatch: React.Dispatch<ShapeEditorAction>
}

export function SettingsPanel({
  fill,
  border,
  dispatch,
}: SettingsPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <h3 className="text-base font-semibold tracking-wide text-muted-foreground uppercase">
          Fill
        </h3>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant={fill.mode === "solid" ? "default" : "outline"}
            onClick={() => dispatch({ type: "SET_FILL", fill: { mode: "solid" } })}
          >
            Solid
          </Button>
          <Button
            size="sm"
            variant={fill.mode === "gradient" ? "default" : "outline"}
            onClick={() =>
              dispatch({ type: "SET_FILL", fill: { mode: "gradient" } })
            }
          >
            Gradient
          </Button>
        </div>
        <ColorField
          label={fill.mode === "gradient" ? "Color 1" : "Color"}
          value={fill.color1}
          onChange={(color1) => dispatch({ type: "SET_FILL", fill: { color1 } })}
        />
        {fill.mode === "gradient" && (
          <>
            <ColorField
              label="Color 2"
              value={fill.color2}
              onChange={(color2) =>
                dispatch({ type: "SET_FILL", fill: { color2 } })
              }
            />
            <SliderField
              label="Angle"
              value={fill.gradientAngle}
              min={0}
              max={360}
              step={5}
              suffix="°"
              onChange={(gradientAngle) =>
                dispatch({ type: "SET_FILL", fill: { gradientAngle } })
              }
            />
          </>
        )}
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold tracking-wide text-muted-foreground uppercase">
            Border
          </h3>
          <Switch
            checked={border.enabled}
            onCheckedChange={(enabled) =>
              dispatch({ type: "SET_BORDER", border: { enabled } })
            }
          />
        </div>
        {border.enabled && (
          <>
            <SliderField
              label="Width"
              value={border.width}
              min={1}
              max={16}
              step={1}
              suffix="px"
              onChange={(width) =>
                dispatch({ type: "SET_BORDER", border: { width } })
              }
            />
            <ColorField
              label="Color"
              value={border.color}
              onChange={(color) =>
                dispatch({ type: "SET_BORDER", border: { color } })
              }
            />
          </>
        )}
      </section>
    </div>
  )
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix = "",
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-base font-normal text-muted-foreground">
          {label}
        </Label>
        <span className="font-mono text-base tabular-nums text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        value={value}
        onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      />
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-base font-normal text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-8 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
          aria-label={`${label} swatch`}
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-28 font-mono text-base"
        />
      </div>
    </div>
  )
}
