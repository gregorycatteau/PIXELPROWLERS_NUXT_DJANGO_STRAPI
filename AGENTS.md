# AGENTS.md — PixelProwlers Studio (repo rules for Codex/Cline/humans)

This file is the **source of truth** for how automated agents (Codex/Cline/etc.) and humans must work inside this repo.

If you are an agent: follow these rules **strictly**. If a rule conflicts with a user instruction, **stop and ask** (do not guess).

---

## 0) Goals (why this exists)

- Keep the repo **secure-by-default** (no XSS, no remote assets surprise, no data leaks).
- Keep the UX consistent (Design System cells + guards).
- Keep changes minimal, reviewable, and reproducible.

---

## 1) Stack & conventions

### Frontend
- Nuxt 4 + TypeScript
- TailwindCSS 4 (dark by default)
- **No inline styles** in templates
- Component order: `<template>`, `<script setup lang="ts">`, `<style scoped>`
- Prefer DS components over ad-hoc UI.

### Backend / Other
- Django exists in the monorepo, but this file is mainly for the Nuxt frontend and SSOT docs.

---

## 2) Security rules (non-negotiable)

### Forbidden patterns
- **NO `v-html`**
- **NO `.innerHTML` / `.outerHTML` / `insertAdjacentHTML`**
- **NO remote assets in CSS or Vue templates**
- No new network calls in DS catalog components
- No “query parsing au feeling”: deep links must be centralized

These are enforced by CI guards. Do not bypass them.

### Data sovereignty
- Resources library pages (`/ressources` and `/ressources/[slug]`) must be **local registry only**.
- Do not fetch resources from the network.
- 404 responses must be **neutral** (no stack traces, no internal details).

---

## 3) Deep links (SafeDeepLinkKit)

### Rule
All links to `/ressources` must be built and parsed via **SafeDeepLinkKit**.
No manual concatenation like:
- `'/ressources?category=' + x`
- `useRoute().query.category` parsing directly in feature code (unless your DS/kit already does it)

### Allowlist (current)
- `q`
- `category`
- `limit`
- `offset`

Anything else is forbidden.

### Validation / anti-DoS
When parsing deep link inputs:
- Clamp `limit` to a safe maximum (recommendation: 1..50)
- Clamp `offset` to a safe maximum (recommendation: 0..5000)
- Clamp `q` length (recommendation: max 120 chars)
- Enforce `category` as a strict enum; invalid values must fallback neutrally

---

## 4) Resources Registry V0 (local-only)

### Source files
- `frontend_nuxt/app/config/resources/registryV0.ts`
- `frontend_nuxt/app/config/resources/registryV0.data.mjs`

### Registry constraints
- Must be typed (no `any`)
- Slugs must be stable and URL-safe
- No external scripts, no remote images
- If you add links, prefer **safe internal redirects** or clearly-marked external URLs (and never render raw HTML)

### Safety guard
A CI guard exists for registry safety:
- `frontend_nuxt/scripts/guards/resources-registry-v0-r1.mjs`

If your change breaks it: fix the change, not the guard.

---

## 5) SSOT docs rules

SSOT scripts live in `tools/` at repo root:
- `python tools/ssot_lint.py --strict`
- `python3 tools/ssot_generate_indexes.py --check` (or `--apply`)
- `python tools/ssot_linkcheck.py --strict --no-orphans`

If you add or rename SSOT docs, you must keep indexes in sync.

---

## 6) Quality gates (what must be green)

Before declaring “done”, run:

### SSOT (repo root)
- `python tools/ssot_lint.py --strict`
- `python3 tools/ssot_generate_indexes.py --check`
- `python tools/ssot_linkcheck.py --strict --no-orphans`

### Frontend (frontend_nuxt/)
- `npm run typecheck`
- `npm run build`
- `npm run guards:ci`

If any gate fails, fix the root cause (do not weaken gates).

---

## 7) Change discipline (how to edit safely)

- Keep diffs minimal and targeted.
- Do not “format the whole file” unless explicitly asked.
- Avoid large refactors during small fixes.
- When changing an API signature, update all call sites and type exports consistently.

Recommended commits:
1) Docs-only (SSOT sync)
2) Frontend code changes

---

## 8) If you are unsure
Stop and ask for clarification rather than guessing.

(Yes, this repo is strict. That’s the point.)
