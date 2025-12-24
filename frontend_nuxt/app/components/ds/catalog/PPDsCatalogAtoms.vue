<template>
  <!--
    PPDsCatalogAtoms — Demos de tous les atomes DS
  -->
  <PPDsCatalogSection
    title="Atomes"
    description="Composants atomiques du Design System."
    v-bind="$attrs"
  >
    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPButton
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPButton</h3>
      <p class="pp-ds-demo__desc">CTA principal avec variants : primary, secondary, ghost.</p>

      <div class="pp-ds-demo__row">
        <PPButton variant="primary">Primary</PPButton>
        <PPButton variant="secondary">Secondary</PPButton>
        <PPButton variant="ghost">Ghost</PPButton>
      </div>

      <div class="pp-ds-demo__row">
        <PPButton variant="primary" disabled>Primary (disabled)</PPButton>
        <PPButton variant="secondary" loading>Secondary (loading)</PPButton>
        <PPButton variant="primary" full class="max-w-xs">Full width</PPButton>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPCard
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPCard</h3>
      <p class="pp-ds-demo__desc">Container avec variants : default, soft, accent, indicator, journey.</p>

      <div class="pp-ds-demo__grid">
        <PPCard variant="default" class="p-4">
          <p class="text-sm">Default card</p>
        </PPCard>
        <PPCard variant="soft" class="p-4">
          <p class="text-sm">Soft card</p>
        </PPCard>
        <PPCard variant="accent" class="p-4">
          <p class="text-sm">Accent card</p>
        </PPCard>
        <PPCard variant="indicator" class="p-4">
          <p class="text-sm">Indicator card</p>
        </PPCard>
      </div>

      <div class="pp-ds-demo__row mt-4">
        <PPCard variant="journey" class="p-4">
          <p class="text-sm">Journey card (normal)</p>
        </PPCard>
        <PPCard variant="journey" :active="true" class="p-4">
          <p class="text-sm">Journey card (active)</p>
        </PPCard>
        <PPCard variant="default" :hoverable="true" class="p-4">
          <p class="text-sm">Hoverable card</p>
        </PPCard>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPBadge
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPBadge</h3>
      <p class="pp-ds-demo__desc">Badges avec variants sémantiques : status, risk, info.</p>

      <div class="pp-ds-demo__row">
        <PPBadge variant="status">Status</PPBadge>
        <PPBadge variant="risk" aria-label="Risque critique">Risk</PPBadge>
        <PPBadge variant="info">Info</PPBadge>
      </div>

      <div class="pp-ds-demo__row">
        <PPBadge variant="neutral">Neutral (legacy)</PPBadge>
        <PPBadge variant="accent">Accent (legacy)</PPBadge>
        <PPBadge variant="success">Success (legacy)</PPBadge>
        <PPBadge variant="warning">Warning (legacy)</PPBadge>
        <PPBadge variant="danger">Danger (legacy)</PPBadge>
      </div>

      <div class="pp-ds-demo__row">
        <PPBadge variant="status" size="sm">Status (sm)</PPBadge>
        <PPBadge variant="status" size="md">Status (md)</PPBadge>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPChip
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPChip</h3>
      <p class="pp-ds-demo__desc">Chips interactifs avec variants : stat, tag, action.</p>

      <div class="pp-ds-demo__row">
        <PPChip variant="stat">Stat: 42</PPChip>
        <PPChip variant="tag">Tag</PPChip>
        <PPChip variant="action">Action</PPChip>
      </div>

      <div class="pp-ds-demo__row">
        <PPChip variant="action" :selected="false">Unselected</PPChip>
        <PPChip variant="action" :selected="true">Selected</PPChip>
        <PPChip variant="action" :disabled="true">Disabled</PPChip>
      </div>

      <div class="pp-ds-demo__row">
        <PPChip variant="tag" size="sm">Tag (sm)</PPChip>
        <PPChip variant="tag" size="md">Tag (md)</PPChip>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPScale5
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPScale5</h3>
      <p class="pp-ds-demo__desc">Échelle 1–5 pour questionnaires (Likert).</p>

      <div class="pp-ds-demo__col max-w-md">
        <PPScale5
          v-model="scale5Value"
          name="demo-scale"
          :show-endpoints="true"
          min-label="Pas du tout"
          max-label="Tout à fait"
        />
        <p class="text-xs text-gray-500 mt-2">Valeur : {{ scale5Value ?? 'non sélectionné' }}</p>
      </div>

      <div class="pp-ds-demo__col max-w-md mt-4">
        <PPScale5
          v-model="scale5Disabled"
          name="demo-scale-disabled"
          :disabled="true"
          size="sm"
        />
        <p class="text-xs text-gray-500 mt-2">Disabled (sm)</p>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPProgress
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPProgress</h3>
      <p class="pp-ds-demo__desc">Indicateur de progression avec modes : bar, ratio, both.</p>

      <div class="pp-ds-demo__col max-w-md space-y-4">
        <PPProgress :current="3" :total="10" mode="bar" label="Mode bar" />
        <PPProgress :current="7" :total="10" mode="ratio" />
        <PPProgress :current="5" :total="10" mode="both" label="Mode both" />
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPSectionHeader
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPSectionHeader</h3>
      <p class="pp-ds-demo__desc">En-tête de section avec eyebrow, titre, lead.</p>

      <div class="pp-ds-demo__col space-y-6">
        <PPCard variant="soft" class="p-4">
          <PPSectionHeader
            as="h3"
            title="Titre de section (h3)"
            eyebrow="Eyebrow"
            lead="Description optionnelle pour le lead."
            density="comfort"
          />
        </PPCard>

        <PPCard variant="soft" class="p-4">
          <PPSectionHeader
            as="h4"
            title="Titre compact (h4)"
            density="compact"
          />
        </PPCard>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPPageHeader
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPPageHeader</h3>
      <p class="pp-ds-demo__desc">En-tête de page (h1/h2) avec eyebrow, lead, meta, actions.</p>

      <div class="pp-ds-demo__col">
        <PPCard variant="soft" class="p-4">
          <PPPageHeader as="h2" density="comfort" align="left">
            <template #eyebrow>
              <span class="text-xs uppercase tracking-wider">Eyebrow</span>
            </template>
            <template #title>Titre de page (h2)</template>
            <template #lead>
              <p>Lead optionnel pour décrire le contenu de la page.</p>
            </template>
          </PPPageHeader>
        </PPCard>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPSkipAction
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPSkipAction</h3>
      <p class="pp-ds-demo__desc">Bouton Ignorer/Passer pour questionnaires.</p>

      <div class="pp-ds-demo__row">
        <PPSkipAction label="Ignorer" density="default" />
        <PPSkipAction label="Passer" density="compact" />
        <PPSkipAction label="Ignorer" density="comfort" :disabled="true" />
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPQuestionNav
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPQuestionNav</h3>
      <p class="pp-ds-demo__desc">Navigation Prev/Next pour questionnaires.</p>

      <div class="pp-ds-demo__col max-w-md space-y-4">
        <PPCard variant="soft" class="p-4">
          <PPQuestionNav
            prev-label="Précédent"
            next-label="Continuer"
            :show-prev="true"
            :show-next="true"
          />
        </PPCard>

        <PPCard variant="soft" class="p-4">
          <PPQuestionNav
            next-label="Commencer"
            :show-prev="false"
            :show-next="true"
            align="end"
          />
        </PPCard>

        <PPCard variant="soft" class="p-4">
          <PPQuestionNav
            :prev-disabled="true"
            :next-disabled="true"
          />
        </PPCard>
      </div>
    </div>
  </PPDsCatalogSection>
</template>

<script setup lang="ts">
/**
 * PPDsCatalogAtoms — Démos interactives de tous les atomes DS
 */
import { ref } from 'vue'

const scale5Value = ref<number | null>(null)
const scale5Disabled = ref<number | null>(3)
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-ds-demo {
  @apply p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3;
}

.pp-ds-demo__title {
  @apply text-base font-semibold text-gray-800;
}

.pp-ds-demo__desc {
  @apply text-sm text-gray-600;
}

.pp-ds-demo__row {
  @apply flex flex-wrap items-center gap-3;
}

.pp-ds-demo__col {
  @apply flex flex-col;
}

.pp-ds-demo__grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-3;
}
</style>
