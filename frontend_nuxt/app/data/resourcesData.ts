/**
 * resourcesData.ts — Catalogue data-only pour la bibliothèque de ressources
 *
 * RÈGLES STRICTES (data-only doctrine) :
 * - Pas de HTML
 * - Pas de Markdown "riche" (seulement plain text)
 * - Pas de remote assets (images/vidéos intégrées)
 * - Liens externes validés (protocol allowlist http/https)
 * - Privacy-first : pas de tracking, pas d'UTM ajouté
 *
 * @see docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md
 */

// =============================================================================
// TYPES
// =============================================================================

export type ResourceKind = 'tool' | 'read' | 'watch' | 'template';
export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';
export type ResourceStatus = 'new' | 'updated' | null;
export type ResourceLanguage = 'fr' | 'en';

/**
 * ResourceItem — Modèle data-only pour une ressource
 */
export interface ResourceItem {
  /** Identifiant unique (slug kebab-case) */
  id: string;

  /** Titre court (max 80 caractères) */
  title: string;

  /** Description plain-text (max 200 caractères) */
  description: string;

  /** Type de ressource */
  kind: ResourceKind;

  /** URL externe (http/https uniquement) — mutually exclusive avec `to` */
  href?: string;

  /** Route interne — mutually exclusive avec `href` */
  to?: string;

  /** Tags de catégorisation (lowercase, kebab-case) */
  tags: string[];

  /** Niveau d'effort */
  effort: EffortLevel;

  /** Niveau d'impact */
  impact: ImpactLevel;

  /** Langue du contenu */
  language: ResourceLanguage;

  /** Date de dernière mise à jour (ISO 8601) */
  updatedAt: string;

  /** Domaine source pour affichage (liens externes) */
  sourceDomain?: string;

  /** Position pour tri éditorial (lower = higher priority) */
  position: number;

  /** Statut pour badge */
  status?: ResourceStatus;
}

// =============================================================================
// LABELS MAPPING
// =============================================================================

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

export const STATUS_LABELS: Record<Exclude<ResourceStatus, null>, string> = {
  new: 'Nouveau',
  updated: 'Mis à jour',
};

// =============================================================================
// CATALOGUE DATA-ONLY
// =============================================================================

/**
 * Catalogue complet des ressources.
 * Chaque ressource respecte la doctrine data-only.
 */
export const RESOURCES: ResourceItem[] = [
  // --- OUTILS ---
  {
    id: 'notion-okr-template',
    title: 'Template OKR Notion',
    description:
      'Un template Notion prêt à l\'emploi pour structurer vos OKRs trimestriels.',
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
  },
  {
    id: 'miro-lean-canvas',
    title: 'Lean Canvas interactif',
    description:
      'Board Miro pour construire votre Lean Canvas en équipe, avec guide intégré.',
    kind: 'tool',
    href: 'https://miro.com/templates/lean-canvas/',
    tags: ['lean', 'business-model', 'miro'],
    effort: 'medium',
    impact: 'high',
    language: 'fr',
    updatedAt: '2024-11-15T14:30:00Z',
    sourceDomain: 'miro.com',
    position: 2,
  },
  {
    id: 'figma-user-journey',
    title: 'Kit User Journey Mapping',
    description:
      'Template Figma pour cartographier le parcours utilisateur avec points de friction.',
    kind: 'template',
    href: 'https://www.figma.com/community/file/user-journey-template',
    tags: ['ux', 'parcours', 'figma'],
    effort: 'medium',
    impact: 'medium',
    language: 'fr',
    updatedAt: '2024-10-20T09:00:00Z',
    sourceDomain: 'figma.com',
    position: 3,
  },

  // --- LECTURES ---
  {
    id: 'article-product-market-fit',
    title: 'Comprendre le Product-Market Fit',
    description:
      'Article fondamental sur les signaux du PMF et comment le mesurer concrètement.',
    kind: 'read',
    href: 'https://www.sequoiacap.com/article/pmf-framework/',
    tags: ['product', 'pmf', 'strategie'],
    effort: 'medium',
    impact: 'high',
    language: 'en',
    updatedAt: '2024-09-10T08:00:00Z',
    sourceDomain: 'sequoiacap.com',
    position: 4,
  },
  {
    id: 'guide-pricing-saas',
    title: 'Guide Pricing SaaS',
    description:
      'Méthodologie complète pour définir votre stratégie tarifaire SaaS.',
    kind: 'read',
    href: 'https://www.priceintelligently.com/blog/saas-pricing-strategy',
    tags: ['pricing', 'saas', 'monetisation'],
    effort: 'high',
    impact: 'high',
    language: 'en',
    updatedAt: '2024-08-05T11:00:00Z',
    sourceDomain: 'priceintelligently.com',
    position: 5,
  },

  // --- VIDÉOS ---
  {
    id: 'video-pitch-deck',
    title: 'Construire un Pitch Deck efficace',
    description:
      'Masterclass de 20 min sur les 10 slides essentiels d\'un pitch investisseur.',
    kind: 'watch',
    href: 'https://www.youtube.com/watch?v=pitch-deck-masterclass',
    tags: ['pitch', 'fundraising', 'presentation'],
    effort: 'low',
    impact: 'medium',
    language: 'fr',
    updatedAt: '2024-11-01T16:00:00Z',
    sourceDomain: 'youtube.com',
    position: 6,
    status: 'updated',
  },
  {
    id: 'video-customer-discovery',
    title: 'Customer Discovery : les bases',
    description:
      'Vidéo pratique sur les techniques d\'interview utilisateur pour valider son produit.',
    kind: 'watch',
    href: 'https://www.youtube.com/watch?v=customer-discovery-basics',
    tags: ['discovery', 'interview', 'validation'],
    effort: 'low',
    impact: 'high',
    language: 'fr',
    updatedAt: '2024-10-15T10:00:00Z',
    sourceDomain: 'youtube.com',
    position: 7,
  },

  // --- TEMPLATES INTERNES (routes locales) ---
  {
    id: 'kit-p1-demarrage',
    title: 'Kit P1 — Démarrage rapide',
    description:
      'Poser un cadrage express, choisir une première vérif et documenter en 30 min.',
    kind: 'template',
    to: '/resources/p1/kit_p1_demarrage',
    tags: ['p1', 'demarrage', 'priorisation'],
    effort: 'low',
    impact: 'medium',
    language: 'fr',
    updatedAt: '2024-12-15T12:00:00Z',
    position: 8,
  },
  {
    id: 'kit-mission-cash',
    title: 'Kit — Mission ↔ cash',
    description:
      'Règle d\'arbitrage mission/financement et contrôle de son application.',
    kind: 'template',
    to: '/resources/p1/kit_mission_cash',
    tags: ['p1', 'gouvernance', 'mission', 'budget'],
    effort: 'medium',
    impact: 'high',
    language: 'fr',
    updatedAt: '2024-12-10T09:00:00Z',
    position: 9,
  },
  {
    id: 'kit-gouvernance-veto',
    title: 'Kit — Gouvernance & veto',
    description:
      'Clarifier qui tranche, qui peut dire non et où chaque décision est consignée.',
    kind: 'template',
    to: '/resources/p1/kit_gouvernance_veto',
    tags: ['p1', 'gouvernance', 'decision'],
    effort: 'medium',
    impact: 'high',
    language: 'fr',
    updatedAt: '2024-12-08T14:00:00Z',
    position: 10,
  },
  {
    id: 'kit-dependance-mortelle',
    title: 'Kit — Dépendance mortelle',
    description:
      'Identifier la dépendance critique et préparer un plan B activable.',
    kind: 'template',
    to: '/resources/p1/kit_dependance_mortelle',
    tags: ['p1', 'risque', 'resilience'],
    effort: 'medium',
    impact: 'high',
    language: 'fr',
    updatedAt: '2024-12-05T11:00:00Z',
    position: 11,
  },
  {
    id: 'kit-capacite-reelle',
    title: 'Kit — Capacité réelle',
    description:
      'Mesurer la capacité tenable et décider quoi couper quand ça dépasse.',
    kind: 'template',
    to: '/resources/p1/kit_capacite_reelle',
    tags: ['p1', 'charge', 'priorisation'],
    effort: 'medium',
    impact: 'medium',
    language: 'fr',
    updatedAt: '2024-12-03T10:00:00Z',
    position: 12,
  },
];

// =============================================================================
// VALIDATION (DEV-ONLY)
// =============================================================================

const VALIDATION_RULES = {
  title: { maxLength: 80, required: true },
  description: { maxLength: 200, required: true },
  tags: { maxItems: 5, pattern: /^[a-z0-9-]+$/ },
  href: { protocols: ['http:', 'https:'] },
} as const;

/**
 * Validate resources data at runtime (dev mode only).
 * Throws if any resource is invalid.
 */
export function validateResourcesData(): void {
  const errors: string[] = [];

  const ids = new Set<string>();

  for (const resource of RESOURCES) {
    const prefix = `Resource [${resource.id}]`;

    // Check duplicate IDs
    if (ids.has(resource.id)) {
      errors.push(`${prefix}: Duplicate ID`);
    }
    ids.add(resource.id);

    // Title validation
    if (!resource.title) {
      errors.push(`${prefix}: Title is required`);
    } else if (resource.title.length > VALIDATION_RULES.title.maxLength) {
      errors.push(
        `${prefix}: Title exceeds ${VALIDATION_RULES.title.maxLength} chars`
      );
    }

    // Description validation
    if (!resource.description) {
      errors.push(`${prefix}: Description is required`);
    } else if (
      resource.description.length > VALIDATION_RULES.description.maxLength
    ) {
      errors.push(
        `${prefix}: Description exceeds ${VALIDATION_RULES.description.maxLength} chars`
      );
    }

    // Tags validation
    if (resource.tags.length > VALIDATION_RULES.tags.maxItems) {
      errors.push(
        `${prefix}: Too many tags (max ${VALIDATION_RULES.tags.maxItems})`
      );
    }
    for (const tag of resource.tags) {
      if (!VALIDATION_RULES.tags.pattern.test(tag)) {
        errors.push(`${prefix}: Invalid tag format "${tag}" (use kebab-case)`);
      }
    }

    // Href validation (protocol allowlist)
    if (resource.href) {
      try {
        const url = new URL(resource.href);
        const allowedProtocols: readonly string[] = VALIDATION_RULES.href.protocols;
        if (!allowedProtocols.includes(url.protocol)) {
          errors.push(
            `${prefix}: Invalid protocol "${url.protocol}" (only http/https allowed)`
          );
        }
      } catch {
        errors.push(`${prefix}: Invalid URL "${resource.href}"`);
      }
    }

    // Mutually exclusive href/to
    if (resource.href && resource.to) {
      errors.push(`${prefix}: Cannot have both href and to`);
    }
    if (!resource.href && !resource.to) {
      errors.push(`${prefix}: Must have either href or to`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Resources validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }
}

// =============================================================================
// UTILITY: Extract all unique tags from catalogue
// =============================================================================

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const resource of RESOURCES) {
    for (const tag of resource.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

// =============================================================================
// UTILITY: Get available filter options
// =============================================================================

export interface FilterOptions {
  kinds: ResourceKind[];
  tags: string[];
  efforts: EffortLevel[];
  impacts: ImpactLevel[];
  languages: ResourceLanguage[];
}

export function getFilterOptions(): FilterOptions {
  const kinds = new Set<ResourceKind>();
  const tags = new Set<string>();
  const efforts = new Set<EffortLevel>();
  const impacts = new Set<ImpactLevel>();
  const languages = new Set<ResourceLanguage>();

  for (const resource of RESOURCES) {
    kinds.add(resource.kind);
    resource.tags.forEach((t) => tags.add(t));
    efforts.add(resource.effort);
    impacts.add(resource.impact);
    languages.add(resource.language);
  }

  return {
    kinds: Array.from(kinds),
    tags: Array.from(tags).sort(),
    efforts: Array.from(efforts),
    impacts: Array.from(impacts),
    languages: Array.from(languages),
  };
}
