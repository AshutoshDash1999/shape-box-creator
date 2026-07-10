import type { Point } from "@/lib/shapes/types"

export const MIN_POINTS = 3

export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value))
}

export function snapToGrid(value: number, gridSize: number): number {
  if (gridSize <= 0) return value
  return Math.round(value / gridSize) * gridSize
}

/** Resolves a raw drag/input value into a valid stored coordinate: clamp, then
 * snap, then clamp again — snapping a clamped 100 to a grid can push it back
 * out of range (e.g. gridSize 8 rounds 100 to 104). */
export function resolvePercent(
  value: number,
  gridSize: number,
  snapEnabled: boolean
): number {
  let next = clampPercent(value)
  if (snapEnabled) {
    next = snapToGrid(next, gridSize)
  }
  return clampPercent(next)
}

function formatNumber(value: number, precision: number): string {
  return Number(value.toFixed(precision)).toString()
}

export function pointsToClipPathPolygon(
  points: Point[],
  precision: number
): string {
  const coords = points
    .map((p) => `${formatNumber(p.x, precision)}% ${formatNumber(p.y, precision)}%`)
    .join(", ")
  return `polygon(${coords})`
}

export function pointsToCssSnippet(
  points: Point[],
  width: number,
  height: number,
  precision: number,
  cornerRadius = 0,
  selector = ".shape"
): string {
  const clipPath = pointsToClipPathValue(
    points,
    width,
    height,
    precision,
    cornerRadius
  )
  // path() coordinates are baked in px, so rounded output only lines up when
  // the element is sized to match; unrounded polygon() is percentage-based
  // and needs no fixed size.
  const sizing =
    cornerRadius > 0 ? `\n  width: ${width}px;\n  height: ${height}px;` : ""
  return `${selector} {${sizing}\n  clip-path: ${clipPath};\n}`
}

/** Straight-line path, or (cornerRadius > 0) each vertex clipped back along
 * its two edges and bridged with a quadratic Bezier through the original
 * vertex — the standard "round an arbitrary polygon" construction. Radius is
 * clamped per-corner to half the shorter adjacent edge so curves never
 * overshoot past a neighboring vertex. */
function buildPathD(
  scaled: Point[],
  precision: number,
  cornerRadius: number
): string {
  const n = scaled.length
  if (n === 0) return ""

  const fmt = (v: number) => formatNumber(v, precision)

  if (cornerRadius <= 0) {
    const [first, ...rest] = scaled
    const moveTo = `M${fmt(first.x)},${fmt(first.y)}`
    const lineTos = rest.map((p) => `L${fmt(p.x)},${fmt(p.y)}`).join(" ")
    return `${moveTo} ${lineTos} Z`.trim()
  }

  const inPoints: Point[] = []
  const outPoints: Point[] = []

  for (let i = 0; i < n; i++) {
    const prev = scaled[(i - 1 + n) % n]
    const curr = scaled[i]
    const next = scaled[(i + 1) % n]

    const toPrev = { x: prev.x - curr.x, y: prev.y - curr.y }
    const toNext = { x: next.x - curr.x, y: next.y - curr.y }
    const distPrev = Math.hypot(toPrev.x, toPrev.y)
    const distNext = Math.hypot(toNext.x, toNext.y)
    const radius =
      distPrev === 0 || distNext === 0
        ? 0
        : Math.min(cornerRadius, distPrev / 2, distNext / 2)

    inPoints.push({
      x: curr.x + (toPrev.x / (distPrev || 1)) * radius,
      y: curr.y + (toPrev.y / (distPrev || 1)) * radius,
    })
    outPoints.push({
      x: curr.x + (toNext.x / (distNext || 1)) * radius,
      y: curr.y + (toNext.y / (distNext || 1)) * radius,
    })
  }

  let d = `M${fmt(inPoints[0].x)},${fmt(inPoints[0].y)}`
  for (let i = 0; i < n; i++) {
    d += ` Q${fmt(scaled[i].x)},${fmt(scaled[i].y)} ${fmt(outPoints[i].x)},${fmt(outPoints[i].y)}`
    const nextIn = inPoints[(i + 1) % n]
    d += ` L${fmt(nextIn.x)},${fmt(nextIn.y)}`
  }
  return `${d} Z`
}

export function pointsToSvgPathD(
  points: Point[],
  width: number,
  height: number,
  precision: number,
  cornerRadius = 0
): string {
  if (points.length === 0) return ""

  const scaled = points.map((p) => ({
    x: (p.x / 100) * width,
    y: (p.y / 100) * height,
  }))

  return buildPathD(scaled, precision, cornerRadius)
}

/** clip-path polygons only draw straight edges, so rounded corners require
 * switching to clip-path: path(), which is defined in the box's pixel
 * coordinates rather than percentages. */
export function pointsToClipPathValue(
  points: Point[],
  width: number,
  height: number,
  precision: number,
  cornerRadius = 0
): string {
  if (cornerRadius <= 0) return pointsToClipPathPolygon(points, precision)
  return `path('${pointsToSvgPathD(points, width, height, precision, cornerRadius)}')`
}

export function pointsToSvgMarkup(
  points: Point[],
  width: number,
  height: number,
  precision: number,
  cornerRadius = 0
): string {
  const d = pointsToSvgPathD(points, width, height, precision, cornerRadius)
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n  <path d="${d}" />\n</svg>`
}

/** One ghost marker per edge, at its midpoint, for click-to-insert-a-point. */
export function getEdgeMidpoints(points: Point[]): Point[] {
  return points.map((p, i) => {
    const next = points[(i + 1) % points.length]
    return { x: (p.x + next.x) / 2, y: (p.y + next.y) / 2 }
  })
}

export function addPointAt(
  points: Point[],
  afterIndex: number,
  point: Point
): Point[] {
  const next = [...points]
  next.splice(afterIndex + 1, 0, point)
  return next
}

export function removePointAt(points: Point[], index: number): Point[] {
  if (points.length <= MIN_POINTS) return points
  return points.filter((_, i) => i !== index)
}

export function movePointTo(
  points: Point[],
  index: number,
  point: Point
): Point[] {
  return points.map((p, i) => (i === index ? point : p))
}
