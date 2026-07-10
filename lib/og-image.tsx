import { ImageResponse } from "next/og"

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo"

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 140,
            height: 140,
            marginBottom: 48,
            background: "#fafafa",
            clipPath:
              "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
          }}
        />
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 30,
            color: "#a1a1aa",
            maxWidth: 900,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  )
}
