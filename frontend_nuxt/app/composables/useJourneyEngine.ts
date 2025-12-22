import { computed, ref } from 'vue';
import type { JourneySchema, JourneyStepMeta } from '~/config/journeys/p1JourneySchema';
import { getJourneySchemaById } from '~/config/journeys/schemaRegistry';

interface UseJourneyEngineOptions {
  journeyId: string;
}

interface UseJourneyEngineResult {
  currentStepId: Ref<string>;
  currentStepMeta: ComputedRef<JourneyStepMeta | null>;
  completedSteps: Ref<Set<string>>;

  goToStep: (stepId: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;

  onStepViewed: (cb: (stepId: string) => void) => void;
  onStepCompleted: (cb: (stepId: string) => void) => void;
}

const resolveSchema = (journeyId: string): JourneySchema => {
  const schema = getJourneySchemaById(journeyId);
  if (!schema) {
    throw new Error(`Journey schema not found for id: ${journeyId}`);
  }
  return schema;
};

export function useJourneyEngine(options: UseJourneyEngineOptions): UseJourneyEngineResult {
  const schema = resolveSchema(options.journeyId);
  const stepOrder = schema.steps.map((step) => step.stepId);

  const currentStepId = ref<string>(schema.steps[0]?.stepId ?? '');
  const completedSteps = ref<Set<string>>(new Set());

  const stepViewedCallbacks: Array<(stepId: string) => void> = [];
  const stepCompletedCallbacks: Array<(stepId: string) => void> = [];

  const findStepIndex = (stepId: string) => stepOrder.indexOf(stepId);
  const findStepMeta = (stepId: string) => schema.steps.find((s) => s.stepId === stepId) ?? null;

  const currentStepMeta = computed<JourneyStepMeta | null>(() => {
    return findStepMeta(currentStepId.value);
  });

  const emitStepViewed = (stepId: string) => {
    stepViewedCallbacks.forEach((cb) => cb(stepId));
  };

  const emitStepCompleted = (stepId: string) => {
    completedSteps.value.add(stepId);
    stepCompletedCallbacks.forEach((cb) => cb(stepId));
  };

  const goToStep = (stepId: string) => {
    if (!stepOrder.includes(stepId)) return;
    currentStepId.value = stepId;
    emitStepViewed(stepId);
  };

  const goToNext = () => {
    const meta = findStepMeta(currentStepId.value);
    const candidate = meta?.next;
    const next = candidate ?? stepOrder[findStepIndex(currentStepId.value) + 1];
    if (!next || !stepOrder.includes(next)) return;
    emitStepCompleted(currentStepId.value);
    currentStepId.value = next;
    emitStepViewed(next);
  };

  const goToPrevious = () => {
    const meta = findStepMeta(currentStepId.value);
    const candidate = meta?.prev;
    const prev = candidate ?? stepOrder[findStepIndex(currentStepId.value) - 1];
    if (!prev || !stepOrder.includes(prev)) return;
    currentStepId.value = prev;
    emitStepViewed(prev);
  };

  const onStepViewed = (cb: (stepId: string) => void) => {
    stepViewedCallbacks.push(cb);
    if (currentStepId.value) {
      cb(currentStepId.value);
    }
  };

  const onStepCompleted = (cb: (stepId: string) => void) => {
    stepCompletedCallbacks.push(cb);
  };

  return {
    currentStepId,
    currentStepMeta,
    completedSteps,
    goToStep,
    goToNext,
    goToPrevious,
    onStepViewed,
    onStepCompleted
  };
}
