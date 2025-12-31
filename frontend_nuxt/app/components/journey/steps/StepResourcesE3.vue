<template>
  <JourneyLayout>
    <PPJourneyStepShell
      as="section"
      align="center"
      density="default"
      aria-labelledby="journey-step-heading-E_resources"
      focus-target-id="journey-step-heading-E_resources"
    >
      <template #header>
        <JourneyStepHeader
          title="Ressources utiles"
          subtitle="Selection ouverte, sans compte. Liens internes uniquement."
          heading-id="journey-step-heading-E_resources"
        />
      </template>

      <div class="space-y-3">
        <p class="pp-journey-body">
          Cette section regroupe des ressources publiques pour continuer a ton rythme.
        </p>
        <p class="text-sm text-[color:var(--color-text-muted)]">
          Aucun contenu n'est partage. Tout reste local.
        </p>
      </div>

      <template #footer>
        <div class="flex flex-wrap gap-3 justify-center">
          <NuxtLink class="pp-cta-primary" :to="resourcesLink">
            Acceder aux ressources
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
import { buildResourcesDeepLink } from '~/utils/deeplinks/resourcesDeepLink';

const resourcesLink = buildResourcesDeepLink({});
</script>
