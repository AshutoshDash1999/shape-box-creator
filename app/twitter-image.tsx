import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image"

export const size = OG_IMAGE_SIZE
export const contentType = "image/png"

export default function TwitterImage() {
  return renderOgImage()
}
