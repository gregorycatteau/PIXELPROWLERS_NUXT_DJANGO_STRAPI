import { computed } from 'vue';
import { useP1SystemicLanding } from '@/composables/useP1SystemicLanding';
import { P1_RESOURCES_V1_3, type P1Resource } from '@/config/resources/p1ResourcesV1_3';

const DEFAULT_FALLBACK_IDS = ['kit_p1_demarrage', 'kit_mission_cash', 'kit_gouvernance_veto'] as const;

export function useP1Resources() {
  const { mainCards, secondaryCards } = useP1SystemicLanding();

  const allResources = computed(() => P1_RESOURCES_V1_3);

  const recommendedResources = computed<P1Resource[]>(() => {
    const resourcesById = Object.fromEntries(P1_RESOURCES_V1_3.map((r) => [r.id, r]));
    const selected: P1Resource[] = [];

    const addResource = (id: keyof typeof resourcesById) => {
      const res = resourcesById[id];
      if (!res) return;
      if (selected.find((r) => r.id === id)) return;
      selected.push(res);
    };

    addResource('kit_p1_demarrage');

    const cardIds = new Set(
      [...(mainCards.value ?? []), ...(secondaryCards.value ?? [])].map((c) => c.id)
    );

    if (cardIds.size > 0) {
      for (const res of P1_RESOURCES_V1_3) {
        if (!res.relatedCards) continue;
        const matches = res.relatedCards.some((id) => cardIds.has(id));
        if (matches) addResource(res.id);
        if (selected.length >= 5) break;
      }
    }

    if (cardIds.size === 0 && selected.length === 1) {
      DEFAULT_FALLBACK_IDS.slice(1).forEach((id) => addResource(id));
    }

    return selected.slice(0, 5);
  });

  const secondaryResources = computed(() => {
    const recommendedIds = new Set(recommendedResources.value.map((r) => r.id));
    return P1_RESOURCES_V1_3.filter((res) => !recommendedIds.has(res.id));
  });

  return {
    allResources,
    recommendedResources,
    secondaryResources
  };
}
