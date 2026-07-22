---
name: ai-video-studio
description: Generate Remotion-based marketing videos for Yumshoq from a text request, render them to MP4, and save the result into remotion/renders/. Use whenever the user asks for a promo video, product video, teaser, or any Remotion video/animation in this repo.
---

# AI Video Studio — Yumshoq

Turns a text request into a rendered MP4 marketing video using the Remotion
project already scaffolded at `remotion/` in this repo.

## Brand style — Yumshoq

- Soft, light look (cream/warm pastel gradient background)
- Water and foam motif — floating soap bubbles
- Premium, handmade-soap product shots
- Elegant serif type (Georgia in the current composition), warm brown palette
  (`#6b4a3a` text, `#f3e2c7`/`#dcb98a` product tones)

## Project layout

```
remotion/
  src/
    Root.tsx          — registers all <Composition> entries
    Composition.tsx    — YumshoqPromo composition (scenes: brand reveal,
                          product, CTA) with an animated floating-bubble
                          background
    index.css          — Tailwind import (Tailwind v4 is enabled)
  remotion.config.ts   — render config; already points at the sandbox's
                          Chromium build so `remotion render` works offline
  renders/              — rendered MP4s land here (gitignored, kept via .gitkeep)
  package.json          — `npm run dev` (Remotion Studio preview),
                          `npm run render` (renders YumshoqPromo to
                          renders/output.mp4)
```

## Workflow for a text request

1. **Analyze the request** — figure out what the video needs to say (brand
   line, product/benefit, call to action) and roughly how long it should run.
2. **Build a storyboard** — a short list of scenes (e.g. brand reveal →
   product shot → CTA), matching the Yumshoq brand style above.
3. **Create/update the Remotion composition**:
   - For a variation of the existing promo, edit the `defaultYumshoqProps` in
     `remotion/src/Composition.tsx` (brand, tagline, productLine, cta) — no
     new composition needed.
   - For a structurally different video, add a new component + a new
     `<Composition id="..." .../>` entry, and register it in
     `remotion/src/Root.tsx` alongside `YumshoqPromo`.
   - Keep using `AbsoluteFill`, `Sequence`, `spring`, and `interpolate` for
     animation, consistent with the existing scenes (the `Bubble` component
     shows the pattern for the foam/water motif).
   - Real product photos/logo can be dropped into `remotion/public/` (or
     pulled from `assets/` at the repo root) and referenced with
     `staticFile()` once real brand assets are available there.
4. **Render to MP4** from inside `remotion/`:
   ```bash
   cd remotion
   npx remotion render <CompositionId> renders/<descriptive-name>.mp4
   ```
   (`npm run render` is a shortcut for the default `YumshoqPromo` →
   `renders/output.mp4`.) If `node_modules` is missing, run `npm install`
   first.
5. **Save into `remotion/renders/`** — this is already the default output
   directory; do not render anywhere else. These files are gitignored, so
   don't try to commit them — just report the local path back to the user
   (and use `SendUserFile` in Claude Code to actually deliver the video).

## Notes

- This sandbox has no internet access to download Chrome Headless Shell, so
  `remotion.config.ts` pins `Config.setBrowserExecutable(...)` to the
  Playwright Chromium already installed in the environment
  (`/opt/pw-browsers/chromium_headless_shell-1194/...`). Don't remove that.
- If that path doesn't exist in a different environment, fall back to
  `npx remotion render --browser-executable=<path-to-chromium>` or let
  Remotion download its own.
