<template>
<section class="pp-section IndicatorsSectionWrapper" aria-labelledby="indicators-title">
  <PPSectionHeader
    as="h2"
    density="comfort"
    eyebrow="Étape 2 · Te reconnais-tu dans ces situations&nbsp;?"
    lead="Si tu te reconnais dans au moins une de ces situations, c’est normal&nbsp;: beaucoup de collectifs et de porteurs de projets vivent ça. Choisis le parcours qui se rapproche le plus de ce que tu vis, même si ce n’est pas parfait."
  >
    <template #title>
      <span id="indicators-title">Indices que tu es vraiment au bon endroit</span>
    </template>
  </PPSectionHeader>
  <div class="IndicatorsGrid">
    <button
      v-for="(item, index) in situations"
      :key="index"
      type="button"
      ref="situationCards"
      class="pp-card-journey pp-tilt-card pp-reveal"
      :class="[{ IndicatorWide: index === 0 }, selectedJourneyId === item.journeyId ? 'pp-card-journey-active' : '']"
      :aria-pressed="selectedJourneyId === item.journeyId"
      :aria-selected="selectedJourneyId === item.journeyId"
      :aria-labelledby="`indicator-${index}-title`"
      :aria-describedby="`indicator-${index}-body`"
      @click="emitSelectJourney(item.journeyId)"
    >
        <PPBadge
          v-if="selectedJourneyId === item.journeyId"
          as="div"
          variant="success"
          size="sm"
          class="CardSelectedBadge"
        >
          Parcours sélectionné
        </PPBadge>
        <div class="IndicatorHeader">
          <PPBadge as="div" variant="accent" size="sm" class="IndicatorBadge">{{ item.icon }}</PPBadge>
          <div>
            <PPBadge as="div" variant="neutral" size="sm" class="CardTag">{{ item.tag }}</PPBadge>
            <h3 :id="`indicator-${index}-title`" class="IndicatorTitle pp-heading-2">{{ item.title }}</h3>
          </div>
        </div>
        <div :id="`indicator-${index}-body`" class="IndicatorBody pp-section-desc space-y-1.5">
          <p v-for="(paragraph, i) in item.body.split('\n')" :key="i" :class="i === 0 ? '' : 'text-slate-400'">
            {{ paragraph }}
          </p>
        </div>
      </button>
    </div>
    <div class="IndicatorsActions">
      <p class="IndicatorsHelper">
        Se reconnaître dans plusieurs cartes est courant. Cliquer sur une carte ou sur ce bouton te permet juste de
        choisir un point de départ. Tu pourras ajuster ensuite.
      </p>
      <div class="IndicatorsButtons">
        <PPButton
          :to="{
            path: '/accompagnement-formation',
            query: { parcours: selectedJourneyId }
          }"
          class="IndicatorsPrimaryButton"
          variant="primary"
          @click="handleCtaClick"
        >
          {{ ctaLabel }}
        </PPButton>
        <PPButton type="button" class="IndicatorsSecondaryButton" variant="secondary" @click="emitScrollToHero">
          Revenir aux parcours du début de page
        </PPButton>
      </div>
      <p class="IndicatorsHelper">
        Tu peux changer de parcours à tout moment avant de nous écrire.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRefs } from 'vue';
import { useAnalytics } from '~/composables/useAnalytics';
import { useCtaVariant } from '~/composables/useCtaVariant';
import { useCurrentJourney } from '~/composables/useCurrentJourney';

type JourneyId = string;

type Situation = {
  title: string;
  body: string;
  tag: string;
  icon: string;
  journeyId: JourneyId;
};

type Journey = {
  id: JourneyId;
  label: string;
  tagline: string;
  heroHighlight?: string;
  step2Description?: string;
};

const props = defineProps<{
  situations: Situation[];
  selectedJourneyId: JourneyId;
  selectedJourney: Journey;
}>();

const emit = defineEmits<{
  (e: 'select-journey', journeyId: JourneyId): void;
  (e: 'scroll-to-hero'): void;
}>();

const { situations, selectedJourneyId, selectedJourney } = toRefs(props);
const situationCards = ref<(HTMLElement | null)[]>([]);
let observer: IntersectionObserver | null = null;

const { trackEvent } = useAnalytics();
const { variant, getJourneyCtaLabel } = useCtaVariant();
const { setSelectedJourney } = useCurrentJourney();

const emitSelectJourney = (journeyId: JourneyId) => {
  if (journeyId === selectedJourneyId.value) return;
  emit('select-journey', journeyId);
  trackEvent('journey_selected', {
    journey_id: journeyId,
    journey_label: situations.value.find((s) => s.journeyId === journeyId)?.title,
    origin: 'step2'
  });
  const journey = situations.value.find((s) => s.journeyId === journeyId);
  if (journey) {
    setSelectedJourney({ id: journey.journeyId, label: journey.title });
  }
};

const emitScrollToHero = () => {
  emit('scroll-to-hero');
};

const ctaLabel = computed(() => getJourneyCtaLabel(selectedJourney.value.label));

const handleCtaClick = () => {
  trackEvent('journey_cta_clicked', {
    journey_id: selectedJourneyId.value,
    journey_label: selectedJourney.value.label,
    origin: 'step2',
    cta_variant: variant
  });
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  situationCards.value.forEach((el) => {
    if (!el) return;
    el.classList.add('pp-reveal');
    observer?.observe(el);
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.IndicatorsSectionWrapper {
  @apply space-y-6;
}

.IndicatorsGrid {
  @apply grid gap-4 md:grid-cols-2;
}

.IndicatorWide {
  @apply md:col-span-2;
}

.IndicatorHeader {
  @apply flex items-center gap-3;
}

.CardSelectedBadge {
  @apply mb-2 inline-flex;
}

.IndicatorBadge {
  @apply shrink-0;
}

.CardTag {
  @apply w-max;
}

.IndicatorTitle {
  @apply leading-snug;
}

.IndicatorBody {
  @apply mt-2 text-slate-200;
}

.IndicatorsActions {
  @apply mt-6 flex flex-col gap-3;
}

.IndicatorsHelper {
  @apply text-sm text-slate-300;
}

.IndicatorsButtons {
  @apply flex flex-col gap-3 sm:flex-row sm:items-center;
}
</style>
