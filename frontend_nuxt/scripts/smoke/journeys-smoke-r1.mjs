const BASE_URL = process.env.JOURNEY_SMOKE_BASE_URL || 'http://127.0.0.1:3010';

const SLUGS = ['parcours-p2', 'parcours-p3', 'parcours-p4', 'parcours-p5'];
const VALID_STEPS = ['E0_intro', 'E_panorama', 'E_bilan', 'E_resources', 'E_exit'];
const INVALID_STEPS = ['__proto__', 'constructor', 'prototype', 'E666', 'E666_nope'];

// Helper pour construire l'URL d'une requete de smoke.
const buildUrl = (slug, step) => {
  const stepParam = step ? `?step=${encodeURIComponent(step)}` : '';
  return `${BASE_URL}/parcours/${encodeURIComponent(slug)}${stepParam}`;
};

// Helper pour verifier un status attendu (avec log clair).
const expectStatus = async (label, url, expected) => {
  const res = await fetch(url, { method: 'GET' });
  const ok = res.status === expected;
  const icon = ok ? '✅' : '❌';
  console.log(`${icon} ${label} -> ${res.status} (attendu ${expected})`);
  return ok;
};

const run = async () => {
  console.log('🔍 journeys-smoke-r1 — Checks');
  console.log(`Base URL: ${BASE_URL}`);

  const failures = [];

  for (const slug of SLUGS) {
    for (const step of VALID_STEPS) {
      const ok = await expectStatus(`${slug} step=${step}`, buildUrl(slug, step), 200);
      if (!ok) failures.push(`${slug}:${step}`);
    }
  }

  for (const slug of SLUGS) {
    for (const step of INVALID_STEPS) {
      const ok = await expectStatus(`${slug} step=${step}`, buildUrl(slug, step), 200);
      if (!ok) failures.push(`${slug}:${step}`);
    }
  }

  const unknownOk = await expectStatus('unknown slug', buildUrl('definitely-not-a-real-journey', 'E0_intro'), 404);
  if (!unknownOk) failures.push('unknown-slug');

  if (failures.length) {
    console.log('\n❌ journeys-smoke-r1 — FAIL');
    failures.forEach((item) => console.log(`   - ${item}`));
    process.exit(1);
  }

  console.log('\n✅ journeys-smoke-r1 — OK');
};

run();
