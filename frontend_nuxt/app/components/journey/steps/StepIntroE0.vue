<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E0_intro">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E0_intro"
      />

      <div v-if="outcomeParagraphs.length" class="space-y-2">
        <p v-for="paragraph in outcomeParagraphs" :key="paragraph" class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
          {{ paragraph }}
        </p>
      </div>

      <div v-if="introSections.length" class="space-y-4">
        <PPCard v-for="(section, index) in introSections" :key="`${section.title}-${index}`" variant="soft" class="space-y-2">
          <h3 class="text-base font-semibold">
            {{ section.title }}
          </h3>
          <ul class="pp-journey-body list-disc list-inside space-y-1">
            <li v-for="(item, itemIndex) in section.items" :key="`${section.title}-${itemIndex}`">
              {{ item }}
            </li>
          </ul>
        </PPCard>
      </div>

      <button type="button" class="pp-journey-cta-primary" @click="handleStart">
        {{ copy.cta }}
      </button>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import PPCard from '~/components/PPCard.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { getJourneyCopy } from '~/config/journeys/journeyDataRegistry';
import type { JourneyCopyIntro } from '~/config/journeys/journeyDataRegistry';
import { getJourneySchemaById } from '~/config/journeys/schemaRegistry';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep: (stepId: string) => void;
}>();

const fallbackCopy: JourneyCopyIntro = {
  title: `Parcours ${props.manifest.id.toUpperCase()}`,
  subtitle: 'Panorama rapide, reponses locales uniquement.',
  cta: 'Commencer le panorama'
};

const copy = computed<JourneyCopyIntro>(() => {
  const bundle = getJourneyCopy(props.manifest);
  return bundle?.intro ? { ...fallbackCopy, ...bundle.intro } : fallbackCopy;
});

const outcomeParagraphs = computed(() => (copy.value.outcome ?? '').split('\n\n').filter(Boolean));

const introSections = computed(() => {
  const sections = copy.value.sections ? Object.values(copy.value.sections) : [];
  return sections
    .map((section) => ({
      title: section.title,
      items: section.items.filter(Boolean)
    }))
    .filter((section) => section.title && section.items.length);
});

const journeySchema = computed(() => getJourneySchemaById(props.manifest.id));

// Helper pour trouver le prochain step depuis le schema (fallback neutre si absent).
const resolveNextStepId = () => {
  const steps = journeySchema.value?.steps ?? [];
  const stepIds = steps.map((step) => step.stepId);
  if (stepIds.includes('E_panorama')) return 'E_panorama';
  if (stepIds.includes('E1_panorama')) return 'E1_panorama';
  return stepIds[1] ?? 'E_panorama';
};

const handleStart = () => {
  props.goToStep(resolveNextStepId());
};
</script>
