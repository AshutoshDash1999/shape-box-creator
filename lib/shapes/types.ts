export type Point = {
  x: number
  y: number
}

export type FillMode = "solid" | "gradient"

export type FillSettings = {
  mode: FillMode
  color1: string
  color2: string
  gradientAngle: number
}

export type BorderSettings = {
  enabled: boolean
  width: number
  color: string
}

export type CanvasSettings = {
  width: number
  height: number
  snapEnabled: boolean
  gridSize: number
  precision: number
  showSampleContent: boolean
  cornerRadius: number
}

export type ShapeEditorState = {
  points: Point[]
  selectedPointIndex: number | null
  fill: FillSettings
  border: BorderSettings
  canvas: CanvasSettings
}

export type SavedShape = {
  id: string
  name: string
  points: Point[]
  fill: FillSettings
  border: BorderSettings
  createdAt: number
}

export type PresetShape = {
  id: string
  name: string
  points: Point[]
  /** Applied to canvas.cornerRadius on load; omit to leave the user's setting alone. */
  cornerRadius?: number
}
