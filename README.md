# WOW CONCEPT — Gallery of Contemporary Art & Architectural Objects

A mobile-first web gallery/catalog app built with **React 19 + TypeScript + Vite 8
+ Tailwind CSS v4**. Browse, filter, and share a curated collection of art,
decor, and architectural lots — each with a detail view, light/dark theme, and
native share support.

## Tech Stack

- **React 19** / **TypeScript 5.9** — strict typing, functional components,
  custom hooks for all stateful logic
- **Vite 8** — dev server + custom build pipeline (`vite build` → flattens
  output so the static site can be deployed straight from the repo root)
- **Tailwind CSS v4** (`@tailwindcss/vite`) — utility-first styling with
  CSS-variable-driven theming (`--bg-primary`, `--text-primary`, etc.) for
  instant light/dark switching without a re-render flash
- **lucide-react** — icon set
- **sharp** — build-time image optimization pipeline (Node script, see below)
- **ESLint 10 + Prettier + typescript-eslint** — linting/formatting, `tsc --noEmit`
  clean on every build

## Architecture

The app started as a single ~330-line `App.tsx` and was refactored into a
hook-based architecture to separate concerns:

```
src/
├── App.tsx                 — shell/layout only (~180 lines, down from ~330)
├── hooks/
│   ├── useGallery.ts        — filtering, search, sorting, favorites state
│   ├── useTheme.ts           — light/dark theme persistence + toggle
│   └── useShare.ts           — Web Share API wrapper with clipboard fallback
├── components/
│   ├── Header.tsx             — category nav, theme toggle, share trigger
│   ├── LotCard.tsx            — grid card for a single lot
│   ├── LotDetailModal.tsx    — full lot detail view (image, price, request CTA)
│   ├── BottomNav.tsx          — mobile fixed bottom navigation
│   ├── PrivateFittingBanner.tsx
│   └── Toast.tsx              — transient notification component
├── data/galleryData.ts      — catalog data (155+ lots)
├── utils/format.ts           — price formatting (Intl.NumberFormat, UZS)
└── types.ts                  — shared TypeScript types (LotItem, etc.)
```

All business logic (filtering/sorting/search/theme/share) lives in hooks, kept
out of the component tree — components stay presentational.

## Performance: Image Optimization Pipeline

The product catalog ships 300+ photos. A custom Node script
(`scripts/optimize-images.mjs`, built on **sharp**) re-encodes every image at
build time:

- Resizes to a 1600px max width (`withoutEnlargement`)
- Re-encodes JPEG at quality 80 with `mozjpeg`, PNG at quality 80
- Backs up originals automatically before touching anything (`product-backup/`,
  gitignored) so the optimization is non-destructive and repeatable
- Prints a before/after size report per file and in aggregate

**Result on this catalog: 310 images, 131.4 MB → 40.6 MB (−69%)**, run via
`npm run optimize:images`.

## Scripts

```bash
npm run dev              # Vite dev server
npm run build             # type-check-free prod build, flattens dist/ to repo root for static hosting
npm run lint               # ESLint
npm run format              # Prettier --write on src/
npm run optimize:images      # sharp-based image compression pass
```

## Notable implementation details

- **Theming** is done entirely through CSS custom properties consumed by
  Tailwind's arbitrary-value syntax (`bg-[var(--bg-primary)]`), so switching
  themes is a single class toggle with no component re-render cost.
- **Sharing** (`useShare`) uses the native Web Share API where available and
  falls back gracefully (clipboard + toast) on desktop browsers that don't
  support it.
- **Responsive grid** catalog layout with a dedicated empty state when a
  category filter returns no lots.
- Lint/type hygiene: no `any`, no unused vars, `__dirname` replaced with
  `import.meta.dirname` in `vite.config.ts` for ESM compatibility.

## Roadmap / known next steps

Tracked internally (see `TECH-IMPROVEMENTS.md` in this repo for the full,
prioritized list): pre-commit hooks (Husky + lint-staged), GitHub Actions CI,
WebP/AVIF + responsive `srcset` images, list virtualization for 300+ item
catalogs, headless CMS for content editing without redeploys, and a Vitest
test suite.

---

*This repository showcases the frontend architecture and build tooling of the
WOW CONCEPT catalog app. Product data and imagery belong to the original
business and are included only as they ship with the public site.*
