import { computed, ref } from 'vue';

export type UseBilanHypothesesStateOptions = {
  maxSelected?: number;
  scrollToSection?: (id: string) => void;
  atterrissageAnchor?: string;
};

export function useBilanHypothesesState(options: UseBilanHypothesesStateOptions = {}) {
  const maxSelected = options.maxSelected ?? 2;
  const atterrissageAnchor = options.atterrissageAnchor ?? 'p1-atterrissage';

  const selectedHypothesisIds = ref<string[]>([]);
  const hypothesisDetailsExpanded = ref<Set<string>>(new Set());
  const landingDone = ref<Set<string>>(new Set());
  const highlightTarget = ref<string | null>(null);

  const isHypothesisSelected = (id: string) => selectedHypothesisIds.value.includes(id);
  const isHypothesisDisabled = (id: string) =>
    !isHypothesisSelected(id) && selectedHypothesisIds.value.length >= maxSelected;

  const toggleHypothesis = (id: string) => {
    if (isHypothesisSelected(id)) {
      selectedHypothesisIds.value = selectedHypothesisIds.value.filter((v) => v !== id);
      return;
    }
    if (selectedHypothesisIds.value.length >= maxSelected) return;
    selectedHypothesisIds.value = [...selectedHypothesisIds.value, id];
  };

  const isHypothesisExpanded = (id: string) => hypothesisDetailsExpanded.value.has(id);
  const toggleHypothesisDetails = (id: string) => {
    const next = new Set(hypothesisDetailsExpanded.value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    hypothesisDetailsExpanded.value = next;
  };

  const isLandingDone = (id: string) => landingDone.value.has(id);
  const toggleLandingDone = (id: string) => {
    const next = new Set(landingDone.value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    landingDone.value = next;
  };

  const goToAtterrissage = () => {
    highlightTarget.value = atterrissageAnchor;
    if (options.scrollToSection) {
      options.scrollToSection(atterrissageAnchor);
    }
    setTimeout(() => {
      highlightTarget.value = null;
    }, 2000);
  };

  const selectionCountLabel = computed(() => `${selectedHypothesisIds.value.length}/${maxSelected}`);

  return {
    selectedHypothesisIds,
    isHypothesisSelected,
    isHypothesisDisabled,
    toggleHypothesis,
    hypothesisDetailsExpanded,
    isHypothesisExpanded,
    toggleHypothesisDetails,
    landingDone,
    isLandingDone,
    toggleLandingDone,
    highlightTarget,
    goToAtterrissage,
    selectionCountLabel,
    maxSelected
  };
}
