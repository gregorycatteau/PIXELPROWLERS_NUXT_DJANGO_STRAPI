---
id: PX_V1_3_P2_P5_JOURNEY_VISIBILITY_R1
version: 1.0.0
status: active
date: 2026-01-03
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journeys", "resources", "security"]
---

# P2-P5 Journey Visibility and Resources Gate (R1)

## Invariants
- Prod is P1 only.
- P2-P5 return a strict 404 in prod (same behavior as unknown slug).
- Dev can allow P2-P5 only under an explicit allowlist flag.
- No remote assets, no v-html, no innerHTML, no tech reveal.

## Journey visibility rules
- Each journey manifest declares `visibility: "prod" | "dev"`.
- Prod behavior: only `visibility: "prod"` is allowed.
- Dev behavior: `visibility: "dev"` is allowed only if an explicit allowlist matches.
- Allowlist matches journey id or slug.

### Flags
- `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST`: comma-separated ids/slugs or `*`/`all`.

Examples:
- Allow P2 only: `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=p2`
- Allow P2+P3: `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=p2,p3`
- Allow all dev journeys: `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=all`

## Resources filtering (P2-P5)
- StepResourcesE3 must only render resources whose `relatedJourneys` includes the current journey id.
- If no resources match, show a neutral empty state (no tech details).
- `recommendResourcesFromBilan` must also respect the journey filter when `journeyId` is provided.

## Definition of Done (DoD)
- P1 remains accessible in prod.
- P2-P5 are strict 404 in prod from both middleware and page validation.
- P2-P5 can be enabled in dev only with an explicit allowlist flag.
- StepResourcesE3 never shows resources outside the current journey.
- New guards pass in CI.

## Guards / CI
- `frontend_nuxt/scripts/guards/journey-prod-p1-only-r1.mjs`
- `frontend_nuxt/scripts/guards/resources-filter-by-journey-r1.mjs`

## Verification commands
- Dev (P2 allowed): `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=p2 npm run dev`
- Prod build: `NODE_ENV=production npm run build` and request `/parcours/parcours-p2` -> 404
- CI: `npm run typecheck`, `npm run guards:ci`, `npm run build`
