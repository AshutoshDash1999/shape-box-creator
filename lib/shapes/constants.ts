import { PRESET_SHAPES } from "@/lib/shapes/presets"
import type {
  BorderSettings,
  CanvasSettings,
  FillSettings,
  ShapeEditorState,
} from "@/lib/shapes/types"

export const DEFAULT_FILL: FillSettings = {
  mode: "solid",
  color1: "#6366f1",
  color2: "#8b5cf6",
  gradientAngle: 135,
}

export const DEFAULT_BORDER: BorderSettings = {
  enabled: false,
  width: 2,
  color: "#312e81",
}

export const DEFAULT_CANVAS: CanvasSettings = {
  width: 320,
  height: 200,
  snapEnabled: false,
  gridSize: 5,
  precision: 1,
  showSampleContent: true,
  cornerRadius: 0,
}

const DEFAULT_PRESET =
  PRESET_SHAPES.find((p) => p.id === "notched-corner") ?? PRESET_SHAPES[0]

export const DEFAULT_STATE: ShapeEditorState = {
  points: DEFAULT_PRESET.points,
  selectedPointIndex: null,
  fill: DEFAULT_FILL,
  border: DEFAULT_BORDER,
  canvas: DEFAULT_CANVAS,
}
