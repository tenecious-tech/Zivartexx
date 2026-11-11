<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Commissioned (working name)

## What this product is
A reverse marketplace for high-ticket custom goods in Zimbabwe. Instead of
browsing listings, buyers post what they want and verified sellers pitch for
the job with a price and timeline. Categories: furniture, jewelry, tailoring,
and fine art. Art is undervalued locally, so art has two modes:
- Commission: same request/pitch flow as the other categories.
- Showcase: artists list finished pieces at an asking price; buyers browse,
  buy, or make an offer. No bidding window.

## Users
- Buyer: posts requests, compares pitches, selects one seller.
- Seller / artisan / artist: registers once with tags, gets matched to
  relevant requests, submits pitches, lists finished art.
- Admin: verifies sellers, moderates content (internal web tool).

## Core loop
1. Buyer posts a request (category, description, budget range, deadline,
   location, reference photos).
2. Matching engine finds sellers whose profile overlaps: category/subcategory,
   budget tier, and location within their service radius. Rule-based for v1.
   No ML.
3. Bidding runs in two phases:
   - Phase 1, "intent to pitch" (24-48h): sellers signal interest and can ask
     the buyer clarifying questions.
   - Phase 2, "full pitch" (3-7 days, scaled to budget tier): interested
     sellers submit price, timeline, message, portfolio photos.
4. Buyer compares pitches side by side and selects one. This compare screen is
   the most important screen in the product.
5. Deal is confirmed; buyer and seller get an in-app message thread.
6. Deal marked complete, which triggers a review tied to that specific deal.

Sellers have a capacity toggle that pauses notifications when booked out.

## Stack
- Monorepo: Turborepo with pnpm.
- apps/web: Next.js (App Router), TypeScript, Tailwind.
- apps/mobile: React Native with Expo (primary product). Use dev builds, not
  Expo Go, because native modules like @rnmapbox/maps need them.
- Backend: Supabase only (Postgres, Auth, Storage, Edge Functions, Realtime).
  No separate API server unless asked.
- Maps: Mapbox (mapbox-gl on web, @rnmapbox/maps on mobile). Access token via
  env vars. Never hardcode.
- Shared validation: Zod schemas in packages/types, used by web, mobile, and
  Edge Functions.

```
apps/web        Next.js app
apps/mobile     Expo app
packages/ui     design tokens + shared components
packages/types  Zod schemas + inferred TS types
packages/config shared eslint/tsconfig
supabase/       migrations, edge functions, seed data
```

## Conventions
- TypeScript strict. No `any` without a comment explaining why.
- All DB changes go through migrations in supabase/migrations. Never edit the
  schema by hand.
- Row Level Security on every table, written in the same migration as the
  table. Buyers see only their own requests; sellers see only requests
  matched to them; pitches are visible only to the request owner and the
  pitching seller.
- Business rules (matching, window phase transitions, status changes) live in
  Postgres functions or Edge Functions, never only in the client.
- Money: integer minor units plus a currency code. Assume USD; confirm.
- Request status (proposed): open_intent -> open_pitching ->
  awaiting_selection -> selected -> completed, plus cancelled and expired.
- Many users are on mobile with expensive data. Compress images before upload,
  lazy-load lists, and design mobile-first.
- Design direction: warm, editorial, photography-led. Serif display font,
  clean sans body, cream background, restrained accent. Not generic SaaS.
  Tokens live in packages/ui. Never hardcode colors or spacing.
- Prefer reusing packages/ui components over writing one-off ones.

## Decisions already made
- Build and verify the full loop on mobile (Expo) first, then port to web.
  Admin moderation stays an internal web tool.
- Payment, escrow, and delivery are out of scope for v1. Deal confirmation
  hands off to direct buyer/seller contact. "Buy now" on art only updates
  listing status.
- Mapbox demo access (no card) during development.

## Still undecided (do not assume, ask)
- Notification channel for sellers: WhatsApp, SMS, email, push, or a mix.
- Monetization: per-deal fee vs per-lead fee vs other.
- Whether art Showcase ships in v1 alongside Commission.

## How to work
- Jira tickets may arrive in a batch. Queue them, implement one card at a
  time in the order given, and don't skip ahead unless asked.
- Before large changes, state the plan in a few lines and wait for approval.
- If a request conflicts with anything above, say so instead of silently
  choosing.
- Don't add libraries without asking.
