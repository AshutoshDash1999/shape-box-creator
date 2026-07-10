"use client"

import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

type CodeOutputProps = {
  cssSnippet: string
  svgMarkup: string
}

export function CodeOutput({ cssSnippet, svgMarkup }: CodeOutputProps) {
  return (
    <Tabs defaultValue="css">
      <TabsList>
        <TabsTrigger value="css">CSS</TabsTrigger>
        <TabsTrigger value="svg">SVG</TabsTrigger>
      </TabsList>
      <TabsContent value="css">
        <CodeBlock code={cssSnippet} />
      </TabsContent>
      <TabsContent value="svg">
        <CodeBlock code={svgMarkup} />
      </TabsContent>
    </Tabs>
  )
}

function CodeBlock({ code }: { code: string }) {
  const { copy, copied } = useCopyToClipboard()

  return (
    <div className="relative">
      <pre className="max-h-48 overflow-auto rounded-lg border bg-muted/30 p-3 pr-24 text-xs whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2"
        onClick={() => copy(code)}
        aria-live="polite"
      >
        {copied ? (
          <>
            <CheckIcon /> Copied
          </>
        ) : (
          <>
            <CopyIcon /> Copy
          </>
        )}
      </Button>
    </div>
  )
}
