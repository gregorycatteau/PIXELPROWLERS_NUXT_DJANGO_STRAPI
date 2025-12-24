<template>
  <!--
    PPDsCatalogCells — Demos de toutes les cells DS
  -->
  <PPDsCatalogSection
    title="Cells"
    description="Composants composites (cells) du Design System."
    v-bind="$attrs"
  >
    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPQuestionCard
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPQuestionCard</h3>
      <p class="pp-ds-demo__desc">Wrapper de question pour questionnaires.</p>

      <div class="pp-ds-demo__col max-w-lg space-y-4">
        <PPQuestionCard
          title="Comment évaluez-vous votre niveau de stress actuel ?"
          context="Pensez à votre ressenti général cette semaine."
          :index="1"
          :total="10"
          id-base="demo-q1"
        >
          <PPScale5 v-model="questionDemo" name="q-demo" :show-endpoints="true" />
        </PPQuestionCard>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPQuestionnaireShell
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPQuestionnaireShell</h3>
      <p class="pp-ds-demo__desc">Shell de questionnaire avec header, contenu, navigation.</p>

      <div class="pp-ds-demo__col">
        <PPCard variant="soft" class="p-0 overflow-hidden">
          <PPQuestionnaireShell>
            <template #header>
              <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <span class="text-sm font-medium">Bloc 1 — Énergie</span>
                <PPProgress :current="3" :total="5" mode="ratio" />
              </div>
            </template>

            <template #content>
              <div class="p-4 text-sm text-gray-600">
                Contenu du questionnaire (questions, échelles, etc.)
              </div>
            </template>

            <template #navigation>
              <div class="p-4 border-t border-gray-200">
                <PPQuestionNav
                  prev-label="Précédent"
                  next-label="Suivant"
                />
              </div>
            </template>
          </PPQuestionnaireShell>
        </PPCard>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPBilanShell + PPBilanSection
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPBilanShell + PPBilanSection</h3>
      <p class="pp-ds-demo__desc">Shell de bilan avec sections structurées.</p>

      <div class="pp-ds-demo__col">
        <PPBilanShell class="max-w-2xl">
          <template #header>
            <PPPageHeader as="h2" density="compact">
              <template #title>Votre Bilan Panorama</template>
              <template #lead>
                <p class="text-sm text-gray-600">Synthèse de vos réponses.</p>
              </template>
            </PPPageHeader>
          </template>

          <template #main>
            <PPBilanSection id-base="demo-energie" title="Énergie" class="space-y-2">
              <PPCard variant="soft" class="p-3">
                <p class="text-sm">Contenu de la section Énergie</p>
              </PPCard>
            </PPBilanSection>

            <PPBilanSection id-base="demo-focus" title="Focus" class="space-y-2">
              <PPCard variant="soft" class="p-3">
                <p class="text-sm">Contenu de la section Focus</p>
              </PPCard>
            </PPBilanSection>
          </template>

          <template #aside>
            <PPCard variant="indicator" class="p-3">
              <p class="text-xs text-gray-500">Aside optionnel</p>
            </PPCard>
          </template>
        </PPBilanShell>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPHypothesesPicker
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPHypothesesPicker</h3>
      <p class="pp-ds-demo__desc">Sélecteur d'hypothèses structurantes.</p>

      <div class="pp-ds-demo__col max-w-lg">
        <PPHypothesesPicker
          :items="demoHypotheses"
          v-model="selectedHypotheses"
          :max-selected="2"
          :show-go-to-atterrissage="false"
        />
        <p class="text-xs text-gray-500 mt-2">
          Sélection : {{ selectedHypotheses.length }} hypothèse(s)
        </p>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPAtterrissagePlan
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPAtterrissagePlan</h3>
      <p class="pp-ds-demo__desc">Plan d'atterrissage systémique.</p>

      <div class="pp-ds-demo__col max-w-lg">
        <PPAtterrissagePlan
          :steps="demoLandingSteps"
          title="Plan d'atterrissage"
          description="Vos prochaines étapes concrètes."
          expected-outcome="Une meilleure gestion de votre énergie au quotidien."
        />
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         PPResourcesShell + PPResourceCard
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">PPResourcesShell + PPResourceCard</h3>
      <p class="pp-ds-demo__desc">Shell de ressources et cartes ressources.</p>

      <div class="pp-ds-demo__col">
        <PPCard variant="soft" class="p-4 space-y-4">
          <PPSectionHeader as="h3" title="Ressources recommandées" density="compact" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PPCard variant="default" class="p-3">
              <p class="text-sm font-medium">Guide pratique</p>
              <p class="text-xs text-gray-500">Description courte de la ressource.</p>
            </PPCard>
            <PPCard variant="default" class="p-3">
              <p class="text-sm font-medium">Vidéo explicative</p>
              <p class="text-xs text-gray-500">Une vidéo pour approfondir.</p>
            </PPCard>
          </div>
        </PPCard>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────────────────────────────────────
         Resources Library Cells (overview)
         ───────────────────────────────────────────────────────────────────────────── -->
    <div class="pp-ds-demo">
      <h3 class="pp-ds-demo__title">Resources Library Cells</h3>
      <p class="pp-ds-demo__desc">
        Cells de la bibliothèque de ressources : PPResourcesLibraryShell, PPResourcesLibraryFilters,
        PPResourcesLibraryToolbar, PPResourcesLibraryGrid, PPResourcesLibraryPagination.
      </p>

      <div class="pp-ds-demo__col">
        <PPCard variant="soft" class="p-4">
          <p class="text-sm text-gray-600">
            Ces cells sont visibles en action sur la page
            <code class="bg-gray-100 px-1 rounded">/ressources</code>.
            Elles composent l'interface de la bibliothèque de ressources.
          </p>
          <ul class="mt-2 text-xs text-gray-500 list-disc list-inside space-y-1">
            <li>PPResourcesLibraryShell — Layout principal</li>
            <li>PPResourcesLibraryFilters — Filtres latéraux</li>
            <li>PPResourcesLibraryToolbar — Barre d'outils (tri, recherche)</li>
            <li>PPResourcesLibraryGrid — Grille de ressources</li>
            <li>PPResourcesLibraryPagination — Pagination</li>
          </ul>
        </PPCard>
      </div>
    </div>
  </PPDsCatalogSection>
</template>

<script setup lang="ts">
/**
 * PPDsCatalogCells — Démos des cells DS
 */
import { ref } from 'vue'

const questionDemo = ref<number | null>(null)

// Demo data pour PPHypothesesPicker
const demoHypotheses = [
  { id: 'h1', title: 'Hypothèse 1', description: 'Description courte de la première hypothèse.', index: 1 },
  { id: 'h2', title: 'Hypothèse 2', description: 'Une autre piste à explorer.', index: 2 },
  { id: 'h3', title: 'Hypothèse 3', description: 'Troisième option possible.', index: 3 }
]
const selectedHypotheses = ref<string[]>([])

// Demo data pour PPAtterrissagePlan
const demoLandingSteps = [
  { title: 'Identifier vos pics d\'énergie', details: 'Notez les moments où vous êtes le plus productif.' },
  { title: 'Planifier vos tâches complexes', details: 'Placez-les sur vos créneaux d\'énergie haute.' },
  { title: 'Instaurer des micro-pauses', details: '5 minutes toutes les heures.' }
]
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
</style>
