import { computed, ref } from 'vue';

export type CurrentJourney = {
  id: string;
  label: string;
};

const selectedJourneyId = ref<string | null>(null);
const selectedJourneyLabel = ref<string | null>(null);

export const useCurrentJourney = () => {
  const setSelectedJourney = (journey: CurrentJourney) => {
    selectedJourneyId.value = journey.id;
    selectedJourneyLabel.value = journey.label;
  };

  const journey = computed<CurrentJourney | null>(() => {
    if (!selectedJourneyId.value || !selectedJourneyLabel.value) return null;
    return {
      id: selectedJourneyId.value,
      label: selectedJourneyLabel.value
    };
  });

  return {
    selectedJourneyId,
    selectedJourneyLabel,
    selectedJourney: journey,
    setSelectedJourney
  };
};
