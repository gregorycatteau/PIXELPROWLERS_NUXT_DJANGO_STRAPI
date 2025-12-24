---
id: HOMEPAGE_V1_3_SPEC
version: "1.3"
status: active
date: 2025-12-24
owners: ["Marty"]
  - Marty
scope: product_specs
tags:
  - product_specs
  - homepage
  - v1.3
  - conversion
  - privacy-first
---

# Homepage V1.3 — Spécification Fonctionnelle

> **Version** : 1.3  
> **Statut** : Active  
> **Dernière mise à jour** : 24 décembre 2025

---

## 1. Objectifs de la page

### 1.1 Objectifs principaux

| Objectif | Métrique | Cible |
|----------|----------|-------|
| **Conversion** | Visiteurs → Parcours P1 | ≥15% clics CTA principal |
| **Orientation** | Compréhension de l'offre | ≤30s avant premier scroll |
| **Confiance** | Perception de crédibilité | Privacy-first visible, pas de bullshit |

### 1.2 Objectifs secondaires

- **Autonomie** : Permettre l'exploration sans friction (ressources, parcours)
- **Qualification** : Filtrer les visiteurs non-cibles naturellement
- **Ancrage émotionnel** : Reconnaître la difficulté, sans victim blaming

### 1.3 Anti-objectifs

Ce que la homepage ne doit PAS faire :
- ❌ Promettre des résultats garantis
- ❌ Utiliser du jargon marketing vide
- ❌ Créer de l'urgence artificielle
- ❌ Collecter des données sans consentement explicite
- ❌ Afficher des assets externes non contrôlés

---

## 2. Personas cibles et anti-personas

### 2.1 Personas cibles (prioritaires)

| Persona | Description | Besoin principal | Parcours recommandé |
|---------|-------------|------------------|---------------------|
| **Marie — Directrice d'asso** | Asso 5-15 salariés, fatiguée par la bureaucratie | Clarifier les vrais problèmes vs symptômes | P1 (Diagnostic structurel) |
| **Jean — Cofondateur SCIC** | SCIC en croissance, tensions gouvernance | Cartographier les blocages systémiques | P1 |
| **Leila — Coordinatrice collectif** | Collectif militant, épuisement décisionnel | Reprendre du pouvoir d'agir | P1 |

### 2.2 Personas secondaires

| Persona | Description | Parcours | Accès |
|---------|-------------|----------|-------|
| **Antoine — Formateur ESS** | Cherche ressources pédagogiques | Ressources | `/ressources` |
| **Sophie — Consultante** | Veille sectorielle | Ressources + Contact | `/ressources`, `/contact` |

### 2.3 Anti-personas (à filtrer)

| Anti-persona | Raison | Signal de filtrage |
|--------------|--------|-------------------|
| **Chercheur de solutions magiques** | Attentes irréalistes | Ton "lucide" du copy |
| **Curieux passif** | Pas prêt à s'engager | Pas de CTA "en savoir plus" vide |
| **Concurrent / scrapper** | Extraction de contenu | Rate limiting + pas de remote assets |

---

## 3. Architecture de page

### 3.1 Structure des sections

```
┌─────────────────────────────────────────────────┐
│  HERO                                           │
│  - Proposition de valeur                        │
│  - CTA principal "Commencer un parcours"        │
│  - Sous-texte confiance (privacy-first)         │
├─────────────────────────────────────────────────┤
│  SECTION "POURQUOI C'EST DUR"                   │
│  - Reconnaissance des difficultés (VUCA/BANI)   │
│  - Mirage bureaucratique                        │
│  - Pas de victim blaming                        │
├─────────────────────────────────────────────────┤
│  SECTION "PARCOURS"                             │
│  - P1 en mise en avant (pilote)                 │
│  - Grille des autres parcours (P2, P3, P4)      │
│  - CTA secondaire par parcours                  │
├─────────────────────────────────────────────────┤
│  SECTION "RESSOURCES"                           │
│  - Autonomie, offline-first                     │
│  - Preview 3-4 ressources                       │
│  - CTA "Voir toutes les ressources"             │
├─────────────────────────────────────────────────┤
│  SECTION "ACCOMPAGNEMENT / FORMATION"           │
│  - Pont vers Opération 125                      │
│  - Bootcamp présentiel (ville + date)           │
│  - CTA "En savoir plus"                         │
├─────────────────────────────────────────────────┤
│  SECTION "CONFIANCE / DOCTRINE"                 │
│  - Privacy-first (zéro tracking)                │
│  - Agrégats only (pas de données brutes)        │
│  - Open source / transparence                   │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
│  - Liens légaux (Politique de confidentialité)  │
│  - Contact                                      │
│  - Réseaux (si applicable)                      │
└─────────────────────────────────────────────────┘
```

### 3.2 Ordre des sections

| Position | Section | Objectif |
|----------|---------|----------|
| 1 | Hero | Accrocher + convertir |
| 2 | Pourquoi c'est dur | Ancrage émotionnel + qualification |
| 3 | Parcours | Présenter l'offre principale |
| 4 | Ressources | Montrer l'autonomie possible |
| 5 | Accompagnement | Upsell formation présentielle |
| 6 | Confiance | Rassurer sur les valeurs |
| 7 | Footer | Navigation + légal |

---

## 4. CTAs et règles de routing

### 4.1 Liste des CTAs

| CTA | Label | Route | Type | Section |
|-----|-------|-------|------|---------|
| `cta-hero-primary` | "Commencer un parcours" | `/parcours/p1` | Primary | Hero |
| `cta-journey-p1` | "Lancer le diagnostic" | `/parcours/p1` | Secondary | Parcours |
| `cta-journey-p2` | "Parcours P2" | `/parcours/p2` | Tertiary | Parcours |
| `cta-journey-p3` | "Parcours P3" | `/parcours/p3` | Tertiary | Parcours |
| `cta-journey-p4` | "Parcours P4" | `/parcours/p4` | Tertiary | Parcours |
| `cta-resources` | "Voir les ressources" | `/ressources` | Secondary | Ressources |
| `cta-operation-125` | "En savoir plus" | `/contact` | Secondary | Accompagnement |
| `cta-contact` | "Nous contacter" | `/contact` | Link | Footer |

### 4.2 Route allowlist

```typescript
// Seules ces routes sont autorisées pour les CTAs homepage
const HOMEPAGE_CTA_ROUTES = [
  '/parcours/p1',
  '/parcours/p2',
  '/parcours/p3',
  '/parcours/p4',
  '/ressources',
  '/contact',
] as const;
```

### 4.3 Règles de routing

| Règle | Description |
|-------|-------------|
| **No external URLs** | Aucun lien vers des domaines externes |
| **No target _blank** | Pas d'ouverture dans un nouvel onglet (sauf PDF) |
| **No utm params** | Pas de tracking marketing dans les URLs |
| **Allowlist only** | Seules les routes de l'allowlist sont autorisées |

---

## 5. Contenu et copy requirements

### 5.1 Ton éditorial

| Aspect | Directive |
|--------|-----------|
| **Posture** | Lucide, sans concession, pas de bullshit |
| **Empathie** | Reconnaître la difficulté sans infantiliser |
| **Clarté** | Phrases courtes, pas de jargon inutile |
| **Honnêteté** | Pas de promesse impossible |

### 5.2 Phrases interdites

```
❌ "Solution magique"
❌ "Résultats garantis"
❌ "Transformez votre organisation en X jours"
❌ "Rejoignez les +1000 organisations..."
❌ "Offre limitée"
❌ "Dernière chance"
❌ "Sans engagement" (ambigu)
```

### 5.3 Claims autorisés

```
✅ "Un diagnostic structurel en 20-30 minutes"
✅ "Vos données restent dans votre navigateur"
✅ "Aucun tracking, aucune publicité"
✅ "Open source et transparent"
✅ "Conçu par et pour les structures de l'ESS"
```

### 5.4 Exemple de copy Hero

```markdown
# Votre organisation mérite mieux que des rustines

Associations, SCIC, collectifs : les problèmes que vous affrontez 
ne sont pas des défauts de méthode. Ce sont des symptômes.

**Commencez un diagnostic structurel** pour identifier les vrais leviers 
de transformation — sans bullshit, sans collecte de données.

[Commencer un parcours] → /parcours/p1
```

---

## 6. Accessibilité et UX requirements

### 6.1 Navigation clavier

| Élément | Comportement |
|---------|--------------|
| CTAs | Focus visible, activables avec Enter/Space |
| Cards | Navigation Tab entre cards |
| Skip link | "Aller au contenu principal" en premier élément |

### 6.2 Contrastes

| Élément | Ratio minimum |
|---------|--------------|
| Texte body | 4.5:1 (WCAG AA) |
| Texte large (>18px) | 3:1 |
| CTAs | 4.5:1 sur fond + 3:1 sur hover |

### 6.3 Mobile

| Aspect | Requirement |
|--------|-------------|
| Breakpoint | Mobile-first, responsive |
| Touch targets | ≥44px × 44px |
| Hero | Image optimisée, pas de vidéo autoplay |
| Scroll | Smooth scroll natif, pas de hijack |

### 6.4 Screen readers

| Élément | Implementation |
|---------|----------------|
| Images | `alt` descriptif ou `aria-hidden` si décoratif |
| Sections | `<section>` avec `aria-labelledby` |
| Navigation | `<nav>` avec `aria-label` |
| CTAs | Libellé explicite, pas "cliquez ici" |

---

## 7. Performance requirements

### 7.1 Règles assets

| Règle | Implementation |
|-------|----------------|
| **No remote assets** | Toutes les images en `/public/` |
| **No CDN tiers** | Pas de Google Fonts, pas de CDN externes |
| **Images optimisées** | WebP/AVIF + fallback PNG, lazy loading |
| **No video autoplay** | Pas de vidéo en lecture automatique |

### 7.2 Métriques cibles

| Métrique | Cible | Outil |
|----------|-------|-------|
| LCP (Largest Contentful Paint) | <2.5s | Lighthouse |
| FID (First Input Delay) | <100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | <0.1 | Lighthouse |
| Bundle JS homepage | <100KB gzipped | Build stats |

### 7.3 Images Hero

```
public/
├── mainhero.avif      (format moderne, <50KB)
├── mainhero.webp      (fallback, <80KB)
└── mainhero.png       (fallback legacy, <150KB)
```

---

## 8. Sécurité et privacy requirements

### 8.1 Rappels doctrine

| Principe | Implementation |
|----------|----------------|
| **Zéro tracking tiers** | Pas de GA, pas de FB Pixel, pas de UTM |
| **Pas de remote assets** | Guard `no-remote-assets.mjs` actif |
| **Pas de v-html** | Guard `no_v_html_guard.ts` actif |
| **Rate limiting contact** | Anti-abus sans service tiers |

### 8.2 Données affichées

| Donnée | Règle |
|--------|-------|
| Adresses bootcamp | ❌ Jamais sur la homepage (ville + date OK) |
| Emails personnels | ❌ Jamais affichés |
| Téléphones | ❌ Jamais affichés |
| Noms complets | ❌ Pas de doxxing |

### 8.3 Liens sécurité

- **Politique de confidentialité** : `/politique-confidentialite` → `PRIVACY_POLICY_V1`
- **Doctrine sécurité** : `docs/40-security/SECURITY_INDEX.md`
- **Guards registry** : `docs/40-security/contracts/PX_V1_3_SECURITY_GUARDS_REGISTRY.md`

---

## 9. Definition of Done (DoD)

### 9.1 Tests smoke

| Test | Critère |
|------|---------|
| Rendu | Page s'affiche sans erreur console |
| CTAs | Tous les CTAs pointent vers routes allowlist |
| Images | Toutes les images se chargent (local) |
| Mobile | Responsive OK sur 375px, 768px, 1024px |
| A11y | Score Lighthouse Accessibility ≥90 |
| Performance | LCP <2.5s, CLS <0.1 |

### 9.2 Guards actifs

| Guard | Fichier | Rôle |
|-------|---------|------|
| No remote assets | `no-remote-assets.mjs` | Bloque assets externes |
| No v-html | `no_v_html_guard.ts` | Bloque rendu HTML non sécurisé |
| No innerHTML | `no-innerhtml.mjs` | Bloque manipulation DOM dangereuse |

### 9.3 Checklist validation

```markdown
- [ ] Tous les CTAs utilisent routePath de l'allowlist
- [ ] Aucune URL externe dans le code
- [ ] Images en WebP/AVIF avec fallback
- [ ] Skip link présent et fonctionnel
- [ ] Contrastes WCAG AA validés
- [ ] Mobile responsive testé
- [ ] Lighthouse Performance ≥80
- [ ] Lighthouse Accessibility ≥90
- [ ] ssot_lint passe sans erreur
```

---

## 10. Références documentaires

### 10.1 Documents canoniques

| Document | Chemin | Rôle |
|----------|--------|------|
| **Privacy Policy** | `docs/60-legal/PRIVACY_POLICY_V1.md` | Politique de confidentialité |
| **Parcours P1** | `docs/20-product_specs/user_stories/PX_V1_3_PARCOURS_UTILISATEURS_P1.md` | User stories parcours |
| **Resources Library** | `docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md` | Spec bibliothèque ressources |
| **Operation 125** | `docs/20-product_specs/functional/PX_V1_3_X_OPERATION_125_PRODUCT_SPEC.md` | Spec bootcamp présentiel |
| **Security Guards** | `docs/40-security/contracts/PX_V1_3_SECURITY_GUARDS_REGISTRY.md` | Registry guards sécurité |

### 10.2 Implémentation frontend

| Fichier | Rôle |
|---------|------|
| `frontend_nuxt/app/pages/index.vue` | Page homepage |
| `frontend_nuxt/app/components/home/` | Composants homepage |
| `frontend_nuxt/app/config/homeJourneysConfig.ts` | Config parcours homepage |

### 10.3 Design System

| Document | Chemin |
|----------|--------|
| CTA Migration | `docs/20-product_specs/ux_ui/DS_CTA_MIGRATION_AUDIT_V1.md` |
| Card Migration | `docs/20-product_specs/ux_ui/DS_CARD_MIGRATION_AUDIT_V1.md` |
| Token Registry | `docs/20-product_specs/ux_ui/DS_TOKEN_REGISTRY_V1.md` |

---

## Annexe : Matrice CTAs

```
┌────────────────────────────────────────────────────────────────┐
│  CTA                    │ Route         │ Type      │ Section  │
├────────────────────────────────────────────────────────────────┤
│  "Commencer un parcours"│ /parcours/p1  │ Primary   │ Hero     │
│  "Lancer le diagnostic" │ /parcours/p1  │ Secondary │ Parcours │
│  "Parcours P2"          │ /parcours/p2  │ Tertiary  │ Parcours │
│  "Parcours P3"          │ /parcours/p3  │ Tertiary  │ Parcours │
│  "Parcours P4"          │ /parcours/p4  │ Tertiary  │ Parcours │
│  "Voir les ressources"  │ /ressources   │ Secondary │ Resources│
│  "En savoir plus"       │ /contact      │ Secondary │ Op. 125  │
│  "Nous contacter"       │ /contact      │ Link      │ Footer   │
│  "Politique confidentialité"│ /politique │ Link     │ Footer   │
└────────────────────────────────────────────────────────────────┘
```

---

*Document canonique — SSOT PixelProwlers V1.3*
