---
id: PX_V1_3_BILAN_COHERENCE_POLICY_DECISION_R1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan", "Marty"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "bilan", "adr", "policy", "security"]
---

# PX V1.3 — Bilan Coherence Policy (Decision R1)

## Decision
Un bilan = un contrat universel.

Tous les parcours (P1..P5 + parcours generes) doivent produire un ViewModel conforme au contrat UniversalBilanViewModel v1.

## Motivation
- Eviter les bilans custom qui divergent (UX et data).
- Rendre la securite "agregats only" enforceable par guards.
- Faciliter l'industrialisation des parcours generes.

## Regles
1) **Separation stricte data vs presentation**
   - Adapters/composables produisent le VM.
   - UI consomme le VM sans logique metier.
2) **Interdiction des bilans custom**
   - Toute variante doit etre encadree par extension du VM, jamais par fork UI.
3) **Agregats only**
   - Aucun champ de reponse brute ou PII dans le VM.
4) **Allowlist ressources**
   - Liens internes + SafeDeepLinkKit uniquement.

## Impact architecture
- **Production**: adapter bilan (parcours) -> UniversalBilanViewModel.
- **Consommation**: GlobalBilanEngine + DS cells.
- **Gating**: conserve dans l'orchestrateur et les guards existants.

## Consequences
- Toute nouvelle feature bilan doit d'abord evoluer le contrat VM.
- Les parcours existants doivent migrer vers le VM universel sans duplication.

## References
- `docs/30-tech_specs/frontend/PX_V1_3_UNIVERSAL_BILAN_VIEWMODEL_RFC_V1.md`
- `docs/30-tech_specs/frontend/PX_V1_3_BILAN_UI_KIT_SPEC_V1.md`
