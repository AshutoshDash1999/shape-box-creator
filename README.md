# Shape Box Creator

A visual editor for designing unconventional UI blocks with polygon clip-paths. Drag points on a canvas to shape a box, then copy out the generated CSS `clip-path` or SVG markup.

<img width="1280" height="832" alt="Screenshot 2026-07-10 at 6 40 24 PM" src="https://github.com/user-attachments/assets/5cdb075e-8ee1-4905-81a8-00b674afe199" />

## Features

- **Interactive point editor** — drag, add, and remove polygon points on a snap-to-grid canvas
- **Shape gallery** — start from presets (notched corners, chevrons, tickets, HUD-style frames, etc.) or save your own
- **Fill & border controls** — solid or gradient fills, adjustable borders and corner radius
- **Live preview** with generated **CSS** and **SVG** output, ready to copy into your project
- Saved shapes persist locally between sessions

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the editor.

## Scripts

| Command           | Description                     |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start the local dev server       |
| `npm run build`    | Build for production             |
| `npm run start`    | Run the production build         |
| `npm run lint`     | Lint the codebase                |
| `npm run format`   | Format files with Prettier       |
| `npm run typecheck`| Type-check with TypeScript       |

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [shadcn/ui](https://ui.shadcn.com) components

## Project structure

```
app/
  _components/shape-editor/   # Editor canvas, point list, gallery, settings, preview, code output
  page.tsx                    # Main app page
components/ui/                # shadcn/ui primitives
hooks/                        # Shape editor state & saved-shapes persistence
lib/shapes/                   # Presets, types, path/clip-path utilities, local storage
```

## Adding shadcn/ui components

```bash
npx shadcn@latest add button
```

This places new UI components in the `components/ui` directory, importable as:

```tsx
import { Button } from "@/components/ui/button"
```
