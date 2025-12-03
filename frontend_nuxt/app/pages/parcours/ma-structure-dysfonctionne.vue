<template>
  <div class="PageContainer">
    <section class="PageSection">
      <div class="PrimaryCard space-y-3">
        <p class="SectionLabel">Parcours longue traîne</p>
        <h1 class="SectionTitle">Ma structure dysfonctionne — double diagnostic</h1>
        <p class="SectionDescription">
          Réponses en mémoire uniquement, rien n’est envoyé au serveur. Seuls les scores et quelques métadonnées
          sont conservés dans ce navigateur (TTL ~30 jours) pour permettre de reprendre la lecture des bilans.
        </p>
        <p class="text-sm text-slate-300">
          Un bouton “Effacer mes réponses de cet appareil” est disponible plus bas : il purgera toutes les clés de
          diagnostic et remettra l’état à zéro.
        </p>
      </div>
    </section>

    <section class="PageSection grid gap-6 lg:grid-cols-2">
      <div class="SecondaryCard space-y-4">
        <header class="space-y-1">
          <p class="SectionLabel">Questionnaire 1</p>
          <h2 class="text-xl font-semibold">Dysfonctionnements — symptômes</h2>
          <p class="text-sm text-slate-300">Echelle 1–5 (pas du tout → problème majeur). Réponses gardées en mémoire.</p>
        </header>
        <div class="space-y-3">
          <div
            v-for="question in q1Questions"
            :key="question.id"
            class="QuestionCard"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-semibold text-slate-100">{{ question.label }}</p>
                <p class="text-xs text-slate-400">{{ axisLabels[question.axis] }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-for="score in scoresScale"
                  :key="score"
                  type="button"
                  class="ScoreButton"
                  :class="{ 'ScoreButton--active': q1Answers[question.id] === score }"
                  @click="selectAnswer('q1', question.id, score)"
                >
                  {{ score }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="StatusRow">
          <p class="text-sm text-slate-200">
            Statut : <span class="font-semibold">{{ q1Completed ? 'Terminé' : 'En cours' }}</span>
          </p>
          <p class="text-xs text-slate-400">Analytics : events q1_start / q1_complete (anonymes, coarse).</p>
        </div>
      </div>

      <div class="SecondaryCard space-y-4">
        <header class="space-y-1">
          <p class="SectionLabel">Questionnaire 2</p>
          <h2 class="text-xl font-semibold">VUCA / modèle systémique</h2>
          <p class="text-sm text-slate-300">Echelle 1–5. Réponses en mémoire uniquement.</p>
        </header>
        <div class="space-y-3">
          <div
            v-for="question in q2Questions"
            :key="question.id"
            class="QuestionCard"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-semibold text-slate-100">{{ question.label }}</p>
                <p class="text-xs text-slate-400">{{ axisLabels[question.axis] }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-for="score in scoresScale"
                  :key="score"
                  type="button"
                  class="ScoreButton"
                  :class="{ 'ScoreButton--active': q2Answers[question.id] === score }"
                  @click="selectAnswer('q2', question.id, score)"
                >
                  {{ score }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="StatusRow">
          <p class="text-sm text-slate-200">
            Statut : <span class="font-semibold">{{ q2Completed ? 'Terminé' : 'En cours' }}</span>
          </p>
          <p class="text-xs text-slate-400">Analytics : events q2_start / q2_complete (anonymes, coarse).</p>
        </div>
      </div>
    </section>

    <section class="PageSection">
      <div class="PrimaryCard space-y-3">
        <p class="SectionLabel">Bilans & stockage limité</p>
        <h2 class="text-xl font-semibold">Synthèse actuelle (scores par axe)</h2>
        <div class="grid gap-3 md:grid-cols-2">
          <div class="space-y-2">
            <h3 class="text-sm uppercase tracking-[0.18em] text-orange-300">En session (mémoire)</h3>
            <div class="TagGrid">
              <div
                v-for="(score, axis) in sessionScores"
                :key="axis"
                class="ScorePill"
              >
                <span class="font-semibold">{{ axisLabels[axis] || axis }}</span>
                <span class="text-sm text-slate-200">{{ formatScore(score) }}</span>
              </div>
              <p v-if="Object.keys(sessionScores).length === 0" class="text-sm text-slate-400">
                En attente de réponses.
              </p>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-sm uppercase tracking-[0.18em] text-orange-300">Persisté (scores/meta)</h3>
            <div class="TagGrid">
              <div
                v-for="(score, axis) in persistedScoresDisplay"
                :key="axis"
                class="ScorePill"
              >
                <span class="font-semibold">{{ axisLabels[axis] || axis }}</span>
                <span class="text-sm text-slate-200">{{ formatScore(score) }}</span>
              </div>
              <p v-if="Object.keys(persistedScoresDisplay).length === 0" class="text-sm text-slate-400">
                Rien de sauvegardé dans ce navigateur (ou TTL expiré).
              </p>
            </div>
            <p v-if="persistedMeta?.lastDiagnosticAt" class="text-xs text-slate-400">
              Dernier diagnostic : {{ formatDate(persistedMeta.lastDiagnosticAt) }} · TTL ~30 jours.
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            class="pp-cta-secondary"
            @click="purgeLocalData"
          >
            Effacer mes réponses de cet appareil
          </button>
          <p class="text-sm text-slate-300">
            Clés utilisées : <code class="Code">pp_diag_v1_scores</code>, <code class="Code">pp_diag_v1_meta</code> (scores + méta uniquement).
          </p>
        </div>
        <p
          v-if="purgeStatus"
          class="text-sm text-orange-300"
        >
          {{ purgeStatus }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useAnalytics } from '~/composables/useAnalytics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';

type Question = {
  id: string;
  axis: string;
  label: string;
};

const journeyId = 'structure-dysfonction';
const scoresScale = [1, 2, 3, 4, 5];

const axisLabels: Record<string, string> = {
  humain: 'Humain / coopération',
  gouvernance: 'Gouvernance / décision',
  organisation: 'Organisation / process',
  ressources: 'Ressources / soutenabilité',
  adaptabilite: 'Adaptabilité / agilité',
  feedback: 'Transparence / feedback',
  autonomie: 'Autonomie / responsabilisation',
  vision: 'Vision / cap partagé'
};

const q1Questions: Question[] = [
  { id: 'q1_humain_1', axis: 'humain', label: 'Les tensions humaines prennent le pas sur les sujets de fond.' },
  { id: 'q1_gouv_1', axis: 'gouvernance', label: 'Les décisions sont floues ou tardives.' },
  { id: 'q1_org_1', axis: 'organisation', label: 'Les process changent souvent et ne sont pas documentés.' },
  { id: 'q1_ress_1', axis: 'ressources', label: 'Manque de temps ou de moyens pour stabiliser l’activité.' }
];

const q2Questions: Question[] = [
  { id: 'q2_adapt_1', axis: 'adaptabilite', label: 'La structure s’adapte facilement aux changements externes.' },
  { id: 'q2_feedback_1', axis: 'feedback', label: 'Les retours utilisateurs/terrain sont intégrés rapidement.' },
  { id: 'q2_auto_1', axis: 'autonomie', label: 'Les équipes peuvent agir sans escalade permanente.' },
  { id: 'q2_vision_1', axis: 'vision', label: 'Le cap partagé reste clair même en contexte mouvant.' }
];

const initAnswers = (questions: Question[]) => {
  return questions.reduce<Record<string, number | null>>((acc, question) => {
    acc[question.id] = null;
    return acc;
  }, {});
};

const q1Answers = reactive<Record<string, number | null>>(initAnswers(q1Questions));
const q2Answers = reactive<Record<string, number | null>>(initAnswers(q2Questions));

const { trackEvent } = useAnalytics();
const { loadScores, loadMeta, saveScores, saveMeta, clearAll, persistedScores, persistedMeta } = useDiagnosticStorage();

const q1Started = ref(false);
const q2Started = ref(false);
const purgeStatus = ref('');

const q1Completed = computed(() => Object.values(q1Answers).every((value) => value !== null));
const q2Completed = computed(() => Object.values(q2Answers).every((value) => value !== null));

const computeAxisScores = (questions: Question[], answers: Record<string, number | null>) => {
  const totals: Record<string, { total: number; count: number }> = {};
  questions.forEach((q) => {
    const value = answers[q.id];
    if (typeof value === 'number') {
      if (!totals[q.axis]) totals[q.axis] = { total: 0, count: 0 };
      totals[q.axis].total += value;
      totals[q.axis].count += 1;
    }
  });
  return Object.entries(totals).reduce<Record<string, number>>((acc, [axis, agg]) => {
    acc[axis] = Number((agg.total / agg.count).toFixed(2));
    return acc;
  }, {});
};

const q1Scores = computed(() => computeAxisScores(q1Questions, q1Answers));
const q2Scores = computed(() => computeAxisScores(q2Questions, q2Answers));

const sessionScores = computed(() => ({ ...q1Scores.value, ...q2Scores.value }));

const frictionBucket = (scores: Record<string, number>) => {
  const frictionCount = Object.values(scores).filter((score) => score >= 4).length;
  if (frictionCount >= 3) return 'high';
  if (frictionCount >= 1) return 'medium';
  return 'low';
};

const persistedScoresDisplay = computed<Record<string, number>>(() => {
  return persistedScores.value?.axes ?? {};
});

const selectAnswer = (phase: 'q1' | 'q2', questionId: string, score: number) => {
  if (phase === 'q1') {
    q1Answers[questionId] = score;
  } else {
    q2Answers[questionId] = score;
  }
};

const persistState = () => {
  const mergedScores = sessionScores.value;
  if (Object.keys(mergedScores).length > 0) {
    saveScores(mergedScores);
  }
  saveMeta({
    lastDiagnosticAt: Date.now(),
    q1Completed: q1Completed.value,
    q2Completed: q2Completed.value
  });
};

const purgeLocalData = () => {
  clearAll();
  Object.keys(q1Answers).forEach((key) => (q1Answers[key] = null));
  Object.keys(q2Answers).forEach((key) => (q2Answers[key] = null));
  q1Started.value = false;
  q2Started.value = false;
  purgeStatus.value = 'Tes résultats ont été effacés de cet appareil. Rien n’a jamais été stocké côté serveur.';
};

const formatScore = (score: number) => `${score.toFixed(2)}/5`;
const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('fr-FR');

watch(
  q1Answers,
  (answers) => {
    if (!q1Started.value && Object.values(answers).some((v) => v !== null)) {
      q1Started.value = true;
      trackEvent('q1_start', { journey_id: journeyId, source: 'longtail_v1_2' });
    }
  },
  { deep: true }
);

watch(
  q2Answers,
  (answers) => {
    if (!q2Started.value && Object.values(answers).some((v) => v !== null)) {
      q2Started.value = true;
      trackEvent('q2_start', { journey_id: journeyId, source: 'longtail_v1_2' });
    }
  },
  { deep: true }
);

watch(
  q1Completed,
  (completed) => {
    if (completed) {
      const bucket = frictionBucket(q1Scores.value);
      trackEvent('q1_complete', { journey_id: journeyId, nb_axes_haute_friction: bucket, source: 'longtail_v1_2' });
      persistState();
    }
  }
);

watch(
  q2Completed,
  (completed) => {
    if (completed) {
      const bucket = frictionBucket({ ...q1Scores.value, ...q2Scores.value });
      trackEvent('q2_complete', { journey_id: journeyId, nb_axes_haute_friction: bucket, source: 'longtail_v1_2' });
      persistState();
    }
  }
);

onMounted(() => {
  loadScores();
  loadMeta();
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

.PageSection {
  @apply space-y-4;
}

.PrimaryCard {
  @apply rounded-3xl border border-orange-500/30 bg-[var(--color-panel-alt)] p-6 shadow-xl shadow-orange-900/20;
}

.SecondaryCard {
  @apply rounded-3xl border border-orange-500/20 bg-[var(--color-panel)] p-6 shadow-lg shadow-orange-900/10;
}

.SectionLabel {
  @apply text-xs uppercase tracking-[0.2em] text-orange-300;
}

.SectionTitle {
  @apply text-3xl font-semibold;
}

.SectionDescription {
  @apply text-base leading-relaxed text-slate-300;
}

.QuestionCard {
  @apply rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4;
}

.ScoreButton {
  @apply h-8 w-8 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-sm font-semibold transition;
}

.ScoreButton--active {
  @apply border-orange-400 bg-orange-500/20 text-orange-200;
}

.StatusRow {
  @apply flex flex-col gap-1 border-t border-slate-700/60 pt-3;
}

.TagGrid {
  @apply grid gap-2 sm:grid-cols-2;
}

.ScorePill {
  @apply flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 py-2;
}

.Code {
  @apply rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-100;
}
</style>
