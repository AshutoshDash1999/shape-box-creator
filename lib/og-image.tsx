import { ImageResponse } from "next/og"

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo"

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

const ACCENT = "#c084fc"
const ACCENT_SOFT = "rgba(192, 132, 252, 0.35)"
const ACCENT_DIM = "rgba(192, 132, 252, 0.14)"

const POLY_SIZE = 170
const RING_INSET = 15
const RING_SIZE = POLY_SIZE + RING_INSET * 2

// Octagon vertices (as fractions) mapped onto the polygon box, offset by
// RING_INSET so they line up with the shape once centered in the ring.
const VERTEX_FRACTIONS: [number, number][] = [
  [0.2, 0],
  [0.8, 0],
  [1, 0.2],
  [1, 0.8],
  [0.8, 1],
  [0.2, 1],
  [0, 0.8],
  [0, 0.2],
]

const VERTICES = VERTEX_FRACTIONS.map(([fx, fy]) => ({
  x: RING_INSET + fx * POLY_SIZE,
  y: RING_INSET + fy * POLY_SIZE,
}))

const GRID_COLUMNS = 6
const GRID_ROWS = 4

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #050109 0%, #120a24 45%, #1c0b3a 100%)",
          color: "#f5f3ff",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* HUD grid backdrop */}
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {Array.from({ length: GRID_COLUMNS - 1 }).map((_, i) => (
            <div
              key={`v-${i}`}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${((i + 1) / GRID_COLUMNS) * 100}%`,
                width: 1,
                display: "flex",
                background: "rgba(192, 132, 252, 0.08)",
              }}
            />
          ))}
          {Array.from({ length: GRID_ROWS - 1 }).map((_, i) => (
            <div
              key={`h-${i}`}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${((i + 1) / GRID_ROWS) * 100}%`,
                height: 1,
                display: "flex",
                background: "rgba(192, 132, 252, 0.08)",
              }}
            />
          ))}
        </div>

        {/* Corner brackets */}
        {[
          { top: 36, left: 36, borderTop: true, borderLeft: true },
          { top: 36, right: 36, borderTop: true, borderRight: true },
          { bottom: 36, left: 36, borderBottom: true, borderLeft: true },
          { bottom: 36, right: 36, borderBottom: true, borderRight: true },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              display: "flex",
              width: 28,
              height: 28,
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              borderTop: pos.borderTop ? `2px solid ${ACCENT_SOFT}` : undefined,
              borderLeft: pos.borderLeft
                ? `2px solid ${ACCENT_SOFT}`
                : undefined,
              borderRight: pos.borderRight
                ? `2px solid ${ACCENT_SOFT}`
                : undefined,
              borderBottom: pos.borderBottom
                ? `2px solid ${ACCENT_SOFT}`
                : undefined,
            }}
          />
        ))}

        {/* Content */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 28,
              fontSize: 20,
              fontFamily: "monospace",
              letterSpacing: 4,
              color: ACCENT,
              textTransform: "uppercase",
            }}
          >
            Polygon.Editor
          </div>

          <div
            style={{
              position: "relative",
              width: RING_SIZE,
              height: RING_SIZE,
              display: "flex",
              marginBottom: 48,
            }}
          >
            {/* Outer halo ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                background: ACCENT_DIM,
                clipPath:
                  "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
              }}
            />

            {/* Filled glowing polygon */}
            <div
              style={{
                position: "absolute",
                top: RING_INSET,
                left: RING_INSET,
                width: POLY_SIZE,
                height: POLY_SIZE,
                display: "flex",
                background: "linear-gradient(135deg, #d8b4fe 0%, #7c3aed 100%)",
                boxShadow: "0 0 60px 12px rgba(168, 85, 247, 0.55)",
                clipPath:
                  "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
              }}
            />

            {/* Vertex handles */}
            {VERTICES.map((v, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  display: "flex",
                  width: 12,
                  height: 12,
                  left: v.x - 6,
                  top: v.y - 6,
                  borderRadius: "50%",
                  background: "#0c0016",
                  border: `2px solid ${ACCENT}`,
                  boxShadow: "0 0 10px 2px rgba(192, 132, 252, 0.7)",
                }}
              />
            ))}

            {/* Coordinate readout on the top-right vertex */}
            <div
              style={{
                position: "absolute",
                display: "flex",
                left: VERTICES[1].x + 10,
                top: VERTICES[1].y - 34,
                fontSize: 13,
                fontFamily: "monospace",
                letterSpacing: 1,
                color: "#e9d5ff",
                background: "rgba(12, 0, 22, 0.7)",
                border: "1px solid rgba(192, 132, 252, 0.4)",
                borderRadius: 4,
                padding: "3px 8px",
              }}
            >
              136, 0
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              color: "#c4b5da",
              maxWidth: 900,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  )
}
