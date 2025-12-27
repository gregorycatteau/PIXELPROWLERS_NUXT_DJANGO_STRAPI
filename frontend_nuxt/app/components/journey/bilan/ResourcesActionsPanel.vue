<template>
  <section id="gb_resources_actions" class="space-y-4 pt-4">
    <!-- Section Recommandé (mode prescription) -->
    <PPResourcesShell
      v-if="hasRecommended"
      title="Recommandé pour toi"
      description="Actions et ressources prioritaires basées sur ton profil."
      density="comfort"
      section-id="resources-recommended"
    >
      <PPResourceCard
        v-for="item in recommended"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :href="getExternalHref(item)"
        :to="getInternalRoute(item)"
        :meta="getResourceMeta(item)"
        :badge="getResourceBadge(item)"
        :cta-aria-label="`${item.cta.label} pour ${item.title}`"
      >
        <template #cta-label>{{ item.cta.label }}</template>
        <template v-if="item.cta.type === 'export'" #cta>
          <button
            type="button"
            class="pp-journey-cta-secondary text-xs"
            @click="emit('go-export')"
          >
            {{ item.cta.label }}
          </button>
        </template>
      </PPResourceCard>
    </PPResourcesShell>

    <!-- Section Bibliothèque (filtrable) -->
    <div v-if="hasLibrary" class="space-y-3">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <PPSectionHeader
          as="h3"
          density="compact"
          title="Bibliothèque"
        />
        <!-- CTA pilote SafeDeepLinkKit : lien sécurisé vers /ressources filtré P1 -->
        <NuxtLink
          :to="P1_IMPACT_RESOURCES_LINK"
          class="pp-journey-cta-secondary text-xs"
        >
          Explorer ressources P1
        </NuxtLink>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <div v-if="tags.length" class="flex flex-wrap gap-2">
          <PPChip
            variant="outline"
            size="sm"
            :selected="activeTag === ''"
            @click="activeTag = ''"
          >
            Tous
          </PPChip>
          <PPChip
            v-for="tag in tags"
            :key="tag"
            variant="outline"
            size="sm"
            :selected="activeTag === tag"
            @click="activeTag = tag"
          >
            {{ tag }}
          </PPChip>
        </div>
        <div class="ml-auto w-full sm:w-auto">
          <input
            v-model="query"
            type="search"
            class="pp-input text-xs"
            placeholder="Rechercher"
            aria-label="Rechercher dans la bibliotheque"
          />
        </div>
      </div>

      <div v-if="filteredLibrary.length" class="grid gap-3 md:grid-cols-2">
        <PPResourceCard
          v-for="item in filteredLibrary"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :href="getExternalHref(item)"
          :to="getInternalRoute(item)"
          :meta="getResourceMeta(item)"
          :cta-aria-label="`${item.cta.label} pour ${item.title}`"
        >
          <template #cta-label>{{ item.cta.label }}</template>
          <template v-if="item.cta.type === 'export'" #cta>
            <button
              type="button"
              class="pp-journey-cta-secondary text-xs"
              @click="emit('go-export')"
            >
              {{ item.cta.label }}
            </button>
          </template>
        </PPResourceCard>
      </div>
      <p v-else class="text-sm text-[color:var(--color-text-muted)]">Aucun element disponible.</p>
    </div>

    <p v-if="!hasLibrary && !hasRecommended" class="text-sm text-[color:var(--color-text-muted)]">
      Aucune recommandation disponible pour ce parcours.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ResourcesActionsItemVM } from '~/types/bilan';
import { safeFilePath, safeRoutePath } from '~/utils/cta/safeCta';
import { buildResourcesDeepLink } from '~/utils/deeplinks/resourcesDeepLink';
import type { ResourceMeta, ResourceBadge } from '~/components/PPResourceCard.vue';

const props = defineProps<{
  recommended: ResourcesActionsItemVM[];
  library: ResourcesActionsItemVM[];
  tags: string[];
}>();

const emit = defineEmits<{
  (e: 'go-export'): void;
}>();

const query = ref('');
const activeTag = ref('');

const hasRecommended = computed(() => props.recommended.length > 0);
const hasLibrary = computed(() => props.library.length > 0);

const matchesQuery = (item: ResourcesActionsItemVM, q: string) => {
  if (!q) return true;
  const hay = `${item.title} ${item.description ?? ''}`.toLowerCase();
  return hay.includes(q.toLowerCase());
};

const filteredLibrary = computed(() => {
  const q = query.value.trim();
  return props.library.filter((item) => {
    const tagOk = !activeTag.value || (item.tags ?? []).includes(activeTag.value);
    return tagOk && matchesQuery(item, q);
  });
});

const CONTACT_ROUTE = safeRoutePath('/contact');
const RESOURCES_ROUTE = safeRoutePath('/ressources');

/**
 * Deep link vers /ressources filtre P1 (SafeDeepLinkKit)
 * @see frontend_nuxt/app/utils/deeplinks/resourcesDeepLink.ts
 */
const P1_IMPACT_RESOURCES_LINK = buildResourcesDeepLink({
  tags: ['p1'],
});

const safeRouteTarget = (target?: string | null) => {
  if (!target) return null;
  try {
    return safeRoutePath(target);
  } catch {
    return null;
  }
};

const safeFileTarget = (target?: string | null) => {
  if (!target) return null;
  try {
    return safeFilePath(target);
  } catch {
    return null;
  }
};

/**
 * Get external href if applicable (file type with valid path)
 * NOTE: External URLs are sanitized by PPResourceCard (UTM stripped, protocol enforced)
 */
const getExternalHref = (item: ResourcesActionsItemVM): string | undefined => {
  if (item.cta.type === 'file') {
    const href = safeFileTarget(item.cta.target);
    return href ?? undefined;
  }
  return undefined;
};

/**
 * Get internal route if applicable
 */
const getInternalRoute = (item: ResourcesActionsItemVM): string | undefined => {
  if (item.cta.type === 'contact') return CONTACT_ROUTE;
  if (item.cta.type === 'resources') return RESOURCES_ROUTE;
  if (item.cta.type === 'route') {
    const to = safeRouteTarget(item.cta.target);
    return to ?? undefined;
  }
  return undefined;
};

/**
 * Map item to ResourceMeta
 */
const getResourceMeta = (item: ResourcesActionsItemVM): ResourceMeta | undefined => {
  const kind = item.kind === 'resource' ? 'read' : undefined;
  const horizon = item.horizon;
  
  if (!kind && !horizon) return undefined;
  
  return {
    kind: kind as 'read' | undefined,
    effort: horizon ?? undefined,
  };
};

/**
 * Map item to ResourceBadge
 */
const getResourceBadge = (item: ResourcesActionsItemVM): ResourceBadge | undefined => {
  if (item.kind === 'action') {
    return { variant: 'status', label: 'Action' };
  }
  if (item.format) {
    return { variant: 'info', label: item.format };
  }
  return undefined;
};
</script>
