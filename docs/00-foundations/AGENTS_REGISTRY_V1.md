---
id: AGENTS_REGISTRY_V1
version: "1.3"
status: active
date: 2025-12-24
owners: ["Jared", "Marty"]
scope: governance
tags: ["agents", "ssot", "ownership", "registry"]
---

# AGENTS_REGISTRY_V1 — Registre des Agents PixelProwlers

## Objectif

Ce document définit le roster officiel des agents PixelProwlers et établit les conventions d'ownership pour le SSOT. Les `displayName` listés ici sont la **source de vérité unique** pour le champ `owners` dans les frontmatters.

## Source Machine-Readable

```
agents/agents_registry.json
```

Ce fichier JSON est la source canonique. Ce document MD est la référence humaine pour la gouvernance.

---

## Roster Agents (V1)

| displayName | slug    | Domaines Primaires                        |
|-------------|---------|-------------------------------------------|
| Bruce       | bruce   | Data, Database, PostgreSQL, Encryption    |
| Claire      | claire  | Email Marketing, CRM, Analytics           |
| Dan         | dan     | Frontend, UX Audit, Components, A11y      |
| Eva         | eva     | Security, OPSEC, Privacy, Threats         |
| Heider      | heider  | Animations, GSAP, Scroll, Visual Design   |
| Jared       | jared   | Project Coordination, Governance, SSOT    |
| Jonas       | jonas   | Authentication, Identity, SSO, Access     |
| Julien      | julien  | SEO Technique, Crawl, Indexation          |
| Marty       | marty   | Product, Roadmap, Prioritization          |
| Nova        | nova    | Prompts, Visual Generation, Aesthetics    |
| Rand        | rand    | SEO Stratégie, Content Planning           |
| Sarah       | sarah   | UX Animation, Micro-interactions, GSAP    |
| Shafi       | shafi   | Encrypted Contexts, Privacy, Backups      |
| Shay        | shay    | CI/CD, DevSecOps, Infra, Monitoring       |
| Talia       | talia   | UX Content, Copywriting, CTA, Conversion  |
| Tom         | tom     | Backend, API, Architecture, Permissions   |

---

## Convention Owners SSOT

### Format

```yaml
owners: ["DisplayName1", "DisplayName2"]
```

### Règles

1. **Majuscule initiale** : `Eva`, pas `eva` ou `EVA`
2. **1-2 owners max** par document (sauf exception justifiée)
3. **Jamais vide** : chaque doc doit avoir au moins 1 owner
4. **DisplayName exact** : utiliser la colonne `displayName` ci-dessus

### Exemples

✅ Correct :
```yaml
owners: ["Eva", "Dan"]
owners: ["Marty"]
```

❌ Incorrect :
```yaml
owners: []
owners: ["eva", "dan"]
owners: ["Eva Galperin"]
```

---

## RACI V1 Compact

| Domaine SSOT              | Accountable | Responsible    | Consulted   | Informed       |
|---------------------------|-------------|----------------|-------------|----------------|
| **00-foundations**        | Jared       | Marty          | Eva, Dan    | All            |
| **10-vision_roadmap**     | Marty       | Marty          | Jared       | All            |
| **20-product_specs**      | Marty       | Marty, Talia   | Dan, Heider | Claire         |
| **30-tech_specs/frontend**| Dan         | Dan, Heider    | Sarah       | Marty          |
| **30-tech_specs/backend** | Tom         | Tom            | Shay        | Dan            |
| **30-tech_specs/quality** | Dan         | Dan, Eva       | Tom         | Jared          |
| **30-tech_specs/cms**     | Shay        | Shay, Dan      | Tom         | Marty          |
| **40-security**           | Eva         | Eva, Dan       | Shafi, Tom  | All            |
| **50-measurement**        | Claire      | Claire, Marty  | Julien      | All            |
| **55-qa**                 | Dan         | Dan, Eva       | Tom         | Jared          |
| **60-legal**              | Eva         | Eva, Marty     | Shafi       | All            |
| **70-seo**                | Rand        | Rand, Julien   | Marty       | Dan            |
| **90-placeholders**       | Jared       | Jared          | Marty       | All            |
| **99_handoff**            | Heider      | Heider, Dan    | Marty       | All            |

---

## Évolution du Registry

### Ajouter un agent

1. Créer `agents/profiles/{slug}_agent.json` avec structure complète
2. Régénérer registry : `python3 tools/agents_generate_registry.py`
3. Mettre à jour ce document (roster + RACI)
4. Mettre à jour `ownershipMatrix` dans `ssot_registry.json` si pertinent

### Retirer un agent

1. Archiver le profil dans `agents/profiles/_archived/`
2. Retirer du registry JSON
3. Réassigner tous les `owners` dans les frontmatters
4. Mettre à jour ce document

---

## Historique

| Version | Date       | Changement                               |
|---------|------------|------------------------------------------|
| 1.3     | 2025-12-24 | Création initiale - 16 agents            |
