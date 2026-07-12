"use client"

import Link from "next/link"
import { motion, type Variants } from "motion/react"

import { CodeOutput } from "@/app/_components/shape-editor/code-output"
import { EditorCanvas } from "@/app/_components/shape-editor/editor-canvas"
import { PointList } from "@/app/_components/shape-editor/point-list"
import { PreviewPanel } from "@/app/_components/shape-editor/preview-panel"
import {
  CanvasSettingsPanel,
  SettingsPanel,
} from "@/app/_components/shape-editor/settings-panel"
import { ShapeGallery } from "@/app/_components/shape-editor/shape-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSavedShapes } from "@/hooks/use-saved-shapes"
import { useShapeEditor } from "@/hooks/use-shape-editor"
import { APP_VERSION } from "@/lib/constants"
import { pointsToClipPathPolygon } from "@/lib/shapes/path-utils"
import Hearts from "reicon-react/icons/Hearts"

const GITHUB_REPO_URL = "https://github.com/AshutoshDash1999/shape-box-creator"

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "grayscale(1) brightness(1.5) blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "grayscale(0) brightness(1) blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
  },
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.94 10.94 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  )
}

export default function Page() {
  const { state, dispatch, derived } = useShapeEditor()
  const { shapes: savedShapes, save, remove } = useSavedShapes()

  const markBackground =
    state.fill.mode === "gradient"
      ? `linear-gradient(${state.fill.gradientAngle}deg, ${state.fill.color1}, ${state.fill.color2})`
      : state.fill.color1

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto flex min-h-svh max-w-7xl flex-col gap-8 p-4 sm:p-6"
    >
      <motion.header
        variants={itemVariants}
        className="flex items-center gap-3.5"
      >
        <motion.span
          aria-hidden
          initial={{ scale: 0.6, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="size-9 shrink-0 rounded-md ring-1 ring-mat-border"
          style={{
            clipPath: pointsToClipPathPolygon(state.points, 1),
            background: markBackground,
          }}
        />
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-extrabold tracking-tight">
              Shape Box Creator
            </h1>
            <span className="rounded-full border px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              v{APP_VERSION}
            </span>
          </div>
          <p className="text-base text-muted-foreground">
            Drag polygon points to design unconventional UI blocks, then copy
            the clip-path or SVG.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          title="Enjoying it? Star the repo on GitHub!"
          nativeButton={false}
          render={
            <Link href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" />
          }
        >
          <GithubIcon className="size-4" />
          Star on GitHub
        </Button>
      </motion.header>

      <motion.section
        variants={cardVariants}
        className="flex flex-col gap-3 rounded-xl border bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
      >
        <ShapeGallery
          savedShapes={savedShapes}
          onSaveCurrent={(name) =>
            save(name, state.points, state.fill, state.border)
          }
          onRemoveSaved={remove}
          dispatch={dispatch}
        />
      </motion.section>

      <motion.div className="grid gap-6 lg:grid-cols-[1fr_400px]" variants={containerVariants}>
        <motion.div variants={cardVariants}>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              Editor
              <span className="font-mono text-base font-normal text-muted-foreground tabular-nums">
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
        </motion.div>

        <motion.div variants={cardVariants}>
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
        </motion.div>
      </motion.div>

      <motion.footer
        variants={itemVariants}
        className="mt-auto flex items-center justify-center gap-1 pb-2 text-center text-base text-muted-foreground"
      >
        Made with{" "}
        <motion.span
          animate={{ scale: [1, 1.18, 1] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            repeatDelay: 1.4,
            ease: "easeInOut",
          }}
          className="inline-flex"
        >
          <Hearts color="red" className="text-red-500" weight="Filled" />
        </motion.span>{" "}
        by{" "}
        <Link
          href="https://ashutoshdash.in/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Ashutosh Dash
        </Link>
      </motion.footer>
    </motion.div>
  )
}
