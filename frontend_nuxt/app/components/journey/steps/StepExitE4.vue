<template>
  <JourneyLayout>
    <PPJourneyStepShell
      as="section"
      align="center"
      density="default"
      aria-labelledby="journey-step-heading-E_exit"
      focus-target-id="journey-step-heading-E_exit"
    >
      <template #header>
        <JourneyStepHeader
          title="Cloture du parcours"
          subtitle="Tu peux garder ce bilan et revenir plus tard."
          heading-id="journey-step-heading-E_exit"
        />
      </template>

      <div class="space-y-3">
        <p class="pp-journey-body">
          Merci d'avoir pris le temps. Ce parcours reste local et sans compte.
        </p>
      </div>

      <template #footer>
        <div class="flex flex-wrap gap-3 justify-center">
          <NuxtLink class="pp-cta-primary" to="/contact">
            Parler avec nous
          </NuxtLink>
          <NuxtLink class="pp-cta-secondary" to="/">
            Retour a l'accueil
          </NuxtLink>
        </div>
      </template>
    </PPJourneyStepShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import PPJourneyStepShell from '~/components/journey/PPJourneyStepShell.vue';
</script>
