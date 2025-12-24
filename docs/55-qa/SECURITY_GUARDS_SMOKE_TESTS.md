---
id: SECURITY_GUARDS_SMOKE_TESTS
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan", "Eva"]
  - Marty
scope:
  - docs/55-qa/**
tags:
  - qa
  - testing
---

# Security Guards — Smoke tests

## Positifs
- `npm run --prefix frontend_nuxt no-v-html:guard` => OK
- `npm run --prefix frontend_nuxt data-only:guard` => OK
- `npm run --prefix frontend_nuxt no-console:guard` => OK

## Negatifs (self-test data-only)
Les payloads suivants doivent echouer si injectes dans un module data-only :
- `<script>alert(1)</script>`
- `javascript:alert(1)`
- `data:text/html;base64,PHNjcmlwdD4=`
- `//evil.com`
- `http://evil`
- `https://evil`
- `mailto:test@example.org`
- `tel:+33600000000`
- `blob:deadbeef`
- `file:///etc/passwd`
- `ws://evil`
- `wss://evil`
- controle ASCII (\u0007)

Attendu: `data-only:guard` FAIL.

## v-html
- Ajouter volontairement `v-html` dans un composant doit faire echouer `no-v-html:guard`.
