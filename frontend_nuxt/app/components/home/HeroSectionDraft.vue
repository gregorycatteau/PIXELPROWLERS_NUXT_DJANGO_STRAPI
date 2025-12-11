<template>
  <section class="HeroWrapper">
    <div class="HeroBackdrop" aria-hidden="true">
      <div class="HeroGlow HeroGlowPrimary" />
      <div class="HeroGlow HeroGlowSecondary" />
      <div class="HeroBackgroundAccent" />
    </div>

    <div class="HeroGrid pp-hero-grid">
      <div class="HeroLeft pp-section-header">
        <p class="pp-section-label">Étape 1 · Faire le point sur ta situation</p>
        <h1 class="HeroTitle pp-heading-1">
          Salut… aujourd’hui, tu en es où, pour de vrai ?
        </h1>
        <div class="HeroParagraph pp-section-desc space-y-2">
          <p>
            Tu portes un projet, une structure, une idée… et souvent, tu fais comme tu peux.
            Entre les urgences, les outils choisis « par défaut » et les décisions bricolées tard le soir,
            tu sens bien que ça tient, mais au prix de ton énergie.
          </p>
          <p class="pp-text-muted">
            Ici, on ne va pas te juger, ni te vendre une solution magique.
            On va regarder la situation avec toi, poser les choses à plat, et imaginer quelques prochains pas réalistes,
            compatibles avec ta fatigue, ton budget et ta réalité de terrain.
          </p>
        </div>
      </div>

      <div class="HeroRight" aria-hidden="true">
        <div class="HeroImageWrapper pp-hero-image">
          <picture>
            <source srcset="/mainhero.avif" type="image/avif" />
            <source srcset="/mainhero.webp" type="image/webp" />
            <img
              src="/mainhero.png"
              srcset="/mainhero.avif 1x, /mainhero.webp 1x, /mainhero.png 1x"
              sizes="(min-width: 1280px) 520px, (min-width: 768px) 420px, 100vw"
              alt="Personne au calme devant son ordinateur au crépuscule, prête à clarifier sa situation"
              class="HeroImage"
              loading="lazy"
            />
          </picture>
        </div>
      </div>

      <div class="HeroLower">
        <div class="HeroQuestionBlock">
          <p class="HeroQuestionLabel">Donc... Qu’est-ce qui t’amène ici aujourd’hui&nbsp;?</p>
          <div class="HeroJourneyGrid">
            <button
              v-for="journey in journeys"
              :key="journey.id"
              type="button"
              class="HeroJourneyCard pp-tilt-card"
              :class="{ HeroJourneyCardActive: journey.id === selectedJourneyId }"
              @click="emitSelectJourney(journey.id)"
            >
              <span class="HeroJourneyLabel">{{ journey.label }}</span>
              <span class="HeroJourneyTagline">{{ journey.tagline }}</span>
              <span v-if="journey.heroHighlight" class="HeroJourneyHighlight">{{ journey.heroHighlight }}</span>
            </button>
          </div>
          <p class="HeroQuestionHelper">
            Tu peux changer de parcours à tout moment, rien n’est figé.
            L’idée, c’est juste de choisir le point d’entrée qui te parle le plus aujourd’hui.
          </p>
        </div>

        <div class="HeroActions">
          <NuxtLink
            :to="{
              path: '/accompagnement-formation',
              query: { parcours: selectedJourneyId }
            }"
            class="HeroPrimaryButton"
            @click="handleCtaClick"
          >
            {{ ctaLabel }}
          </NuxtLink>
          <NuxtLink to="/a-propos" class="HeroSecondaryButton">
            Voir concrètement comment on travaille
          </NuxtLink>
        </div>

        <p class="HeroReassurance">
          Premier échange offert (30–45&nbsp;min), sans engagement, en visio ou téléphone.
          Rien n’est enregistré, rien ne part en communication.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useAnalytics } from '~/composables/useAnalytics';
import { useCtaVariant } from '~/composables/useCtaVariant';
import { useCurrentJourney } from '~/composables/useCurrentJourney';

type JourneyId = string;

type Journey = {
  id: JourneyId;
  label: string;
  tagline: string;
  heroHighlight?: string;
  step2Description?: string;
};

const props = defineProps<{
  journeys: readonly Journey[];
  selectedJourneyId: JourneyId;
  selectedJourney: Journey;
}>();

const emit = defineEmits<{
  (e: 'select-journey', journeyId: JourneyId): void;
}>();

const { journeys, selectedJourneyId, selectedJourney } = toRefs(props);

const { trackEvent } = useAnalytics();
const { variant, getJourneyCtaLabel } = useCtaVariant();
const { setSelectedJourney } = useCurrentJourney();

const emitSelectJourney = (journeyId: JourneyId) => {
  if (journeyId === selectedJourneyId.value) return;
  emit('select-journey', journeyId);
  const journey = journeys.value.find((j) => j.id === journeyId);
  if (journey) {
    setSelectedJourney({ id: journey.id, label: journey.label });
  }
  trackEvent('journey_selected', {
    journey_id: journeyId,
    journey_label: journey?.label,
    origin: 'hero'
  });
};

const ctaLabel = computed(() => getJourneyCtaLabel(selectedJourney.value.label));

const handleCtaClick = () => {
  trackEvent('journey_cta_clicked', {
    journey_id: selectedJourneyId.value,
    journey_label: selectedJourney.value.label,
    origin: 'hero',
    cta_variant: variant
  });
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.HeroWrapper {
  @apply relative overflow-hidden rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-950/85 via-slate-950/75 to-slate-900/75 px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 shadow-[0_26px_80px_rgba(15,23,42,0.85)] backdrop-blur-md lg:min-h-[calc(100vh-160px)];
}

.HeroBackdrop {
  @apply absolute inset-0 opacity-25 blur-3xl pointer-events-none z-0;
}

.HeroGlow {
  @apply pointer-events-none absolute rounded-full;
}

.HeroGlowPrimary {
  @apply -left-24 -top-10 h-64 w-64 bg-orange-400/20;
}

.HeroGlowSecondary {
  @apply right-0 top-10 h-60 w-60 bg-cyan-300/18;
}

.HeroBackgroundAccent {
  @apply absolute inset-y-10 left-20 w-24 rounded-full bg-gradient-to-b from-orange-400/12 via-purple-500/10 to-cyan-300/12 blur-3xl;
}

.HeroGrid {
  @apply relative z-10 mx-auto grid gap-8 lg:gap-10 lg:grid-cols-12 items-start;
}

.HeroLeft {
  @apply flex flex-col gap-6 lg:col-span-7;
}

.HeroRight {
  @apply lg:col-span-5 flex justify-center lg:justify-end;
}

.HeroImageWrapper {
  @apply relative w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-slate-800/60 bg-slate-900/60 shadow-[0_24px_80px_rgba(15,23,42,0.9)] aspect-[4/3];
}

.HeroImage {
  @apply w-full h-full object-cover block;
}

.HeroLower {
  @apply lg:col-span-12 mt-4 space-y-5;
}

.HeroTitle {
  @apply text-4xl sm:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight max-w-[22ch];
}

.HeroParagraph {
  @apply mt-4 text-sm md:text-base text-slate-200/90 max-w-[64ch] leading-relaxed;
}

.HeroQuestionBlock {
  @apply mt-2 space-y-3;
}

.HeroQuestionLabel {
  @apply text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-400;
}

.HeroJourneyGrid {
  @apply grid gap-3 sm:grid-cols-2;
  perspective: 1200px;
}

.HeroJourneyCard {
  @apply text-left rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3.5 flex flex-col gap-1.5 cursor-pointer transition-all duration-150 hover:border-orange-300/70 hover:bg-slate-900/90;
  transform: translateZ(0);
}

.HeroJourneyCardActive {
  @apply border-orange-400/80 bg-slate-900/95 shadow-lg shadow-orange-900/40;
  animation: pp-glow-pulse 2600ms ease-in-out infinite;
}

.HeroJourneyLabel {
  @apply text-sm font-semibold text-slate-50;
}

.HeroJourneyTagline {
  @apply text-xs text-slate-400 leading-snug;
}

.HeroJourneyHighlight {
  @apply text-xs text-slate-300 leading-snug;
}

.HeroQuestionHelper {
  @apply text-xs text-slate-500 max-w-[50ch];
}

.HeroActions {
  @apply mt-4 flex flex-col sm:flex-row gap-3 sm:items-center;
}

.HeroPrimaryButton {
  @apply inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold bg-orange-400 text-slate-950 shadow-lg shadow-orange-500/35 hover:bg-orange-300 hover:shadow-orange-300/50 hover:-translate-y-[1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950;
}

.HeroSecondaryButton {
  @apply inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border border-slate-500 text-slate-100 hover:border-slate-200 hover:bg-slate-900/60 hover:-translate-y-[1px] transition;
}

.HeroReassurance {
  @apply text-xs md:text-sm text-slate-400 max-w-[45ch];
}
</style>
