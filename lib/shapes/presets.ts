import type { PresetShape } from "@/lib/shapes/types"

function pts(...coords: [number, number][]) {
  return coords.map(([x, y]) => ({ x, y }))
}

export const PRESET_SHAPES: PresetShape[] = [
  {
    id: "rectangle",
    name: "Rectangle",
    points: pts([0, 0], [100, 0], [100, 100], [0, 100]),
  },
  {
    id: "notched-corner",
    name: "Notched Corner",
    points: pts([0, 0], [80, 0], [100, 20], [100, 100], [0, 100]),
  },
  {
    id: "double-notch",
    name: "Double Notch",
    points: pts(
      [0, 0],
      [80, 0],
      [100, 20],
      [100, 100],
      [20, 100],
      [0, 80]
    ),
  },
  {
    id: "chevron-arrow-tab",
    name: "Chevron Tab",
    points: pts(
      [0, 0],
      [85, 0],
      [100, 50],
      [85, 100],
      [0, 100],
      [15, 50]
    ),
  },
  {
    id: "bookmark-ribbon-tail",
    name: "Bookmark",
    points: pts([0, 0], [100, 0], [100, 100], [50, 80], [0, 100]),
  },
  {
    id: "ticket-stub",
    name: "Ticket Stub",
    points: pts(
      [0, 0],
      [100, 0],
      [100, 45],
      [90, 50],
      [100, 55],
      [100, 100],
      [0, 100],
      [0, 55],
      [10, 50],
      [0, 45]
    ),
  },
  {
    id: "zigzag-edge",
    name: "Zigzag Edge",
    points: pts(
      [0, 0],
      [100, 0],
      [100, 85],
      [87.5, 100],
      [75, 85],
      [62.5, 100],
      [50, 85],
      [37.5, 100],
      [25, 85],
      [12.5, 100],
      [0, 85]
    ),
  },
  {
    id: "hexagon",
    name: "Hexagon",
    points: pts([25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]),
  },
  {
    id: "octagon",
    name: "Octagon",
    points: pts(
      [30, 0],
      [70, 0],
      [100, 30],
      [100, 70],
      [70, 100],
      [30, 100],
      [0, 70],
      [0, 30]
    ),
  },
  {
    id: "slanted-parallelogram",
    name: "Slanted Block",
    points: pts([15, 0], [100, 0], [85, 100], [0, 100]),
  },
  {
    id: "asymmetric-cut-corners",
    name: "Asymmetric Cut",
    points: pts([10, 0], [70, 0], [100, 30], [100, 100], [0, 100], [0, 10]),
  },
  {
    id: "cyber-button",
    name: "Cyber Button",
    points: pts([10, 0], [100, 0], [100, 84], [90, 100], [0, 100], [0, 16]),
    cornerRadius: 6,
  },
  {
    id: "step-notch",
    name: "Step Notch",
    points: pts(
      [0, 0],
      [58, 0],
      [58, 14],
      [86, 14],
      [86, 0],
      [100, 0],
      [100, 100],
      [0, 100]
    ),
    cornerRadius: 4,
  },
  {
    id: "hud-card",
    name: "HUD Card",
    points: pts(
      [9, 0],
      [60, 0],
      [65, 12],
      [87, 12],
      [92, 0],
      [100, 0],
      [100, 86],
      [91, 100],
      [40, 100],
      [35, 88],
      [13, 88],
      [8, 100],
      [0, 100],
      [0, 14]
    ),
    cornerRadius: 8,
  },
]
