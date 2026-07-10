"use client"

import * as React from "react"
import { SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SaveShapeDialogProps = {
  onSave: (name: string) => void
}

export function SaveShapeDialog({ onSave }: SaveShapeDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    setName("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <SaveIcon /> Save shape
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save this shape</DialogTitle>
          <DialogDescription>
            Give it a name to find it later under My Shapes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="shape-name">Name</Label>
          <Input
            id="shape-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Ticket card"
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave()
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
