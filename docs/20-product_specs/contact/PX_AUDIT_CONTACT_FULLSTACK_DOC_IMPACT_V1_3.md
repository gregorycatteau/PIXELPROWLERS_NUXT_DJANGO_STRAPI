---
id: PX_AUDIT_CONTACT_FULLSTACK_DOC_IMPACT_V1_3
title: "Audit Doc Impact - Contact full-stack (V1.3)"
version: 1.0.0
status: draft
date: 2026-01-02
owners: ["Marty"]
scope: ["docs/**", "frontend_nuxt/**", "backend_django/**"]
tags: ["audit", "contact", "privacy", "full-stack", "v1.3"]
---

# Audit Doc Impact - Contact full-stack (V1.3)

## 1) Resume executif (<=10 lignes)
- Disruption: la page Contact passe en full-stack (API + DB + email) alors que plusieurs textes suggèrent une posture "front-only" ou "rien n'est envoye".
- Les promesses front-only sont principalement valides pour le diagnostic P1, mais elles ne sont pas toujours explicitement scopees, ce qui peut etre lu comme une promesse globale.
- La page Contact actuelle dit qu'un "espace plus complet" n'existe pas encore, ce qui contredit la realite full-stack.
- Des copies "confidentialite" (page + registry UI texts) promettent "uniquement repondre" sans mentionner retention/purge/logs.
- Le risque principal est un conflit de contrat percu (privacy/retention) et un risque de non-conformite RGPD si les infos de traitement ne sont pas explicites.
- Aucun besoin de bump de version V1.3; des patchs doc cibles suffisent.

## 2) Findings (exhaustif)
| Fichier | Lignes | Extrait court | Type de conflit | Severite |
|---|---:|---|---|---|
| `frontend_nuxt/app/pages/contact.vue:11` | 11 | "Un espace de contact plus complet sera bientot disponible..." | Contrat UX: page affirme "pas encore full-stack" | HIGH |
| `frontend_nuxt/app/pages/confidentialite.vue:12` | 12-15 | "Les donnees collectees ... uniquement a repondre ... page enrichie avant prod" | Privacy copy incomplet (retention/purge/processing) | MED |
| `docs/00-foundations/ui_texts_schema.json:45` | 45 | "On garde seulement ce qu'il faut pour te repondre. Pas de spam." | Promesse generique sans mention retention | MED |
| `docs/00-foundations/ui_texts_schema.json:56` | 56 | "Les donnees collectees via le formulaire..." | Privacy copy incomplet (retention/purge) | MED |
| `docs/20-product_specs/user_stories/parcours_utilisateurs_P1.md:278` | 278-287 | "L'export est 100% client-side... aucune donnee... aucune data upload" | Scope P1 non explicite vs contact full-stack | LOW |
| `docs/20-product_specs/user_stories/parcours_utilisateurs_P1.md:309` | 309-312 | "rien n'etait stocke cote serveur" | Scope P1 non explicite vs contact full-stack | LOW |
| `docs/20-product_specs/user_stories/parcours_utilisateurs_P1.md:361` | 361 | "Aucun mail... P1 ne collecte aucune donnee de contact." | Scope P1 non explicite vs contact full-stack | LOW |
| `docs/40-security/POLITIQUES_OPSEC_PRIVACY.md:54` | 54 | "aucune donnee de P1 n'est captee" | Scope P1 ok, mais a expliciter vs contact | LOW |
| `frontend_nuxt/app/config/journeys/p1CopyV1_3.ts:1` | 1-9 | "front-only... Rien n'est envoye..." | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1QuestionsConfig.ts:248` | 248-259 | "aucune donnee n'est envoyee au serveur" | Copy P1, scope implicite | LOW |
| `frontend_nuxt/app/config/resources/p1ResourcesV1_3.ts:1` | 1-2 | "Registry front-only..." | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/types/journeys/p1.ts:44` | 44-45 | "Plan d'action P1 - front-only" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1ActionPlansV1_0.ts:2` | 2-3 | "front-only... aucune donnee personnelle" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1NarrativesV1_3.ts:752` | 752-764 | "textes front-only... ne jamais envoyer" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1ExportCopyV1_3.ts:1` | 1 | "front-only, ne jamais inclure de donnees brutes" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1SystemCopyV1_3.ts:1` | 1 | "front-only. Aucune donnee brute, aucun envoi backend." | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1SystemicFollowupsV1_3.ts:1` | 1-3 | "front-only... ne jamais les envoyer au backend." | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1SystemicLandingCopyV1_3.ts:1` | 1-2 | "front-only... ne jamais envoyer" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1HypothesesCopyV1_3.ts:1` | 1-2 | "front-only... ne jamais envoyer" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1SystemScalpelsCopyV1_3.ts:1` | 1-2 | "front-only... ne jamais envoyer" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1SystemShiftCopyV1_3.ts:1` | 1 | "front-only... ne pas envoyer au backend" | Commentaires front-only P1 | LOW |
| `frontend_nuxt/app/config/journeys/p1ActionCopyV1_0.ts:3` | 3-14 | "Front-only... sans aucune donnee personnelle" | Commentaires/copy P1 | LOW |
| `docs/20-product_specs/functional/HOMEPAGE_V1_3_SPEC.md:110` | 110-112 | "Privacy-first (zero tracking) / Agregats only" | Promesse high-level a aligner avec contact full-stack | LOW |
| `docs/90-placeholders_archive/legacy_v1_2/10-vision_roadmap/PIXELPROWLERS_V1_2_GAPS_ET_PHASES.md:14` | 14-18,26 | "Front Nuxt statique... Backend: seul endpoint contact... front ne stocke rien" | Archive V1.2, mais assertions front-only | LOW |
| `docs/90-placeholders_archive/legacy_v1_2/20-product_specs/functional/HOME_V1_2_Spec.md:237` | 237,292 | "aucun formulaire... ne collecte aucune donnee personnelle" | Archive V1.2 | LOW |
| `docs/90-placeholders_archive/legacy_v1_2/20-product_specs/functional/PX_V1_2_LONGTAIL_DIAGNOSTIC_FONCTIONNEL.md:17` | 17-18 | "front Nuxt uniquement... pas de stockage serveur" | Archive V1.2 | LOW |
| `docs/90-placeholders_archive/legacy_v1_2/20-product_specs/ux_content/HOME_V1_2_HOMEPAGE_UX_CONTENT_TALA.md:34` | 34-36 | "aucun formulaire" | Archive V1.2 | LOW |
| `docs/20-product_specs/functional/PX_V1_3_X_OPERATION_125_PRODUCT_SPEC.md:92` | 92-94 | "pas de donnees personnelles" | Champ libre Gate 125 (scope specifique) | LOW |

## 3) Documents a mettre a jour (SSOT) - patchs minimaux proposes
1) `frontend_nuxt/app/pages/contact.vue` (lead)
   - Avant: "Un espace de contact plus complet sera bientot disponible..."
   - Apres: "Formulaire de contact traite cote serveur (API + DB) avec retention minimale; voir la politique de confidentialite."

2) `frontend_nuxt/app/pages/confidentialite.vue` + `docs/00-foundations/ui_texts_schema.json`
   - Avant: "donnees ... uniquement repondre" (sans retention/traitement)
   - Apres: "donnees utilisees pour repondre + retention 6 mois + purge auto + logs anonymises + lien vers politique complete."

3) `docs/60-legal/PRIVACY_POLICY_V1.md`
   - Section 2.3 / 5.1 / 6.1: ajouter une phrase explicite "Contact full-stack = API + DB + emails transactionnels", et renvoyer vers retention/purge deja definies.

4) `docs/20-product_specs/user_stories/parcours_utilisateurs_P1.md`
   - Ajouter une phrase de scope apres les passages "rien envoye au serveur": "Scope: donnees du diagnostic P1 uniquement; le contact est un flux separe."

5) `docs/40-security/POLITIQUES_OPSEC_PRIVACY.md`
   - Ajouter un encadre "Exception controlee: Contact full-stack (PII isolees, retention courte, logs no-PII, anti-abus)."

6) `docs/20-product_specs/functional/HOMEPAGE_V1_3_SPEC.md`
   - Dans "Securite & privacy requirements": ajouter un item "Contact full-stack: minimisation + retention 6 mois + purge + logs anonymises".

7) (Optionnel, si documents archives sont reutilises)
   - `docs/90-placeholders_archive/**` : ajouter une note "archive V1.2, ne pas reutiliser pour V1.3".

## 4) Nouveaux artefacts SSOT a creer
1) Spec produit Contact full-stack (V1.3)
   - Chemin propose: `docs/20-product_specs/contact/PX_V1_3_CONTACT_FULLSTACK_SPEC.md`
2) User stories + AC Contact full-stack
   - Extension de `docs/20-product_specs/user_stories/formulaire_contact.md` (passer de draft a active)
3) Decision record
   - Chemin propose: `docs/30-tech_specs/backend/PX_V1_3_CONTACT_FULLSTACK_DECISION_R1.md`
   - Sujet: "Contact full-stack = exception controlee au principe no-retention (scope P1 uniquement)."
4) Addendum privacy/legal
   - Mise a jour de `docs/60-legal/PRIVACY_POLICY_V1.md` + `docs/60-legal/LEGAL_MENTIONS_V1.md`

## 5) Checklist non-regression doc
- `python tools/ssot_lint.py --strict`
- `python3 tools/ssot_generate_indexes.py --check`
- `python tools/ssot_linkcheck.py --strict --no-orphans`

## 6) Recommandations secu doc (anti-oracle + minimisation)
- Erreurs neutres: ne jamais revealer si un email existe ou si un message est stocke.
- Anti-abus: mentionner honeypot + rate limiting + cooldown, sans exposer de details exploitables.
- Logs: jamais d'email, nom, message en clair; IP uniquement hashee/prefixee.
- Retention: afficher clairement la duree (ex. 6 mois contact, 30 jours logs), purge automatique, droit d'effacement.
- Separation des flux: diagnostic P1 reste "front-only"; Contact est un flux separe, avec consentement explicite.

---
### SSOT registry & indexes
Ce document doit etre enregistre dans `docs/00-foundations/ssot_registry.json`.  
L'index generator devra etre relance (ssot_generate_indexes).
