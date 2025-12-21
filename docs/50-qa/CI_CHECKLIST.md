# CI Checklist — Bilan Engine

Commands to run in CI for the frontend:

1. `npm install --prefix frontend_nuxt`
2. `npm run --prefix frontend_nuxt typecheck`
3. `npm run --prefix frontend_nuxt bilan:guard`

Where to hook:
- Add a job in your workflow (e.g. `.github/workflows/ci.yml`) that checks out the repo, installs deps, then runs the commands above in order.
- Make sure the job uses a Node version compatible with the `engines` in `frontend_nuxt/package.json` (>=20.19).
