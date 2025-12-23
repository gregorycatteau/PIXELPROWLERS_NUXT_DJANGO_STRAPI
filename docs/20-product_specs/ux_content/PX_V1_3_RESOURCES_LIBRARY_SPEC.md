# PX_V1_3_RESOURCES_LIBRARY_SPEC

> **Version** : 1.0  
> **Date** : 2024-12-23  
> **Statut** : Draft — En attente de validation PO  
> **Auteur** : Cline (AI Assistant)

---

## 1. Intentions Produit & Périmètre

### 1.1 Vision

La page **Bibliothèque Ressources** offre un accès en **exploration libre** (mode LIBRARY) à l'ensemble des ressources du catalogue PixelProwlers. Contrairement au mode PRESCRIPTION (3-7 items max, contextualisés dans un parcours/bilan), ce mode permet à l'utilisateur de naviguer, filtrer et découvrir des ressources selon ses propres critères.

### 1.2 Bibliothèque vs Prescription

| Aspect | Mode PRESCRIPTION | Mode LIBRARY |
|--------|-------------------|--------------|
| **Contexte** | Dans un bilan/parcours | Page dédiée autonome |
| **Sélection** | 3-7 items max, curés par l'IA | Catalogue complet |
| **Navigation** | Linéaire, guidée | Libre, exploratoire |
| **Filtres** | Aucun (items pré-sélectionnés) | Tags, type, effort, impact |
| **Tri** | Par pertinence IA | Multiple (récent, effort, impact) |
| **Composant** | `PPResourcesShell` + `PPResourceCard` | Même composants, mode="library" |

### 1.3 Objectifs Business

1. **Augmenter l'autonomie** : L'utilisateur peut explorer sans être dans un parcours
2. **Enrichir le SEO** : Page indexable avec contenu structuré
3. **Créer un hub de référence** : Point d'entrée unique pour toutes les ressources
4. **Préparer la monétisation** : Base pour des ressources premium futures

### 1.4 Ce qui est HORS SCOPE (v1)

- ❌ Recherche full-text server-side (v2)
- ❌ Personnalisation par profil utilisateur
- ❌ Système de favoris / bookmarks
- ❌ Commentaires / ratings
- ❌ Contenu premium / paywall

---

## 2. Personas & Jobs-to-be-done

### 2.1 Persona Primaire : "L'Explorateur Curieux"

**Profil** : Fondateur/entrepreneur early-stage qui a terminé un parcours et veut approfondir certains sujets.

**Jobs-to-be-done** :
- "Je veux trouver des ressources sur un thème précis sans refaire tout le parcours"
- "Je cherche des outils concrets pour un problème spécifique"
- "Je veux comparer plusieurs approches sur un même sujet"

### 2.2 Persona Secondaire : "Le Visiteur Direct"

**Profil** : Personne arrivant par SEO ou recommandation, n'ayant pas encore fait de parcours.

**Jobs-to-be-done** :
- "Je veux voir ce que PixelProwlers propose avant de m'engager dans un parcours"
- "Je cherche une ressource spécifique qu'on m'a recommandée"

### 2.3 Persona Tertiaire : "Le Consultant Externe"

**Profil** : Coach/consultant qui accompagne des startups et cherche des ressources à partager.

**Jobs-to-be-done** :
- "Je veux des ressources filtrées par effort/impact pour mes clients"
- "Je cherche des templates/outils à recommander"

---

## 3. IA / Navigation

### 3.1 Position dans l'architecture

```
/
├── /parcours/[id]         (parcours P1, P2, P3...)
├── /ressources            ← PAGE LIBRARY (nouveau)
├── /contact
└── /mentions-legales
```

### 3.2 Points d'entrée

| Source | CTA | Destination |
|--------|-----|-------------|
| Header principal | Lien "Ressources" | `/ressources` |
| Bilan (après section prescription) | "Voir toutes les ressources" | `/ressources?filter=...` |
| Footer | Lien "Bibliothèque" | `/ressources` |
| Homepage (How We Work) | "Explorer nos outils" | `/ressources?kind=tool` |

### 3.3 Deep linking

La page supporte les query params pour deep linking :
- `/ressources?kind=tool` → Filtré sur les outils
- `/ressources?tags=marketing,growth` → Filtré sur tags
- `/ressources?sort=impact` → Trié par impact

---

## 4. UX Détaillée

### 4.1 Recherche

**Phase R1** : Client-side filtering uniquement
- Input de recherche filtrant `title` et `description`
- Debounce 300ms
- Highlight des termes trouvés (optionnel R2)

**Phase R2** : Server-side avec indexation
- Elastic-search ou Meilisearch
- Recherche full-text avec ranking
- Autocomplete

### 4.2 Filtres

```typescript
interface ResourceFilters {
  kind?: ResourceKind[];      // tool | read | watch | template
  tags?: string[];            // Tags libres (multi-select)
  effort?: EffortLevel[];     // low | medium | high
  impact?: ImpactLevel[];     // low | medium | high
  language?: string[];        // fr | en (futur)
}
```

**UX Filtres** :
- Chips interactifs pour chaque catégorie
- Multi-select possible
- Compteur de résultats en temps réel
- Bouton "Effacer les filtres"

**Positionnement** :
- Mobile : Drawer collapsible en haut
- Desktop : Sidebar gauche sticky

### 4.3 Tri

Options de tri :
| Label | Clé | Description |
|-------|-----|-------------|
| Recommandé | `default` | Ordre éditorial (position manuelle) |
| Plus récent | `updatedAt:desc` | Date de mise à jour |
| Effort croissant | `effort:asc` | Du plus rapide au plus long |
| Impact décroissant | `impact:desc` | Du plus impactant au moins |

### 4.4 Pagination / Affichage

**Choix R1** : Pagination classique (12 items/page)
- Simple à implémenter
- Bon pour SEO (pages distinctes)
- Prévisible pour l'utilisateur

**R2 potentiel** : Virtual list + infinite scroll
- Meilleure UX pour gros catalogues (100+ items)
- Nécessite plus de complexité

**Justification R1** : Catalogue initial < 50 items, pagination suffisante.

### 4.5 États UI

| État | Trigger | Affichage |
|------|---------|-----------|
| **Loading** | Fetch initial | Skeleton grid (6 cards) |
| **Empty** | Catalogue vide | Message + CTA vers parcours |
| **No Results** | Filtres sans match | "Aucune ressource ne correspond" + suggestion |
| **Error** | Erreur réseau/data | Message d'erreur + retry |
| **Success** | Data chargée | Grid de PPResourceCard |

**Empty State Copy** :
> "Aucune ressource disponible pour le moment. Découvrez nos parcours pour des recommandations personnalisées."

**No Results Copy** :
> "Aucune ressource ne correspond à vos critères. Essayez d'élargir vos filtres ou de rechercher un autre terme."

---

## 5. DS Mapping

### 5.1 Composants à utiliser

| Composant | Rôle dans Library |
|-----------|-------------------|
| `PPResourcesShell` | Container principal (titre, description) |
| `PPResourceCard` | Carte individuelle ressource |
| `PPChip` (action) | Filtres interactifs |
| `PPChip` (tag) | Tags de catégorisation |
| `PPChip` (stat) | Métriques (effort, impact) |
| `PPBadge` (status) | Statut ("Nouveau", "Mis à jour") |
| `PPBadge` (info) | Type de ressource |

### 5.2 Extension PPResourcesShell

**Props actuelles** :
- `title`, `description`, `density`, `sectionId`

**Props à ajouter (R1)** :
```typescript
interface PPResourcesShellProps {
  // ... existing
  mode?: 'prescription' | 'library';  // default: 'prescription'
  showFilters?: boolean;               // default: false
  showSearch?: boolean;                // default: false
  showSort?: boolean;                  // default: false
}
```

### 5.3 Variants PPChip / PPBadge

**PPChip usage** :
- `stat` : Effort ("5 min"), Impact ("Fort")
- `tag` : Catégories libres ("Marketing", "Product")
- `action` : Filtres cliquables

**PPBadge usage** :
- `status` : "Nouveau", "Mis à jour"
- `info` : Type ("Outil", "Lecture", "Vidéo", "Template")
- `risk` : Non utilisé dans ce contexte

---

## 6. Modèle Data-Only (TypeScript)

### 6.1 Interface ResourceItem

```typescript
/**
 * ResourceItem — Modèle data-only pour une ressource
 * RÈGLES STRICTES :
 * - Pas de HTML
 * - Pas de Markdown "riche" (seulement plain text)
 * - Pas de remote assets (images/vidéos intégrées)
 * - Liens externes validés (protocol allowlist)
 */
export interface ResourceItem {
  /** Identifiant unique (UUID ou slug) */
  id: string;

  /** Titre court (max 80 caractères) */
  title: string;

  /** Description plain-text (max 200 caractères) */
  description: string;

  /** Type de ressource */
  kind: ResourceKind;

  /** URL externe (http/https uniquement) */
  href?: string;

  /** Route interne (mutually exclusive avec href) */
  to?: string;

  /** Tags de catégorisation (lowercase, no spaces) */
  tags: string[];

  /** Niveau d'effort */
  effort: EffortLevel;

  /** Niveau d'impact */
  impact: ImpactLevel;

  /** Langue du contenu */
  language: 'fr' | 'en';

  /** Date de dernière mise à jour (ISO 8601) */
  updatedAt: string;

  /** Domaine source pour affichage (liens externes) */
  sourceDomain?: string;

  /** Position pour tri éditorial */
  position?: number;

  /** Statut pour badge */
  status?: ResourceStatus;
}

export type ResourceKind = 'tool' | 'read' | 'watch' | 'template';

export type EffortLevel = 'low' | 'medium' | 'high';

export type ImpactLevel = 'low' | 'medium' | 'high';

export type ResourceStatus = 'new' | 'updated' | null;
```

### 6.2 Labels Mapping

```typescript
export const RESOURCE_KIND_LABELS: Record<ResourceKind, string> = {
  tool: 'Outil',
  read: 'Lecture',
  watch: 'Vidéo',
  template: 'Template',
};

export const EFFORT_LABELS: Record<EffortLevel, string> = {
  low: '5 min',
  medium: '15-30 min',
  high: '1h+',
};

export const IMPACT_LABELS: Record<ImpactLevel, string> = {
  low: 'Impact léger',
  medium: 'Impact moyen',
  high: 'Impact fort',
};

export const STATUS_LABELS: Record<ResourceStatus, string> = {
  new: 'Nouveau',
  updated: 'Mis à jour',
};
```

### 6.3 Règles de validation

```typescript
const RESOURCE_VALIDATION_RULES = {
  title: { maxLength: 80, required: true },
  description: { maxLength: 200, required: true },
  tags: { maxItems: 5, format: /^[a-z0-9-]+$/ },
  href: { protocol: ['http:', 'https:'] },
} as const;
```

---

## 7. Sécurité / Privacy

### 7.1 Allowlist Protocol

**Implémenté dans PPResourceCard** :
```typescript
// Seuls http:// et https:// sont autorisés
if (!href.startsWith('http://') && !href.startsWith('https://')) {
  return null; // Bloque javascript:, data:, file:, etc.
}
```

### 7.2 UTM Stripping

**Implémenté dans PPResourceCard** :
```typescript
// Supprime tous les paramètres utm_*
url.searchParams.forEach((_, key) => {
  if (key.toLowerCase().startsWith('utm_')) {
    paramsToRemove.push(key);
  }
});
```

### 7.3 Affichage domaine obligatoire

Pour les liens externes, le domaine source **DOIT** être affiché :
- Soit dans `meta.sourceDomain`
- Soit extrait automatiquement de l'URL

**Exemple UI** :
> "Voir sur notion.so" ou "Ouvre miro.com"

### 7.4 Pas de tracking

**Interdictions strictes** :
- ❌ Pas de `?ref=pixelprowlers` ajouté aux URLs
- ❌ Pas de redirect tracking (pas de `/go/xxx`)
- ❌ Pas de pixel tracking sur les clics
- ❌ Pas de collecte d'événements vers services tiers

**Autorisé** :
- ✅ Analytics first-party anonymisé (Plausible/Fathom)
- ✅ Compteur de clics agrégé (sans PII)

### 7.5 Attributs de sécurité liens

**Obligatoires pour liens externes** :
```html
<a 
  href="https://..." 
  target="_blank" 
  rel="noopener noreferrer"
>
```

---

## 8. Roadmap d'Implémentation

### 8.1 R1 — Page Statique Data-Only (Estimé : 2 sprints)

**Objectif** : Page fonctionnelle avec filtres client-side

**Livrables** :
1. [ ] Créer `/ressources` page Nuxt
2. [ ] Créer `useResourcesLibrary()` composable
3. [ ] Créer data file `resourcesData.ts` (catalogue statique)
4. [ ] Étendre `PPResourcesShell` avec mode="library"
5. [ ] Implémenter filtres client-side (kind, tags, effort, impact)
6. [ ] Implémenter tri (default, updatedAt, effort, impact)
7. [ ] Implémenter recherche client-side (title + description)
8. [ ] Créer états UI (loading, empty, no-results, error)
9. [ ] Tests smoke (navigation, filtres, tri)
10. [ ] Guard `resources-library-r1.mjs`

**Dépendances** :
- PPResourcesShell ✅ (existe)
- PPResourceCard ✅ (existe)
- PPChip action/tag/stat ✅ (existe)
- PPBadge status/info ✅ (existe)

### 8.2 R2 — Indexation & Recherche Avancée (Estimé : 1-2 sprints)

**Objectif** : Recherche full-text performante

**Livrables** :
1. [ ] Intégration Meilisearch ou Lunr.js (client-side)
2. [ ] Indexation automatique du catalogue
3. [ ] Autocomplete avec suggestions
4. [ ] Highlight des termes recherchés
5. [ ] Pagination infinite scroll (si catalogue > 50 items)
6. [ ] Virtual list pour performance (si > 100 items)

### 8.3 R3 — Personnalisation (Future, non planifié)

- Recommandations basées sur parcours complétés
- Favoris / bookmarks
- Historique de consultation

---

## 9. Annexes

### 9.1 Wireframe ASCII (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (navigation)                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BIBLIOTHÈQUE RESSOURCES                             │  │
│  │  Explorez notre catalogue d'outils et lectures       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────┐  ┌────────────────────────────────────┐│
│  │ FILTRES        │  │  [🔍 Rechercher...]                ││
│  │                │  │                                    ││
│  │ Type           │  │  Tri: [Recommandé ▼]               ││
│  │ [Outil] [Lect] │  │                                    ││
│  │ [Vidéo] [Temp] │  │  ┌────────┐ ┌────────┐ ┌────────┐  ││
│  │                │  │  │ Card 1 │ │ Card 2 │ │ Card 3 │  ││
│  │ Effort         │  │  └────────┘ └────────┘ └────────┘  ││
│  │ [Rapide] [Moy] │  │  ┌────────┐ ┌────────┐ ┌────────┐  ││
│  │ [Long]         │  │  │ Card 4 │ │ Card 5 │ │ Card 6 │  ││
│  │                │  │  └────────┘ └────────┘ └────────┘  ││
│  │ Impact         │  │                                    ││
│  │ [Léger] [Moy]  │  │  [← Précédent]    [Suivant →]     ││
│  │ [Fort]         │  │                                    ││
│  │                │  └────────────────────────────────────┘│
│  │ Tags           │                                        │
│  │ [market] [prod]│                                        │
│  │ [growth] [ops] │                                        │
│  │                │                                        │
│  │ [Effacer tout] │                                        │
│  └────────────────┘                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Exemple de donnée ResourceItem

```typescript
const exampleResource: ResourceItem = {
  id: 'notion-okr-template',
  title: 'Template OKR Notion',
  description: 'Un template Notion prêt à l\'emploi pour structurer vos OKRs trimestriels.',
  kind: 'template',
  href: 'https://notion.so/templates/okr-startup',
  tags: ['okr', 'planning', 'notion'],
  effort: 'low',
  impact: 'high',
  language: 'fr',
  updatedAt: '2024-12-01T10:00:00Z',
  sourceDomain: 'notion.so',
  position: 1,
  status: 'new',
};
```

---

## 10. Références

- **DS Components** : `frontend_nuxt/app/components/PP*.vue`
- **Guards existants** : `frontend_nuxt/scripts/guards/no-legacy-resources-r1.mjs`
- **Skip Signal Policy** : `docs/20-product_specs/ux_content/PX_SKIP_SIGNAL_POLICY_V1.md`
- **Badge Migration Audit** : `docs/20-product_specs/ux_ui/DS_BADGE_MIGRATION_AUDIT_V1.md`

---

**Fin du document — PX_V1_3_RESOURCES_LIBRARY_SPEC.md**
