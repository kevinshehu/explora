# Explora

Explora is a premium Angular travel discovery platform focused on the Albanian Riviera and Southern Albania. It helps travelers discover coastal villages, hidden beaches, nature routes, curated tours, estimate package pricing, and continue booking conversations through WhatsApp.

## Tech stack

- Angular 21 (standalone APIs)
- TypeScript
- Tailwind CSS directives integrated into Angular styles
- Strict TypeScript + strict Angular templates

## Features

- Albanian Riviera home page with destination discovery and lightweight price calculators
- South Albania destination listing with search, categories, filters, and sorting
- Destination detail pages with galleries, highlights, and related tours
- Tour listing with filters, sorting, and package cards
- Tour detail pages with itinerary, pricing, includes, exclusions, and WhatsApp CTAs
- Booking flow centered on price calculation and dynamic WhatsApp message handoff
- Responsive layout and reusable component structure

## Available scripts

- `pnpm install` installs dependencies
- `pnpm start` starts the development server
- `pnpm run build` builds the production bundle

## Development scripts

- `pnpm run test` runs frontend tests
- `pnpm run lint` runs ESLint
- `pnpm run verify` runs tests and lint

## Getting started

1. Install dependencies

```bash
pnpm install
```

2. Start local development

```bash
pnpm start
```

3. Build for production

```bash
pnpm run build
```

## Production check

Before publishing, verify these routes:

- `/`
- `/destinations`
- `/destinations/:slug`
- `/tours`
- `/tours/:slug`
- `/booking`
